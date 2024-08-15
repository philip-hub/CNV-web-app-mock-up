  Project Overview

Project Overview
================

\_app.js
--------

**Location:** `src/pages/_app.js`

This file is the custom App component for your Next.js application. It is used to initialize pages and is common across all the pages in the app. The `MyApp` function receives two props: `Component` (the active page) and `pageProps` (an object with the initial props that were preloaded for your page). This file imports the global CSS file `globals.css`, which ensures consistent styling across the entire app.

    import '../styles/globals.css';
    
    function MyApp({ Component, pageProps }) {
      return <Component {...pageProps} />;
    }
    
    export default MyApp;

about.js
--------

**Location:** `src/pages/about.js`

This file represents the "About" page of the application. It includes a header and a paragraph providing information about the app and its contributors. The page also contains a link that navigates back to the home page. The file imports styles from `Home.module.css` to style the page.

    import Link from 'next/link';
    import styles from '../styles/Home.module.css';
    
    export default function About() {
      return (
        <div className={styles.container}>
          <main className={styles.main}>
            <h1 className={styles.title}>About Page</h1>
            <p className={styles.description}>
              Made by Philip Pounds with extensive help from Dr. Karol Szlatcha and Dr. Gang Wu At St Jude Childrens Research Hospital in Memphis TN.
            </p>
            <Link href="/">
              <a>Go back to home</a>
            </Link>
          </main>
        </div>
      );
    }

index.js
--------

**Location:** `src/pages/index.js`

This file is the entry point of the application, representing the home page. It includes a title, a brief description, and options for navigating to different types of CNV (Copy Number Variation) analysis. The page makes use of state to manage the selected analysis option and results from file uploads. The page imports styles from `Home.module.css` and uses the `next/head` component to manage the metadata of the page.

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
              <h1 className={styles.title}>Interactive Copy Number Analysis</h1>
              <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmRkZWE1NmFrbXZ0ZmV5d2lrZzIxN2R6YmVlbWlnM3g5ZnAzMXV1cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26tndRwnXg6AR50fS/giphy.webp"/>
              <br />
              <label className={styles.toggleButton}>
                <p><a href='single'>Single File CNV Analysis</a></p>
              </label>
              <br />
              <label className={styles.toggleButton}>
                <p><a href='single'>Multi File CNV Analysis</a></p>
              </label>
            </center>
          </main>
    
          <footer className={styles.footer}>
            <a href='https://github.com/philip-hub/CNV-web-app-mock-up' target='_blank'>Open Source Code ✨</a>
          </footer>
        </div>
      );
    }