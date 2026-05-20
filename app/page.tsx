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
  "          ✦          Soluções de TI para o seu local!" +
  "          ✦          Sites · Sistemas de segurança · Automações · e muito mais" +
  "          ✦          Conheça tudo em:   www.safevisionbr.com.br" +
  "          ✦          WhatsApp:   (11) 96356-1680" +
  "          ✦          Fale com a gente!";

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

  const recentBalls = [...history].reverse().slice(1, 6);

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
        padding: "22px 24px",
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

      {/* ══ BODY ══ */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── PAINEL ESQUERDO ── */}
        <div style={{
          width: "clamp(210px, 26vw, 320px)",
          flexShrink: 0,
          background: "#ffffff",
          borderRight: `1px solid ${G.mid}50`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "18px 14px 80px",
          gap: "40px",
          overflow: "hidden",
          position: "relative",
        }}>

          {/* Logo */}
          <Image
            src="/logo.png"
            alt="Santuário Nossa Senhora Aparecida"
            width={250} height={250}
            style={{ objectFit: "contain", height: "clamp(90px, 14vw, 160px)", width: "auto" }}
            priority
          />

          <div style={{ fontSize: "clamp(22px, 1.3vw, 16px)", color: G.mid, letterSpacing: "3px", fontWeight: 700 }}>
            BOLA ATUAL
          </div>

          {/* Aro dourado + bola */}
          <div style={{
            padding: "5px", borderRadius: "50%",
            background: `conic-gradient(from 0deg, ${G.dk}, ${G.lo}, ${G.mid}, ${G.hi}, ${G.mid}, ${G.dk})`,
            boxShadow: `0 6px 28px ${G.glow}, 0 2px 8px rgba(0,0,0,0.12)`,
            flexShrink: 0,
          }}>
            <div
              key={animKey}
              className={lastBall ? "ball-pop" : ""}
              style={{
                width:  "clamp(108px, 13vw, 162px)",
                height: "clamp(108px, 13vw, 162px)",
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
                  <span style={{ color: "rgba(255,255,255,0.92)", fontSize: "clamp(14px, 1.8vw, 22px)", fontWeight: 900, letterSpacing: "6px", lineHeight: 1 }}>
                    {lastLetter}
                  </span>
                  <span style={{ color: "white", fontSize: "clamp(40px, 6vw, 76px)", fontWeight: 900, lineHeight: 0.9, textShadow: "0 3px 10px rgba(0,0,0,0.35)" }}>
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

          {/* Contador */}
          <div style={{
            textAlign: "center", background: NAVY, borderRadius: "12px",
            padding: "8px 14px", width: "100%",
            boxShadow: `0 4px 18px rgba(15,32,68,0.22)`,
          }}>
            <span style={{ fontSize: "clamp(24px, 3.6vw, 46px)", fontWeight: 900, color: allDone ? G.lo : "#ffffff", lineHeight: 1 }}>
              {drawn.size}
            </span>
            <span style={{ fontSize: "clamp(18px, 2.2vw, 28px)", color: G.mid, fontWeight: 900 }}> / 75</span>
            <div style={{ fontSize: "clamp(11px, 1.2vw, 15px)", color: G.mid, letterSpacing: "2px", marginTop: "4px", fontWeight: 700 }}>BOLAS SORTEADAS</div>
            <div style={{ marginTop: "6px", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${(drawn.size / 75) * 100}%`,
                background: `linear-gradient(90deg, ${G.dk}, ${G.lo})`,
                borderRadius: "2px", transition: "width 0.4s ease",
              }} />
            </div>
          </div>

          {/* Histórico */}
          {recentBalls.length > 0 && (
            <div style={{ width: "100%", flexShrink: 0 }}>
              <div style={{ fontSize: "clamp(10px, 1.1vw, 14px)", color: G.mid, letterSpacing: "3px", textAlign: "center", marginBottom: "8px", fontWeight: 700 }}>ÚLTIMAS BOLAS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center" }}>
                {recentBalls.map((n, i) => {
                  const l = letterOf(n); const c = COLS[l];
                  return (
                    <div key={n} style={{
                      width: "clamp(36px, 4vw, 48px)", height: "clamp(36px, 4vw, 48px)", borderRadius: "50%",
                      background: `radial-gradient(circle at 35% 30%, ${c.color}cc, ${c.dark})`,
                      border: `1.5px solid ${G.mid}`,
                      color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "clamp(12px, 1.4vw, 18px)", fontWeight: 900,
                      opacity: Math.max(0.2, 1 - i * 0.08), flexShrink: 0,
                    }}>
                      {n}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reiniciar — fixado no fundo do painel */}
          <div style={{ position: "absolute", bottom: "14px", left: "14px", right: "14px" }}>
            {allDone && (
              <div style={{
                background: `linear-gradient(135deg, ${G.dk}, ${G.mid}, ${G.lo})`,
                borderRadius: "10px", padding: "8px 12px", textAlign: "center",
                marginBottom: "8px", boxShadow: `0 0 28px ${G.glow}`,
              }}>
                <div style={{ fontSize: "16px", fontWeight: 900, color: NAVY, letterSpacing: "2px" }}>JOGO COMPLETO!</div>
              </div>
            )}
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                style={{
                  padding: "12px 0", width: "100%", background: "transparent",
                  border: `2px solid ${G.mid}70`, borderRadius: "10px",
                  color: "#94a3b8", cursor: "pointer", fontSize: "14px", fontWeight: 700, letterSpacing: "2px",
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
                onMouseOut={e  => { e.currentTarget.style.borderColor = `${G.mid}70`; e.currentTarget.style.color = "#94a3b8"; }}
              >
                ↺ REINICIAR JOGO
              </button>
            ) : (
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "8px", fontWeight: 600 }}>Reiniciar o jogo?</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={reset} style={{ flex: 1, padding: "12px", background: "#ef4444", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 700, fontSize: "15px" }}>SIM</button>
                  <button onClick={() => setConfirmReset(false)} style={{ flex: 1, padding: "12px", background: "#e2e8f0", color: "#334155", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 700, fontSize: "15px" }}>NÃO</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── GRADE BINGO ── */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          padding: "12px", gap: "6px", overflow: "hidden",
          background: "#ffffff",
        }}>

          {/* B I N G O headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px", flexShrink: 0 }}>
            {LETTERS.map(l => (
              <div key={l} style={{
                background: `linear-gradient(160deg, ${COLS[l].color}, ${COLS[l].dark})`,
                color: "white", textAlign: "center",
                fontSize: "clamp(22px, 3.6vw, 50px)",
                fontWeight: 900, padding: "10px 4px",
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

          {/* Células — 5 colunas × 15 linhas */}
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
                        ? `2.5px solid ${G.mid}`
                        : isDrawn ? "2.5px solid transparent" : "1.5px solid #ddd8cc",
                      background: isDrawn
                        ? `linear-gradient(145deg, ${cfg.color}, ${cfg.dark})`
                        : "#ffffff",
                      color: isDrawn ? "white" : "#374151",
                      fontSize: "clamp(14px, 2.2vw, 28px)",
                      fontWeight: 900,
                      cursor: "pointer",
                      boxShadow: isLast
                        ? `0 0 18px ${G.glow}, 0 0 8px ${cfg.glow}`
                        : isDrawn ? `0 2px 8px ${cfg.glow}` : "0 1px 3px rgba(0,0,0,0.04)",
                      transform: isLast ? "scale(1.06)" : "scale(1)",
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
