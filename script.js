const pageType = document.body.dataset.page;

function normalizeResponse(text) {
  if (!text) return "";
  return text
    .replace(/^#+\s?/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/^[*-]\s+/gm, "• ")
    .trim();
}

function setupSuperpowerPage() {
  // Accordion elements
  const accordions = Array.from(document.querySelectorAll(".scenario-accordion"));
  const usePromptBtns = Array.from(document.querySelectorAll(".use-prompt-btn"));

  // ChatGPT-style elements
  const aiMessages = document.getElementById("ai-messages");
  const aiInput = document.getElementById("ai-input");
  const aiSendBtn = document.getElementById("ai-send-btn");

  let isLoading = false;
  let loadingInterval = null;
  let currentAbortController = null;

  function getSystemPrompt() {
    return "You are a helpful Medical Affairs AI assistant. Format all responses using short paragraphs and bullet dots (•). Do not use markdown formatting such as headers (#), bold (**), or bullet points (* or -). Keep responses clear, professional, and actionable.";
  }

  function addAIMessage(role, content, isLoadingMsg = false) {
    // Remove empty state if present
    const emptyState = aiMessages.querySelector(".ai-empty-state");
    if (emptyState) emptyState.remove();

    const message = document.createElement("div");
    message.className = "ai-message";
    if (isLoadingMsg) message.id = "loading-message";

    const header = document.createElement("div");
    header.className = "ai-message-header";

    const avatar = document.createElement("div");
    avatar.className = `ai-avatar ${role}`;
    avatar.textContent = role === "user" ? "Y" : "AI";

    const sender = document.createElement("div");
    sender.className = "ai-message-sender";
    sender.textContent = role === "user" ? "You" : "AI Assistant";

    header.append(avatar, sender);

    const contentDiv = document.createElement("div");
    contentDiv.className = "ai-message-content";

    if (isLoadingMsg) {
      contentDiv.classList.add("loading");
      contentDiv.innerHTML = `
        <div class="loading-indicator">
          <div class="loading-dots">
            <span></span><span></span><span></span>
          </div>
          <span class="loading-counter">0s</span>
        </div>
      `;
    } else {
      contentDiv.textContent = content;
    }

    message.append(header, contentDiv);
    aiMessages.appendChild(message);
    aiMessages.scrollTop = aiMessages.scrollHeight;

    return message;
  }

  function startLoadingAnimation() {
    let seconds = 0;
    loadingInterval = setInterval(() => {
      seconds++;
      const counter = document.querySelector(".loading-counter");
      if (counter) counter.textContent = `${seconds}s`;
    }, 1000);
  }

  function stopLoadingAnimation() {
    if (loadingInterval) {
      clearInterval(loadingInterval);
      loadingInterval = null;
    }
    const loadingMsg = document.getElementById("loading-message");
    if (loadingMsg) loadingMsg.remove();
  }

  function scrollToChat() {
    const chatContainer = document.querySelector(".ai-chat-container");
    if (chatContainer) {
      chatContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function loadPromptToInput(prompt, contextTextarea) {
    if (!aiInput) return;

    // Get context from the accordion's textarea
    const context = contextTextarea ? contextTextarea.value.trim() : "";

    // Combine context and prompt
    const fullPrompt = context
      ? `Context:\n${context}\n\nInstruction:\n${prompt}`
      : prompt;

    aiInput.value = fullPrompt;
    aiInput.style.height = "auto";
    aiInput.style.height = Math.min(aiInput.scrollHeight, 200) + "px";
    aiInput.focus();
    scrollToChat();
  }

  async function sendMessage() {
    // Cancel any previous request
    if (currentAbortController) {
      currentAbortController.abort();
      currentAbortController = null;
    }

    if (isLoading) return;

    const prompt = aiInput ? aiInput.value.trim() : "";
    if (!prompt) return;

    isLoading = true;
    if (aiSendBtn) aiSendBtn.disabled = true;
    if (aiInput) {
      aiInput.value = "";
      aiInput.style.height = "auto";
    }

    // Add user message
    addAIMessage("user", prompt);

    // Add loading message
    addAIMessage("assistant", "", true);
    startLoadingAnimation();
    scrollToChat();

    // Create abort controller for this request
    currentAbortController = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemPrompt: getSystemPrompt(), stream: true }),
        signal: currentAbortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "AI request failed.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let buffer = "";
      let assistantMsg = null;
      let contentDiv = null;
      let firstChunkReceived = false;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Check if request was aborted
          if (currentAbortController?.signal.aborted) {
            reader.cancel();
            break;
          }

          buffer += decoder.decode(value, { stream: true });

          // Process SSE lines
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const chunk = parsed.choices?.[0]?.delta?.content;
                if (chunk) {
                  // On first actual content, stop loading and create message
                  if (!firstChunkReceived) {
                    firstChunkReceived = true;
                    stopLoadingAnimation();
                    assistantMsg = addAIMessage("assistant", "");
                    contentDiv = assistantMsg.querySelector(".ai-message-content");
                  }
                  fullContent += chunk;
                  if (contentDiv) {
                    contentDiv.textContent = normalizeResponse(fullContent);
                    aiMessages.scrollTop = aiMessages.scrollHeight;
                  }
                }
              } catch {
                // Skip non-JSON lines
              }
            }
          }
        }
      } finally {
        try {
          reader.releaseLock();
        } catch (e) {
          // Reader already released
        }
      }

      // If no content was received, show a message
      if (!firstChunkReceived && !currentAbortController?.signal.aborted) {
        stopLoadingAnimation();
        addAIMessage("assistant", "No response returned.");
      } else if (contentDiv && !currentAbortController?.signal.aborted) {
        contentDiv.textContent = normalizeResponse(fullContent);
      }
    } catch (error) {
      // Don't show error if request was aborted
      if (error.name !== "AbortError" && !currentAbortController?.signal.aborted) {
        stopLoadingAnimation();
        addAIMessage("assistant", `Error: ${error.message}`);
      }
    } finally {
      isLoading = false;
      currentAbortController = null;
      if (aiSendBtn) aiSendBtn.disabled = false;
    }
  }

  // Setup accordion behavior
  if (accordions.length > 0) {
    accordions.forEach((accordion) => {
      const header = accordion.querySelector(".scenario-accordion-header");
      if (header) {
        header.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          // Close all other accordions
          accordions.forEach((a) => {
            if (a !== accordion) a.classList.remove("open");
          });
          // Toggle this accordion
          accordion.classList.toggle("open");
        });
      }
    });

    // Open first accordion by default
    accordions[0].classList.add("open");
  }

  // Setup "Use This Prompt" buttons
  usePromptBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const prompt = btn.dataset.prompt;
      const accordion = btn.closest(".scenario-accordion");
      const contextTextarea = accordion ? accordion.querySelector(".context-input") : null;
      loadPromptToInput(prompt, contextTextarea);
    });
  });

  // Setup "Copy Prompt" buttons
  const copyPromptBtns = Array.from(document.querySelectorAll(".copy-prompt-btn"));
  copyPromptBtns.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const prompt = btn.dataset.prompt;
      const accordion = btn.closest(".scenario-accordion");
      const contextTextarea = accordion ? accordion.querySelector(".context-input") : null;
      
      // Build full prompt with context if available
      let fullPrompt = prompt;
      if (contextTextarea && contextTextarea.value.trim()) {
        const context = contextTextarea.value.trim();
        fullPrompt = `Context:\n${context}\n\nInstruction:\n${prompt}`;
      }

      try {
        await navigator.clipboard.writeText(fullPrompt);
        // Visual feedback
        const originalText = btn.textContent;
        btn.textContent = "Copied!";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove("copied");
        }, 2000);
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = fullPrompt;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          const originalText = btn.textContent;
          btn.textContent = "Copied!";
          btn.classList.add("copied");
          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove("copied");
          }, 2000);
        } catch (err) {
          alert("Failed to copy. Please copy manually.");
        }
        document.body.removeChild(textArea);
      }
    });
  });

  // Send button
  if (aiSendBtn) {
    aiSendBtn.addEventListener("click", sendMessage);
  }

  // Enter key to send
  if (aiInput) {
    aiInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Auto-resize textarea
    aiInput.addEventListener("input", () => {
      aiInput.style.height = "auto";
      aiInput.style.height = Math.min(aiInput.scrollHeight, 200) + "px";
    });
  }
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (pageType === "superpower") {
      setupSuperpowerPage();
    }
  });
} else {
  // DOM is already ready
  if (pageType === "superpower") {
    setupSuperpowerPage();
  }
}
