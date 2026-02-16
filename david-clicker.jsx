import { useState, useRef, useEffect, useCallback } from "react";

const NORMAL_SRC = "https://static.wikia.nocookie.net/battlefordreamisland/images/8/86/HD_David.png/revision/latest?cb=20241210131638&format=original";
const ANGRY_SRC = "https://static.wikia.nocookie.net/battlefordreamisland/images/e/e1/Angry_David.gif/revision/latest/scale-to-width-down/2537?cb=20200422064552";
const AUDIO_SRC = "https://static.wikia.nocookie.net/battlefordreamisland/images/d/d2/Bfdi_angery_AW_SERIOUSLY.ogg/revision/latest?cb=20200420143938&format=original";

export default function DavidClicker() {
  const [score, setScore] = useState(0);
  const [isAngry, setIsAngry] = useState(false);
  const [labels, setLabels] = useState([]);
  const audioRef = useRef(null);
  const labelIdRef = useRef(0);

  useEffect(() => {
    audioRef.current = new Audio(AUDIO_SRC);
    audioRef.current.onended = () => setIsAngry(false);
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, []);

  const goAngry = useCallback(() => {
    setIsAngry(true);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }, []);

  const spawnLabel = useCallback((x, y, text) => {
    const id = labelIdRef.current++;
    setLabels(prev => [...prev, { id, x, y, text }]);
    setTimeout(() => setLabels(prev => prev.filter(l => l.id !== id)), 950);
  }, []);

  const handleDavidClick = (e) => {
    setScore(s => s + 1);
    spawnLabel(e.clientX, e.clientY, "+1");
    goAngry();
  };

  const handleBoost = (amount, e) => {
    setScore(s => s + amount);
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top;
    const count = amount <= 50 ? 6 : 10;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const ox = (Math.random() - 0.5) * 140;
        const oy = (Math.random() - 0.5) * 30;
        spawnLabel(cx + ox, cy + oy, `+${amount}`);
      }, i * 35);
    }
    goAngry();
  };

  return (
    <>
      <style>{`
        @import url(https://db.onlinewebfonts.com/c/468c67c3a57b93870b455fc4ec30dbe1?family=Shag-Lounge);
        @font-face {
          font-family: "Shag-Lounge";
          src: url("https://db.onlinewebfonts.com/t/468c67c3a57b93870b455fc4ec30dbe1.woff2") format("woff2"),
               url("https://db.onlinewebfonts.com/t/468c67c3a57b93870b455fc4ec30dbe1.ttf") format("truetype");
        }
        @keyframes floatUp {
          0%   { opacity:1; transform: translateY(0px) scale(1); }
          60%  { opacity:1; transform: translateY(-55px) scale(1.12); }
          100% { opacity:0; transform: translateY(-95px) scale(0.85); }
        }
        .david-img { cursor: pointer; user-select: none; -webkit-user-drag: none; }
        .david-img:active { filter: brightness(0.9); }
        .boost-btn {
          font-family: "Shag-Lounge", sans-serif;
          font-size: 20px;
          background: #22bb33;
          color: #fff;
          border: none;
          border-radius: 14px;
          padding: 13px 26px;
          cursor: pointer;
          box-shadow: 0 4px 0 #167a20;
          transition: transform 0.08s, box-shadow 0.08s;
          letter-spacing: 1px;
          line-height: 1.4;
          text-align: center;
          outline: none;
        }
        .boost-btn:hover { background: #1ea82d; }
        .boost-btn:active { transform: translateY(3px); box-shadow: 0 1px 0 #167a20; }
      `}</style>

      <div style={{
        background: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: '"Shag-Lounge", sans-serif',
        position: "relative",
        overflow: "hidden"
      }}>

        {/* Floating labels */}
        {labels.map(l => (
          <div key={l.id} style={{
            position: "fixed",
            left: l.x - 20,
            top: l.y - 20,
            fontFamily: '"Shag-Lounge", sans-serif',
            fontSize: l.text === "+1" ? 30 : 34,
            color: "#22bb33",
            fontWeight: "bold",
            pointerEvents: "none",
            animation: "floatUp 0.95s ease-out forwards",
            textShadow: "0 1px 4px rgba(0,0,0,0.12)",
            zIndex: 9999,
          }}>{l.text}</div>
        ))}

        {/* Title */}
        <h1 style={{
          fontFamily: '"Shag-Lounge", sans-serif',
          fontSize: 54,
          color: "#111",
          marginTop: 30,
          letterSpacing: 2,
          textAlign: "center",
          lineHeight: 1,
        }}>David Clicker</h1>

        {/* Score */}
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <span style={{ fontFamily: '"Shag-Lounge", sans-serif', fontSize: 24, color: "#444" }}>Clicks:</span>
          <div style={{ fontFamily: '"Shag-Lounge", sans-serif', fontSize: 54, color: "#111", lineHeight: 1.1 }}>
            {score.toLocaleString()}
          </div>
        </div>

        {/* David */}
        <div style={{ marginTop: 24, width: 240, height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img
            className="david-img"
            src={isAngry ? ANGRY_SRC : NORMAL_SRC}
            alt="David from BFDI"
            draggable={false}
            style={{ width: 220 }}
            onClick={handleDavidClick}
          />
        </div>

        {/* Boost Buttons */}
        <div style={{ display: "flex", gap: 22, marginTop: 26 }}>
          <button className="boost-btn" onClick={(e) => handleBoost(50, e)}>
            Super Click<br /><span style={{ fontSize: 15 }}>+50 clicks</span>
          </button>
          <button className="boost-btn" onClick={(e) => handleBoost(200, e)}>
            Mega Click<br /><span style={{ fontSize: 15 }}>+200 clicks</span>
          </button>
        </div>

        {/* Credits */}
        <div style={{
          marginTop: "auto",
          padding: "24px 0 18px",
          fontFamily: '"Shag-Lounge", sans-serif',
          fontSize: 14,
          color: "#999",
          textAlign: "center",
        }}>
          David is a character from <strong style={{ color: "#555" }}>Battle for Dream Island (BFDI)</strong><br />
          Created by <strong style={{ color: "#555" }}>Michael Huang &amp; Cary Huang</strong>{" "}
          <span style={{ color: "#22bb33" }}>(jacknjellify)</span>
        </div>

      </div>
    </>
  );
            }
