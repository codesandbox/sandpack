import { toPx } from "./utils";

export const GRID_BASE_UNIT = 4;

export const onGrid = (multiplier: number): number =>
  multiplier * GRID_BASE_UNIT;
export const onGridPx = (multiplier: number): string =>
  toPx(onGrid(multiplier));

export const space = {
  0: onGridPx(0),
  1: onGridPx(1),
  2: onGridPx(2),
  3: onGridPx(3),
  4: onGridPx(4),
  5: onGridPx(5),
  6: onGridPx(6),
  7: onGridPx(7),
  8: onGridPx(8),
  9: onGridPx(9),
  10: onGridPx(10),
  11: onGridPx(11),
  12: onGridPx(12),
  13: onGridPx(13),
  14: onGridPx(14),
  15: onGridPx(15),
  16: onGridPx(16),
  17: onGridPx(17),
  18: onGridPx(18),
  19: onGridPx(19),
  20: onGridPx(20),
  21: onGridPx(21),
  22: onGridPx(22),
  23: onGridPx(23),
  24: onGridPx(24),
  25: onGridPx(25),
};
