"use client";

import Link from "next/link";
import { useState, type CSSProperties, type FormEvent } from "react";
import "./editor.css";

type Message = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

type SiteChanges = {
  headline?: string;
  buttonLabel?: string;
  accent?: string;
  addSection?: boolean;
};

type EditorResponse = {
  message?: string;
  changes?: SiteChanges;
};

const prompts = [
  "Make the tone more welcoming",
  "Add a services section",
  "Change the call to action",
];

export default function EditSitePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text: "Hi! I can help you refine this site. Try asking me to update the headline, add a section, or change the tone.",
    },
  ]);
  const [prompt, setPrompt] = useState("");
  const [headline, setHeadline] = useState("Smile with confidence.");
  const [buttonLabel, setButtonLabel] = useState("Book an appointment");
  const [accent, setAccent] = useState("#2d6c82");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [published, setPublished] = useState(false);
  const [hasExtraSection, setHasExtraSection] = useState(false);
  const [isSending, setIsSending] = useState(false);

  function applyChanges(changes: SiteChanges) {
    if (changes.headline && changes.headline.length <= 110)
      setHeadline(changes.headline);
    if (changes.buttonLabel && changes.buttonLabel.length <= 45)
      setButtonLabel(changes.buttonLabel);
    if (changes.accent && /^#[0-9a-f]{6}$/i.test(changes.accent))
      setAccent(changes.accent);
    if (changes.addSection) setHasExtraSection(true);
  }

  async function requestChange(value: string) {
    const userMessage = { id: Date.now(), role: "user" as const, text: value };
    setMessages((current) => [...current, userMessage]);
    setIsSending(true);

    try {
      const response = await fetch("/api/site-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: value }),
      });
      const result = (await response
        .json()
        .catch(() => null)) as EditorResponse | null;

      if (!response.ok) {
        throw new Error(
          result?.message ?? "The AI service could not complete that request.",
        );
      }

      applyChanges(result?.changes ?? {});
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: result?.message ?? "Your site preview is updated.",
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The AI service could not complete that request.";
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text:
            message === "Featherless is not configured."
              ? "AI isn’t connected yet. Add your new Featherless key to .env.local, then restart npm run dev."
              : message,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = prompt.trim();

    if (!value) return;

    await requestChange(value);
    setPrompt("");
  }

  async function usePrompt(value: string) {
    await requestChange(value);
  }

  return (
    <div className="editor-page">
      <header className="editor-header">
        <Link className="logo" href="/dashboard">
          <span>sc</span>SiteCreator
        </Link>
        <div className="editor-site-name">
          <span className="editor-site-dot" /> Westside Dental Group
        </div>
        <Link className="editor-exit" href="/site">
          Exit editor
        </Link>
      </header>

      <main className="editor-workspace">
        <aside className="ai-panel" aria-label="AI site editor">
          <div className="ai-panel-heading">
            <div className="assistant-label">
              <span>✦</span> Site assistant
            </div>
            <h1>What should we change?</h1>
            <p>
              Describe an update in plain language. Your site preview changes as
              you work.
            </p>
          </div>

          <div className="prompt-list" aria-label="Suggested prompts">
            {prompts.map((item) => (
              <button
                disabled={isSending}
                key={item}
                onClick={() => usePrompt(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="message-list" aria-live="polite">
            {messages.map((message) => (
              <div className={`message ${message.role}`} key={message.id}>
                {message.role === "assistant" && (
                  <span className="message-mark">✦</span>
                )}
                <p>{message.text}</p>
              </div>
            ))}
            {isSending && (
              <div className="message assistant">
                <span className="message-mark">✦</span>
                <p>Updating your site…</p>
              </div>
            )}
          </div>

          <form className="editor-composer" onSubmit={sendMessage}>
            <label htmlFor="editor-prompt">Describe a change</label>
            <div>
              <textarea
                id="editor-prompt"
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Make the headline friendlier..."
                value={prompt}
              />
              <button
                aria-label="Send change request"
                disabled={isSending}
                type="submit"
              >
                ↑
              </button>
            </div>
          </form>
        </aside>

        <section className="preview-stage" aria-label="Website preview">
          <div className="preview-toolbar">
            <span>{published ? "Changes published" : "Draft changes"}</span>
            <div className="preview-devices" aria-label="Preview device">
              <button
                className={device === "desktop" ? "active" : ""}
                onClick={() => setDevice("desktop")}
                type="button"
              >
                Desktop
              </button>
              <button
                className={device === "mobile" ? "active" : ""}
                onClick={() => setDevice("mobile")}
                type="button"
              >
                Mobile
              </button>
            </div>
            <button
              className="publish-button"
              onClick={() => setPublished(true)}
              type="button"
            >
              {published ? "Published" : "Publish changes"}
            </button>
          </div>

          <div
            className={`website-frame ${device === "mobile" ? "mobile-preview" : ""}`}
          >
            <div className="website-bar">
              <i />
              <i />
              <i />
              <span>westside-dental.sitecreator.app</span>
            </div>
            <div className="website-canvas">
              <nav className="mock-nav">
                <strong>Westside Dental</strong>
                <span>
                  Services&nbsp;&nbsp;&nbsp; About&nbsp;&nbsp;&nbsp; Contact
                </span>
              </nav>
              <section
                className="mock-hero"
                style={{ "--site-accent": accent } as CSSProperties}
              >
                <p>WESTSIDE DENTAL GROUP</p>
                <h2>{headline}</h2>
                <span>Kind, modern dentistry in the heart of Manhattan.</span>
                <button type="button">{buttonLabel}</button>
              </section>
              <section className="mock-services">
                <p>OUR SERVICES</p>
                <div>
                  <span>General dentistry</span>
                  <span>Cosmetic care</span>
                  <span>Emergency visits</span>
                </div>
              </section>
              {hasExtraSection && (
                <section className="mock-quote">
                  <p>
                    “The kind of dental care that makes every visit feel easy.”
                  </p>
                  <span>— A Westside patient</span>
                </section>
              )}
            </div>
          </div>
          <button
            className="add-section"
            onClick={() => setHasExtraSection(true)}
            type="button"
          >
            + Add a section
          </button>
        </section>
      </main>
    </div>
  );
}
