import type { Tile } from '../game';

interface TileColors {
  bg: string;
  fg: string;
}

const COLORS: Record<number, TileColors> = {
  2:    { bg: '#eee4da', fg: '#776e65' },
  4:    { bg: '#ede0c8', fg: '#776e65' },
  8:    { bg: '#f2b179', fg: '#f9f6f2' },
  16:   { bg: '#f59563', fg: '#f9f6f2' },
  32:   { bg: '#f67c5f', fg: '#f9f6f2' },
  64:   { bg: '#f65e3b', fg: '#f9f6f2' },
  128:  { bg: '#edcf72', fg: '#f9f6f2' },
  256:  { bg: '#edcc61', fg: '#f9f6f2' },
  512:  { bg: '#edc850', fg: '#f9f6f2' },
  1024: { bg: '#edc53f', fg: '#f9f6f2' },
  2048: { bg: '#edc22e', fg: '#f9f6f2' },
};
const DEFAULT: TileColors = { bg: '#3c3a32', fg: '#f9f6f2' };

interface TileProps {
  tile: Tile;
}

export default function TileComponent({ tile }: TileProps) {
  const { bg, fg } = COLORS[tile.value] ?? DEFAULT;
  const digits = String(tile.value).length;

  const classes = [
    'tile-wrapper',
    tile.isNew && 'tile-new',
    tile.isMerged && 'tile-merged',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={{ '--r': tile.r, '--c': tile.c } as React.CSSProperties}
    >
      <div
        className="tile"
        data-digits={digits}
        style={{ background: bg, color: fg }}
      >
        {tile.value}
      </div>
    </div>
  );
}
