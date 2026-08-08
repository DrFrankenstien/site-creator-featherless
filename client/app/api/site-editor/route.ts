type EditorChanges = {
  headline?: string;
  buttonLabel?: string;
  accent?: string;
  addSection?: boolean;
};

type EditorResult = {
  message: string;
  changes: EditorChanges;
};

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return undefined;

  const text = value.trim();
  return text ? text.slice(0, maxLength) : undefined;
}

function cleanChanges(value: unknown): EditorChanges {
  if (!value || typeof value !== "object") return {};

  const changes = value as {
    headline?: unknown;
    buttonLabel?: unknown;
    accent?: unknown;
    addSection?: unknown;
  };
  const accent =
    typeof changes.accent === "string" && /^#[0-9a-f]{6}$/i.test(changes.accent)
      ? changes.accent
      : undefined;

  return {
    headline: cleanText(changes.headline, 110),
    buttonLabel: cleanText(changes.buttonLabel, 45),
    accent,
    addSection: changes.addSection === true || undefined,
  };
}

function asEditorResult(content: string): EditorResult {
  const json = content.match(/\{[\s\S]*\}/)?.[0];

  if (!json) {
    return { message: content, changes: {} };
  }

  try {
    const parsed: unknown = JSON.parse(json);

    if (!parsed || typeof parsed !== "object") {
      return { message: content, changes: {} };
    }

    const value = parsed as { message?: unknown; changes?: unknown };
    return {
      message: cleanText(value.message, 280) ?? "I updated the site preview.",
      changes: cleanChanges(value.changes),
    };
  } catch {
    return { message: content, changes: {} };
  }
}

export async function POST(request: Request) {
  const { prompt } = (await request.json()) as { prompt?: unknown };
  const apiKey = process.env.FEATHERLESS_API_KEY;

  if (typeof prompt !== "string" || !prompt.trim()) {
    return Response.json(
      { message: "Tell me what you want to change." },
      { status: 400 },
    );
  }

  if (prompt.length > 750) {
    return Response.json(
      { message: "Keep your request under 750 characters." },
      { status: 400 },
    );
  }

  // Graceful fallback if Featherless API key is not configured in .env.local
  if (!apiKey) {
    const lower = prompt.toLowerCase();
    const changes: EditorChanges = {};

    if (lower.includes("welcom") || lower.includes("friend") || lower.includes("warm") || lower.includes("tone")) {
      changes.headline = "Gentle, compassionate dental care for your whole family.";
    } else if (lower.includes("service") || lower.includes("section") || lower.includes("add")) {
      changes.addSection = true;
    } else if (lower.includes("action") || lower.includes("button") || lower.includes("cta") || lower.includes("book")) {
      changes.buttonLabel = "Schedule Your Visit";
    } else if (lower.includes("headline") || lower.includes("title")) {
      changes.headline = "Your local partner for bright, healthy smiles.";
    } else if (lower.includes("blue") || lower.includes("navy")) {
      changes.accent = "#1d4ed8";
    } else if (lower.includes("green") || lower.includes("teal")) {
      changes.accent = "#0f766e";
    } else {
      changes.headline = "Crafted with excellence for your business.";
    }

    return Response.json({
      message: `Updated site preview for "${prompt.trim()}". (Add your FEATHERLESS_API_KEY in .env.local for live Featherless LLM completions)`,
      changes,
    });
  }

  try {
    const response = await fetch(
      "https://api.featherless.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "SiteCreator",
        },
        body: JSON.stringify({
          model: process.env.FEATHERLESS_MODEL ?? "Qwen/Qwen2.5-7B-Instruct",
          temperature: 0.4,
          max_tokens: 240,
          messages: [
            {
              role: "system",
              content:
                'You edit a dental-practice website. Return only valid JSON with this shape: {"message": string, "changes": {"headline"?: string, "buttonLabel"?: string, "accent"?: string, "addSection"?: boolean}}. Use short, polished copy. Only use a hex color for accent.',
            },
            { role: "user", content: prompt.trim() },
          ],
        }),
      },
    );

    if (!response.ok) {
      return Response.json(
        { message: "Featherless could not complete that request." },
        { status: response.status },
      );
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;

    if (!content) {
      return Response.json(
        { message: "Featherless returned an empty response." },
        { status: 502 },
      );
    }

    return Response.json(asEditorResult(content));
  } catch (err: any) {
    return Response.json({
      message: `Could not connect to Featherless API: ${err.message}`,
      changes: {},
    });
  }
}
