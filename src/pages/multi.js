import Head from 'next/head';
import styles from '../styles/Home.module.css';
import NavBar from '../components/NavBar';

export default function Multi() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Multifile Sample Analysis</title>
        <meta name="description" content="Multifile Sample Analysis Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Multifile Sample Analysis
        </h1>
        <p className={styles.description}>
          This is the Multifile Sample Analysis page.
        </p>
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
