// Main tarot app
const { useState: useAppState, useEffect: useAppEffect, useMemo: useAppMemo, useRef: useAppRef } = React;

// Fisher-Yates
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// TWEAKS — persisted defaults
const TWEAKS = /*EDITMODE-BEGIN*/{
  "theme": "parchment",
  "revealAnimation": "flip"
}/*EDITMODE-END*/;

const THEMES = {
  parchment: {
    name: "Vintage Parchment",
    "--bg":        "#e8dcc0",
    "--bg-2":      "#d8c8a6",
    "--paper":     "#f4ead5",
    "--ink":       "#2a1a0f",
    "--ink-2":     "#4a3422",
    "--ink-soft":  "#6b5238",
    "--accent":    "#b8542a",
    "--accent-2":  "#8a3f1e",
    "--gold":      "#c89b3c",
    "--sage":      "#7a8b6f",
    "--line":      "#b8a582",
  },
  dusk: {
    name: "Terracotta Dusk",
    "--bg":        "#3d2418",
    "--bg-2":      "#4a2d1e",
    "--paper":     "#e6d3b3",
    "--ink":       "#1f1209",
    "--ink-2":     "#3a2416",
    "--ink-soft":  "#6b4a32",
    "--accent":    "#d16a3a",
    "--accent-2":  "#b8542a",
    "--gold":      "#e0b055",
    "--sage":      "#8fa582",
    "--line":      "#9a7a5a",
  },
  bone: {
    name: "Bone & Ochre",
    "--bg":        "#e8e0cf",
    "--bg-2":      "#d5c9ad",
    "--paper":     "#f6f1e0",
    "--ink":       "#24201a",
    "--ink-2":     "#423a2c",
    "--ink-soft":  "#6e6246",
    "--accent":    "#a86b2a",
    "--accent-2":  "#7a4a1c",
    "--gold":      "#b8923c",
    "--sage":      "#8a9278",
    "--line":      "#b0a283",
  },
};

const REVEAL_ANIMS = {
  flip:  { name: "Horizontal Flip" },
  rise:  { name: "Rise & Fade" },
  iris:  { name: "Iris Open" },
  burn:  { name: "Parchment Unveil" },
};

