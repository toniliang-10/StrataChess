import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { fen, depth = 12 } = await req.json();
    
    console.log('API Request - FEN:', fen, 'Depth:', depth);

    if (!fen || typeof fen !== "string") {
      return NextResponse.json({ ok: false, error: "Missing FEN" }, { status: 400 });
    }

    // Clamp depth to reasonable range
    const d = Math.max(1, Math.min(15, Number(depth) || 12));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      // Try chess-api.com which appears to be more current
      const response = await fetch("https://chess-api.com/v1", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          fen: fen,
          depth: d
        }),
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        
        // If chess-api.com fails, fall back to a simple local engine simulation
        // This is just a temporary fallback while we find the right API
        return NextResponse.json({
          ok: true,
          fen,
          depth: d,
          engine: {
            bestmove: generateRandomLegalMove(fen),
            bestmoveRaw: "fallback move",
            evaluation: null,
            mate: null,
            continuation: null,
          },
        });
      }

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', responseText);
        
        // Fallback to random move if API response is invalid
        return NextResponse.json({
          ok: true,
          fen,
          depth: d,
          engine: {
            bestmove: generateRandomLegalMove(fen),
            bestmoveRaw: "fallback move",
            evaluation: null,
            mate: null,
            continuation: null,
          },
        });
      }

      console.log('Parsed response:', data);

      // Extract the best move from whatever format the API returns
      let bestmove = null;
      if (data.bestmove) bestmove = data.bestmove;
      else if (data.move) bestmove = data.move;
      else if (data.uci) bestmove = data.uci;
      else if (data.best) bestmove = data.best;

      if (!bestmove) {
        console.log('No bestmove found in response, using fallback');
        bestmove = generateRandomLegalMove(fen);
      }

      const result = {
        ok: true,
        fen,
        depth: d,
        engine: {
          bestmove: bestmove,
          bestmoveRaw: JSON.stringify(data),
          evaluation: data.evaluation || data.eval || null,
          mate: data.mate || null,
          continuation: data.continuation || null,
        },
      };

      console.log('Returning result:', result);
      return NextResponse.json(result);

    } catch (fetchError: any) {
      clearTimeout(timeout);
      
      console.error('Fetch error, using fallback:', fetchError);
      
      // If all APIs fail, use a simple fallback
      return NextResponse.json({
        ok: true,
        fen,
        depth: d,
        engine: {
          bestmove: generateRandomLegalMove(fen),
          bestmoveRaw: "fallback move",
          evaluation: null,
          mate: null,
          continuation: null,
        },
      });
    }

  } catch (err: any) {
    console.error('API route error:', err);
    const msg = err?.message || "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

// Simple fallback function to generate a random legal move
// This is just to keep the game playable while we sort out the API
function generateRandomLegalMove(fen: string): string {
  try {
    // Import chess.js dynamically since this is server-side
    const { Chess } = require('chess.js');
    const chess = new Chess(fen);
    const moves = chess.moves({ verbose: true });
    
    if (moves.length === 0) return "e2e4"; // fallback
    
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return randomMove.from + randomMove.to + (randomMove.promotion || '');
  } catch (error) {
    console.error('Error generating fallback move:', error);
    return "e2e4"; // ultimate fallback
  }
}