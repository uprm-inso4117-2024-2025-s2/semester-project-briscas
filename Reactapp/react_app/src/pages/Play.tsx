import React from "react";
import "../styles/pages/Board.css";

const PlayBoard = () => {
  return (
    <div className="page-content">
      {/* Game Board */}
      <div className="relative w-full max-w-3xl bg-green-900 p-6 rounded-lg shadow-lg border-4 border-yellow-500">
        <h2 className="text-white text-center text-xl font-bold mb-4">Game Board</h2>

        {/* Card Slots (Example) */}
        <div className="grid grid-cols-3 gap-4 justify-items-center">
          <div className="card-slot" />
          <div className="card-slot" />
          <div className="card-slot" />
        </div>
      </div>

      {/* Player Hand */}
      <div className="flex gap-4 mt-8">
        <div className="card">A♠</div>
        <div className="card">7♦</div>
        <div className="card">K♣</div>
      </div>
    </div>
  );
};

export default PlayBoard;
