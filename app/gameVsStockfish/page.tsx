'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Chess, Square } from 'chess.js';
import { useSession } from 'next-auth/react';

type EngineReply =
  | { ok: true; engine: any; fen: string; depth: number }
  | { ok: false; error: string };

const FILES = ['a','b','c','d','e','f','g','h'];
const RANKS = ['8','7','6','5','4','3','2','1'];

const GameVsStockfish = () => {
  const gameRef = useRef(new Chess());
  const [boardKey, setBoardKey] = useState(0);
  const [selected, setSelected] = useState<Square | null>(null);
  const [legalTargets, setLegalTargets] = useState<Set<string>>(new Set());
  const [isThinking, setIsThinking] = useState(false);
  const [depth, setDepth] = useState<number>(12);
  const [gameResult, setGameResult] = useState<{ winner: 'white' | 'black' | 'draw'; reason: string } | null>(null);

  const { data: session, status } = useSession();

  const chess = gameRef.current;
  const isWhitesTurn = chess.turn() === 'w';

  // Check for game over conditions
  const checkGameOver = useCallback(() => {
    if (chess.isGameOver()) {
      if (chess.isCheckmate()) {
        const winner = chess.turn() === 'w' ? 'black' : 'white';
        setGameResult({ winner, reason: winner === 'white' ? 'You won by checkmate!' : 'Stockfish won by checkmate!' });
      } else if (chess.isDraw()) {
        if (chess.isStalemate()) {
          setGameResult({ winner: 'draw', reason: 'Draw by stalemate' });
        } else if (chess.isInsufficientMaterial()) {
          setGameResult({ winner: 'draw', reason: 'Draw by insufficient material' });
        } else if (chess.isThreefoldRepetition()) {
          setGameResult({ winner: 'draw', reason: 'Draw by threefold repetition' });
        } else {
          setGameResult({ winner: 'draw', reason: 'Draw by 50-move rule' });
        }
      }
    }
  }, [chess]);

  // Compute check square for highlight
  const kingInCheckSquare = useMemo(() => {
    if (!chess.isCheck()) return null;
    const side = chess.turn() === 'w' ? 'K' : 'k';
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const sq = (FILES[f] + RANKS[r]) as Square;
        const p = chess.get(sq);
        if (p && p.type === 'k' && (p.color === 'w' ? 'K' : 'k') === side) {
          return sq;
        }
      }
    }
    return null;
  }, [boardKey]);

  const refreshBoard = useCallback(() => {
    setBoardKey((k) => k + 1);
    setTimeout(checkGameOver, 100);
  }, [checkGameOver]);

  const onSquareClick = useCallback((sq: Square) => {
    if (isThinking || !isWhitesTurn || chess.isGameOver()) return;
  
    // Toggle off if clicking the same square
    if (selected === sq) {
      setSelected(null);
      setLegalTargets(new Set());
      return;
    }
  
    // 1) If you click your own piece, (re)select it and show its legal targets
    const piece = chess.get(sq);
    if (piece && piece.color === 'w') {
      setSelected(sq);
      const legal = chess.moves({ square: sq, verbose: true }).map(m => m.to);
      setLegalTargets(new Set(legal));
      return; // don't attempt a move onto your own piece
    }
  
    // 2) Otherwise, if a piece is selected, try to move it
    if (selected) {
      const move = chess.move({ from: selected, to: sq, promotion: 'q' as const });
      if (move) {
        setSelected(null);
        setLegalTargets(new Set());
        refreshBoard();
        if (!chess.isGameOver()) {
          setTimeout(() => { engineMove(); }, 100);
        }
        return;
      }
  
      // ⬇️ Illegal click: clear selection and targets
      setSelected(null);
      setLegalTargets(new Set());
      return;
    }
  
    // Clicked empty/opponent square with nothing selected → no-op
  }, [selected, isThinking, isWhitesTurn, refreshBoard, chess]);

  async function engineMove() {
    try {
      setIsThinking(true);
      console.log('Making engine request with FEN:', chess.fen());
      
      const res = await fetch('/api/stockfish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen: chess.fen(), depth }),
      });

      if (!res.ok) {
        console.error('API request failed with status:', res.status);
        return;
      }

      const data: EngineReply = await res.json();
      console.log('API response:', data);

      if (!data.ok) {
        console.error('Engine error:', data.error);
        return;
      }

      // The API returns the bestmove directly in data.engine.bestmove
      const uci = data.engine?.bestmove;
      console.log('Engine bestmove UCI:', uci);
      
      if (!uci || uci.length < 4) {
        console.error('Invalid UCI move:', uci);
        return;
      }

      const from = uci.slice(0, 2) as Square;
      const to = uci.slice(2, 4) as Square;
      const promotion = uci.length > 4 ? uci[4] : undefined;

      console.log('Attempting move:', { from, to, promotion });

      // Build move object
      const moveObj: any = { from, to };
      if (promotion && ['q', 'r', 'b', 'n'].includes(promotion)) {
        moveObj.promotion = promotion;
      }

      // Try to make the move
      const move = chess.move(moveObj);
      
      if (!move) {
        console.error('Failed to apply move:', moveObj);
        console.error('Current position:', chess.fen());
        console.error('Legal moves:', chess.moves());
        return;
      }

      console.log('Move applied successfully:', move);
      console.log('New position:', chess.fen());
      
    } catch (error) {
      console.error('Error in engineMove:', error);
    } finally {
      setIsThinking(false);
      // Always refresh the board at the end
      refreshBoard();
    }
  }

  function newGame() {
    chess.reset();
    setSelected(null);
    setLegalTargets(new Set());
    setGameResult(null);
    refreshBoard();
  }

  function resign() {
    setGameResult({ winner: 'black', reason: 'You resigned. Stockfish wins!' });
  }

  const boardMatrix = useMemo(() => chess.board(), [boardKey]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-orange-100 to-amber-500 flex items-center justify-center p-4">
      <div className="flex flex-col items-center">
        {/* Note for unauthenticated users */}
        {(status !== 'authenticated') && (
          <div className="text-black mb-5 max-w-lg text-center px-4">
            Note: Log in to save your data Against Stockfish. We are currently developing performance tracking and analysis features.
          </div>
        )}

        <div className="relative">
          {/* Game Over Modal */}
        {gameResult && (
          <div className="absolute inset-0 z-30 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="bg-white/95 p-8 rounded-2xl shadow-2xl border border-orange-200 max-w-md mx-4 text-center">
              <div className="mb-6">
                {gameResult.winner === 'white' && (
                  <div className="text-6xl mb-4">🎉</div>
                )}
                {gameResult.winner === 'black' && (
                  <div className="text-6xl mb-4">😔</div>
                )}
                {gameResult.winner === 'draw' && (
                  <div className="text-6xl mb-4">🤝</div>
                )}
                
                <h2 className={`text-2xl font-bold mb-2 ${
                  gameResult.winner === 'white' ? 'text-green-600' :
                  gameResult.winner === 'black' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {gameResult.winner === 'white' ? 'Victory!' :
                   gameResult.winner === 'black' ? 'Defeat!' : 'Draw!'}
                </h2>
                
                <p className="text-orange-800 text-lg">{gameResult.reason}</p>
              </div>
              
              <button
                onClick={newGame}
                className="
                  px-8 py-3 rounded-xl font-bold text-white
                  bg-gradient-to-r from-orange-600 to-amber-600 
                  hover:from-orange-700 hover:to-amber-700
                  shadow-lg hover:shadow-xl
                  transition-all duration-200 hover:scale-105 active:scale-95
                  border-2 border-orange-500/30
                "
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Removed thinking overlay - pieces will animate instead */}

        {/* Board container with medium size */}
        <div className="p-5 bg-gradient-to-br from-orange-900 via-orange-800 to-amber-800 rounded-2xl shadow-2xl">
          <div className="grid grid-cols-8 gap-0.5 p-3.5 bg-gradient-to-br from-orange-100 to-amber-50 rounded-xl shadow-inner">
            {boardMatrix.map((row, rIdx) =>
              row.map((cell, fIdx) => {
                const file = FILES[fIdx];
                const rank = RANKS[rIdx];
                const sq = (file + rank) as Square;

                const isDark = (fIdx % 2 === 0 && rIdx % 2 === 1) || (fIdx % 2 === 1 && rIdx % 2 === 0);
                const isSelected = selected === sq;
                const isTarget = legalTargets.has(sq);
                const isCheckSq = kingInCheckSquare === sq;

                // Slightly smaller square styling
                let squareClasses = `
                  relative h-14 w-14 md:h-18 md:w-18
                  flex items-center justify-center rounded-md
                  transition-all duration-200 ease-out
                  shadow-sm hover:shadow-md
                  cursor-pointer hover:scale-105 active:scale-95
                `;

                if (isDark) {
                  squareClasses += ' bg-gradient-to-br from-orange-400 to-orange-500';
                } else {
                  squareClasses += ' bg-gradient-to-br from-orange-50 to-orange-100';
                }

                if (isSelected) {
                  squareClasses += ' ring-3 ring-gray-800 ring-opacity-90 shadow-lg scale-110 bg-gray-300/60';
                }

                if (isTarget) {
                  squareClasses += ' after:absolute after:inset-1.5 after:rounded-full after:bg-gray-800/70 after:border-2 after:border-gray-900';
                }

                if (isCheckSq) {
                  squareClasses += ' ring-3 ring-red-500 ring-opacity-90 shadow-red-300 shadow-lg animate-pulse';
                }

                return (
                  <button
                    key={sq}
                    onClick={() => onSquareClick(sq)}
                    className={squareClasses}
                    aria-label={sq}
                  >
                    {/* Chess piece SVG */}
                    {cell && (
                      <img 
                        src={`/pieces/${cell.color}${cell.type.toUpperCase()}.svg`}
                        alt={`${cell.color === 'w' ? 'White' : 'Black'} ${cell.type}`}
                        className="w-10 h-10 md:w-12 md:h-12 select-none z-10 relative transition-transform duration-200 hover:scale-110"
                        draggable={false}
                      />
                    )}

                    {/* Coordinate labels */}
                    {fIdx === 0 && (
                      <span className="absolute top-1 left-1.5 text-xs font-bold text-orange-800/70">
                        {rank}
                      </span>
                    )}
                    {rIdx === 7 && (
                      <span className="absolute bottom-1 right-1.5 text-xs font-bold text-orange-800/70">
                        {file}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Controls below board */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={newGame}
            className="
              px-6 py-2.5 rounded-xl font-bold text-white
              bg-gradient-to-r from-orange-600 to-amber-600 
              hover:from-orange-700 hover:to-amber-700
              shadow-lg hover:shadow-xl
              transition-all duration-200 hover:scale-105 active:scale-95
              border-2 border-orange-500/30
            "
          >
            New Game
          </button>
          
          <button
            onClick={resign}
            disabled={chess.isGameOver() || isThinking}
            className="
              px-6 py-2.5 rounded-xl font-bold text-white
              bg-gradient-to-r from-red-600 to-red-700
              hover:from-red-700 hover:to-red-800
              disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
              shadow-lg hover:shadow-xl
              transition-all duration-200 hover:scale-105 active:scale-95
              border-2 border-red-500/30
            "
          >
            Resign
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default GameVsStockfish;