const pptxgen = require("pptxgenjs");

// Create presentation
const pptx = new pptxgen();

// Set presentation properties
pptx.author = "Medical Affairs";
pptx.title = "AI Agent Creation Workshop";
pptx.subject = "From Prompts to Agents";

// Define consistent styling
const COLORS = {
  primary: "0066CC",      // Blue
  secondary: "333333",    // Dark gray
  accent: "FF6600",       // Orange
  light: "F5F5F5",        // Light gray background
  white: "FFFFFF",
  darkBlue: "003366"
};

const FONTS = {
  title: { fontFace: "Arial", fontSize: 36, bold: true, color: COLORS.darkBlue },
  subtitle: { fontFace: "Arial", fontSize: 24, color: COLORS.secondary },
  heading: { fontFace: "Arial", fontSize: 28, bold: true, color: COLORS.primary },
  body: { fontFace: "Arial", fontSize: 18, color: COLORS.secondary },
  bullet: { fontFace: "Arial", fontSize: 16, color: COLORS.secondary }
};

// Slide 1 - Title & Framing
let slide1 = pptx.addSlide();
slide1.addText("From Prompts to Agents", {
  x: 0.5, y: 1.5, w: 9, h: 1,
  ...FONTS.title,
  fontSize: 44
});
slide1.addText("Designing Practical AI Workflows for Medical Affairs", {
  x: 0.5, y: 2.7, w: 9, h: 0.7,
  ...FONTS.subtitle,
  fontSize: 28
});
slide1.addText([
  { text: "Build once ", options: { bold: true } },
  { text: "→ reuse often" }
], {
  x: 0.5, y: 4, w: 9, h: 0.5,
  ...FONTS.body,
  fontSize: 22
});
slide1.addText([
  { text: "Less prompting. ", options: { bold: true } },
  { text: "More leverage." }
], {
  x: 0.5, y: 4.5, w: 9, h: 0.5,
  ...FONTS.body,
  fontSize: 22
});

// Slide 2 - What You'll Walk Out With
let slide2 = pptx.addSlide();
slide2.addText("What You'll Walk Out With", {
  x: 0.5, y: 0.3, w: 9, h: 0.8,
  ...FONTS.heading,
  fontSize: 32
});
slide2.addText("By the end of this session, you will:", {
  x: 0.5, y: 1.2, w: 9, h: 0.5,
  ...FONTS.body,
  fontSize: 20,
  italic: true
});
slide2.addText([
  { text: "• Know when to use a prompt vs an agent\n\n", options: FONTS.bullet },
  { text: "• Understand the building blocks of agents\n\n", options: FONTS.bullet },
  { text: "• Build at least 2 agents\n\n", options: FONTS.bullet },
  { text: "• Team activity: build your own agent + Shark Tank pitch to win all the glory", options: FONTS.bullet }
], {
  x: 0.7, y: 1.9, w: 8.5, h: 3.5,
  fontSize: 20,
  color: COLORS.secondary,
  valign: "top"
});

// Slide 3 - Agent in a Box: Build Your First Agent
let slide3 = pptx.addSlide();
slide3.addText("Agent in a Box: Build Your First Agent", {
  x: 0.5, y: 0.3, w: 9, h: 0.8,
  ...FONTS.heading,
  fontSize: 32
});
slide3.addText("Hands-on, guided", {
  x: 0.5, y: 1.1, w: 2, h: 0.4,
  fontSize: 14,
  color: COLORS.white,
  fill: { color: COLORS.accent },
  align: "center"
});
slide3.addText("Your Task (Work in Small Teams)", {
  x: 0.5, y: 1.7, w: 9, h: 0.5,
  ...FONTS.body,
  bold: true,
  fontSize: 20
});
slide3.addText([
  { text: "1. Create a new agent in your AI tool\n" },
  { text: "   (ChatGPT, Copilot, or similar)\n\n" },
  { text: "2. In the agent setup/config screen, fill in each section\n" },
  { text: "   • Use the content we build together\n" },
  { text: "   • If your tool doesn't have a section, skip it\n\n" },
  { text: "3. Save your agent\n\n" },
  { text: "4. Test it on a real example, then tweak as needed" }
], {
  x: 0.7, y: 2.3, w: 5, h: 2.8,
  fontSize: 16,
  color: COLORS.secondary
});
slide3.addShape(pptx.shapes.RECTANGLE, {
  x: 6, y: 1.7, w: 3.5, h: 3.5,
  fill: { color: COLORS.light }
});
slide3.addText("Live Example:\nSubject Line Pro", {
  x: 6.2, y: 2.5, w: 3.1, h: 1.5,
  fontSize: 18,
  bold: true,
  color: COLORS.primary,
  align: "center",
  valign: "middle"
});
slide3.addText("(Facilitator builds live while teams follow)", {
  x: 6.2, y: 3.8, w: 3.1, h: 0.5,
  fontSize: 12,
  color: COLORS.secondary,
  align: "center",
  italic: true
});

