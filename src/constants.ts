/*
 * Each item in the `grid' array is one of the following values:
 *
 * 	- 0 to 8 mean the square is open and has a surrounding mine
 * 	  count.
 *
 *  - -1 means the square is marked as a mine.
 *
 *  - -2 means the square is unknown.
 *
 * 	- -3 means the square is marked with a question mark
 * 	  (FIXME: do we even want to bother with this?).
 *
 * 	- 64 means the square has had a mine revealed when the game
 * 	  was lost.
 *
 * 	- 65 means the square had a mine revealed and this was the
 * 	  one the player hits.
 *
 * 	- 66 means the square has a crossed-out mine because the
 * 	  player had incorrectly marked it.
 */

export const SquareState = {
    Question: -3,
    Up: -2,
    Flag: -1,
    Down: 0,
    FlagMine: 64,
    Blast: 65,
    FalseMine: 66,
    Mine: 67,
} as const
