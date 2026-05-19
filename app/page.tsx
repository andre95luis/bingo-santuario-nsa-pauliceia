"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

type Letter = "B" | "I" | "N" | "G" | "O";

const COLS: Record<Letter, { start: number; color: string; dark: string; light: string; glow: string }> = {
  B: { start: 1,  color: "#1a4f9f", dark: "#0f3270", light: "#eef2fb", glow: "rgba(26,79,159,0.28)"  },
  I: { start: 16, color: "#9b1d2a", dark: "#6b1020", light: "#faeaec", glow: "rgba(155,29,42,0.28)"  },
  N: { start: 31, color: "#374151", dark: "#1f2937", light: "#f0f1f3", glow: "rgba(55,65,81,0.28)"   },
  G: { start: 46, color: "#1a6b3c", dark: "#0f4726", light: "#e6f4ed", glow: "rgba(26,107,60,0.28)"  },
  O: { start: 61, color: "#9c4211", dark: "#6b2d0c", light: "#faeae4", glow: "rgba(156,66,17,0.28)"  },
};

const LETTERS: Letter[] = ["B", "I", "N", "G", "O"];

const G = {
  lo: "#f7e098", mid: "#c9a84c", hi: "#e8c96a", dk: "#8b6914",
  glow: "rgba(201,168,76,0.45)",
};

const NAVY = "#0f2044";

function letterOf(n: number): Letter {
  if (n <= 15) return "B";
  if (n <= 30) return "I";
  if (n <= 45) return "N";
  if (n <= 60) return "G";
  return "O";
}

const TICKER =
  "          ✦          Gostou deste sistema?   Foi criado pela  SAFE VISION BR" +
  "          ✦          Soluções de TI para igrejas, empresas e eventos" +
  "          ✦          Sites · Sistemas · Automações · e muito mais" +
  "          ✦          Conheça tudo em:   www.safevisionbr.com.br" +
  "          ✦          WhatsApp:   (11) 96356-1680" +
  "          ✦          Seu evento merece isso também.   Fale com a gente!          ";

