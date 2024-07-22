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
          This is the about page.
        </p>
        <Link href="/">
          <a>Go back to home</a>
        </Link>
      </main>
    </div>
  )
}
