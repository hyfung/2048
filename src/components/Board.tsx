import type { Tile } from '../game';
import TileComponent from './Tile';

const CELLS = Array.from({ length: 16 });

interface BoardProps {
  tiles: Tile[];
  onTouchStart: React.TouchEventHandler<HTMLDivElement>;
  onTouchEnd: React.TouchEventHandler<HTMLDivElement>;
}

export default function Board({ tiles, onTouchStart, onTouchEnd }: BoardProps) {
  return (
    <div
      className="board"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="board-bg">
        {CELLS.map((_, i) => <div key={i} className="cell" />)}
      </div>
      <div className="board-tiles">
        {tiles.map(tile => <TileComponent key={tile.id} tile={tile} />)}
      </div>
    </div>
  );
}
