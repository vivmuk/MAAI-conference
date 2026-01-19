const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// Create presentation
const pptx = new pptxgen();

// FUTURISTIC COLOR PALETTE - matching the reference images
const COLORS = {
  // Dark futuristic base
  darkBg: '0A0E27',           // Deep navy/black
  darkBg2: '141833',          // Slightly lighter navy
  cardBg: '1A2744',           // Card background

  // Neon accents
  neonCyan: '00F5FF',         // Bright cyan
  neonPurple: 'BF40FF',       // Electric purple
  neonOrange: 'FF6B35',       // Bright orange
  neonBlue: '4D9FFF',         // Electric blue

  // CRAFT colors (matching ROCE style)
  craftC: '1E6FBA',           // Blue for C - Context
  craftR: '2B8A8A',           // Teal for R - Role
  craftA: '3AA5A5',           // Lighter teal for A - Action
  craftF: 'D4651E',           // Orange for F - Format
  craftT: 'C94A1A',           // Darker orange for T - Tone

  // Superpower specific - vibrant neon
  sp1_ideas: '00D4FF',        // Cyan - Ideas
  sp2_analyze: '00FFA3',      // Neon green - Analyze
  sp3_content: 'BF40FF',      // Electric purple - Content
  sp4_feedback: 'FF6B6B',     // Coral red - Feedback

  // Supporting colors
  white: 'FFFFFF',
  lightGray: 'E0E6ED',
  mediumGray: '8892B0',
  gold: 'FFD93D',

  // Glass effect colors
  glassBg: '1A1F3D',
  glassStroke: '4A5568',
};

// Presentation settings
pptx.author = 'MSL Mastery';
pptx.title = "AI's 4 Superpowers Workshop";
pptx.subject = 'Medical Affairs AI Training';
pptx.company = 'MSL Mastery';
pptx.layout = 'LAYOUT_16x9';

// Helper function to add futuristic background
function addFuturisticBg(slide, variant = 'default') {
  slide.background = { color: COLORS.darkBg };

  if (variant === 'default') {
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 7, y: -1, w: 5, h: 5,
      fill: { color: COLORS.neonCyan, transparency: 90 }
    });
    slide.addShape(pptx.ShapeType.ellipse, {
      x: -1, y: 4, w: 4, h: 4,
      fill: { color: COLORS.neonPurple, transparency: 90 }
    });
  } else if (variant === 'centered') {
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 3, y: 1, w: 7, h: 7,
      fill: { color: COLORS.neonCyan, transparency: 92 }
    });
  }
}

// Helper to create glass card effect
function addGlassCard(slide, x, y, w, h, accentColor = null) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: x, y: y, w: w, h: h,
    fill: { color: COLORS.cardBg },
    line: { color: accentColor || COLORS.glassStroke, width: 1, transparency: 50 },
    rectRadius: 0.1
  });
}

// Helper to add neon accent line
function addNeonLine(slide, x, y, w, color) {
  slide.addShape(pptx.ShapeType.rect, {
    x: x, y: y, w: w, h: 0.05,
    fill: { color: color },
    line: { color: color, width: 0 }
  });
}

// Helper to add glowing circle badge
function addGlowBadge(slide, x, y, size, number, color) {
  slide.addShape(pptx.ShapeType.ellipse, {
    x: x - 0.1, y: y - 0.1, w: size + 0.2, h: size + 0.2,
    fill: { color: color, transparency: 70 }
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: x, y: y, w: size, h: size,
    fill: { color: color },
    line: { color: COLORS.white, width: 1, transparency: 50 }
  });
  slide.addText(number.toString(), {
    x: x, y: y, w: size, h: size,
    fontSize: size * 20, fontFace: 'Arial', bold: true,
    color: COLORS.white, align: 'center', valign: 'middle'
  });
}

// ===========================================
// SLIDE 1: Title Slide
// ===========================================
let slide = pptx.addSlide();
addFuturisticBg(slide, 'centered');

// Subtle grid pattern
for (let i = 0; i < 10; i++) {
  slide.addShape(pptx.ShapeType.line, {
    x: 0, y: i * 0.6, w: 10, h: 0,
    line: { color: COLORS.neonCyan, width: 0.3, transparency: 95 }
  });
}

// Main title - AI's 4 SUPERPOWERS
slide.addText("AI's 4", {
  x: 0.5, y: 1.2, w: 5, h: 0.9,
  fontSize: 52, fontFace: 'Arial', bold: true,
  color: COLORS.white
});

slide.addText('SUPERPOWERS', {
  x: 0.5, y: 2, w: 5, h: 0.9,
  fontSize: 52, fontFace: 'Arial', bold: true,
  color: COLORS.neonCyan
});

addNeonLine(slide, 0.5, 2.9, 3, COLORS.neonCyan);

slide.addText('WORKSHOP', {
  x: 0.5, y: 3.1, w: 3, h: 0.5,
  fontSize: 20, fontFace: 'Arial', bold: true, color: COLORS.mediumGray,
  charSpacing: 8
});

slide.addText('Medical Affairs AI Training', {
  x: 0.5, y: 3.6, w: 4, h: 0.4,
  fontSize: 14, fontFace: 'Arial', color: COLORS.mediumGray
});

slide.addText('MSL Mastery', {
  x: 0.5, y: 4.8, w: 2, h: 0.3,
  fontSize: 12, fontFace: 'Arial', color: COLORS.neonCyan
});

// Right side - 4 Superpower cards
const cardW = 2;
const cardH = 1.6;
const startX = 5.8;
const startY = 0.8;
const gap = 0.15;

addGlassCard(slide, startX, startY, cardW, cardH, COLORS.sp1_ideas);
addGlowBadge(slide, startX + cardW/2 - 0.25, startY + 0.2, 0.5, 1, COLORS.sp1_ideas);
slide.addText('GENERATE', { x: startX, y: startY + 0.8, w: cardW, h: 0.3, fontSize: 12, fontFace: 'Arial', bold: true, color: COLORS.sp1_ideas, align: 'center' });
slide.addText('IDEAS', { x: startX, y: startY + 1.1, w: cardW, h: 0.3, fontSize: 12, fontFace: 'Arial', bold: true, color: COLORS.white, align: 'center' });

