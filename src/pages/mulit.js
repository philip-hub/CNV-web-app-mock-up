import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Multi() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Multifile Sample Analysis</title>
        <meta name="description" content="Multifile Sample Analysis Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Multifile Sample Analysis
        </h1>
        <p className={styles.description}>
          This is the Multifile Sample Analysis page.
        </p>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