// Slide 4 - Why This Is an Agent
let slide4 = pptx.addSlide();
slide4.addText("Why This Is an Agent", {
  x: 0.5, y: 0.3, w: 9, h: 0.8,
  ...FONTS.heading,
  fontSize: 32
});
slide4.addText("This works because it:", {
  x: 0.5, y: 1.3, w: 9, h: 0.5,
  ...FONTS.body,
  fontSize: 22,
  italic: true
});
slide4.addText([
  { text: "✓  Solves the same job repeatedly\n\n" },
  { text: "✓  Uses fixed instructions\n\n" },
  { text: "✓  Produces a consistent output\n\n" },
  { text: "✓  Saves time every use" }
], {
  x: 1, y: 2, w: 8, h: 3,
  fontSize: 24,
  color: COLORS.secondary
});

// Slide 5 - Prompt vs Agent
let slide5 = pptx.addSlide();
slide5.addText("Prompt vs Agent", {
  x: 0.5, y: 0.3, w: 9, h: 0.8,
  ...FONTS.heading,
  fontSize: 32
});

// Prompt box
slide5.addShape(pptx.shapes.RECTANGLE, {
  x: 0.5, y: 1.3, w: 4.3, h: 3,
  fill: { color: "E8F4FC" },
  line: { color: COLORS.primary, width: 2 }
});
slide5.addText("Prompt", {
  x: 0.5, y: 1.4, w: 4.3, h: 0.6,
  fontSize: 22,
  bold: true,
  color: COLORS.primary,
  align: "center"
});
slide5.addText([
  { text: "• One-off thinking\n\n" },
  { text: "• Exploration\n\n" },
  { text: "• Output varies" }
], {
  x: 0.8, y: 2.1, w: 3.7, h: 2,
  fontSize: 18,
  color: COLORS.secondary
});

// Agent box
slide5.addShape(pptx.shapes.RECTANGLE, {
  x: 5.2, y: 1.3, w: 4.3, h: 3,
  fill: { color: "FFF3E8" },
  line: { color: COLORS.accent, width: 2 }
});
slide5.addText("Agent", {
  x: 5.2, y: 1.4, w: 4.3, h: 0.6,
  fontSize: 22,
  bold: true,
  color: COLORS.accent,
  align: "center"
});
slide5.addText([
  { text: "• Repeating workflow\n\n" },
  { text: "• Defined steps\n\n" },
  { text: "• Same output every time" }
], {
  x: 5.5, y: 2.1, w: 3.7, h: 2,
  fontSize: 18,
  color: COLORS.secondary
});

// Rule
slide5.addShape(pptx.shapes.RECTANGLE, {
  x: 0.5, y: 4.5, w: 9, h: 0.8,
  fill: { color: COLORS.darkBlue }
});
slide5.addText("Rule: If you'll reuse it → it's a candidate for an agent.", {
  x: 0.5, y: 4.5, w: 9, h: 0.8,
  fontSize: 20,
  bold: true,
  color: COLORS.white,
  align: "center",
  valign: "middle"
});

