import { useState, useEffect, useCallback, useRef } from 'react';
import { initGame, applyMove, type Direction, type GameState } from './game';
import Board from './components/Board';
import './App.css';

const BEST_KEY = '2048_best';

export default function App() {
  const [state, setState] = useState<GameState>(() => {
    const best = parseInt(localStorage.getItem(BEST_KEY) ?? '0', 10);
    return initGame(best);
  });

  const move = useCallback((dir: Direction) => {
    setState(prev => {
      const next = applyMove(prev, dir);
      if (next === prev) return prev;
      if (next.best > prev.best) localStorage.setItem(BEST_KEY, String(next.best));
      return next;
    });
  }, []);

  const newGame = useCallback(() => {
    setState(prev => initGame(prev.best));
  }, []);

  const keepGoing = useCallback(() => {
    setState(prev => ({ ...prev, won: false, keepGoing: true }));
  }, []);

  useEffect(() => {
    const MAP: Record<string, Direction> = {
      ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
      a: 'left', d: 'right', w: 'up', s: 'down',
    };
    const onKey = (e: KeyboardEvent) => {
      const dir = MAP[e.key];
      if (dir) { e.preventDefault(); move(dir); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move]);

  const touchOrigin = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    touchOrigin.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchOrigin.current) return;
    const dx = e.changedTouches[0].clientX - touchOrigin.current.x;
    const dy = e.changedTouches[0].clientY - touchOrigin.current.y;
    touchOrigin.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left');
    else move(dy > 0 ? 'down' : 'up');
  }, [move]);

  return (
    <div className="app">
      <header className="header">
        <div className="title-block">
          <h1 className="title">2048</h1>
          <p className="hint">Arrow keys or WASD to play</p>
        </div>
        <div className="controls">
          <div className="scores">
            <ScoreBox label="SCORE" value={state.score} />
            <ScoreBox label="BEST" value={state.best} />
          </div>
          <button className="btn" onClick={newGame}>New Game</button>
        </div>
      </header>

      <Board tiles={state.tiles} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} />

      <footer className="footer">
        <p>Join tiles with the same number to reach <strong>2048</strong>!</p>
      </footer>

      {(state.won || state.over) && (
        <div className="overlay">
          <div className="overlay-box">
            {state.won ? (
              <>
                <div className="overlay-icon">🏆</div>
                <h2 className="overlay-title">You Win!</h2>
                <p className="overlay-msg">You reached <strong>2048</strong>!</p>
                <div className="overlay-actions">
                  <button className="btn btn-accent" onClick={keepGoing}>Keep Going</button>
                  <button className="btn" onClick={newGame}>New Game</button>
                </div>
              </>
            ) : (
              <>
                <div className="overlay-icon">😔</div>
                <h2 className="overlay-title">Game Over</h2>
                <p className="overlay-msg">No more moves available!</p>
                <p className="overlay-score">Final score: <strong>{state.score}</strong></p>
                <button className="btn btn-accent" onClick={newGame}>Try Again</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ScoreBoxProps {
  label: string;
  value: number;
}

function ScoreBox({ label, value }: ScoreBoxProps) {
  return (
    <div className="score-box">
      <span className="score-label">{label}</span>
      <span className="score-value">{value}</span>
    </div>
  );
}
