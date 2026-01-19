const fs = require("fs");
const path = require("path");

const VENICE_API_KEY = "axVuPlm7Tgb-UcUDYBXlP-G2EYaK4btQcbQFkEvRUI";
const MODEL = "fluently-xl";
const OUTPUT_DIR = path.join(__dirname, "assets");

const stylePrompt = "watercolor whimsical illustration with soft washes, dreamy pastel edges, futuristic palette of cyan (#00F5FF), magenta (#BF40FF), coral (#FF6B6B), and teal (#00FFA3) on white background, delicate brushstrokes, ethereal glow, professional medical illustration style";

const images = [
  {
    name: "hero-watercolor",
    prompt: `A majestic lightbulb with neural network patterns inside emanating soft light rays, symbolizing AI intelligence and innovation, ${stylePrompt}`,
  },
  {
    name: "icon-ideas",
    prompt: `A cluster of floating light bulbs with sparkles and thought bubbles, representing brainstorming and idea generation, ${stylePrompt}`,
  },
  {
    name: "icon-analyze",
    prompt: `A magnifying glass examining a flowing document with highlighted sections, symbolizing content analysis and review, ${stylePrompt}`,
  },
  {
    name: "icon-generate",
    prompt: `A quill pen writing on flowing paper with text materializing from glowing particles, representing content creation, ${stylePrompt}`,
  },
  {
    name: "icon-feedback",
    prompt: `Two speech bubbles with a coaching whistle and checkmarks, representing feedback and improvement coaching, ${stylePrompt}`,
  },
  {
    name: "craft-context",
    prompt: `An open book with a small scene emerging from its pages, representing context and background information, ${stylePrompt}`,
  },
  {
    name: "craft-role",
    prompt: `A theatrical mask with professional elements like stethoscope and briefcase, representing roles and personas, ${stylePrompt}`,
  },
  {
    name: "craft-action",
    prompt: `An arrow hitting a target with action lines and motion effects, representing clear action and tasks, ${stylePrompt}`,
  },
  {
    name: "craft-format",
    prompt: `Organized building blocks and geometric shapes forming a structured layout, representing format and structure, ${stylePrompt}`,
  },
  {
    name: "craft-tone",
    prompt: `A tuning fork with musical notes and sound waves, representing tone and voice, ${stylePrompt}`,
  },
];

async function generateImage(imageConfig) {
  console.log(`Generating: ${imageConfig.name}...`);

  try {
    const response = await fetch("https://api.venice.ai/api/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VENICE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: imageConfig.prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error generating ${imageConfig.name}:`, errorText);
      return null;
    }

    const data = await response.json();

    if (data.data && data.data[0] && data.data[0].b64_json) {
      const imageBuffer = Buffer.from(data.data[0].b64_json, "base64");
      const outputPath = path.join(OUTPUT_DIR, `${imageConfig.name}.webp`);
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`  ✅ Saved: ${outputPath}`);
      return outputPath;
    } else {
      console.error(`No image data for ${imageConfig.name}`);
      return null;
    }
  } catch (error) {
    console.error(`Error generating ${imageConfig.name}:`, error.message);
    return null;
  }
}

async function main() {
  console.log("Starting image generation with Venice AI...\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const img of images) {
    await generateImage(img);
    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log("\n✅ Image generation complete!");
}

main().catch(console.error);
