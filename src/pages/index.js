import Head from 'next/head';
import styles from '../styles/Home.module.css';
import FileUpload from '../components/FileUpload';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    if (selectedValue) {
      router.push(`/${selectedValue}`);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Welcome to the home page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
           Copy Number Analysis
        </h1>
        <p className={styles.description}>
          Upload the files and select analysis options
        </p>
        <FileUpload />
        <div style={{ marginTop: '20px' }}>
          <select value={selectedOption} onChange={handleSelectionChange}>
            <option value="" disabled>Select Analysis Type</option>
            <option value="single">Single Sample Analysis</option>
            <option value="multi">Multifile Sample Analysis</option>
            <option value="timeseries">Timeseries Analysis</option>
          </select>
        </div>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
