const pageType = document.body.dataset.page;

function decodeText(value) {
  if (!value) return "";
  return value.replace(/\\n/g, "\n");
}

function normalizeResponse(text) {
  if (!text) return "";
  return text
    .replace(/^#+\s?/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/^[*-]\s+/gm, "• ")
    .trim();
}

function setupSuperpowerPage() {
  const scenarioCards = Array.from(document.querySelectorAll(".scenario-card"));
  const contextInput = document.getElementById("context-input");
  const goodPromptText = document.getElementById("good-prompt-text");
  const badPromptText = document.getElementById("bad-prompt-text");
  const useGoodPrompt = document.getElementById("use-good-prompt");

  // ChatGPT-style elements
  const aiMessages = document.getElementById("ai-messages");
  const aiInput = document.getElementById("ai-input");
  const aiSendBtn = document.getElementById("ai-send-btn");

  let activeScenario = null;
  let isLoading = false;
  let loadingInterval = null;

  function getSystemPrompt() {
    return "You are a helpful Medical Affairs AI assistant. Format all responses using short paragraphs and bullet dots (•). Do not use markdown formatting such as headers (#), bold (**), or bullet points (* or -). Keep responses clear, professional, and actionable.";
  }

  function buildPromptFromInput() {
    // Build prompt from what's in the chat input
    return aiInput ? aiInput.value.trim() : "";
  }

  function buildFullPrompt() {
    const context = contextInput ? contextInput.value.trim() : "";
    const instruction = activeScenario ? activeScenario.good : "";
    return `Context:\n${context || "[Add context here]"}\n\nInstruction:\n${instruction}`;
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

  function setScenario(card) {
    scenarioCards.forEach((item) => item.classList.remove("active"));
    card.classList.add("active");

    activeScenario = {
      title: card.dataset.title,
      summary: card.dataset.summary,
      audience: card.dataset.audience,
      goal: card.dataset.goal,
      output: card.dataset.output,
      context: decodeText(card.dataset.context),
      good: decodeText(card.dataset.good),
      bad: decodeText(card.dataset.bad),
    };

    if (contextInput) contextInput.value = activeScenario.context || "";
    if (goodPromptText) goodPromptText.textContent = activeScenario.good || "";
    if (badPromptText) badPromptText.textContent = activeScenario.bad || "";
  }

  function loadPromptToInput() {
    if (!activeScenario || !aiInput) return;
    const fullPrompt = buildFullPrompt();
    aiInput.value = fullPrompt;
    // Auto-resize textarea
    aiInput.style.height = "auto";
    aiInput.style.height = Math.min(aiInput.scrollHeight, 200) + "px";
    aiInput.focus();
    scrollToChat();
  }

  async function sendMessage() {
    if (isLoading) return;

    const prompt = buildPromptFromInput();
    if (!prompt.trim()) return;

    isLoading = true;
    if (aiSendBtn) aiSendBtn.disabled = true;
    if (aiInput) aiInput.value = "";
    if (aiInput) {
      aiInput.style.height = "auto";
    }

    // Add user message
    addAIMessage("user", prompt);

    // Add loading message
    const loadingMsg = addAIMessage("assistant", "", true);
    startLoadingAnimation();

    // Scroll to see the loading indicator
    scrollToChat();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemPrompt: getSystemPrompt(), stream: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "AI request failed.");
      }

      // Stop loading animation when first chunk arrives
      stopLoadingAnimation();

      // Create the assistant message element for streaming content
      const assistantMsg = addAIMessage("assistant", "");
      const contentDiv = assistantMsg.querySelector(".ai-message-content");

      // Scroll to the new message
      scrollToChat();

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

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
                fullContent += chunk;
                contentDiv.textContent = normalizeResponse(fullContent);
                aiMessages.scrollTop = aiMessages.scrollHeight;
              }
            } catch {
              // Skip non-JSON lines
            }
          }
        }
      }

      // Final normalization
      if (fullContent) {
        contentDiv.textContent = normalizeResponse(fullContent);
      } else {
        contentDiv.textContent = "No response returned.";
      }
    } catch (error) {
      stopLoadingAnimation();
      addAIMessage("assistant", `Error: ${error.message}`);
    } finally {
      isLoading = false;
      if (aiSendBtn) aiSendBtn.disabled = false;
    }
  }

  // Initialize scenarios with collapsible behavior
  if (scenarioCards.length > 0) {
    scenarioCards.forEach((card) => {
      card.addEventListener("click", () => {
        const wasActive = card.classList.contains("active");

        // If clicking the same card, toggle collapse
        if (wasActive) {
          card.classList.toggle("collapsed");
        } else {
          // Collapse all others, expand this one
          scenarioCards.forEach((c) => c.classList.add("collapsed"));
          card.classList.remove("collapsed");
          setScenario(card);
        }
      });
    });
    // Set first scenario as active but all start expanded
    setScenario(scenarioCards[0]);
  }

  // Use good prompt button - loads prompt into chat input
  if (useGoodPrompt) {
    useGoodPrompt.addEventListener("click", loadPromptToInput);
  }

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

if (pageType === "superpower") {
  setupSuperpowerPage();
}
