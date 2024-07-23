import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';
import styles from '../styles/Analysis.module.css';
import NavBar from '../components/NavBar';

export default function Single() {
  const [showDraggable, setShowDraggable] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const draggableRef = useRef(null);

  const handleGraphClick = (e) => {
    console.log("Left graph clicked");
    setMousePosition({ x: e.clientX, y: e.clientY });
    setShowDraggable(true);
  };

  const handleClose = () => {
    console.log("Close button clicked");
    setShowDraggable(false);
  };

  useEffect(() => {
    const draggableElement = draggableRef.current;
    let offsetX, offsetY;

    const onMouseMove = (e) => {
      draggableElement.style.left = `${e.pageX - offsetX}px`;
      draggableElement.style.top = `${e.pageY - offsetY}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    const onMouseDown = (e) => {
      offsetX = e.clientX - draggableElement.getBoundingClientRect().left;
      offsetY = e.clientY - draggableElement.getBoundingClientRect().top;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    if (draggableElement) {
      draggableElement.addEventListener('mousedown', onMouseDown);
    }

    return () => {
      if (draggableElement) {
        draggableElement.removeEventListener('mousedown', onMouseDown);
      }
    };
  }, [showDraggable]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Single Sample Analysis</title>
        <meta name="description" content="Single Sample Analysis Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <main className={styles.main}>
        <div className={styles.graphContainer}>
          <div className={styles.leftGraph} onClick={handleGraphClick}>
            <div className={styles.graph}>
              <img src="/image1.png" alt="Graph 1" />
            </div>
          </div>
          <div className={styles.rightGraphs}>
            <div className={styles.graph}>
              <img src="/image2.png" alt="Graph 2" />
            </div>
            <div className={styles.graph}>
              <img src="/image3.png" alt="Graph 3" />
            </div>
          </div>
        </div>
      </main>

      {showDraggable && (
        <div
          className={styles.draggable}
          ref={draggableRef}
          draggable="true"
          style={{ top: mousePosition.y + 'px', left: mousePosition.x + 'px' }}
        >
          <button className={styles.closeButton} onClick={handleClose}>X</button>
          <div className={styles.draggableContent}>
            <div className={styles.draggableGraph}>
              <h3 className={styles.graphTitle}>CU CFD Graph</h3>
              <img src="/image4.png" alt="CU CFD Graph" />
            </div>
            <div className={styles.draggableGraph}>
              <h3 className={styles.graphTitle}>AI CFD Graph</h3>
              <img src="/image5.png" alt="AI CFD Graph" />
            </div>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
<a href='https://github.com/philip-hub/CNV-web-app-mock-up' target="_blank">Source Code</a>
      </footer>
    </div>
  );
}