// Slide 6 - Slido: Is This an Agent or Not?
let slide6 = pptx.addSlide();
slide6.addText("Slido: Is This an Agent or Not?", {
  x: 0.5, y: 0.3, w: 9, h: 0.8,
  ...FONTS.heading,
  fontSize: 32
});
slide6.addText("Audience Quiz", {
  x: 0.5, y: 1.1, w: 2, h: 0.4,
  fontSize: 14,
  color: COLORS.white,
  fill: { color: COLORS.primary },
  align: "center"
});
slide6.addText("Vote: Prompt or Agent?", {
  x: 0.5, y: 1.7, w: 9, h: 0.5,
  ...FONTS.body,
  bold: true,
  fontSize: 20
});
slide6.addText([
  { text: "1. \"Summarize this paper\"\n\n" },
  { text: "2. \"Generate KOL visit briefs every month\"\n\n" },
  { text: "3. \"Brainstorm discussion questions\"\n\n" },
  { text: "4. \"Flag objections for every slide deck\"" }
], {
  x: 1, y: 2.4, w: 8, h: 2.5,
  fontSize: 20,
  color: COLORS.secondary
});
slide6.addText("(Facilitator explains answers quickly)", {
  x: 0.5, y: 4.8, w: 9, h: 0.4,
  fontSize: 14,
  color: COLORS.secondary,
  italic: true,
  align: "center"
});

// Slide 7 - What Is an Agent?
let slide7 = pptx.addSlide();
slide7.addText("What Is an Agent?", {
  x: 0.5, y: 0.3, w: 9, h: 0.8,
  ...FONTS.heading,
  fontSize: 32
});
slide7.addText("An agent is an AI that:", {
  x: 0.5, y: 1.3, w: 9, h: 0.5,
  ...FONTS.body,
  fontSize: 22,
  italic: true
});
slide7.addText([
  { text: "Has a job\n\n", options: { bold: true } },
  { text: "Follows reusable instructions\n\n", options: { bold: true } },
  { text: "Produces structured outputs\n\n", options: { bold: true } },
  { text: "Can use tools and memory", options: { bold: true } }
], {
  x: 1.5, y: 2, w: 7, h: 3,
  fontSize: 26,
  color: COLORS.primary,
  bullet: { type: "number" }
});

// Slide 8 - Chatbot vs Agent
let slide8 = pptx.addSlide();
slide8.addText("Chatbot vs Agent", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  ...FONTS.heading,
  fontSize: 28
});

// Table data
const tableData = [
  [{ text: "Dimension", options: { bold: true, fill: { color: COLORS.darkBlue }, color: COLORS.white } },
   { text: "Chatbot", options: { bold: true, fill: { color: COLORS.darkBlue }, color: COLORS.white } },
   { text: "Agent", options: { bold: true, fill: { color: COLORS.darkBlue }, color: COLORS.white } }],
  ["Primary role", "Conversation", "Task completion"],
  ["Autonomy", "None", "Partial → full"],
  ["Acts without prompt", "No", "Yes"],
  ["Has goals", "No", "Yes"],
  ["Planning", "No", "Yes"],
  ["Tool orchestration", "Limited", "Core capability"],
  ["Memory/state", "Short-term", "Persistent"],
  ["Handles failures", "Minimal", "Retries, recovery"],
  ["Executes workflows", "No", "Yes"],
  ["Example output", "\"Here is how to...\"", "Actually does it"]
];

slide8.addTable(tableData, {
  x: 0.3, y: 0.9, w: 9.4, h: 4.3,
  fontSize: 12,
  color: COLORS.secondary,
  border: { type: "solid", pt: 0.5, color: "CCCCCC" },
  colW: [2.2, 3.2, 4],
  valign: "middle",
  align: "left"
});

// Slide 9 - Quick Start: The CRAFT Framework
let slide9 = pptx.addSlide();
slide9.addText("Quick Start: The CRAFT Framework", {
  x: 0.5, y: 0.3, w: 9, h: 0.8,
  ...FONTS.heading,
  fontSize: 32
});
slide9.addText("Use this for every prompt or agent", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 18,
  color: COLORS.secondary,
  italic: true
});

const craftItems = [
  { letter: "C", word: "Context", desc: "background info" },
  { letter: "R", word: "Role", desc: "AI persona" },
  { letter: "A", word: "Action", desc: "what it must do" },
  { letter: "F", word: "Format", desc: "output structure" },
  { letter: "T", word: "Tone", desc: "style / voice" }
];

craftItems.forEach((item, i) => {
  const yPos = 1.7 + (i * 0.7);
  slide9.addShape(pptx.shapes.OVAL, {
    x: 0.8, y: yPos, w: 0.6, h: 0.6,
    fill: { color: COLORS.primary }
  });
  slide9.addText(item.letter, {
    x: 0.8, y: yPos, w: 0.6, h: 0.6,
    fontSize: 24,
    bold: true,
    color: COLORS.white,
    align: "center",
    valign: "middle"
  });
  slide9.addText([
    { text: item.word + " — ", options: { bold: true } },
    { text: item.desc }
  ], {
    x: 1.6, y: yPos, w: 7, h: 0.6,
    fontSize: 22,
    color: COLORS.secondary,
    valign: "middle"
  });
});