addGlassCard(slide, startX + cardW + gap, startY, cardW, cardH, COLORS.sp2_analyze);
addGlowBadge(slide, startX + cardW + gap + cardW/2 - 0.25, startY + 0.2, 0.5, 2, COLORS.sp2_analyze);
slide.addText('ANALYZE', { x: startX + cardW + gap, y: startY + 0.8, w: cardW, h: 0.3, fontSize: 12, fontFace: 'Arial', bold: true, color: COLORS.sp2_analyze, align: 'center' });
slide.addText('CONTENT', { x: startX + cardW + gap, y: startY + 1.1, w: cardW, h: 0.3, fontSize: 12, fontFace: 'Arial', bold: true, color: COLORS.white, align: 'center' });

addGlassCard(slide, startX, startY + cardH + gap, cardW, cardH, COLORS.sp3_content);
addGlowBadge(slide, startX + cardW/2 - 0.25, startY + cardH + gap + 0.2, 0.5, 3, COLORS.sp3_content);
slide.addText('GENERATE', { x: startX, y: startY + cardH + gap + 0.8, w: cardW, h: 0.3, fontSize: 12, fontFace: 'Arial', bold: true, color: COLORS.sp3_content, align: 'center' });
slide.addText('CONTENT', { x: startX, y: startY + cardH + gap + 1.1, w: cardW, h: 0.3, fontSize: 12, fontFace: 'Arial', bold: true, color: COLORS.white, align: 'center' });

addGlassCard(slide, startX + cardW + gap, startY + cardH + gap, cardW, cardH, COLORS.sp4_feedback);
addGlowBadge(slide, startX + cardW + gap + cardW/2 - 0.25, startY + cardH + gap + 0.2, 0.5, 4, COLORS.sp4_feedback);
slide.addText('PROVIDE', { x: startX + cardW + gap, y: startY + cardH + gap + 0.8, w: cardW, h: 0.3, fontSize: 12, fontFace: 'Arial', bold: true, color: COLORS.sp4_feedback, align: 'center' });
slide.addText('FEEDBACK', { x: startX + cardW + gap, y: startY + cardH + gap + 1.1, w: cardW, h: 0.3, fontSize: 12, fontFace: 'Arial', bold: true, color: COLORS.white, align: 'center' });

slide.addText('BUILD TRUST BY TESTING THE LIMITS', {
  x: 5.8, y: 4.2, w: 4.2, h: 0.3,
  fontSize: 10, fontFace: 'Arial', bold: true, color: COLORS.gold, align: 'center'
});

// ===========================================
// SLIDE 2: Today's Journey (New Agenda Style)
// ===========================================
slide = pptx.addSlide();
addFuturisticBg(slide);

slide.addText("Today's Journey", {
  x: 0.5, y: 0.3, w: 5, h: 0.7,
  fontSize: 36, fontFace: 'Arial', bold: true, color: COLORS.white
});

slide.addText('YOUR PATH TO AI FLUENCY', {
  x: 0.5, y: 0.95, w: 4, h: 0.3,
  fontSize: 11, fontFace: 'Arial', bold: true, color: COLORS.neonCyan
});

// Left side - Agenda items with time badges
const journeyItems = [
  { time: '10 min', title: 'Icebreaker: AI in Action', desc: 'See something amazing while we set context', color: COLORS.neonOrange },
  { time: '15 min', title: 'The CRAFT Framework', desc: 'Your recipe for talking to AI effectively', color: COLORS.neonCyan },
  { time: '80 min', title: "4 AI Superpowers (Hands-On)", desc: 'Practice, share, and build confidence', color: COLORS.neonOrange },
  { time: '15 min', title: 'Recipe Book & Next Steps', desc: 'Take your prompts with you', color: COLORS.neonCyan },
];

let yPos = 1.5;
journeyItems.forEach((item) => {
  // Card background
  addGlassCard(slide, 0.5, yPos, 5.5, 0.85, item.color);

  // Time badge
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.65, y: yPos + 0.2, w: 0.9, h: 0.45,
    fill: { color: item.color },
    rectRadius: 0.05
  });
  slide.addText(item.time, {
    x: 0.65, y: yPos + 0.2, w: 0.9, h: 0.45,
    fontSize: 11, fontFace: 'Arial', bold: true, color: COLORS.darkBg, align: 'center', valign: 'middle'
  });

  // Title and description
  slide.addText(item.title, {
    x: 1.7, y: yPos + 0.15, w: 4, h: 0.35,
    fontSize: 14, fontFace: 'Arial', bold: true, color: COLORS.white
  });
  slide.addText(item.desc, {
    x: 1.7, y: yPos + 0.48, w: 4, h: 0.3,
    fontSize: 11, fontFace: 'Arial', color: COLORS.mediumGray
  });

  yPos += 0.95;
});

// Right side - Interactive Format box
addGlassCard(slide, 6.3, 1.5, 3.3, 3.3, COLORS.neonBlue);
slide.addShape(pptx.ShapeType.rect, {
  x: 6.3, y: 1.5, w: 3.3, h: 0.05,
  fill: { color: COLORS.neonBlue }
});

slide.addText('INTERACTIVE FORMAT', {
  x: 6.5, y: 1.7, w: 3, h: 0.3,
  fontSize: 10, fontFace: 'Arial', bold: true, color: COLORS.neonCyan
});

slide.addText('Each Superpower', {
  x: 6.5, y: 2.1, w: 3, h: 0.4,
  fontSize: 18, fontFace: 'Arial', bold: true, color: COLORS.white
});

const formatPoints = [
  '• 14 min hands-on practice',
  '• 1 min summary + Slido question',
  '• 5 min share back with group'
];