export default function BingoPage() {
  const [drawn, setDrawn]               = useState<Set<number>>(new Set());
  const [history, setHistory]           = useState<number[]>([]);
  const [animKey, setAnimKey]           = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);

  const lastBall   = history.at(-1) ?? null;
  const lastLetter = lastBall ? letterOf(lastBall) : null;
  const lastCfg    = lastLetter ? COLS[lastLetter] : null;
  const allDone    = drawn.size === 75;

  const handleCell = useCallback((n: number) => {
    if (drawn.has(n)) {
      setDrawn(prev => { const s = new Set(prev); s.delete(n); return s; });
      setHistory(prev => prev.filter(x => x !== n));
    } else {
      setDrawn(prev => new Set(prev).add(n));
      setHistory(prev => [...prev, n]);
      setAnimKey(k => k + 1);
    }
  }, [drawn]);

  const reset = useCallback(() => {
    setDrawn(new Set()); setHistory([]); setAnimKey(0); setConfirmReset(false);
  }, []);

  const recentBalls = [...history].reverse().slice(1, 9);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#ffffff", overflow: "hidden" }}>

      {/* ══ HEADER ══ */}
      <header style={{
        flexShrink: 0,
        background: "#ffffff",
        borderBottom: `3px solid ${G.mid}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 24px",
      }}>
        <div style={{
          color: NAVY,
          fontSize: "clamp(19px, 2.8vw, 42px)",
          fontWeight: 900,
          letterSpacing: "clamp(1px, 0.2vw, 3px)",
          textAlign: "center",
          lineHeight: 1,
        }}>
          SANTUÁRIO NOSSA SENHORA APARECIDA · PAULICÉIA
        </div>
      </header>

      {/* ══ FAIXA SUPERIOR: logo | bola | contador ══ */}
      <div style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        padding: "10px 24px",
        gap: "24px",
        background: "#ffffff",
        borderBottom: `1px solid ${G.mid}30`,
        height: "clamp(150px, 20vh, 210px)",
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "clamp(100px, 11vw, 150px)", flexShrink: 0 }}>
          <Image
            src="/logo.png"
            alt="Santuário Nossa Senhora Aparecida"
            width={200} height={200}
            style={{ objectFit: "contain", height: "clamp(90px, 14vw, 160px)", width: "auto" }}
            priority
          />
        </div>

        {/* Bola atual — centro, grande */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <div style={{ fontSize: "9px", color: G.mid, letterSpacing: "4px", fontWeight: 700 }}>BOLA ATUAL</div>
          <div style={{
            padding: "4px",
            borderRadius: "50%",
            background: `conic-gradient(from 0deg, ${G.dk}, ${G.lo}, ${G.mid}, ${G.hi}, ${G.mid}, ${G.dk})`,
            boxShadow: `0 4px 24px ${G.glow}`,
          }}>
            <div
              key={animKey}
              className={lastBall ? "ball-pop" : ""}
              style={{
                width:  "clamp(110px, 14vw, 168px)",
                height: "clamp(110px, 14vw, 168px)",
                borderRadius: "50%",
                background: lastBall
                  ? `radial-gradient(circle at 30% 25%, #ffffff44, ${lastCfg!.color} 50%, ${lastCfg!.dark})`
                  : `radial-gradient(circle at 40% 35%, #f0ede6, #ddd8cc)`,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                position: "relative",
                boxShadow: lastBall
                  ? `inset 0 -8px 20px rgba(0,0,0,0.22), inset 0 4px 12px rgba(255,255,255,0.12)`
                  : `inset 0 4px 10px rgba(0,0,0,0.06)`,
              }}
            >
              {lastBall ? (
                <>
                  <div style={{
                    position: "absolute", top: "11%", left: "16%",
                    width: "24%", height: "16%", borderRadius: "50%",
                    background: "radial-gradient(ellipse, rgba(255,255,255,0.52) 0%, transparent 100%)",
                    pointerEvents: "none",
                  }} />
                  <span style={{ color: "rgba(255,255,255,0.88)", fontSize: "clamp(10px, 1.4vw, 18px)", fontWeight: 900, letterSpacing: "5px", lineHeight: 1 }}>
                    {lastLetter}
                  </span>
                  <span style={{ color: "white", fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, lineHeight: 0.9, textShadow: "0 3px 10px rgba(0,0,0,0.35)" }}>
                    {lastBall}
                  </span>
                </>
              ) : (
                <span style={{ color: "#b0a890", fontSize: "9px", textAlign: "center", fontWeight: 700, letterSpacing: "1px" }}>
                  AGUARDANDO<br />SORTEIO
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contador + histórico + reset */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", width: "clamp(180px, 22vw, 300px)", flexShrink: 0 }}>

          {/* Contador */}
          <div style={{
            textAlign: "center", background: NAVY, borderRadius: "12px",
            padding: "8px 20px", width: "100%",
            boxShadow: `0 4px 18px rgba(15,32,68,0.2)`,
          }}>
            <span style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, color: allDone ? G.lo : "#ffffff", lineHeight: 1 }}>
              {drawn.size}
            </span>
            <span style={{ fontSize: "15px", color: G.mid, fontWeight: 700 }}> / 75</span>
            <div style={{ fontSize: "8px", color: G.mid, letterSpacing: "2px", marginTop: "3px", fontWeight: 700 }}>BOLAS SORTEADAS</div>
            <div style={{ marginTop: "5px", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${(drawn.size / 75) * 100}%`,
                background: `linear-gradient(90deg, ${G.dk}, ${G.lo})`,
                borderRadius: "2px", transition: "width 0.4s ease",
              }} />
            </div>
          </div>

          {/* Últimas bolas */}
          {recentBalls.length > 0 && (
            <div style={{ width: "100%" }}>
              <div style={{ fontSize: "7px", color: G.mid, letterSpacing: "2px", textAlign: "center", marginBottom: "5px", fontWeight: 700 }}>ÚLTIMAS BOLAS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", justifyContent: "center" }}>
                {recentBalls.map((n, i) => {
                  const l = letterOf(n); const c = COLS[l];
                  return (
                    <div key={n} style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: `radial-gradient(circle at 35% 30%, ${c.color}cc, ${c.dark})`,
                      border: `1.5px solid ${G.mid}`,
                      color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "11px", fontWeight: 900,
                      opacity: Math.max(0.2, 1 - i * 0.1), flexShrink: 0,
                    }}>
                      {n}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reiniciar */}
          {allDone && (
            <div style={{
              background: `linear-gradient(135deg, ${G.dk}, ${G.mid}, ${G.lo})`,
              borderRadius: "10px", padding: "6px 12px", textAlign: "center", width: "100%",
              boxShadow: `0 0 24px ${G.glow}`,
            }}>
              <div style={{ fontSize: "15px", fontWeight: 900, color: NAVY, letterSpacing: "2px" }}>JOGO COMPLETO!</div>
            </div>
          )}

          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              style={{
                padding: "10px 0", width: "100%", background: "transparent",
                border: `2px solid ${G.mid}70`, borderRadius: "10px",
                color: "#94a3b8", cursor: "pointer", fontSize: "13px", fontWeight: 700, letterSpacing: "2px",
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
              onMouseOut={e  => { e.currentTarget.style.borderColor = `${G.mid}70`; e.currentTarget.style.color = "#94a3b8"; }}
            >
              ↺ REINICIAR JOGO
            </button>
          ) : (
            <div style={{ textAlign: "center", width: "100%" }}>
              <p style={{ color: "#64748b", fontSize: "12px", marginBottom: "6px", fontWeight: 600 }}>Reiniciar o jogo?</p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={reset} style={{ flex: 1, padding: "10px", background: "#ef4444", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 700, fontSize: "14px" }}>SIM</button>
                <button onClick={() => setConfirmReset(false)} style={{ flex: 1, padding: "10px", background: "#e2e8f0", color: "#334155", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 700, fontSize: "14px" }}>NÃO</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ GRADE BINGO — largura 100% ══ */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        padding: "10px 12px 8px", gap: "6px", overflow: "hidden",
        background: "#ffffff",
      }}>

        {/* B I N G O headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px", flexShrink: 0 }}>
          {LETTERS.map(l => (
            <div key={l} style={{
              background: `linear-gradient(160deg, ${COLS[l].color}, ${COLS[l].dark})`,
              color: "white", textAlign: "center",
              fontSize: "clamp(24px, 4vw, 56px)",
              fontWeight: 900, padding: "8px 4px",
              borderRadius: "10px", letterSpacing: "3px",
              boxShadow: `0 4px 16px ${COLS[l].glow}`,
              lineHeight: 1,
              borderBottom: `3px solid ${G.mid}`,
              textShadow: "0 2px 6px rgba(0,0,0,0.25)",
            }}>
              {l}
            </div>
          ))}
        </div>

        {/* Células — grade 100% da tela */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "6px",
          flex: 1,
          overflow: "hidden",
        }}>
          {Array.from({ length: 15 }, (_, row) =>
            LETTERS.map(l => {
              const n       = COLS[l].start + row;
              const isDrawn = drawn.has(n);
              const isLast  = n === lastBall;
              const cfg     = COLS[l];

              return (
                <button
                  key={n}
                  onClick={() => handleCell(n)}
                  className="cell-btn"
                  style={{
                    borderRadius: "8px",
                    border: isLast
                      ? `3px solid ${G.mid}`
                      : isDrawn ? "3px solid transparent" : "1.5px solid #e2ddd5",
                    background: isDrawn
                      ? `linear-gradient(145deg, ${cfg.color}, ${cfg.dark})`
                      : "#f9f8f6",
                    color: isDrawn ? "white" : "#374151",
                    fontSize: "clamp(16px, 2.8vw, 36px)",
                    fontWeight: 900,
                    cursor: "pointer",
                    boxShadow: isLast
                      ? `0 0 20px ${G.glow}, 0 0 8px ${cfg.glow}`
                      : isDrawn ? `0 2px 8px ${cfg.glow}` : "0 1px 3px rgba(0,0,0,0.05)",
                    transform: isLast ? "scale(1.05)" : "scale(1)",
                    lineHeight: 1,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", overflow: "hidden",
                  }}
                >
                  {isDrawn && (
                    <span style={{
                      position: "absolute", inset: 0, height: "45%",
                      background: "linear-gradient(180deg, rgba(255,255,255,0.14), transparent)",
                      pointerEvents: "none",
                    }} />
                  )}
                  {n}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ══ RODAPÉ TICKER ══ */}
      <footer style={{
        flexShrink: 0,
        height: "76px",
        background: `linear-gradient(90deg, ${NAVY} 0%, #162d6a 50%, ${NAVY} 100%)`,
        borderTop: `4px solid ${G.mid}`,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}>
        <div style={{
          flexShrink: 0, padding: "0 22px",
          borderRight: `2px solid ${G.mid}70`,
          height: "100%", display: "flex", alignItems: "center",
        }}>
          <span style={{
            background: `linear-gradient(180deg, ${G.lo}, ${G.mid})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text", color: "transparent",
            fontSize: "clamp(13px, 1.6vw, 20px)",
            fontWeight: 900, letterSpacing: "4px", whiteSpace: "nowrap",
          }}>
            PATROCINADORES
          </span>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div className="ticker-scroll">
            <span style={{ color: G.hi, fontSize: "clamp(20px, 2.6vw, 32px)", fontWeight: 900, letterSpacing: "1px" }}>
              {TICKER}{TICKER}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
