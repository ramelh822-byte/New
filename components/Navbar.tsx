import Link from 'next/link';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🌍</span>
          <span className={styles.logoText}>Planet Leads Academy</span>
        </Link>

        <div className={`${styles.links} ${open ? styles.linksOpen : ''}`}>
          <Link href="/courses" className={styles.link} onClick={() => setOpen(false)}>Courses</Link>
          <Link href="/ai-tutor" className={`${styles.link} ${styles.aiLink}`} onClick={() => setOpen(false)}>🤖 AI Tutor</Link>
          <Link href="/#features" className={styles.link} onClick={() => setOpen(false)}>Features</Link>
          <Link href="/#pricing" className={styles.link} onClick={() => setOpen(false)}>Pricing</Link>
        </div>

        <div className={`${styles.actions} ${open ? styles.actionsOpen : ''}`}>
          <a href="https://app.gumroad.com/library" target="_blank" rel="noopener noreferrer" className={styles.signIn}>
            My Courses
          </a>
          <Link href="/courses" className={styles.cta} onClick={() => setOpen(false)}>
            Get Started
          </Link>
        </div>

        <button
          className={styles.burger}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.bar} ${open ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${open ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${open ? styles.barOpen3 : ''}`} />
        </button>
      </div>
    </nav>
  );
}

