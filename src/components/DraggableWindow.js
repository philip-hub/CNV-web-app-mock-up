import React from 'react';
import Draggable from 'react-draggable';
import styles from './DraggableWindow.module.css';

const DraggableWindow = ({ position, onClose, data }) => {
    return (
        <Draggable defaultPosition={{ x: position.x, y: position.y }}>
            <div className={styles.draggableWindow}>
                <div className={styles.header}>
                    <span>Details</span>
                    <button onClick={onClose} className={styles.closeButton}>X</button>
                </div>
                <div className={styles.content}>
                    <p>Clicked Arm: {data.clickedArm}</p>
                    <p>CN: {data.CN}</p>
                    <p>AI: {data.AI}</p>
                    <p>M: {data.M}</p>
                    <p>dm: {data.dm}</p>
                    <p>dcn: {data.dcn}</p>
                </div>
            </div>
        </Draggable>
    );
};

export default DraggableWindow;
