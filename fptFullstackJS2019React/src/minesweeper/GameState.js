import React from "react";
import { GameStateEnum } from "./Core";
import { relative } from "path";

export default function GameState({ gameState, handleNewGame }) {
  let title = null
  switch (gameState) {
    case GameStateEnum.WON: title = <h1>You WON!</h1>; break;
    case GameStateEnum.LOST: title = <h1>You LOST!</h1>; break;
    case GameStateEnum.PLAYING: break;
    default: break;
  }

  if (!title)
    return null

  return (<div>
      {title}
      <button className="btn btn-primary" onClick={() => handleNewGame()}>New game</button>
    </div>)
}
