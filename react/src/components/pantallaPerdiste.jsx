import React from "react";
import { useNavigate } from "react-router-dom";

export default function PantallaPerdiste({ score, onRestart }) {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      <div className="bg-black/80 border-4 border-white p-8 text-center shadow-lg animate-scaleIn rounded-xl">
        <h1 className="text-5xl font-bold text-white mb-6 tracking-widest retro-text">
          GAME OVER
        </h1>
        <p className="text-xl text-white mb-2">Puntaje:</p>
        <p className="text-4xl font-extrabold text-white mb-6">{score}</p>

        {/* Botones uno al lado del otro */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-black text-white font-bold rounded-xl border-2 border-white hover:bg-white hover:text-black transition"
          >
            REINTENTAR
          </button>

          <button
            onClick={() => navigate("/ranking")}
            className="px-6 py-3 bg-black text-white font-bold rounded-xl border-2 border-white hover:bg-white hover:text-black transition"
          >
            VER RANKING
          </button>
        </div>
      </div>
    </div>
  );
}
