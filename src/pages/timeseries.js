import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Timeseries() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Timeseries Analysis</title>
        <meta name="description" content="Timeseries Analysis Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Timeseries Analysis
        </h1>
        <p className={styles.description}>
          This is the Timeseries Analysis page.
        </p>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
