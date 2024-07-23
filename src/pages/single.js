import Head from 'next/head';
import styles from '../styles/Analysis.module.css';
import NavBar from '../components/NavBar';

export default function Single() {
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
          <div className={styles.graph}>
            <img src="/image1.png" alt="Graph 1" />
          </div>
          <div className={styles.graph}>
            <img src="/image2.png" alt="Graph 2" />
          </div>
          <div className={styles.graph}>
            <img src="/image3.png" alt="Graph 3" />
          </div>
        </div>
      </main>

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