yPos = 2.6;
formatPoints.forEach(point => {
  slide.addText(point, {
    x: 6.5, y: yPos, w: 3, h: 0.35,
    fontSize: 12, fontFace: 'Arial', color: COLORS.lightGray
  });
  yPos += 0.4;
});

// Divider line
slide.addShape(pptx.ShapeType.line, {
  x: 6.5, y: 3.9, w: 2.8, h: 0,
  line: { color: COLORS.glassStroke, width: 1 }
});

slide.addText('Work individually or in small groups', {
  x: 6.5, y: 4.1, w: 3, h: 0.3,
  fontSize: 10, fontFace: 'Arial', color: COLORS.neonCyan, italic: true
});

// ===========================================
// SLIDE 3: Icebreaker
// ===========================================
slide = pptx.addSlide();
addFuturisticBg(slide, 'centered');

slide.addShape(pptx.ShapeType.ellipse, {
  x: 2.5, y: 0.5, w: 5, h: 5,
  fill: { color: COLORS.neonCyan, transparency: 85 }
});

slide.addText('⚡', { x: 4, y: 0.5, w: 2, h: 1.2, fontSize: 60, align: 'center' });

slide.addText('ICEBREAKER', {
  x: 0.5, y: 1.5, w: 9, h: 0.8,
  fontSize: 40, fontFace: 'Arial', bold: true, color: COLORS.white, align: 'center'
});

slide.addText('Show Something Cool in AI', {
  x: 0.5, y: 2.2, w: 9, h: 0.5,
  fontSize: 22, fontFace: 'Arial', color: COLORS.neonCyan, align: 'center'
});

addGlassCard(slide, 1.5, 2.9, 7, 1.8, COLORS.neonCyan);

slide.addText('🎬 LIVE DEMO', {
  x: 1.7, y: 3.05, w: 3, h: 0.35,
  fontSize: 14, fontFace: 'Arial', bold: true, color: COLORS.neonCyan
});

slide.addText('Generate an infographic from a research paper', {
  x: 1.7, y: 3.45, w: 6.5, h: 0.4,
  fontSize: 16, fontFace: 'Arial', color: COLORS.white
});

slide.addText('While it generates, we\'ll explore:', {
  x: 1.7, y: 3.9, w: 6.5, h: 0.3,
  fontSize: 12, fontFace: 'Arial', color: COLORS.mediumGray, italic: true
});

const icePoints = [
  '✦  What AI can and can\'t do',
  '✦  Building AI intuition',
  '✦  The importance of context'
];

yPos = 4.2;
icePoints.forEach(point => {
  slide.addText(point, { x: 2, y: yPos, w: 5, h: 0.3, fontSize: 13, fontFace: 'Arial', color: COLORS.lightGray });
  yPos += 0.35;
});

// ===========================================
// SLIDE 4: Workshop Outcomes
// ===========================================
slide = pptx.addSlide();
addFuturisticBg(slide);

slide.addText('WORKSHOP OUTCOMES', {
  x: 0.5, y: 0.3, w: 6, h: 0.7,
  fontSize: 32, fontFace: 'Arial', bold: true, color: COLORS.white
});

slide.addText('By the end of this session, you will:', {
  x: 0.5, y: 0.95, w: 6, h: 0.35,
  fontSize: 14, fontFace: 'Arial', color: COLORS.mediumGray, italic: true
});

addNeonLine(slide, 0.5, 1.3, 2, COLORS.neonPurple);

const outcomes = [
  { icon: '🗣️', title: 'Know how to talk to AI', desc: 'Master the CRAFT prompting framework', color: COLORS.neonCyan },
  { icon: '🎯', title: 'Know when to reach for AI', desc: 'Understand the 4 AI Superpowers', color: COLORS.sp2_analyze },
  { icon: '💪', title: 'Build confidence', desc: 'Practice with real Medical Affairs scenarios', color: COLORS.sp3_content },
  { icon: '⚖️', title: 'Set expectations', desc: 'Understand what AI can and can\'t do', color: COLORS.sp4_feedback },
  { icon: '🧠', title: 'Build AI intuition', desc: 'Learn to iterate and improve outputs', color: COLORS.gold },
  { icon: '📝', title: 'Master context', desc: 'Give AI what it needs to succeed', color: COLORS.neonPurple }
];

const col1X = 0.5;
const col2X = 5;
yPos = 1.55;

outcomes.forEach((outcome, idx) => {
  const xPos = idx < 3 ? col1X : col2X;
  const adjustedY = idx < 3 ? yPos + (idx * 1.1) : yPos + ((idx - 3) * 1.1);

  addGlassCard(slide, xPos, adjustedY, 4.3, 0.95, outcome.color);

  slide.addText(outcome.icon, {
    x: xPos + 0.15, y: adjustedY + 0.2, w: 0.5, h: 0.5,
    fontSize: 24
  });

  slide.addText(outcome.title, {
    x: xPos + 0.7, y: adjustedY + 0.15, w: 3.4, h: 0.35,
    fontSize: 13, fontFace: 'Arial', bold: true, color: COLORS.white
  });

  slide.addText(outcome.desc, {
    x: xPos + 0.7, y: adjustedY + 0.5, w: 3.4, h: 0.35,
    fontSize: 11, fontFace: 'Arial', color: COLORS.mediumGray
  });
});

// ===========================================
// SLIDE 5: Slido Check-in
// ===========================================
slide = pptx.addSlide();
addFuturisticBg(slide, 'centered');

slide.addText('📊', { x: 0.5, y: 0.3, w: 1, h: 0.8, fontSize: 40 });

slide.addText('SLIDO CHECK-IN', {
  x: 1.3, y: 0.4, w: 5, h: 0.6,
  fontSize: 32, fontFace: 'Arial', bold: true, color: COLORS.white
});

addNeonLine(slide, 0.5, 1, 2.5, COLORS.sp2_analyze);

