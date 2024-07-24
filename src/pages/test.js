import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import NavBar from '../components/NavBar';

// Dynamically import Plotly component with SSR disabled
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function Home() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');


  function data(){
    const x = [1, 2, 3];
    const y = [2, 6, 3];
    return x, y
  }

  

  return (
    <div className={styles.container}>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Welcome to the home page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
      <NavBar />
        <h1 className={styles.title}>
           Copy Number Analysis
        </h1>
      
        <Plot
        data={[
          {
            x: data()[0],
            y: data()[1],
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'red' },
          },
          { type: 'bar', x: [1, 2, 3], y: [2, 5, 3] },
        ]}
        layout={{ width: 320, height: 240, title: 'A Fancy Plot' }}
        />
      </main>

      <footer className={styles.footer}>
        <a href="https://github.com/philip-hub/CNV-web-app-mock-up" target="_blank">Source Code</a>
      </footer>
    </div>
  );
}
