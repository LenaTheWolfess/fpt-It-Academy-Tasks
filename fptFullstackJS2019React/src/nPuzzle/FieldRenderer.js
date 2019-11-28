import React from 'react'
import StoneComponent from './StoneComponent'
import './style.css'


export default function FieldRenderer(props) {
    const field = props.field;
    const handleMoveStone = props.handleMoveStone;
    const data = field.stones.map((row, rInd) => {
        const stones = row.map((stone, cInd) =>
            <StoneComponent key={"s"+((rInd+1)*(cInd+1))}
                            row = {rInd}
                            col = {cInd}
                            stone = {stone}
                            handleMoveStone = {handleMoveStone}/>
        )
        return <tr key={"r"+rInd}>{stones}</tr>
    })
    return <table><tbody>{data}</tbody></table>
}
