const pageType = document.body.dataset.page;

function decodeText(value) {
  if (!value) {
    return "";
  }
  return value.replace(/\\n/g, "\n");
}

function normalizeResponse(text) {
  if (!text) {
    return "";
  }
  return text
    .replace(/^#+\s?/gm, "")
    .replace(/^[*-]\s+/gm, "� ")
    .trim();
}

function addMessage(container, role, text) {
  const message = document.createElement("div");
  message.className = `chat-message ${role}`;

  const label = document.createElement("div");
  label.className = "chat-label";
  label.textContent = role === "user" ? "You" : "AI";

  const body = document.createElement("div");
  body.className = "chat-text";
  body.textContent = text;

  message.append(label, body);
  container.appendChild(message);
  container.scrollTop = container.scrollHeight;
}

function setupSuperpowerPage() {
  const scenarioCards = Array.from(document.querySelectorAll(".scenario-card"));
  const contextInput = document.getElementById("context-input");
  const goodPrompt = document.getElementById("good-prompt");
  const badPrompt = document.getElementById("bad-prompt");
  const scenarioTitle = document.getElementById("scenario-title");
  const scenarioSummary = document.getElementById("scenario-summary");
  const scenarioAudience = document.getElementById("scenario-audience");
  const scenarioGoal = document.getElementById("scenario-goal");
  const scenarioOutput = document.getElementById("scenario-output");
  const chatInput = document.getElementById("chat-input");
  const chatLog = document.getElementById("chat-log");
  const copyPromptButton = document.getElementById("copy-prompt");
  const copyGoodButton = document.getElementById("copy-good");
  const copyBadButton = document.getElementById("copy-bad");
  const runButton = document.getElementById("run-venice");
  const clearButton = document.getElementById("clear-chat");

  let activeScenario = null;

  function buildPrompt(includeSystemInstructions = false) {
    const context = contextInput.value.trim();
    const corePrompt = (goodPrompt.textContent || "").trim();
    const extra = chatInput.value.trim();
    const extraLine = extra ? `Additional request: ${extra}` : "";

    let prompt = `Context:\n${context || "[Add context here]"}\n\nInstruction:\n${corePrompt}${extraLine ? `\n\n${extraLine}` : ""}`;

    if (includeSystemInstructions) {
      prompt += `\n\nOutput requirements: Use short paragraphs and bullet dots (•). Do not use markdown.`;
    }

    return prompt;
  }

  function getSystemPrompt() {
    return "You are a helpful Medical Affairs AI assistant. Format all responses using short paragraphs and bullet dots (•). Do not use markdown formatting such as headers (#), bold (**), or bullet points (* or -). Keep responses clear, professional, and actionable.";
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

    if (scenarioTitle) {
      scenarioTitle.textContent = activeScenario.title || "";
    }
    if (scenarioSummary) {
      scenarioSummary.textContent = activeScenario.summary || "";
    }
    if (scenarioAudience) {
      scenarioAudience.textContent = activeScenario.audience || "";
    }
    if (scenarioGoal) {
      scenarioGoal.textContent = activeScenario.goal || "";
    }
    if (scenarioOutput) {
      scenarioOutput.textContent = activeScenario.output || "";
    }
    if (contextInput) {
      contextInput.value = activeScenario.context || "";
    }
    if (goodPrompt) {
      goodPrompt.textContent = activeScenario.good || "";
    }
    if (badPrompt) {
      badPrompt.textContent = activeScenario.bad || "";
    }
  }

  if (scenarioCards.length > 0) {
    scenarioCards.forEach((card) => {
      card.addEventListener("click", () => setScenario(card));
    });
    setScenario(scenarioCards[0]);
  }

  if (chatLog) {
    addMessage(chatLog, "assistant", "Select a scenario, then try with AI or copy prompts.");
  }

  if (copyPromptButton) {
    copyPromptButton.textContent = "Copy for your AI tool";
    copyPromptButton.addEventListener("click", async () => {
      const prompt = buildPrompt(false);
      try {
        await navigator.clipboard.writeText(prompt);
        copyPromptButton.textContent = "Copied!";
        setTimeout(() => {
          copyPromptButton.textContent = "Copy for your AI tool";
        }, 1400);
      } catch (error) {
        alert("Copy failed. Please copy manually.");
      }
    });
  }

  if (copyGoodButton) {
    copyGoodButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(goodPrompt.textContent || "");
        copyGoodButton.textContent = "Copied";
        setTimeout(() => {
          copyGoodButton.textContent = "Copy good prompt";
        }, 1400);
      } catch (error) {
        alert("Copy failed. Please copy manually.");
      }
    });
  }

  if (copyBadButton) {
    copyBadButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(badPrompt.textContent || "");
        copyBadButton.textContent = "Copied";
        setTimeout(() => {
          copyBadButton.textContent = "Copy bad prompt";
        }, 1400);
      } catch (error) {
        alert("Copy failed. Please copy manually.");
      }
    });
  }

  if (runButton) {
    runButton.addEventListener("click", async () => {
      const prompt = buildPrompt(false);
      const systemPrompt = getSystemPrompt();
      if (!prompt.trim()) {
        return;
      }

      addMessage(chatLog, "user", prompt);
      runButton.disabled = true;
      runButton.textContent = "Running...";

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, systemPrompt }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "AI request failed.");
        }

        const cleaned = normalizeResponse(data.content || "");
        addMessage(chatLog, "assistant", cleaned || "No response returned.");
      } catch (error) {
        addMessage(chatLog, "assistant", error.message);
      } finally {
        runButton.disabled = false;
        runButton.textContent = "Try with AI";
      }
    });
  }

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      chatLog.innerHTML = "";
      addMessage(chatLog, "assistant", "Chat cleared. Select a scenario to begin again.");
    });
  }
}

if (pageType === "superpower") {
  setupSuperpowerPage();
}
