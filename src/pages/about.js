// src/pages/about.js
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function About() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          About Page
        </h1>
        <p className={styles.description}>
          Made by Philip Pounds with extensive help from Dr. Karol Szlatcha and Dr. Gang Wu At St Jude Childrens Research Hospital in Memphis TN.
        </p>
        <Link href="/">
          <a>Go back to home</a>
        </Link>
      </main>
    </div>
  )
}