const UI = {
  en: {
    title: "ARCANA",
    subtitle: "/ a reading in three cards",
    newReading: "new reading",
    footer1: "LXXVIII cards · three positions · one reading",
    footer2: "past / present / future",
    introTitle1: "Three cards",
    introTitle2: "for the question",
    introTitle3: "you are carrying.",
    introBody: "Hold your question in mind — something true, something unresolved. When you are ready, shuffle the deck and draw three cards. The first speaks to",
    introBodySit: "the past",
    introBodyMid: ", the second to",
    introBodyAct: "the present",
    introBodyEnd: ", the third to",
    introBodyOut: "the future",
    introCta: "Shuffle the deck",
    introCards: "cards",
    introPositions: "positions",
    shufflingLabel: "SHUFFLING · hold your question",
    drawInstruct0: "Drag three cards from the deck",
    drawInstruct1: "Two more to draw",
    drawInstruct2: "One more to draw",
    drawInstruct3: "Revealing…",
    drawByNumber: "or draw by number",
    drawBtn: "draw",
    fanHint: "Tap & drag a card up, or type its position number",
    positions: [
      { key: "past",    title: "Past",    subtitle: "what was" },
      { key: "present", title: "Present", subtitle: "what is" },
      { key: "future",  title: "Future",  subtitle: "what comes" },
    ],
    tapReveal: "tap to reveal",
    tapMeaning: "tap for meaning →",
    readingFooter: "Tap any card to read its meaning across career, finance, love & health.",
    keywords: "KEYWORDS",
    tabs: [
      { key: "career",  label: "Career" },
      { key: "love",    label: "Love" },
      { key: "finance", label: "Finance" },
      { key: "health",  label: "Health" },
    ],
    tweaksTitle: "TWEAKS",
    colorTheme: "Color theme",
    revealAnim: "Reveal animation",
  },
  th: {
    title: "ARCANA",
    subtitle: "/ การทำนายด้วยสามใบ",
    newReading: "เริ่มใหม่",
    footer1: "ไพ่ LXXVIII ใบ · สามตำแหน่ง · หนึ่งการทำนาย",
    footer2: "อดีต / ปัจจุบัน / อนาคต",
    introTitle1: "สามใบไพ่",
    introTitle2: "สำหรับคำถาม",
    introTitle3: "ที่คุณกำลังแบกรับ",
    introBody: "ตั้งจิตใจกับคำถามของคุณ — สิ่งที่แท้จริง สิ่งที่ยังไม่ได้รับการคลี่คลาย เมื่อพร้อมแล้ว สับไพ่และหยิบสามใบ ใบแรกบอกถึง",
    introBodySit: "อดีต",
    introBodyMid: " ใบที่สองบอกถึง",
    introBodyAct: "ปัจจุบัน",
    introBodyEnd: " ใบที่สามบอกถึง",
    introBodyOut: "อนาคต",
    introCta: "สับไพ่",
    introCards: "ใบ",
    introPositions: "ตำแหน่ง",
    shufflingLabel: "กำลังสับไพ่ · ตั้งจิตกับคำถามของคุณ",
    drawInstruct0: "ลากไพ่สามใบจากกองไพ่",
    drawInstruct1: "เหลืออีกสองใบ",
    drawInstruct2: "เหลืออีกหนึ่งใบ",
    drawInstruct3: "กำลังเปิดเผย…",
    drawByNumber: "หรือหยิบตามหมายเลข",
    drawBtn: "หยิบ",
    fanHint: "แตะและลากไพ่ขึ้น หรือพิมพ์หมายเลขตำแหน่ง",
    positions: [
      { key: "past",    title: "อดีต",    subtitle: "สิ่งที่ผ่านมา" },
      { key: "present", title: "ปัจจุบัน", subtitle: "สิ่งที่เป็นอยู่" },
      { key: "future",  title: "อนาคต",  subtitle: "สิ่งที่จะมาถึง" },
    ],
    tapReveal: "แตะเพื่อเปิดไพ่",
    tapMeaning: "แตะเพื่ออ่านความหมาย →",
    readingFooter: "แตะที่ไพ่ใบใดก็ได้เพื่ออ่านความหมายด้านการงาน การเงิน ความรัก และสุขภาพ",
    keywords: "คำสำคัญ",
    tabs: [
      { key: "career",  label: "การงาน" },
      { key: "love",    label: "ความรัก" },
      { key: "finance", label: "การเงิน" },
      { key: "health",  label: "สุขภาพ" },
    ],
    tweaksTitle: "ตั้งค่า",
    colorTheme: "โทนสี",
    revealAnim: "แอนิเมชั่นเปิดไพ่",
  }
};

