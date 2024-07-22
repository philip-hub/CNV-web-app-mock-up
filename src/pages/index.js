import Head from 'next/head';
import styles from '../styles/Home.module.css';
import FileUpload from '../components/FileUpload';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Welcome to the home page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to My Next.js App
        </h1>
        <p className={styles.description}>
          This is the home page of the application.
        </p>
        <FileUpload />
      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  );
}