// Slide 10 - Team Build Instructions
let slide10 = pptx.addSlide();
slide10.addText("Team Build Instructions", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  ...FONTS.heading,
  fontSize: 28
});
slide10.addText("Your Challenge: Build One Focused Agent", {
  x: 0.5, y: 0.8, w: 9, h: 0.4,
  fontSize: 18,
  color: COLORS.accent,
  bold: true
});

// Step boxes
const steps = [
  { title: "Step 1: Pick & narrow (10 min)", items: "• Choose a domain\n• List steps\n• Select 1-2 steps only" },
  { title: "Step 2: Define & build (20 min)", items: "• User + recurring job\n• Inputs & outputs\n• Constraints\n• Build using CRAFT" },
  { title: "Step 3: Test & refine (10 min)", items: "• Run 2-3 real scenarios\n• Identify failures or overreach" },
  { title: "Step 4: Prepare pitch (10 min)", items: "• Problem + user\n• Agent (name, inputs, outputs)\n• Demo summary\n• Impact" }
];

steps.forEach((step, i) => {
  const xPos = 0.3 + (i * 2.4);
  slide10.addShape(pptx.shapes.RECTANGLE, {
    x: xPos, y: 1.3, w: 2.3, h: 3.8,
    fill: { color: COLORS.light },
    line: { color: COLORS.primary, width: 1 }
  });
  slide10.addText(step.title, {
    x: xPos, y: 1.4, w: 2.3, h: 0.7,
    fontSize: 12,
    bold: true,
    color: COLORS.primary,
    align: "center",
    valign: "middle"
  });
  slide10.addText(step.items, {
    x: xPos + 0.1, y: 2.1, w: 2.1, h: 2.8,
    fontSize: 11,
    color: COLORS.secondary,
    valign: "top"
  });
});

// Slide 11 - Shark Tank Pitches
let slide11 = pptx.addSlide();
slide11.addText("Shark Tank Pitches", {
  x: 0.5, y: 0.3, w: 9, h: 0.8,
  ...FONTS.heading,
  fontSize: 32
});

// Format box
slide11.addShape(pptx.shapes.RECTANGLE, {
  x: 0.5, y: 1.3, w: 4.3, h: 1.8,
  fill: { color: "E8F4FC" },
  line: { color: COLORS.primary, width: 2 }
});
slide11.addText("Format", {
  x: 0.5, y: 1.4, w: 4.3, h: 0.5,
  fontSize: 20,
  bold: true,
  color: COLORS.primary,
  align: "center"
});
slide11.addText([
  { text: "• 4-minute pitch\n\n" },
  { text: "• 2-minute feedback" }
], {
  x: 0.8, y: 1.9, w: 3.7, h: 1,
  fontSize: 18,
  color: COLORS.secondary
});

// Judging box
slide11.addShape(pptx.shapes.RECTANGLE, {
  x: 5.2, y: 1.3, w: 4.3, h: 3.5,
  fill: { color: "FFF3E8" },
  line: { color: COLORS.accent, width: 2 }
});
slide11.addText("Judging Criteria", {
  x: 5.2, y: 1.4, w: 4.3, h: 0.5,
  fontSize: 20,
  bold: true,
  color: COLORS.accent,
  align: "center"
});
slide11.addText([
  { text: "• Problem clarity\n\n" },
  { text: "• Scope & feasibility\n\n" },
  { text: "• Agent design\n\n" },
  { text: "• User value\n\n" },
  { text: "• Storytelling" }
], {
  x: 5.5, y: 1.9, w: 3.7, h: 2.7,
  fontSize: 16,
  color: COLORS.secondary
});

// Save the presentation
pptx.writeFile({ fileName: "c:\\Users\\vivga\\OneDrive\\AI\\AI Projects\\Medical Affairs Training Pilot\\Workshop\\AI_Agent_Creation_Workshop.pptx" })
  .then(fileName => {
    console.log(`Presentation created: ${fileName}`);
  })
  .catch(err => {
    console.error(err);
  });
