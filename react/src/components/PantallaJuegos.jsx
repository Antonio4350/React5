import React from "react";
import { Link } from "react-router-dom";
import Fondo from "./Fondo.jsx";

export default function PantallaJuegos() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Fondo dinámico */}
      <Fondo />

      {/* Contenido retro */}
      <div className="relative z-10 bg-black/80 border-4 border-white p-10 rounded-lg shadow-lg text-center max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-10 retro-text">
          SELECCIONA TU JUEGO
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Juego Space */}
          <Link
            to="/space"
            className="group flex flex-col items-center border-2 border-white p-6 rounded-lg bg-black hover:bg-white transition"
          >
            <img
              src="/images/space.png"
              alt="Space Game"
              className="w-40 h-40 object-contain mb-4 group-hover:scale-110 transition"
            />
            <span className="text-white group-hover:text-black retro-text">
              SPACE GAME
            </span>
          </Link>

          {/* Juego Guerra */}
          <Link
            to="/guerra"
            className="group flex flex-col items-center border-2 border-white p-6 rounded-lg bg-black hover:bg-white transition"
          >
            <img
              src="/images/guerra.png"
              alt="Guerra Game"
              className="w-40 h-40 object-contain mb-4 group-hover:scale-110 transition"
            />
            <span className="text-white group-hover:text-black retro-text">
              GUERRA GAME
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