const slidoQuestions = [
  { q: '"Who here uses AI weekly?"', note: 'Align to Sarah\'s poll on AI usage' },
  { q: '"Who still feels unsure if they\'re doing it \'right\'?"', note: '' },
  { q: '"What is your coolest use case?"', note: '' }
];

yPos = 1.3;
slidoQuestions.forEach((item, idx) => {
  addGlassCard(slide, 0.5, yPos, 5.5, 0.85, COLORS.sp2_analyze);

  slide.addShape(pptx.ShapeType.ellipse, {
    x: 0.7, y: yPos + 0.2, w: 0.45, h: 0.45,
    fill: { color: COLORS.sp2_analyze }
  });
  slide.addText((idx + 1).toString(), {
    x: 0.7, y: yPos + 0.2, w: 0.45, h: 0.45,
    fontSize: 14, fontFace: 'Arial', bold: true, color: COLORS.darkBg, align: 'center', valign: 'middle'
  });

  slide.addText(item.q, {
    x: 1.3, y: yPos + 0.15, w: 4.5, h: 0.4,
    fontSize: 14, fontFace: 'Arial', color: COLORS.white, italic: true
  });

  if (item.note) {
    slide.addText(item.note, {
      x: 1.3, y: yPos + 0.5, w: 4.5, h: 0.3,
      fontSize: 10, fontFace: 'Arial', color: COLORS.mediumGray
    });
  }

  yPos += 0.95;
});

// QR Code placeholder
addGlassCard(slide, 6.5, 1.3, 3, 3.3, COLORS.sp2_analyze);
slide.addText('📱', { x: 7.3, y: 1.8, w: 1.5, h: 1, fontSize: 50, align: 'center' });
slide.addText('SCAN TO JOIN', { x: 6.6, y: 3, w: 2.8, h: 0.3, fontSize: 12, fontFace: 'Arial', bold: true, color: COLORS.sp2_analyze, align: 'center' });
slide.addText('[Insert QR Code]', { x: 6.6, y: 3.4, w: 2.8, h: 0.8, fontSize: 11, fontFace: 'Arial', color: COLORS.mediumGray, align: 'center' });

// ===========================================
// SLIDE 6: 4 AI Superpowers Overview
// ===========================================
slide = pptx.addSlide();
addFuturisticBg(slide);

slide.addText("AI's 4 SUPERPOWERS", {
  x: 0.5, y: 0.25, w: 9, h: 0.6,
  fontSize: 32, fontFace: 'Arial', bold: true, color: COLORS.white, align: 'center'
});

addNeonLine(slide, 3.5, 0.85, 3, COLORS.gold);

const spCardW = 2.15;
const spCardH = 2.4;
const spStartX = 0.45;
const spStartY = 1.1;
const spGap = 0.2;

const superpowers = [
  { num: 1, title: 'GENERATE\nIDEAS', icon: '💡', desc: 'Brainstorm, expand options, reframe problems', color: COLORS.sp1_ideas },
  { num: 2, title: 'ANALYZE\nCONTENT', icon: '🔍', desc: 'Spot patterns, gaps, risks, competitor angles', color: COLORS.sp2_analyze },
  { num: 3, title: 'GENERATE\nCONTENT', icon: '✍️', desc: 'Draft summaries, slides, or communications fast', color: COLORS.sp3_content },
  { num: 4, title: 'PROVIDE\nFEEDBACK', icon: '🎯', desc: 'Act like a reviewer or coach to improve your work', color: COLORS.sp4_feedback },
];

superpowers.forEach((sp, idx) => {
  const xPos = spStartX + idx * (spCardW + spGap);

  slide.addShape(pptx.ShapeType.roundRect, {
    x: xPos - 0.05, y: spStartY - 0.05, w: spCardW + 0.1, h: spCardH + 0.1,
    fill: { color: sp.color, transparency: 80 },
    rectRadius: 0.1
  });

  addGlassCard(slide, xPos, spStartY, spCardW, spCardH, sp.color);
  addGlowBadge(slide, xPos + spCardW/2 - 0.3, spStartY + 0.15, 0.6, sp.num, sp.color);

  slide.addText(sp.icon, {
    x: xPos, y: spStartY + 0.85, w: spCardW, h: 0.6,
    fontSize: 32, align: 'center'
  });

  slide.addText(sp.title, {
    x: xPos + 0.1, y: spStartY + 1.45, w: spCardW - 0.2, h: 0.55,
    fontSize: 12, fontFace: 'Arial', bold: true, color: sp.color, align: 'center', lineSpacing: 14
  });

  slide.addText(sp.desc, {
    x: xPos + 0.1, y: spStartY + 2, w: spCardW - 0.2, h: 0.5,
    fontSize: 9, fontFace: 'Arial', color: COLORS.lightGray, align: 'center'
  });
});

// Use cases section
addGlassCard(slide, 0.45, 3.7, 9.1, 1.4, COLORS.gold);

slide.addText('💼 USE CASES', {
  x: 0.6, y: 3.8, w: 2, h: 0.35,
  fontSize: 14, fontFace: 'Arial', bold: true, color: COLORS.gold
});

const useCases = [
  'Email subject lines',
  'Presentation talking points',
  'Objection handling',
  'Different perspectives',
  'Executive presence coaching'
];

useCases.forEach((uc, idx) => {
  const row = Math.floor(idx / 3);
  const col = idx % 3;
  slide.addText('▸ ' + uc, {
    x: 0.7 + col * 3, y: 4.2 + row * 0.4, w: 2.9, h: 0.35,
    fontSize: 11, fontFace: 'Arial', color: COLORS.lightGray
  });
});

// ===========================================
// SLIDE 7: CRAFT Framework (ROCE Style)
// ===========================================
slide = pptx.addSlide();
addFuturisticBg(slide);

slide.addText('YOUR PROMPTING RECIPE', {
  x: 0.5, y: 0.25, w: 9, h: 0.35,
  fontSize: 11, fontFace: 'Arial', bold: true, color: COLORS.neonCyan
});

