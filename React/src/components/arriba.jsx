const arriba = ({ jugador1, jugador2 }) => {
  return (
    <header className="flex justify-between items-center fixed top-0 left-0 w-full bg-black text-white p-4 shadow-md z-50">
    <div className="flex items-center gap-2">
        <span className="text-green-400">Jugador 1:</span>
        <span>{jugador1 || "Desconectado"}</span>
    </div>

    <div className="flex items-center gap-4">
        <a href="http://localhost:5173/" className="hover:text-red-500 transition">menu</a>
        <a href="http://localhost:5173/pantallajuegos" className="hover:text-gray-500 transition">lista de juegos</a>
    </div>

    <div className="flex items-center gap-2">
        <span className="text-purple-400">Jugador 2:</span>
        <span>{jugador2 || "Desconectado"}</span>
    </div>
</header>
  );
};

export default arriba;