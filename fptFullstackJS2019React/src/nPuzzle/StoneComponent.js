import React from 'react'
import './stone.css'

export default function StoneComponent(props) {
    const { stone, row, col, handleMoveStone} = props;

    const getStyle = (stone) => {
        if (stone.value)
            return 'tileStyle close';
        return 'tileStyle open';
    }
    return (
        <td className='colStyle'>
            <button className = {getStyle(stone)} onClick = {(ev) => {handleMoveStone(row, col)}}>
                {stone.value}
            </button>
        </td>
    );
}