slide.addText('The CRAFT Framework', {
  x: 0.5, y: 0.55, w: 9, h: 0.6,
  fontSize: 32, fontFace: 'Arial', bold: true, color: COLORS.white
});

// Large letters above cards (faded)
const craftCards = [
  { letter: 'C', word: 'Context', desc: 'Share the backstory. Give AI the information it needs to help you.', example: '"I\'m an MSL preparing for a KOL meeting..."', color: COLORS.craftC },
  { letter: 'R', word: 'Role', desc: 'Tell AI who to be. Give it an expert identity to shape its perspective.', example: '"Act as a medical communication coach..."', color: COLORS.craftR },
  { letter: 'A', word: 'Action', desc: 'Be specific about what you want. Define clear parameters for the output.', example: '"Generate 5 subject lines under 8 words..."', color: COLORS.craftA },
  { letter: 'F', word: 'Format', desc: 'Show, don\'t tell. Specify how you want the output structured.', example: '"Use bullet points, keep each under 20 words..."', color: COLORS.craftF },
  { letter: 'T', word: 'Tone', desc: 'Set the voice. Define the communication style you need.', example: '"Professional, warm, and confident..."', color: COLORS.craftT }
];

const craftCardW = 1.8;
const craftCardH = 2.8;
const craftStartX = 0.4;
const craftGap = 0.15;

craftCards.forEach((card, idx) => {
  const xPos = craftStartX + idx * (craftCardW + craftGap);

  // Faded letter above
  slide.addText(card.letter, {
    x: xPos, y: 1.1, w: craftCardW, h: 0.5,
    fontSize: 28, fontFace: 'Arial', bold: true, color: card.color, transparency: 60, align: 'center'
  });

  // Card with gradient-like solid fill
  slide.addShape(pptx.ShapeType.roundRect, {
    x: xPos, y: 1.5, w: craftCardW, h: craftCardH,
    fill: { color: card.color },
    rectRadius: 0.1
  });

  // Large letter
  slide.addText(card.letter, {
    x: xPos + 0.1, y: 1.6, w: 0.6, h: 0.6,
    fontSize: 32, fontFace: 'Arial', bold: true, color: COLORS.neonCyan
  });

  // Word
  slide.addText(card.word, {
    x: xPos + 0.1, y: 2.2, w: craftCardW - 0.2, h: 0.4,
    fontSize: 16, fontFace: 'Arial', bold: true, color: COLORS.white
  });

  // Description
  slide.addText(card.desc, {
    x: xPos + 0.1, y: 2.65, w: craftCardW - 0.2, h: 0.9,
    fontSize: 10, fontFace: 'Arial', color: COLORS.lightGray
  });

  // Divider line
  slide.addShape(pptx.ShapeType.line, {
    x: xPos + 0.1, y: 3.6, w: craftCardW - 0.2, h: 0,
    line: { color: COLORS.white, width: 0.5, transparency: 70 }
  });

  // Example
  slide.addText(card.example, {
    x: xPos + 0.1, y: 3.7, w: craftCardW - 0.2, h: 0.5,
    fontSize: 9, fontFace: 'Arial', color: COLORS.white, italic: true
  });
});

// ===========================================
// SLIDE 8: Good vs Bad Prompts
// ===========================================
slide = pptx.addSlide();
addFuturisticBg(slide);

slide.addText('THE POWER OF PROMPTING', {
  x: 0.5, y: 0.25, w: 9, h: 0.6,
  fontSize: 32, fontFace: 'Arial', bold: true, color: COLORS.white, align: 'center'
});

addNeonLine(slide, 3.5, 0.85, 3, COLORS.neonPurple);

// Bad prompt card
addGlassCard(slide, 0.5, 1.1, 4.3, 2.3, 'FF4757');
slide.addText('❌ BAD PROMPT', { x: 0.7, y: 1.2, w: 3, h: 0.4, fontSize: 14, fontFace: 'Arial', bold: true, color: 'FF4757' });

slide.addShape(pptx.ShapeType.roundRect, {
  x: 0.7, y: 1.65, w: 3.9, h: 0.7,
  fill: { color: COLORS.darkBg2 },
  rectRadius: 0.05
});
slide.addText('"Write me an email"', {
  x: 0.85, y: 1.75, w: 3.6, h: 0.5,
  fontSize: 14, fontFace: 'Arial', color: COLORS.lightGray, italic: true
});

slide.addText('⚠️ Missing:', { x: 0.7, y: 2.45, w: 2, h: 0.3, fontSize: 11, fontFace: 'Arial', bold: true, color: 'FF4757' });
slide.addText('Context, Role, Action specifics,\nFormat, Tone', { x: 0.7, y: 2.75, w: 3.9, h: 0.5, fontSize: 11, fontFace: 'Arial', color: COLORS.mediumGray });

// Good prompt card
addGlassCard(slide, 5.2, 1.1, 4.3, 2.3, COLORS.sp2_analyze);
slide.addText('✅ GOOD PROMPT', { x: 5.4, y: 1.2, w: 3, h: 0.4, fontSize: 14, fontFace: 'Arial', bold: true, color: COLORS.sp2_analyze });

slide.addShape(pptx.ShapeType.roundRect, {
  x: 5.4, y: 1.65, w: 3.9, h: 1.3,
  fill: { color: COLORS.darkBg2 },
  rectRadius: 0.05
});
slide.addText('"Act as an MSL writing to an oncologist interested in real-world data. Draft a follow-up email with 3 bullets on our latest trial results. Keep it professional and under 100 words."', {
  x: 5.55, y: 1.75, w: 3.6, h: 1.1,
  fontSize: 11, fontFace: 'Arial', color: COLORS.lightGray, italic: true
});

slide.addText('✓ Has: Context, Role, Action, Format, Tone', { x: 5.4, y: 3, w: 3.9, h: 0.3, fontSize: 10, fontFace: 'Arial', color: COLORS.sp2_analyze });

