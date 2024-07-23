import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';
import styles from '../styles/Analysis.module.css';
import NavBar from '../components/NavBar';

export default function Multi() {
  const [showDraggable, setShowDraggable] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [view, setView] = useState('general');
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

  const handleViewChange = (event) => {
    setView(event.target.value);
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

  const renderGraphs = () => {
    switch(view) {
      case 'general':
        return (
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
        );
      case 'heatmap':
        return (
          <div className={styles.graphContainer}>
            <div className={styles.leftGraph} onClick={handleGraphClick}>
              <div className={styles.graph}>
                <img src="/image6.png" alt="Graph 1" />
              </div>
            </div>
            <div className={styles.rightGraphs}>
              <div className={styles.graph}>
                <img src="/image7.png" alt="Graph 2" />
              </div>
              <div className={styles.graph}>
                <img src="/image8.png" alt="Graph 3" />
              </div>
            </div>
          </div>
        );
      case 'showall':
        return (
          <div className={styles.showAllContainer}>
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
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Multifile Sample Analysis</title>
        <meta name="description" content="Multifile Sample Analysis Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <main className={styles.main}>
        <div className={styles.dropdownContainer}>
          <select onChange={handleViewChange} value={view} className={styles.dropdown}>
            <option value="general">General</option>
            <option value="heatmap">Heat Map</option>
            <option value="showall">Show All</option>
          </select>
        </div>
        {renderGraphs()}
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
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <img src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
