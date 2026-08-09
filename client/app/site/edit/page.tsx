"use client";

import Link from "next/link";
import { useState, useEffect, useRef, Suspense, type CSSProperties, type FormEvent, type ChangeEvent, type KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import "./editor.css";
import ThemeToggle from "../../components/ThemeToggle";
import { getSites, getSiteById, editSite, deploySite, startSiteServer } from "../../lib/api";

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

type SkillItem = {
  id: string;
  name: string;
  category: "impeccable" | "ui-ux-pro-max";
  command: string;
  description: string;
  promptText: string;
};

const SKILLS: SkillItem[] = [
  {
    id: "impeccable-live",
    name: "Impeccable Live UI Polish",
    category: "impeccable",
    command: "/impeccable live",
    description: "Real-time visual audit, design polish, spacing & typography refinement",
    promptText: "Use /impeccable live: Perform real-time visual audit and polish spacing, contrast, and alignment.",
  },
  {
    id: "impeccable-critique",
    name: "Impeccable UX Critique",
    category: "impeccable",
    command: "/impeccable critique",
    description: "Audit visual hierarchy, cognitive load, accessibility & layout clarity",
    promptText: "Use /impeccable critique: Review visual hierarchy, reduce cognitive load, and improve UX clarity.",
  },
  {
    id: "impeccable-polish",
    name: "Impeccable Visual Polish",
    category: "impeccable",
    command: "/impeccable polish",
    description: "Refine hover states, micro-interactions, borders & color tokens",
    promptText: "Use /impeccable polish: Elevate visual quality with refined hover states, subtle borders, and micro-interactions.",
  },
  {
    id: "impeccable-harden",
    name: "Impeccable UX Resilience",
    category: "impeccable",
    command: "/impeccable harden",
    description: "Harden edge cases, empty states, error fallbacks & loading indicators",
    promptText: "Use /impeccable harden: Ensure clean edge cases, loading skeletons, empty states, and fallback error handling.",
  },
  {
    id: "impeccable-adapt",
    name: "Impeccable Responsive Layout",
    category: "impeccable",
    command: "/impeccable adapt",
    description: "Fluid scaling across mobile, tablet, desktop & container queries",
    promptText: "Use /impeccable adapt: Ensure flawless responsive scaling across mobile, tablet, and desktop viewports.",
  },
  {
    id: "impeccable-animate",
    name: "Impeccable Motion & Animation",
    category: "impeccable",
    command: "/impeccable animate",
    description: "Spring physics, easing curves, GPU-accelerated micro-interactions",
    promptText: "Use /impeccable animate: Add natural spring physics, smooth easing transitions, and micro-interactions.",
  },
  {
    id: "impeccable-colorize",
    name: "Impeccable Color System",
    category: "impeccable",
    command: "/impeccable colorize",
    description: "Curated HSL color tokens, dark mode palette & WCAG AAA contrast",
    promptText: "Use /impeccable colorize: Apply curated HSL color system, sleek dark mode tokens, and high contrast.",
  },
  {
    id: "impeccable-extract",
    name: "Impeccable Design Tokens",
    category: "impeccable",
    command: "/impeccable extract",
    description: "Extract reusable CSS variables, spacing scales & component specs",
    promptText: "Use /impeccable extract: Organize design tokens into three-layer CSS variables and component specifications.",
  },
  {
    id: "impeccable-simplify",
    name: "Impeccable Minimalist Distillation",
    category: "impeccable",
    command: "/impeccable simplify",
    description: "Distill cluttered layout into clean, bold typography-first minimalism",
    promptText: "Use /impeccable simplify: Clean up visual noise, embrace whitespace, and enforce bold minimalist typography.",
  },
  {
    id: "impeccable-delight",
    name: "Impeccable Delighting Features",
    category: "impeccable",
    command: "/impeccable delight",
    description: "Transform basic UI into delightful, premium state-of-the-art interface",
    promptText: "Use /impeccable delight: Upgrade basic UI into a premium, state-of-the-art interactive user experience.",
  },
  {
    id: "impeccable-bento",
    name: "Impeccable Bento Showcase",
    category: "ui-ux-pro-max",
    command: "/impeccable bento",
    description: "Organize feature cards into a modern asymmetric Bento grid layout",
    promptText: "Use /impeccable bento: Structure features into a modern, asymmetric Bento grid card layout.",
  },
  {
    id: "impeccable-glassmorphism",
    name: "Impeccable Glassmorphism",
    category: "ui-ux-pro-max",
    command: "/impeccable glassmorphism",
    description: "Frosted translucent glass panels with backdrop blur & subtle borders",
    promptText: "Use /impeccable glassmorphism: Apply translucent frosted glass cards with backdrop-blur and subtle borders.",
  },
];

const prompts = [
  "Make the tone more welcoming",
  "Add a services section",
  "Change the call to action",
];

function EditSiteContent() {
  const searchParams = useSearchParams();
  const siteIdParam = searchParams.get("id");
  const initialName = searchParams.get("name") || "Westside Dental Group";
  const promptParam = searchParams.get("prompt");

  const [activeSiteId, setActiveSiteId] = useState<string | null>(siteIdParam);
  const [siteName, setSiteName] = useState(initialName);
  const [sitePort, setSitePort] = useState<number | null>(null);
  const [isDeployed, setIsDeployed] = useState<boolean>(false);
  const [isSiteLoading, setIsSiteLoading] = useState<boolean>(true);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const slug = siteName.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const siteDomain = `${slug}.sitecreator.app`;

  const iframeSrc = isDeployed
    ? `https://${siteDomain}`
    : sitePort
    ? `http://localhost:${sitePort}`
    : "";

  const refreshIframe = () => {
    if (iframeRef.current && (sitePort || isDeployed)) {
      try {
        const targetSrc = isDeployed
          ? `https://${siteDomain}`
          : `http://localhost:${sitePort}`;
        const url = new URL(targetSrc);
        url.searchParams.set("_t", Date.now().toString());
        iframeRef.current.src = url.toString();
      } catch (e) {
        if (iframeRef.current) {
          iframeRef.current.src = iframeSrc;
        }
      }
    }
  };

  // Always reset loading screen to true on page entry / route change
  useEffect(() => {
    setIsSiteLoading(true);
  }, [siteIdParam]);

  // Continuous health monitoring: show loading screen whenever site server is down/compiling, hide when live
  useEffect(() => {
    if (isDeployed) {
      setIsSiteLoading(false);
      return;
    }

    if (!sitePort) {
      return;
    }

    const targetPort = sitePort;
    let isMounted = true;
    let pollInterval: NodeJS.Timeout | null = null;
    let isServerLive = false;

    const checkPortStatus = async () => {
      try {
        await fetch(`http://localhost:${targetPort}`, {
          method: "GET",
          mode: "no-cors",
        });

        if (isMounted) {
          if (!isServerLive) {
            isServerLive = true;
            refreshIframe();
            setTimeout(() => {
              if (isMounted) {
                setIsSiteLoading(false);
              }
            }, 1500);
          }
        }
      } catch (err) {
        // Dev server not working / compiling / unreachable -> show loading screen
        if (isMounted) {
          isServerLive = false;
          setIsSiteLoading(true);
        }
      }
    };

    checkPortStatus();
    pollInterval = setInterval(checkPortStatus, 1000);

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [sitePort, isDeployed, activeSiteId]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text: `Hi! I'm connected to your backend site builder. Describe any change to update ${initialName} or type / for skills.`,
    },
  ]);
  const [prompt, setPrompt] = useState("");
  const [headline, setHeadline] = useState("Smile with confidence.");
  const [buttonLabel, setButtonLabel] = useState("Book an appointment");
  const [accent, setAccent] = useState("#2d6c82");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [published, setPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasExtraSection, setHasExtraSection] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const loadingTexts = ["Editing site…", "Polishing site…"];

  // Slash Command Skill Menu states
  const [showSkillMenu, setShowSkillMenu] = useState(false);
  const [skillFilter, setSkillFilter] = useState("");
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);

  const filteredSkills = SKILLS.filter(
    (s) =>
      s.command.toLowerCase().includes(skillFilter.toLowerCase()) ||
      s.name.toLowerCase().includes(skillFilter.toLowerCase()) ||
      s.description.toLowerCase().includes(skillFilter.toLowerCase()) ||
      s.id.toLowerCase().includes(skillFilter.toLowerCase())
  );

  useEffect(() => {
    if (!isSending) {
      setLoadingTextIndex(0);
      return;
    }
    const timer = setInterval(() => {
      setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2200);

    return () => clearInterval(timer);
  }, [isSending]);

  const promptExecutedRef = useRef(false);

  function applyChanges(changes: SiteChanges) {
    if (changes.headline && changes.headline.length <= 110)
      setHeadline(changes.headline);
    if (changes.buttonLabel && changes.buttonLabel.length <= 45)
      setButtonLabel(changes.buttonLabel);
    if (changes.accent && /^#[0-9a-f]{6}$/i.test(changes.accent))
      setAccent(changes.accent);
    if (changes.addSection) setHasExtraSection(true);
  }

  async function requestChange(value: string, targetSiteId?: string | null) {
    const targetId = targetSiteId !== undefined ? targetSiteId : activeSiteId;
    const userMessage = { id: Date.now(), role: "user" as const, text: value };
    setMessages((current) => [...current, userMessage]);
    setIsSending(true);

    let backendMsg = "";

    // 1. Execute backend server edit endpoint (/site/edit)
    if (targetId) {
      try {
        const res = await editSite(targetId, value);
        if (res) {
          if (typeof res.port === "number") {
            setSitePort(res.port);
          }
          backendMsg = res.message || "✨ Site preview updated.";
        }
      } catch (err: any) {
        console.warn("Express backend /site/edit API response:", err);
        backendMsg = err.message || "⚠ Verifying your account...\n  ⎿  We're finishing verifying your account eligibility. This usually takes a moment. Please try again shortly.";
      }
    }

    // 2. Execute live UI preview generator
    try {
      const response = await fetch("/api/site-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: value }),
      });
      const result = (await response
        .json()
        .catch(() => null)) as EditorResponse | null;

      if (response.ok && result?.changes) {
        applyChanges(result.changes);
      }

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text:
            backendMsg ||
            result?.message ||
            "✨ Site preview updated.",
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: backendMsg || "✨ Site preview updated.",
        },
      ]);
    } finally {
      setIsSending(false);
      // Auto-refresh iframe preview after code edits
      setTimeout(() => {
        refreshIframe();
      }, 2500);
    }
  }

  useEffect(() => {
    let isMounted = true;

    const initSiteAndPrompt = async () => {
      let resolvedSiteId = siteIdParam;

      if (siteIdParam) {
        try {
          const data = await getSiteById(siteIdParam);
          const siteObj = data?.site || data;
          if (isMounted && siteObj) {
            if (siteObj._id) resolvedSiteId = siteObj._id;
            if (siteObj.name) setSiteName(siteObj.name);
            if (typeof siteObj.port === "number") setSitePort(siteObj.port);
            if (siteObj.isDeployed) setIsDeployed(true);
          }
        } catch (e) { }
      } else {
        try {
          const sites = await getSites();
          if (isMounted && Array.isArray(sites) && sites.length > 0) {
            const match = sites[0];
            const siteObj = match?.site || match;
            if (siteObj?._id) resolvedSiteId = siteObj._id;
            if (siteObj?.name) setSiteName(siteObj.name);
            if (typeof siteObj?.port === "number") setSitePort(siteObj.port);
            if (siteObj?.isDeployed) setIsDeployed(true);
          }
        } catch (e) { }
      }

      if (isMounted && resolvedSiteId) {
        setActiveSiteId(resolvedSiteId);
        // Explicitly start Terminal A dev server if not running when mounting site editor
        startSiteServer(resolvedSiteId).then((res) => {
          if (isMounted && res && typeof res.port === "number") {
            setSitePort(res.port);
          }
        }).catch(() => {});
      }

      // Execute initial creation prompt automatically if present
      if (isMounted && promptParam && promptParam.trim() && !promptExecutedRef.current) {
        promptExecutedRef.current = true;
        requestChange(promptParam.trim(), resolvedSiteId);
      }
    };

    initSiteAndPrompt();

    return () => {
      isMounted = false;
    };
  }, [siteIdParam, promptParam]);

  const handleIframeLoad = () => {
    setIsSiteLoading(false);
  };

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setPrompt(val);

    const slashIndex = val.lastIndexOf("/");
    if (slashIndex !== -1 && (slashIndex === 0 || val[slashIndex - 1] === " ")) {
      const query = val.slice(slashIndex + 1);
      setSkillFilter(query);
      setShowSkillMenu(true);
      setSelectedSkillIndex(0);
    } else {
      setShowSkillMenu(false);
    }
  };

  const selectSkill = (skill: SkillItem) => {
    const slashIndex = prompt.lastIndexOf("/");
    const before = slashIndex !== -1 ? prompt.slice(0, slashIndex) : "";
    setPrompt(`${before}${skill.promptText} `);
    setShowSkillMenu(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSkillMenu && filteredSkills.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSkillIndex((prev) => (prev + 1) % filteredSkills.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSkillIndex((prev) => (prev - 1 + filteredSkills.length) % filteredSkills.length);
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        selectSkill(filteredSkills[selectedSkillIndex]);
      } else if (e.key === "Escape") {
        setShowSkillMenu(false);
      }
    }
  };

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = prompt.trim();

    if (!value) return;

    setShowSkillMenu(false);
    await requestChange(value);
    setPrompt("");
  }

  async function usePrompt(value: string) {
    await requestChange(value);
  }

  async function handlePublish() {
    setIsPublishing(true);
    try {
      if (activeSiteId) {
        await deploySite(activeSiteId);
      }
      setPublished(true);
      setIsDeployed(true);
      setSitePort(null); // Port disappears when site is deployed!
    } catch (err: any) {
      console.warn("Backend deploy error:", err);
      setPublished(true);
      setIsDeployed(true);
      setSitePort(null);
    } finally {
      setIsPublishing(false);
    }
  }

  const displayAddress = isDeployed
    ? siteDomain
    : sitePort
    ? `localhost:${sitePort}`
    : siteDomain;

  return (
    <div className="editor-page">
      <header className="editor-header">
        <Link className="logo" href="/dashboard">
          <span>sc</span>SiteCreator
        </Link>
        <div className="editor-site-name">
          <span className="editor-site-dot" /> {siteName}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", justifySelf: "end" }}>
          <ThemeToggle />
          <Link className="editor-exit" href={`/site${activeSiteId ? `?id=${activeSiteId}` : ""}`}>
            Exit editor
          </Link>
        </div>
      </header>

      <main className="editor-workspace">
        <aside className="ai-panel" aria-label="AI site editor">
          <div className="ai-panel-heading">
            <div className="assistant-label">
              <span>✦</span> Site assistant
            </div>
            <h1>What should we change?</h1>
            <p>
              Describe an update in plain language or type <code>/impeccable</code> for skills.
            </p>
          </div>

          {isSending && (
            <div className="editor-status-banner">
              <span className="spinner-mark">✦</span>
              <span key={loadingTextIndex} className="animated-loading-text">
                {loadingTexts[loadingTextIndex]}
              </span>
              <span className="bouncing-dots">
                <span />
                <span />
                <span />
              </span>
            </div>
          )}

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
          </div>

          <form className="editor-composer" onSubmit={sendMessage}>
            {showSkillMenu && (
              <div className="skill-menu-dropdown" aria-label="Skills menu">
                <div className="skill-menu-header">
                  <span>✦</span> Impeccable Skills ({filteredSkills.length})
                </div>
                <div className="skill-menu-list">
                  {filteredSkills.length === 0 ? (
                    <div className="skill-menu-empty">No matching /impeccable skill found</div>
                  ) : (
                    filteredSkills.map((skill, index) => (
                      <button
                        key={skill.id}
                        type="button"
                        className={`skill-menu-item ${index === selectedSkillIndex ? "selected" : ""}`}
                        onClick={() => selectSkill(skill)}
                        onMouseEnter={() => setSelectedSkillIndex(index)}
                      >
                        <div className="skill-command-row">
                          <code className="skill-cmd">{skill.command}</code>
                          <span className={`skill-badge ${skill.category}`}>
                            {skill.category === "impeccable" ? "Impeccable" : "UI/UX Pro"}
                          </span>
                        </div>
                        <div className="skill-name">{skill.name}</div>
                        <div className="skill-desc">{skill.description}</div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            <label htmlFor="editor-prompt">Describe a change or type /impeccable for skills</label>
            <div>
              <textarea
                id="editor-prompt"
                onChange={handlePromptChange}
                onKeyDown={handleKeyDown}
                placeholder="use / to checkout skills..."
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
            <span>{published || isDeployed ? "Changes published" : "Draft changes"}</span>
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
              <button
                className="refresh-preview-button"
                onClick={refreshIframe}
                title="Refresh preview"
                type="button"
                style={{ marginLeft: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}
              >
                ↻ Refresh
              </button>
            </div>
            <button
              className="publish-button"
              onClick={handlePublish}
              disabled={isPublishing}
              type="button"
            >
              {isPublishing ? "Publishing..." : (published || isDeployed) ? "Published" : "Publish changes"}
            </button>
          </div>

          <div
            className={`website-frame ${device === "mobile" ? "mobile-preview" : ""}`}
          >
            <div className="website-bar">
              <i />
              <i />
              <i />
              <span>{displayAddress}</span>
            </div>
            <div className="website-canvas">
              {isSiteLoading && (
                <div className="site-loading-overlay">
                  <div className="site-loading-card">
                    <span className="message-mark site-spinner">✦</span>
                    <h3>Launching {siteName}...</h3>
                    <p>Starting dev server environment on port {sitePort || "10000"}...</p>
                    <div className="site-progress-bar">
                      <div className="site-progress-fill" />
                    </div>
                  </div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                className="preview-iframe"
                src={iframeSrc}
                title={`${siteName} Live Preview`}
                onLoad={handleIframeLoad}
              />
            </div>
          </div>
          <button
            className="add-section"
            onClick={() => requestChange("Add a services section")}
            type="button"
          >
            + Add a section
          </button>
        </section>
      </main>
    </div>
  );
}

function FullScreenLoadingOverlay() {
  return (
    <div className="site-loading-overlay" style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#0f1218" }}>
      <div className="site-loading-card">
        <span className="message-mark site-spinner">✦</span>
        <h3>Launching Site...</h3>
        <p>Starting dev server environment...</p>
        <div className="site-progress-bar">
          <div className="site-progress-fill" />
        </div>
      </div>
    </div>
  );
}

export default function EditSitePage() {
  return (
    <Suspense fallback={<FullScreenLoadingOverlay />}>
      <EditSiteContent />
    </Suspense>
  );
}
