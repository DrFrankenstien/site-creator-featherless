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

  if (!apiKey) {
    return Response.json(
      { message: "Featherless is not configured." },
      { status: 500 },
    );
  }

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
}
