import Head from 'next/head';
import styles from '../styles/Home.module.css';
import FileUpload from '../components/FileUpload';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');
  const [results, setResults] = useState(null);

  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    if (selectedValue) {
      router.push(`/${selectedValue}`);
    }
  };

  const handleFileUpload = (data) => {
    setResults(data);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Welcome to the home page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <center>
        <h1 className={styles.title}>
           Interactive Copy Number Analysis
        </h1>
        <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmRkZWE1NmFrbXZ0ZmV5d2lrZzIxN2R6YmVlbWlnM3g5ZnAzMXV1cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26tndRwnXg6AR50fS/giphy.webp"/>
      <br />
      <label className={styles.toggleButton}>
      <p><a href='single'>Single File CNV Analysis</a></p>
      </ label>

      <br />

      <br />


      <label className={styles.toggleButton}>
      <p><a href='single'>Multi File CNV Analysis</a></p>
      </ label>

      </center>

      <footer className={styles.footer}>
        <a href='https://github.com/philip-hub/CNV-web-app-mock-up' target='_blank'>Open Source Code ✨</a>
      </footer>
      </main>


    </div>
  );
}
