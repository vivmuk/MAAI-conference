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
  const scenarioTitle = document.getElementById("scenario-title");
  const scenarioSummary = document.getElementById("scenario-summary");
  const scenarioAudience = document.getElementById("scenario-audience");
  const scenarioGoal = document.getElementById("scenario-goal");
  const scenarioOutput = document.getElementById("scenario-output");

  // New ChatGPT-style elements
  const aiMessages = document.getElementById("ai-messages");
  const aiInput = document.getElementById("ai-input");
  const aiSendBtn = document.getElementById("ai-send-btn");
  const promptToggleBtn = document.getElementById("prompt-toggle-btn");
  const promptExpandable = document.getElementById("prompt-expandable");
  const goodPromptText = document.getElementById("good-prompt-text");
  const badPromptText = document.getElementById("bad-prompt-text");
  const loadGoodPrompt = document.getElementById("load-good-prompt");
  const copyGoodPrompt = document.getElementById("copy-good-prompt");

  let activeScenario = null;
  let isLoading = false;
  let loadingInterval = null;

  function getSystemPrompt() {
    return "You are a helpful Medical Affairs AI assistant. Format all responses using short paragraphs and bullet dots (•). Do not use markdown formatting such as headers (#), bold (**), or bullet points (* or -). Keep responses clear, professional, and actionable.";
  }

  function buildPrompt() {
    const context = contextInput ? contextInput.value.trim() : "";
    const instruction = activeScenario ? activeScenario.good : "";
    return `Context:\n${context || "[Add context here]"}\n\nInstruction:\n${instruction}`;
  }

  function addAIMessage(role, content, isLoadingMsg = false) {
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
    const counter = document.querySelector(".loading-counter");
    loadingInterval = setInterval(() => {
      seconds++;
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

    if (scenarioTitle) scenarioTitle.textContent = activeScenario.title || "";
    if (scenarioSummary) scenarioSummary.textContent = activeScenario.summary || "";
    if (scenarioAudience) scenarioAudience.textContent = activeScenario.audience || "";
    if (scenarioGoal) scenarioGoal.textContent = activeScenario.goal || "";
    if (scenarioOutput) scenarioOutput.textContent = activeScenario.output || "";
    if (contextInput) contextInput.value = activeScenario.context || "";
    if (goodPromptText) goodPromptText.textContent = activeScenario.good || "";
    if (badPromptText) badPromptText.textContent = activeScenario.bad || "";
  }

  async function sendMessage() {
    if (isLoading || !activeScenario) return;

    const userMessage = aiInput ? aiInput.value.trim() : "";
    let prompt = buildPrompt();

    if (userMessage) {
      prompt += `\n\nAdditional request: ${userMessage}`;
    }

    if (!prompt.trim()) return;

    isLoading = true;
    if (aiSendBtn) aiSendBtn.disabled = true;
    if (aiInput) aiInput.value = "";

    // Add user message
    addAIMessage("user", prompt);

    // Add loading message
    addAIMessage("assistant", "", true);
    startLoadingAnimation();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemPrompt: getSystemPrompt() }),
      });

      const data = await response.json();
      stopLoadingAnimation();

      if (!response.ok) {
        throw new Error(data.error || "AI request failed.");
      }

      const cleaned = normalizeResponse(data.content || "");
      addAIMessage("assistant", cleaned || "No response returned.");
    } catch (error) {
      stopLoadingAnimation();
      addAIMessage("assistant", `Error: ${error.message}`);
    } finally {
      isLoading = false;
      if (aiSendBtn) aiSendBtn.disabled = false;
    }
  }

  // Initialize scenarios
  if (scenarioCards.length > 0) {
    scenarioCards.forEach((card) => {
      card.addEventListener("click", () => setScenario(card));
    });
    setScenario(scenarioCards[0]);
  }

  // Prompt toggle button
  if (promptToggleBtn && promptExpandable) {
    promptToggleBtn.addEventListener("click", () => {
      promptToggleBtn.classList.toggle("expanded");
      promptExpandable.classList.toggle("show");
    });
  }

  // Load good prompt button
  if (loadGoodPrompt) {
    loadGoodPrompt.addEventListener("click", () => {
      sendMessage();
    });
  }

  // Copy good prompt button
  if (copyGoodPrompt) {
    copyGoodPrompt.addEventListener("click", async () => {
      const prompt = buildPrompt();
      try {
        await navigator.clipboard.writeText(prompt);
        copyGoodPrompt.textContent = "Copied!";
        setTimeout(() => {
          copyGoodPrompt.textContent = "Copy";
        }, 1400);
      } catch (error) {
        alert("Copy failed. Please copy manually.");
      }
    });
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
      aiInput.style.height = Math.min(aiInput.scrollHeight, 120) + "px";
    });
  }
}

if (pageType === "superpower") {
  setupSuperpowerPage();
}
