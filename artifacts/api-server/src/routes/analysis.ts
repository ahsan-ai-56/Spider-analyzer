import { Router } from "express";
import OpenAI from "openai";
import { db } from "@workspace/db";
import { spiderScansTable, biteScansTable } from "@workspace/db";

const router = Router();

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  return new OpenAI({ apiKey });
}

function stripBase64Prefix(base64: string): string {
  return base64.replace(/^data:image\/[a-z]+;base64,/, "");
}

// POST /api/analysis/spider
router.post("/analysis/spider", async (req, res) => {
  const { imageBase64 } = req.body as { imageBase64?: string };

  if (!imageBase64) {
    res.status(400).json({ error: "imageBase64 is required" });
    return;
  }

  let openai: OpenAI;
  try {
    openai = getOpenAIClient();
  } catch {
    res.status(500).json({ error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your secrets." });
    return;
  }

  try {
    const cleanBase64 = stripBase64Prefix(imageBase64);
    const hasPrefix = imageBase64.startsWith("data:");
    const imageUrl = hasPrefix ? imageBase64 : `data:image/jpeg;base64,${cleanBase64}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageUrl, detail: "high" },
            },
            {
              type: "text",
              text: `Analyze this image and identify the spider species. Respond ONLY with valid JSON in this exact format:
{
  "spiderName": "Common name of the spider",
  "scientificName": "Scientific binomial name",
  "confidence": 87,
  "isDangerous": false,
  "dangerLevel": "low",
  "habitat": "Where this spider typically lives",
  "diet": "What this spider eats",
  "lifespan": "Typical lifespan",
  "facts": ["Interesting fact 1", "Interesting fact 2", "Interesting fact 3"],
  "safetyInfo": "Safety advice for encountering this spider",
  "relatedSpecies": ["Related species 1", "Related species 2"]
}

dangerLevel must be "low", "medium", or "high". confidence is 0-100. If no spider is visible, use spiderName "Unknown" with low confidence.`,
            },
          ],
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      res.status(500).json({ error: "Failed to parse AI response" });
      return;
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      spiderName: string;
      scientificName: string;
      confidence: number;
      isDangerous: boolean;
      dangerLevel: string | null;
      habitat: string;
      diet: string;
      lifespan: string;
      facts: string[];
      safetyInfo: string;
      relatedSpecies: string[];
    };

    const [inserted] = await db
      .insert(spiderScansTable)
      .values({
        spiderName: parsed.spiderName,
        scientificName: parsed.scientificName,
        confidence: parsed.confidence,
        isDangerous: parsed.isDangerous,
        dangerLevel: parsed.dangerLevel ?? null,
        habitat: parsed.habitat,
        diet: parsed.diet,
        lifespan: parsed.lifespan,
        facts: parsed.facts,
        safetyInfo: parsed.safetyInfo,
        relatedSpecies: parsed.relatedSpecies,
        imageBase64: cleanBase64.substring(0, 5000),
      })
      .returning();

    res.json({
      id: inserted.id,
      spiderName: inserted.spiderName,
      scientificName: inserted.scientificName,
      confidence: inserted.confidence,
      isDangerous: inserted.isDangerous,
      dangerLevel: inserted.dangerLevel,
      habitat: inserted.habitat,
      diet: inserted.diet,
      lifespan: inserted.lifespan,
      facts: inserted.facts,
      safetyInfo: inserted.safetyInfo,
      relatedSpecies: inserted.relatedSpecies,
      imageBase64: cleanBase64.substring(0, 5000),
      analyzedAt: inserted.analyzedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Spider analysis failed");
    res.status(500).json({ error: "Analysis failed. Please try again." });
  }
});

// POST /api/analysis/bite
router.post("/analysis/bite", async (req, res) => {
  const { imageBase64 } = req.body as { imageBase64?: string };

  if (!imageBase64) {
    res.status(400).json({ error: "imageBase64 is required" });
    return;
  }

  let openai: OpenAI;
  try {
    openai = getOpenAIClient();
  } catch {
    res.status(500).json({ error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your secrets." });
    return;
  }

  try {
    const cleanBase64 = stripBase64Prefix(imageBase64);
    const hasPrefix = imageBase64.startsWith("data:");
    const imageUrl = hasPrefix ? imageBase64 : `data:image/jpeg;base64,${cleanBase64}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 1200,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageUrl, detail: "high" },
            },
            {
              type: "text",
              text: `Analyze this image of a possible spider bite or skin reaction. Respond ONLY with valid JSON in this exact format:
{
  "possibleSpider": "Most likely spider or Unknown",
  "dangerLevel": "low",
  "symptoms": ["Symptom 1", "Symptom 2", "Symptom 3"],
  "safetyTips": ["Safety tip 1", "Safety tip 2", "Safety tip 3"],
  "recommendation": "Medical advice or recommendation"
}

dangerLevel must be "low", "medium", or "high". Be conservative — if unsure, lean toward medium. If no bite is visible, say so in recommendation.`,
            },
          ],
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      res.status(500).json({ error: "Failed to parse AI response" });
      return;
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      possibleSpider: string;
      dangerLevel: string;
      symptoms: string[];
      safetyTips: string[];
      recommendation: string;
    };

    const [inserted] = await db
      .insert(biteScansTable)
      .values({
        possibleSpider: parsed.possibleSpider,
        dangerLevel: parsed.dangerLevel,
        symptoms: parsed.symptoms,
        safetyTips: parsed.safetyTips,
        recommendation: parsed.recommendation,
        imageBase64: cleanBase64.substring(0, 5000),
      })
      .returning();

    res.json({
      id: inserted.id,
      possibleSpider: inserted.possibleSpider,
      dangerLevel: inserted.dangerLevel,
      symptoms: inserted.symptoms,
      safetyTips: inserted.safetyTips,
      recommendation: inserted.recommendation,
      imageBase64: cleanBase64.substring(0, 5000),
      analyzedAt: inserted.analyzedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Bite analysis failed");
    res.status(500).json({ error: "Analysis failed. Please try again." });
  }
});

export default router;