// Results
slide.addText('📊 RESULT', { x: 0.5, y: 3.6, w: 2, h: 0.4, fontSize: 16, fontFace: 'Arial', bold: true, color: COLORS.white });

addGlassCard(slide, 0.5, 4, 4.3, 1, 'FF4757');
slide.addText('Generic, unfocused email\nthat needs heavy editing', {
  x: 0.7, y: 4.2, w: 4, h: 0.7,
  fontSize: 13, fontFace: 'Arial', color: COLORS.mediumGray, align: 'center'
});

addGlassCard(slide, 5.2, 4, 4.3, 1, COLORS.sp2_analyze);
slide.addText('Targeted, relevant draft\nready for quick review ✨', {
  x: 5.4, y: 4.2, w: 4, h: 0.7,
  fontSize: 13, fontFace: 'Arial', bold: true, color: COLORS.white, align: 'center'
});

// ===========================================
// SLIDE 9: Workshop Instructions
// ===========================================
slide = pptx.addSlide();
addFuturisticBg(slide, 'centered');

slide.addText('🔧', { x: 4, y: 0.2, w: 2, h: 0.8, fontSize: 45, align: 'center' });

slide.addText('HANDS-ON WORKSHOP', {
  x: 0.5, y: 0.9, w: 9, h: 0.6,
  fontSize: 32, fontFace: 'Arial', bold: true, color: COLORS.white, align: 'center'
});

slide.addText('15 minutes per superpower', {
  x: 0.5, y: 1.5, w: 9, h: 0.4,
  fontSize: 16, fontFace: 'Arial', color: COLORS.neonCyan, align: 'center'
});

addNeonLine(slide, 3.5, 1.9, 3, COLORS.neonCyan);

addGlassCard(slide, 1, 2.1, 8, 2.2, COLORS.neonCyan);

slide.addText('📋 INSTRUCTIONS', { x: 1.2, y: 2.2, w: 3, h: 0.4, fontSize: 16, fontFace: 'Arial', bold: true, color: COLORS.neonCyan });

const instructions = [
  { num: '1', text: 'Pick one of the example topics for this superpower' },
  { num: '2', text: 'Practice running the prompts (good vs bad examples provided)' },
  { num: '3', text: 'Iterate and refine your output' },
  { num: '4', text: 'Note what worked and what surprised you' }
];

yPos = 2.65;
instructions.forEach((inst) => {
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 1.3, y: yPos, w: 0.35, h: 0.35,
    fill: { color: COLORS.neonCyan }
  });
  slide.addText(inst.num, {
    x: 1.3, y: yPos, w: 0.35, h: 0.35,
    fontSize: 12, fontFace: 'Arial', bold: true, color: COLORS.darkBg, align: 'center', valign: 'middle'
  });
  slide.addText(inst.text, {
    x: 1.8, y: yPos, w: 7, h: 0.35,
    fontSize: 13, fontFace: 'Arial', color: COLORS.white
  });
  yPos += 0.4;
});

addGlassCard(slide, 1, 4.5, 3.8, 0.9, COLORS.sp3_content);
slide.addText('⏱️ 10 min', { x: 1.2, y: 4.6, w: 1.5, h: 0.35, fontSize: 16, fontFace: 'Arial', bold: true, color: COLORS.sp3_content });
slide.addText('Practice in small groups\nor individually', { x: 1.2, y: 4.95, w: 3.4, h: 0.4, fontSize: 11, fontFace: 'Arial', color: COLORS.lightGray });

addGlassCard(slide, 5.2, 4.5, 3.8, 0.9, COLORS.sp4_feedback);
slide.addText('💬 5 min', { x: 5.4, y: 4.6, w: 1.5, h: 0.35, fontSize: 16, fontFace: 'Arial', bold: true, color: COLORS.sp4_feedback });
slide.addText('Share back with group', { x: 5.4, y: 4.95, w: 3.4, h: 0.4, fontSize: 11, fontFace: 'Arial', color: COLORS.lightGray });

// ===========================================
// SLIDES 10-13: Superpower slides (same as before but with "AI's" branding)
// ===========================================