function App() {
  const [tweaks, setTweaks] = useAppState(TWEAKS);
  const [showTweaks, setShowTweaks] = useAppState(false);
  const [editAvailable, setEditAvailable] = useAppState(false);
  const [lang, setLang] = useAppState("en");

  const [stage, setStage] = useAppState("intro");
  const [deckOrder, setDeckOrder] = useAppState(() => shuffle(window.ALL_CARDS));
  const [drawn, setDrawn] = useAppState([]);
  const [flipped, setFlipped] = useAppState([false, false, false]);
  const [detailIdx, setDetailIdx] = useAppState(null);

  const t = UI[lang];

  useAppEffect(() => {
    const theme = THEMES[tweaks.theme] || THEMES.parchment;
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) => {
      if (k.startsWith("--")) root.style.setProperty(k, v);
    });
  }, [tweaks.theme]);

  useAppEffect(() => {
    function onMsg(e) {
      if (e.data?.type === "__activate_edit_mode")   setShowTweaks(true);
      if (e.data?.type === "__deactivate_edit_mode") setShowTweaks(false);
    }
    window.addEventListener("message", onMsg);
    setEditAvailable(true);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  function persistTweak(patch) {
    setTweaks((t) => ({ ...t, ...patch }));
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: patch }, "*");
  }

  function startShuffle() {
    setStage("shuffling");
    setDeckOrder(shuffle(window.ALL_CARDS));
    setDrawn([]);
    setFlipped([false, false, false]);
    setDetailIdx(null);
    setTimeout(() => setStage("fan"), 2000);
  }

  function drawCard(i) {
    if (drawn.includes(i)) return;
    if (drawn.length >= 3) return;
    const next = [...drawn, i];
    setDrawn(next);
    if (next.length === 3) setTimeout(() => setStage("revealing"), 700);
  }

  function flipOne(i) {
    setFlipped((f) => { const n = [...f]; n[i] = true; return n; });
  }

  function openDetail(i) {
    if (!flipped[i]) { flipOne(i); return; }
    setDetailIdx(i);
  }

  function restart() {
    setStage("intro");
    setDrawn([]);
    setFlipped([false, false, false]);
    setDetailIdx(null);
  }

  const pickedCards = drawn.map((idx) => deckOrder[idx]);

  return (
    <div className={`app${lang === "th" ? " lang-th" : ""}`}>
      <div className="paper-grain"></div>

      <header className="app-header">
        <div className="app-title">
          <span className="app-title-mark">✦</span>
          <span className="app-title-text">{t.title}</span>
          <span className="app-title-sub">{t.subtitle}</span>
        </div>
        <div className="app-header-right">
          <button
            className={`lang-toggle ${lang === "en" ? "active-en" : "active-th"}`}
            onClick={() => setLang(l => l === "en" ? "th" : "en")}
            title="Switch language / เปลี่ยนภาษา"
          >
            <span className={lang === "en" ? "lang-active" : "lang-dim"}>EN</span>
            <span className="lang-sep">·</span>
            <span className={lang === "th" ? "lang-active" : "lang-dim"}>TH</span>
          </button>
          {stage !== "intro" && (
            <button className="app-restart" onClick={restart}>
              <span>↺</span> {t.newReading}
            </button>
          )}
        </div>
      </header>

      <main className={`app-main${stage === "fan" ? " app-main--fan" : ""}`}>
        {stage === "intro"     && <Intro onStart={startShuffle} t={t} />}
        {stage === "shuffling" && <Shuffling t={t} />}
        {stage === "fan"       && (
          <Fan deck={deckOrder} drawn={drawn} onDraw={drawCard} t={t} />
        )}
        {(stage === "revealing" || stage === "reading") && (
          <Reading
            cards={pickedCards}
            flipped={flipped}
            onFlip={flipOne}
            onDetail={openDetail}
            animation={tweaks.revealAnimation}
            positions={t.positions}
            t={t}
          />
        )}
      </main>

      <footer className="app-footer">
        <span>{t.footer1}</span>
        <span className="app-footer-dot">·</span>
        <span>{t.footer2}</span>
      </footer>

      {detailIdx !== null && (
        <DetailView
          card={pickedCards[detailIdx]}
          position={t.positions[detailIdx]}
          onClose={() => setDetailIdx(null)}
          lang={lang}
          t={t}
        />
      )}

      {showTweaks && (
        <TweaksPanel
          tweaks={tweaks}
          onChange={persistTweak}
          onClose={() => setShowTweaks(false)}
          t={t}
        />
      )}
    </div>
  );
}

// ───── Stage: intro
function Intro({ onStart, t }) {
  return (
    <div className="intro">
      <div className="intro-ornament">
        <span>✦</span>
        <span className="intro-ornament-line"></span>
        <span>☽</span>
        <span className="intro-ornament-line"></span>
        <span>✦</span>
      </div>
      <h1 className="intro-title">
        <span className="intro-title-accent">{t.introTitle1}</span>
        <span> {t.introTitle2}</span>
        <br />
        <span>{t.introTitle3}</span>
      </h1>
      <p className="intro-body">
        {t.introBody} <em>{t.introBodySit}</em>{t.introBodyMid} <em>{t.introBodyAct}</em>{t.introBodyEnd} <em>{t.introBodyOut}</em>.
      </p>
      <button className="intro-cta" onClick={onStart}>
        <span className="intro-cta-mark">✦</span>
        <span>{t.introCta}</span>
      </button>
      <div className="intro-meta">
        <div className="intro-meta-col">
          <div className="intro-meta-n">78</div>
          <div className="intro-meta-l">{t.introCards}</div>
        </div>
        <div className="intro-meta-col">
          <div className="intro-meta-n">3</div>
          <div className="intro-meta-l">{t.introPositions}</div>
        </div>
      </div>
    </div>
  );
}

// ───── Stage: shuffling
function Shuffling({ t }) {
  return (
    <div className="shuffling">
      <div className="shuffling-stack">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="shuffling-card" style={{ animationDelay: `${i * 0.08}s` }}>
            <CardBack />
          </div>
        ))}
      </div>
      <div className="shuffling-label">{t.shufflingLabel}</div>
    </div>
  );
}

