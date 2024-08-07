import React from 'react';
import Draggable from 'react-draggable';
import styles from './DraggableWindow.module.css';

const DraggableWindow = ({ position, onClose, data }) => {
    return (
        <Draggable defaultPosition={position} bounds="parent">
            <div className={styles.draggableWindow}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <div>
                    <p>Clicked Arm: {data.clickedArm}</p>
                    <p>CN: {data.cn}</p>
                    <p>AI: {data.ai}</p>
                    <p>M: {data.m}</p>
                    <p>dm: {data.dm}</p>
                    <p>dcn: {data.dcn}</p>
                </div>
            </div>
        </Draggable>
    );
};

export default DraggableWindow;
