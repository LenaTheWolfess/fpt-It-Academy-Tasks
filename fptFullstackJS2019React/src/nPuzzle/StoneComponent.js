import React from 'react'
import './stone.css'
import { GameStateEnum } from './Core';

export default function StoneComponent(props) {
    const { stone, row, col, handleMoveStone, state} = props;

    const getStyle = (stone, state) => {
        if (state === GameStateEnum.WON)
            return 'tileStyle won';
        if (stone.value)
            return 'tileStyle closed';
        return `tileStyle open `;
    }
    return (
        <td className='colStyle'>
            <button className = {getStyle(stone, state)} onClick = {(ev) => {handleMoveStone(row, col)}}>
                {stone.value}
            </button>
        </td>
    );
}