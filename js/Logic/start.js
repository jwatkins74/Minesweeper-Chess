import { makeBombs, showBombs } from "./bombs.js";
import { mineVis } from "../Storage/debug.js";
export function start() {
    makeBombs()
    if (mineVis) {
        showBombs()
    }
}