// Helper function for superpower slides
function createSuperpowerSlide(num, title, subtitle, color, examples) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  slide.addShape(pptx.ShapeType.ellipse, {
    x: -2, y: -2, w: 8, h: 8,
    fill: { color: color, transparency: 88 }
  });

  addGlowBadge(slide, 0.4, 0.25, 0.7, num, color);

  slide.addText('SUPERPOWER ' + num, {
    x: 1.25, y: 0.2, w: 3, h: 0.4,
    fontSize: 14, fontFace: 'Arial', bold: true, color: color
  });

  slide.addText(title, {
    x: 1.25, y: 0.55, w: 5, h: 0.5,
    fontSize: 28, fontFace: 'Arial', bold: true, color: COLORS.white
  });

  slide.addText(subtitle, {
    x: 5.3, y: 0.4, w: 4.5, h: 0.4,
    fontSize: 12, fontFace: 'Arial', color: COLORS.lightGray, italic: true
  });

  addNeonLine(slide, 0.4, 1.05, 9.2, color);

  const exCardW = 3;
  const exCardH = 2.4;
  const exStartX = 0.4;
  const exStartY = 1.2;
  const exGap = 0.15;

  examples.forEach((ex, idx) => {
    const xPos = exStartX + idx * (exCardW + exGap);

    addGlassCard(slide, xPos, exStartY, exCardW, exCardH, color);

    slide.addText('EXAMPLE ' + (idx + 1), {
      x: xPos + 0.1, y: exStartY + 0.08, w: 1.2, h: 0.25,
      fontSize: 9, fontFace: 'Arial', bold: true, color: color
    });
    slide.addText(ex.title, {
      x: xPos + 0.1, y: exStartY + 0.3, w: exCardW - 0.2, h: 0.3,
      fontSize: 11, fontFace: 'Arial', bold: true, color: COLORS.white
    });

    slide.addText('❌ BAD:', { x: xPos + 0.1, y: exStartY + 0.65, w: 1, h: 0.2, fontSize: 9, fontFace: 'Arial', bold: true, color: 'FF4757' });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos + 0.1, y: exStartY + 0.85, w: exCardW - 0.2, h: 0.4,
      fill: { color: 'FF4757', transparency: 85 },
      rectRadius: 0.03
    });
    slide.addText(ex.bad, { x: xPos + 0.15, y: exStartY + 0.88, w: exCardW - 0.3, h: 0.35, fontSize: 8, fontFace: 'Arial', color: COLORS.lightGray, italic: true });

    slide.addText('✅ GOOD:', { x: xPos + 0.1, y: exStartY + 1.3, w: 1, h: 0.2, fontSize: 9, fontFace: 'Arial', bold: true, color: COLORS.sp2_analyze });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos + 0.1, y: exStartY + 1.5, w: exCardW - 0.2, h: 0.8,
      fill: { color: color, transparency: 85 },
      rectRadius: 0.03
    });
    slide.addText(ex.good, { x: xPos + 0.15, y: exStartY + 1.53, w: exCardW - 0.3, h: 0.75, fontSize: 8, fontFace: 'Arial', color: COLORS.white, italic: true });
  });

  addGlassCard(slide, 0.4, 3.75, 7.2, 0.9, color);
  slide.addText('🚀 TRY IT NOW', { x: 0.55, y: 3.85, w: 2, h: 0.3, fontSize: 12, fontFace: 'Arial', bold: true, color: color });
  slide.addText('1. Pick one example  →  2. Open your AI tool  →  3. Try BAD then GOOD  →  4. Compare outputs', {
    x: 0.55, y: 4.15, w: 6.9, h: 0.4,
    fontSize: 11, fontFace: 'Arial', color: COLORS.white
  });

  addGlassCard(slide, 7.75, 3.75, 1.85, 0.9, color);
  slide.addText('📱 QR', { x: 7.85, y: 3.95, w: 1.65, h: 0.5, fontSize: 18, fontFace: 'Arial', color: COLORS.mediumGray, align: 'center' });

  slide.addText('💬 SLIDO: What else could you use this superpower for?', {
    x: 0.4, y: 4.8, w: 9, h: 0.3,
    fontSize: 12, fontFace: 'Arial', bold: true, color: color
  });
}

// Superpower 1 - Generate Ideas
createSuperpowerSlide(1, 'GENERATE IDEAS', '💡 When you need options, angles, or a fresh perspective', COLORS.sp1_ideas, [
  { title: 'Email Subject Lines', bad: '"Give me email subjects"', good: '"Generate 5 subject line options for a follow-up email to an oncologist focused on real-world evidence. Make them short, specific, and open-worthy."' },
  { title: 'Meeting Talking Points', bad: '"What should I talk about?"', good: '"Generate 4 discussion angles for a KOL meeting about our Phase 3 data. Focus on what a cardiologist would find most valuable."' },
  { title: 'Objection Responses', bad: '"How do I respond to objections?"', good: '"Generate 3 ways to address the objection that our trial population doesn\'t match their patient mix. Use data-driven responses."' }
]);

// Superpower 2 - Analyze Content
createSuperpowerSlide(2, 'ANALYZE CONTENT', '🔍 When you need to stress-test assumptions or stories', COLORS.sp2_analyze, [
  { title: 'Email Review', bad: '"Is this email good?"', good: '"Review this email and flag where it could be misunderstood, unclear, too long, or low-value for a busy endocrinologist. Suggest concise fixes."' },
  { title: 'Data Gaps Analysis', bad: '"Analyze this trial data"', good: '"Identify 3 potential gaps or questions an HCP might raise about this trial summary. Consider patient population, endpoints, and follow-up period."' },
  { title: 'Competitor Angle', bad: '"What would a competitor say?"', good: '"Play the role of a competitor MSL. What weaknesses would you highlight in this data presentation? What questions would challenge our positioning?"' }
]);

// Superpower 3 - Generate Content
createSuperpowerSlide(3, 'GENERATE CONTENT', '✍️ When you need fast drafts or first drafts', COLORS.sp3_content, [
  { title: 'Email Rewrite', bad: '"Make this email better"', good: '"Rewrite this email to be skimmable: 3 bullets and a one-line ask. Keep it warm, simple, and professional. Under 75 words."' },
  { title: 'Meeting Summary', bad: '"Summarize this meeting"', good: '"Create a meeting summary in this format: Key Insights (3 bullets), Action Items (numbered), Follow-up Date. Tone: professional, concise."' },
  { title: 'Slide Content', bad: '"Write slides about our drug"', good: '"Draft 3 slide titles and 3 bullets each for a presentation on efficacy data. Audience: community oncologists. Focus: practical clinical application."' }
]);

// Superpower 4 - Provide Feedback
createSuperpowerSlide(4, 'PROVIDE FEEDBACK', '🎯 When you need a quick, actionable critique or coaching', COLORS.sp4_feedback, [
  { title: 'Email Coach', bad: '"Give me feedback on this"', good: '"Act as my MSL email communication coach. Give me 3 specific improvements that would increase reply likelihood — tone, clarity, or relevance — and explain why."' },
  { title: 'Presentation Coach', bad: '"How can I improve this?"', good: '"Act as an executive presentation coach. Review these talking points for a KOL meeting. Rate clarity (1-5) and suggest how to sound more confident and data-driven."' },
  { title: 'Executive Presence', bad: '"Does this sound professional?"', good: '"Coach me on executive presence. Review this message and tell me where I sound uncertain, too wordy, or miss opportunities to demonstrate expertise."' }
]);

// ===========================================
// SLIDE 14: Wrap-Up
// ===========================================
slide = pptx.addSlide();
addFuturisticBg(slide, 'centered');

