import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './legal.module.css';

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy — Planet Leads Academy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.page}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link> / Privacy Policy
            </div>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.updated}>Last updated: January 1, 2025</p>

            <div className={styles.content}>
              <h2>1. Information We Collect</h2>
              <p>Planet Leads Academy collects information you provide directly to us when you purchase a course, contact us, or use our AI tutor feature. This may include your name, email address, and payment information processed securely through Gumroad.</p>

              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.</p>

              <h2>3. AI Tutor Conversations</h2>
              <p>Conversations with our AI Tutor are powered by Anthropic&apos;s Claude AI. Messages sent to the AI Tutor are processed by Anthropic in accordance with their privacy policy. We do not permanently store your AI tutor conversations on our servers.</p>

              <h2>4. Payment Processing</h2>
              <p>All payments are processed through Gumroad. We do not store your credit card or payment information. Please review Gumroad&apos;s privacy policy for information on how they handle your payment data.</p>

              <h2>5. Cookies</h2>
              <p>We use cookies and similar tracking technologies to track activity on our service and hold certain information to improve your experience.</p>

              <h2>6. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:planetleads1@gmail.com">planetleads1@gmail.com</a>.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
