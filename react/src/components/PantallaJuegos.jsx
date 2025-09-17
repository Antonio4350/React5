import React from "react";
import { Link } from "react-router-dom";
import Fondo from "./Fondo.jsx";

export default function PantallaJuegos() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <Fondo />

      <div className="relative z-10 bg-black/80 border-4 border-white p-6 rounded-lg shadow-lg text-center max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-6 retro-text">
          SELECCIONA UN JUEGO
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/space"
            className="group flex flex-col items-center border-2 border-white p-4 rounded-lg bg-black hover:bg-white transition"
          >
            <img
              src="./fondoSpace.png"
              alt="Space Game"
              className="w-60 h-60 object-contain mb-2 group-hover:scale-110 transition"
            />
            <span className="text-white group-hover:text-black retro-text text-sm md:text-base text-center">
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
              className="w-60 h-60 object-contain mb-2 group-hover:scale-110 transition"
            />
            <span className="text-white group-hover:text-black retro-text text-sm md:text-base text-center">
              1942 REMAKE
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
