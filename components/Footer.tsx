import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span>🌍</span>
              <span className={styles.logoText}>Planet Leads Academy</span>
            </Link>
            <p className={styles.tagline}>
              Master Any Skill With AI Guidance. Personalized learning paths that adapt to you — available anywhere, anytime.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.social} aria-label="Twitter/X">𝕏</a>
              <a href="#" className={styles.social} aria-label="LinkedIn">in</a>
              <a href="#" className={styles.social} aria-label="YouTube">▶</a>
              <a href="#" className={styles.social} aria-label="Instagram">📷</a>
            </div>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Courses</h4>
            <ul className={styles.colLinks}>
              <li><Link href="/courses">Faith &amp; Spirituality</Link></li>
              <li><Link href="/courses">Languages</Link></li>
              <li><Link href="/courses">Music</Link></li>
              <li><Link href="/courses">Programming</Link></li>
              <li><Link href="/courses">Business</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Company</h4>
            <ul className={styles.colLinks}>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Support</h4>
            <ul className={styles.colLinks}>
              <li><a href="#">Help Center</a></li>
              <li><a href="mailto:planetleads1@gmail.com">Contact</a></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Planet Leads Academy. All rights reserved.</p>
          <p className={styles.sub}>Brooklyn, NY · planetleads1@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}
