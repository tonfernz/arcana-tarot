// Detail view — full-screen card with tabbed aspects
const { useState: useStateDetail } = React;

function DetailView({ card, position, onClose, lang, t }) {
  const [tab, setTab] = useStateDetail("career");
  if (!card) return null;

  const tabs = t.tabs;
  const kw = lang === "th" ? (card.kwTH || card.kw) : card.kw;

  function getText(key) {
    if (lang === "th") {
      const thKey = key + "TH";
      return card[thKey] || card[key] || "";
    }
    return card[key] || "";
  }

  return (
    <div className="detail-scrim" onClick={onClose}>
      <div className="detail" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close detail-close-fixed" onClick={onClose} aria-label="Close">
          <span>×</span>
        </button>

        <div className="detail-grid">
          <div className="detail-card-col">
            <div className="detail-position-label">{position?.title?.toUpperCase()}</div>
            <div className="detail-position-sub">{position?.subtitle}</div>

            <div className="detail-card">
              <CardFace card={card} />
            </div>

            <div className="detail-keywords">
              <div className="detail-kw-label">{t.keywords}</div>
              <ul className="detail-kw-list">
                {kw.map((k, i) => (
                  <li key={i} className="detail-kw-item">
                    <span className="detail-kw-n">{String(i + 1).padStart(2, "0")}</span>
                    <span className="detail-kw-word">{k}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="detail-text-col">
            <div className="detail-name">
              <span className="detail-name-numeral">{card.n}</span>
              <span className="detail-name-text">{card.name}</span>
            </div>

            <div className="detail-tabs">
              {tabs.map((tb) => (
                <button
                  key={tb.key}
                  className={`detail-tab ${tab === tb.key ? "active" : ""}`}
                  onClick={() => setTab(tb.key)}
                >
                  {tb.label}
                </button>
              ))}
            </div>

            <div className="detail-body">
              <div className="detail-body-mark">§</div>
              <p className="detail-body-text">{getText(tab)}</p>

              <div className="detail-all">
                {tabs.map((tb) => (
                  <div
                    key={tb.key}
                    className={`detail-all-item ${tab === tb.key ? "active" : ""}`}
                    onClick={() => setTab(tb.key)}
                  >
                    <div className="detail-all-label">{tb.label}</div>
                    <div className="detail-all-preview">{getText(tb.key)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DetailView });
