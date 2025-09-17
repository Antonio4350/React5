import React from "react";
import { Link } from "react-router-dom";
import Fondo from "./Fondo.jsx";

export default function PantallaJuegos() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <Fondo />

      <div className="relative z-10 bg-black/80 border-4 border-white p-10 rounded-lg shadow-lg text-center max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-10 retro-text">
          SELECCIONA UN JUEGO
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Link
            to="/space"
            className="group flex flex-col items-center border-2 border-white p-4 rounded-lg bg-black hover:bg-white transition"
          >
            <img
              src="./fondoSpace.png"
              alt="Space Game"
              className="w-90 h-90 object-contain mb-2 group-hover:scale-110 transition"
            />
            <span className="text-white group-hover:text-black retro-text">
              SPACE INVADERS REMAKE
            </span>
          </Link>

          <Link
            to="/guerra"
            className="group flex flex-col items-center border-2 border-white p-4 rounded-lg bg-black hover:bg-white transition"
          >
            <img
              src="./1942fondo.png"
              alt="Guerra Game"
              className="w-90 h-90 object-contain mb-2 group-hover:scale-110 transition"
            />
            <span className="text-white group-hover:text-black retro-text">
              1942 REMAKE
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
