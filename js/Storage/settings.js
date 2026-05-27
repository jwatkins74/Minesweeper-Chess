//This file contains all the constants and the choices

//Colors
export const enemyColor = "lightcoral";   // color of tiles where moves do kill
export const emptyColor = "darkseagreen"; // color of tiles where moves don't kill
export const clickColor = "chocolate";    // clicked tile color
export const aColor     = "honeydew";     // A tile colors
export const bColor     = "tan";          // B tile colors




//Difficulty aka Mines
export const mineProb = localStorage.getItem("diff") >= 0 && localStorage.getItem("diff") <= 1  ? localStorage.getItem("diff") / 100 : 0.35;  