// ───── Stage: fan
function Fan({ deck, drawn, onDraw, t }) {
  const n = deck.length;
  const drawnSet = new Set(drawn);
  const remaining = n - drawn.length;

  const [dragIdx, setDragIdx] = useAppState(null);
  const [dragPt, setDragPt] = useAppState({ x: 0, y: 0 });
  const [grabOffset, setGrabOffset] = useAppState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useAppState({ x: 0, y: 0 });
  const [dragged, setDragged] = useAppState(false);
  const [inputVal, setInputVal] = useAppState("");
  const [inputErr, setInputErr] = useAppState(false);
  const fanRef = useAppRef(null);
  const slotRef = useAppRef(null);

  function onPointerDown(e, i) {
    if (drawnSet.has(i) || drawn.length >= 3) return;
    e.preventDefault();
    const pt = getPt(e);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragIdx(i);
    setDragStart({ x: pt.x, y: pt.y });
    setDragPt({ x: pt.x, y: pt.y });
    setGrabOffset({ x: pt.x - (rect.left + rect.width / 2), y: pt.y - (rect.top + rect.height / 2) });
    setDragged(false);
    try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch {}
  }

  function onPointerMove(e) {
    if (dragIdx === null) return;
    const pt = getPt(e);
    setDragPt({ x: pt.x, y: pt.y });
    if (Math.hypot(pt.x - dragStart.x, pt.y - dragStart.y) > 6) setDragged(true);
  }

  function onPointerUp(e) {
    if (dragIdx === null) return;
    const pt = getPt(e);
    const dx = pt.x - dragStart.x, dy = pt.y - dragStart.y;
    const slot = slotRef.current?.getBoundingClientRect();
    const onSlot = slot && pt.x >= slot.left && pt.x <= slot.right && pt.y >= slot.top && pt.y <= slot.bottom;
    if (onSlot || dy < -80 || Math.hypot(dx, dy) > 100 || !dragged) onDraw(dragIdx);
    setDragIdx(null);
    setDragged(false);
  }

  useAppEffect(() => {
    if (dragIdx === null) return;
    const mv = (e) => onPointerMove(e);
    const up = (e) => onPointerUp(e);
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", mv);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragIdx, dragStart.x, dragStart.y]);

  function getPt(e) {
    if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  function submitIndex(e) {
    e.preventDefault();
    const num = parseInt(inputVal.trim(), 10);
    if (!Number.isFinite(num) || num < 1 || num > remaining) {
      setInputErr(true);
      setTimeout(() => setInputErr(false), 600);
      return;
    }
    let count = 0, target = -1;
    for (let i = 0; i < deck.length; i++) {
      if (drawnSet.has(i)) continue;
      if (++count === num) { target = i; break; }
    }
    if (target >= 0) { onDraw(target); setInputVal(""); }
  }

  const instructText = [t.drawInstruct0, t.drawInstruct1, t.drawInstruct2, t.drawInstruct3][drawn.length];

  return (
    <div className="fan-wrap">
      <div className="fan-toolbar">
        <div className="fan-instruction">
          <span className="fan-instruction-count">{drawn.length} / 3</span>
          <span className="fan-instruction-text">{instructText}</span>
        </div>

        <form className={`fan-input ${inputErr ? "err" : ""}`} onSubmit={submitIndex}>
          <label className="fan-input-label">{t.drawByNumber}</label>
          <div className="fan-input-row">
            <input
              type="number" min="1" max={remaining}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="##"
              disabled={drawn.length >= 3}
              className="fan-input-field"
              inputMode="numeric"
            />
            <span className="fan-input-slash">/</span>
            <span className="fan-input-max">{String(remaining).padStart(2, "0")}</span>
            <button type="submit" className="fan-input-btn" disabled={drawn.length >= 3 || !inputVal}>
              {t.drawBtn}
            </button>
          </div>
        </form>
      </div>

      <div className="fan-slot-row" ref={slotRef}>
        {[0,1,2].map((i) => {
          const card = drawn[i] !== undefined ? deck[drawn[i]] : null;
          return (
            <div key={i} className={`fan-slot ${card ? "filled" : ""}`}>
              <div className="fan-slot-n">{["I","II","III"][i]}</div>
              {card ? (
                <div className="fan-slot-card"><CardBack /></div>
              ) : (
                <div className="fan-slot-empty"><span className="fan-slot-dash">—</span></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="fan" ref={fanRef} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        {deck.map((c, i) => {
          const mid = (n - 1) / 2;
          const t_ = (i - mid) / mid;
          const angle = t_ * 36;
          const radius = 900;
          const xShift = Math.sin(angle * Math.PI / 180) * radius * 0.02;
          const lift   = (1 - Math.cos(angle * Math.PI / 180)) * radius * 0.02;
          const isDrawn = drawnSet.has(i);
          const isDragging = dragIdx === i;

          if (isDragging) {
            return (
              <div key={i} className="fan-card fan-card-placeholder"
                style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(${lift}px) translateX(${xShift}px)`, zIndex: i }} />
            );
          }

          return (
            <div key={i}
              className={`fan-card ${isDrawn ? "drawn" : ""}`}
              onPointerDown={(e) => onPointerDown(e, i)}
              style={{
                transform: isDrawn
                  ? `translate(-50%, -280%) rotate(0deg) scale(0.7)`
                  : `translate(-50%, -50%) rotate(${angle}deg) translateY(${lift}px) translateX(${xShift}px)`,
                zIndex: isDrawn ? 0 : i,
                pointerEvents: isDrawn ? "none" : (drawn.length >= 3 ? "none" : "auto"),
              }}
            >
              <CardBack />
              <div className="fan-card-idx">{String(i + 1).padStart(2, "0")}</div>
            </div>
          );
        })}
      </div>

      {dragIdx !== null && (
        <div className="fan-card-floater"
          style={{ left: `${dragPt.x - grabOffset.x}px`, top: `${dragPt.y - grabOffset.y}px` }}
          onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
        >
          <CardBack />
        </div>
      )}

      <div className="fan-hint">
        <span>✱</span>
        <span>{t.fanHint}</span>
      </div>
    </div>
  );
}

// ───── Stage: reading — improved spread layout
function Reading({ cards, flipped, onFlip, onDetail, animation, positions, t }) {
  return (
    <div className={`reading reading-anim-${animation}`}>
      <div className="reading-spread">
        {positions.map((p, i) => (
          <div key={p.key} className={`reading-position-col ${i === 1 ? "reading-col-center" : ""}`}>
            <div className="reading-position-header">
              <div className="reading-position-n">{["I","II","III"][i]}</div>
              <div className="reading-position-title">{p.title}</div>
              <div className="reading-position-sub">{p.subtitle}</div>
            </div>

            <div
              className={`reading-slot ${flipped[i] ? "flipped" : ""} ${i === 1 ? "reading-slot-center" : ""}`}
              onClick={() => (flipped[i] ? onDetail(i) : onFlip(i))}
            >
              <div className="reading-slot-inner">
                <div className="reading-slot-face reading-slot-back"><CardBack /></div>
                <div className="reading-slot-face reading-slot-front"><CardFace card={cards[i]} /></div>
              </div>
              <div className={`reading-slot-hint ${flipped[i] ? "reading-slot-hint-detail" : ""}`}>
                {flipped[i] ? t.tapMeaning : t.tapReveal}
              </div>
            </div>
          </div>
        ))}
      </div>

      {flipped.every(Boolean) && (
        <div className="reading-footer">
          <div className="reading-footer-line"></div>
          <div className="reading-footer-text">{t.readingFooter}</div>
        </div>
      )}
    </div>
  );
}

// ───── Tweaks panel
function TweaksPanel({ tweaks, onChange, onClose, t }) {
  return (
    <div className="tweaks">
      <div className="tweaks-header">
        <span className="tweaks-title">{t.tweaksTitle}</span>
        <button className="tweaks-close" onClick={onClose}>×</button>
      </div>

      <div className="tweaks-section">
        <div className="tweaks-label">{t.colorTheme}</div>
        <div className="tweaks-swatches">
          {Object.entries(THEMES).map(([key, th]) => (
            <button key={key} className={`tweaks-swatch ${tweaks.theme === key ? "active" : ""}`} onClick={() => onChange({ theme: key })}>
              <div className="tweaks-swatch-row">
                <span className="tweaks-swatch-dot" style={{ background: th["--bg"] }}></span>
                <span className="tweaks-swatch-dot" style={{ background: th["--accent"] }}></span>
                <span className="tweaks-swatch-dot" style={{ background: th["--ink"] }}></span>
                <span className="tweaks-swatch-dot" style={{ background: th["--gold"] }}></span>
              </div>
              <div className="tweaks-swatch-name">{th.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="tweaks-section">
        <div className="tweaks-label">{t.revealAnim}</div>
        <div className="tweaks-options">
          {Object.entries(REVEAL_ANIMS).map(([key, a]) => (
            <button key={key} className={`tweaks-option ${tweaks.revealAnimation === key ? "active" : ""}`} onClick={() => onChange({ revealAnimation: key })}>
              {a.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