slide.addText('🚀', { x: 4, y: 0.2, w: 2, h: 0.8, fontSize: 45, align: 'center' });

slide.addText('WRAP-UP & REFLECTION', {
  x: 0.5, y: 0.9, w: 9, h: 0.6,
  fontSize: 32, fontFace: 'Arial', bold: true, color: COLORS.white, align: 'center'
});

addNeonLine(slide, 3.5, 1.5, 3, COLORS.gold);

addGlassCard(slide, 0.5, 1.7, 5, 2.3, COLORS.gold);

slide.addText('💬 SLIDO REFLECTION', { x: 0.7, y: 1.85, w: 3, h: 0.35, fontSize: 14, fontFace: 'Arial', bold: true, color: COLORS.gold });

const wrapQuestions = [
  'What surprised you the most?',
  'Which superpower would you use tomorrow?',
  'What\'s one thing you\'ll try differently?'
];

yPos = 2.3;
wrapQuestions.forEach((q, idx) => {
  slide.addShape(pptx.ShapeType.ellipse, { x: 0.7, y: yPos, w: 0.4, h: 0.4, fill: { color: COLORS.gold } });
  slide.addText((idx + 1).toString(), { x: 0.7, y: yPos, w: 0.4, h: 0.4, fontSize: 14, fontFace: 'Arial', bold: true, color: COLORS.darkBg, align: 'center', valign: 'middle' });
  slide.addText(q, { x: 1.25, y: yPos + 0.05, w: 4, h: 0.4, fontSize: 13, fontFace: 'Arial', color: COLORS.white });
  yPos += 0.55;
});

addGlassCard(slide, 5.8, 1.7, 3.7, 2.3, COLORS.gold);
slide.addText('📱', { x: 6.9, y: 2.1, w: 1.5, h: 0.8, fontSize: 40, align: 'center' });
slide.addText('SCAN TO RESPOND', { x: 5.9, y: 2.9, w: 3.5, h: 0.3, fontSize: 11, fontFace: 'Arial', bold: true, color: COLORS.gold, align: 'center' });
slide.addText('[Insert QR Code]', { x: 5.9, y: 3.3, w: 3.5, h: 0.5, fontSize: 10, fontFace: 'Arial', color: COLORS.mediumGray, align: 'center' });

slide.addText('✨ KEY TAKEAWAYS', { x: 0.5, y: 4.15, w: 3, h: 0.35, fontSize: 14, fontFace: 'Arial', bold: true, color: COLORS.neonCyan });

const takeaways = [
  { text: 'Better prompts = Better outputs (use CRAFT)', color: COLORS.sp1_ideas },
  { text: 'AI is a thinking partner, not a replacement', color: COLORS.sp2_analyze },
  { text: 'Context is everything — the more you give, the better you get', color: COLORS.sp3_content },
  { text: 'Practice builds intuition — keep experimenting!', color: COLORS.sp4_feedback }
];

yPos = 4.5;
takeaways.forEach((t) => {
  slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: yPos, w: 0.08, h: 0.3, fill: { color: t.color } });
  slide.addText(t.text, { x: 0.7, y: yPos, w: 9, h: 0.3, fontSize: 12, fontFace: 'Arial', color: COLORS.lightGray });
  yPos += 0.38;
});

// ===========================================
// SLIDE 15: Thank You
// ===========================================
slide = pptx.addSlide();
addFuturisticBg(slide, 'centered');

slide.addShape(pptx.ShapeType.ellipse, { x: 2, y: 0.5, w: 6, h: 6, fill: { color: COLORS.neonCyan, transparency: 90 } });

slide.addText('THANK YOU', {
  x: 0.5, y: 1.3, w: 9, h: 1,
  fontSize: 52, fontFace: 'Arial', bold: true, color: COLORS.white, align: 'center'
});

slide.addText("Keep practicing AI's 4 Superpowers", {
  x: 0.5, y: 2.3, w: 9, h: 0.5,
  fontSize: 18, fontFace: 'Arial', color: COLORS.neonCyan, align: 'center'
});

const badgeStartX = 2;
const badgeY = 3;
const badgeW = 1.5;
const badgeGap = 0.3;

const miniSuperpowers = [
  { num: 1, label: 'IDEAS', color: COLORS.sp1_ideas },
  { num: 2, label: 'ANALYZE', color: COLORS.sp2_analyze },
  { num: 3, label: 'CONTENT', color: COLORS.sp3_content },
  { num: 4, label: 'FEEDBACK', color: COLORS.sp4_feedback }
];

miniSuperpowers.forEach((sp, idx) => {
  const xPos = badgeStartX + idx * (badgeW + badgeGap);

  slide.addShape(pptx.ShapeType.roundRect, {
    x: xPos, y: badgeY, w: badgeW, h: 0.8,
    fill: { color: sp.color, transparency: 20 },
    line: { color: sp.color, width: 2 },
    rectRadius: 0.1
  });

  slide.addText(sp.num + ' ' + sp.label, {
    x: xPos, y: badgeY, w: badgeW, h: 0.8,
    fontSize: 11, fontFace: 'Arial', bold: true, color: sp.color, align: 'center', valign: 'middle'
  });
});

slide.addText('MSL Mastery', {
  x: 0.5, y: 4.2, w: 9, h: 0.4,
  fontSize: 16, fontFace: 'Arial', bold: true, color: COLORS.neonCyan, align: 'center'
});

slide.addText('Questions? Reach out to your workshop facilitator', {
  x: 0.5, y: 4.7, w: 9, h: 0.3,
  fontSize: 12, fontFace: 'Arial', color: COLORS.mediumGray, align: 'center'
});

// Save the presentation
const outputPath = path.join(__dirname, 'AI_Superpowers_Workshop_v3.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(fileName => {
    console.log(`✅ Presentation created successfully: ${fileName}`);
  })
  .catch(err => {
    console.error('Error creating presentation:', err);
  });
