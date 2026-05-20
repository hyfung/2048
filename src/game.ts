const SIZE = 4;
let _id = 0;
const uid = () => ++_id;

export interface Tile {
  id: number;
  value: number;
  r: number;
  c: number;
  isNew: boolean;
  isMerged: boolean;
}

export type Direction = 'left' | 'right' | 'up' | 'down';

export interface GameState {
  tiles: Tile[];
  score: number;
  best: number;
  over: boolean;
  won: boolean;
  keepGoing: boolean;
}

type Grid = (Tile | null)[][];

function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array<Tile | null>(SIZE).fill(null));
}

function spawnTile(tiles: Tile[]): Tile[] {
  const taken = new Set(tiles.map(t => `${t.r},${t.c}`));
  const free: [number, number][] = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (!taken.has(`${r},${c}`)) free.push([r, c]);
  if (!free.length) return tiles;
  const [r, c] = free[Math.floor(Math.random() * free.length)];
  return [
    ...tiles,
    { id: uid(), value: Math.random() < 0.9 ? 2 : 4, r, c, isNew: true, isMerged: false },
  ];
}

function noMovesLeft(tiles: Tile[]): boolean {
  if (tiles.length < SIZE * SIZE) return false;
  const g = emptyGrid();
  tiles.forEach(t => { g[t.r][t.c] = t; });
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      const v = g[r][c]?.value;
      if (r < SIZE - 1 && g[r + 1][c]?.value === v) return false;
      if (c < SIZE - 1 && g[r][c + 1]?.value === v) return false;
    }
  return true;
}

export function initGame(best = 0): GameState {
  let tiles: Tile[] = [];
  tiles = spawnTile(tiles);
  tiles = spawnTile(tiles);
  return { tiles, score: 0, best, over: false, won: false, keepGoing: false };
}

export function applyMove(state: GameState, direction: Direction): GameState {
  if (state.over || state.won) return state;

  const g = emptyGrid();
  state.tiles.forEach(t => { g[t.r][t.c] = { ...t, isNew: false, isMerged: false }; });

  let moved = false;
  let gain = 0;
  const ng = emptyGrid();

  const lines: { r: number; c: number }[][] =
    direction === 'left' || direction === 'right'
      ? Array.from({ length: SIZE }, (_, r) =>
          Array.from({ length: SIZE }, (_, i) => ({
            r,
            c: direction === 'right' ? SIZE - 1 - i : i,
          }))
        )
      : Array.from({ length: SIZE }, (_, c) =>
          Array.from({ length: SIZE }, (_, i) => ({
            r: direction === 'down' ? SIZE - 1 - i : i,
            c,
          }))
        );

  for (const line of lines) {
    const row = line.map(({ r, c }) => g[r][c]).filter((t): t is Tile => t !== null);
    const result: Tile[] = [];

    let i = 0;
    while (i < row.length) {
      if (i + 1 < row.length && row[i].value === row[i + 1].value) {
        const val = row[i].value * 2;
        gain += val;
        result.push({ ...row[i], id: uid(), value: val, isMerged: true });
        moved = true;
        i += 2;
      } else {
        result.push(row[i]);
        i++;
      }
    }

    result.forEach((tile, idx) => {
      const { r, c } = line[idx];
      if (!moved && (tile.r !== r || tile.c !== c)) moved = true;
      ng[r][c] = { ...tile, r, c };
    });
  }

  if (!moved) return state;

  let tiles: Tile[] = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      const t = ng[r][c];
      if (t) tiles.push(t);
    }

  tiles = spawnTile(tiles);

  const score = state.score + gain;
  const best = Math.max(state.best, score);
  const won = !state.keepGoing && tiles.some(t => t.value >= 2048);
  const over = !won && noMovesLeft(tiles);

  return { tiles, score, best, over, won, keepGoing: state.keepGoing };
}
