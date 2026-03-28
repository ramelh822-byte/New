import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './404.module.css';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 — Page Not Found | Planet Leads Academy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.page}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.inner}>
            <span className={styles.code}>404</span>
            <h1 className={styles.title}>Page Not Found</h1>
            <p className={styles.sub}>
              This page doesn&apos;t exist — but your next skill level does.
            </p>
            <div className={styles.actions}>
              <Link href="/" className={styles.primary}>Go Home</Link>
              <Link href="/courses" className={styles.secondary}>Browse Courses</Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
