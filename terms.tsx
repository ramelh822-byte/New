import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './legal.module.css';

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms of Service — Planet Leads Academy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.page}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link> / Terms of Service
            </div>
            <h1 className={styles.title}>Terms of Service</h1>
            <p className={styles.updated}>Last updated: January 1, 2025</p>

            <div className={styles.content}>
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing and using Planet Leads Academy, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

              <h2>2. Course Access</h2>
              <p>Upon purchasing a course, you receive lifetime access to that course content. Access is granted to you personally and may not be shared, transferred, or resold.</p>

              <h2>3. Intellectual Property</h2>
              <p>All course content, including videos, PDFs, and AI-powered materials, is the property of Planet Leads Academy and is protected by copyright law. You may not reproduce, distribute, or create derivative works without our express written permission.</p>

              <h2>4. AI Tutor Usage</h2>
              <p>Our AI Tutor is provided for educational purposes only. You agree not to use the AI Tutor to generate harmful, illegal, or inappropriate content. We reserve the right to suspend access for misuse.</p>

              <h2>5. Refund Policy</h2>
              <p>Due to the digital nature of our products, all sales are final. If you experience technical issues accessing your course, please contact us at planetleads1@gmail.com and we will work to resolve the issue promptly.</p>

              <h2>6. Limitation of Liability</h2>
              <p>Planet Leads Academy provides educational content for informational purposes. We are not responsible for outcomes resulting from applying course knowledge. Results may vary based on individual effort and circumstances.</p>

              <h2>7. Contact</h2>
              <p>Questions about these Terms? Contact us at <a href="mailto:planetleads1@gmail.com">planetleads1@gmail.com</a>. Planet Leads Academy · Brooklyn, NY · (347) area code.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
