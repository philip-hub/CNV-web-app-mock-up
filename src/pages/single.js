import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Single() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Single Sample Analysis</title>
        <meta name="description" content="Single Sample Analysis Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Single Sample Analysis
        </h1>
        <p className={styles.description}>
          This is the Single Sample Analysis page.
        </p>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
