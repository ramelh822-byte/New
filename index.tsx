import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import { featuredCourses } from '../data/courses';
import styles from './index.module.css';

const stats = [
  { value: '25+', label: 'Courses' },
  { value: '500+', label: 'Students' },
  { value: '4.9★', label: 'Rating' },
  { value: '95%', label: 'Completion Rate' },
];

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Learning',
    desc: 'Personalized curriculum adapts to your pace and style, ensuring you always learn at the optimal challenge level.',
  },
  {
    icon: '📚',
    title: 'Expert Content',
    desc: 'Curated by industry professionals and subject matter experts so every lesson delivers real-world applicable knowledge.',
  },
  {
    icon: '🎯',
    title: 'Goal-Oriented',
    desc: 'Structured learning paths designed to reach your specific goals — whether career advancement or personal enrichment.',
  },
  {
    icon: '💬',
    title: 'Interactive Practice',
    desc: 'Real-time feedback and conversational AI tutoring means you learn by doing, not just watching or reading.',
  },
  {
    icon: '📱',
    title: 'Learn Anywhere',
    desc: 'Access your courses on any device, anytime. Your progress syncs automatically so you never lose your place.',
  },
  {
    icon: '🏆',
    title: 'Certificates',
    desc: 'Earn recognized certificates upon course completion to showcase your new skills to employers and colleagues.',
  },
];

const plans = [
  {
    name: 'Starter',
    price: '$49.99',
    period: 'per course',
    features: [
      'Single course access',
      'AI tutor included',
      'Lifetime access',
      'Course certificate',
    ],
    cta: 'Get Started',
    href: '/courses',
    highlight: false,
  },
  {
    name: 'Professional',
    price: '$129.99',
    period: '3 courses bundle',
    features: [
      '3 course bundle',
      'Priority AI tutor',
      'All Starter features',
      'Progress analytics',
    ],
    cta: 'Get Started',
    href: '/courses',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: '$299.99',
    period: '10 courses bundle',
    features: [
      '10 course bundle',
      'Dedicated support',
      'All Pro features',
      'Team dashboard',
      'Custom learning paths',
    ],
    cta: 'Contact Us',
    href: 'https://rayhymn.gumroad.com/',
    highlight: false,
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Planet Leads Academy - Master Any Skill With AI Guidance</title>
        <meta
          name="description"
          content="Personalized AI-powered courses that adapt to your learning style. From languages to programming, faith to business — grow at your own pace."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Planet Leads Academy" />
        <meta property="og:description" content="Master Any Skill With AI Guidance" />
        <meta property="og:type" content="website" />
      </Head>

      <div className={styles.page}>
        <Navbar />

        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <div className={styles.heroBgGlow1} />
            <div className={styles.heroBgGlow2} />
            <div className={styles.heroBgGrid} />
          </div>
          <div className={styles.heroInner}>
            <span className={styles.heroBadge}>✨ AI-Powered Learning Platform</span>
            <h1 className={styles.heroTitle}>
              Master Any Skill<br />
              <span className={styles.heroTitleAccent}>With AI Guidance</span>
            </h1>
            <p className={styles.heroSub}>
              Personalized AI-powered courses that adapt to your learning style. From languages to
              programming, faith to business — grow at your own pace with expert-curated content.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/courses" className={styles.ctaPrimary}>Get Started Free</Link>
              <Link href="/courses" className={styles.ctaSecondary}>Browse Courses</Link>
            </div>
            <div className={styles.heroStats}>
              {stats.map((s) => (
                <div key={s.label} className={styles.stat}>
                  <span className={styles.statVal}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED COURSES */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>Popular</span>
              <h2 className={styles.sectionTitle}>Featured Courses</h2>
              <p className={styles.sectionSub}>Explore our most popular AI-powered courses</p>
            </div>
            <div className={styles.courseGrid}>
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            <div className={styles.sectionCta}>
              <Link href="/courses" className={styles.viewAll}>
                View All 25 Courses →
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className={styles.features} id="features">
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>Why Choose Us</span>
              <h2 className={styles.sectionTitle}>Everything You Need to Succeed</h2>
              <p className={styles.sectionSub}>Our platform is built around how people actually learn best</p>
            </div>
            <div className={styles.featuresGrid}>
              {features.map((f) => (
                <div key={f.title} className={styles.featureCard}>
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className={styles.pricing} id="pricing">
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>Pricing</span>
              <h2 className={styles.sectionTitle}>Simple, Transparent Pricing</h2>
              <p className={styles.sectionSub}>Choose the plan that fits your learning goals</p>
            </div>
            <div className={styles.plansGrid}>
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`${styles.planCard} ${plan.highlight ? styles.planHighlight : ''}`}
                >
                  {plan.badge && <span className={styles.planBadge}>{plan.badge}</span>}
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <div className={styles.planPrice}>
                    <span className={styles.planAmount}>{plan.price}</span>
                    <span className={styles.planPeriod}>{plan.period}</span>
                  </div>
                  <ul className={styles.planFeatures}>
                    {plan.features.map((f) => (
                      <li key={f} className={styles.planFeature}>
                        <span className={styles.planCheck}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  {plan.href.startsWith('http') ? (
                    <a
                      href={plan.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.planCta} ${plan.highlight ? styles.planCtaHighlight : ''}`}
                    >
                      {plan.cta}
                    </a>
                  ) : (
                    <Link
                      href={plan.href}
                      className={`${styles.planCta} ${plan.highlight ? styles.planCtaHighlight : ''}`}
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className={styles.ctaBanner}>
          <div className="container">
            <div className={styles.ctaBannerInner}>
              <h2 className={styles.ctaBannerTitle}>Ready to Start Learning?</h2>
              <p className={styles.ctaBannerSub}>
                Join hundreds of students already transforming their skills with AI-powered education.
              </p>
              <Link href="/courses" className={styles.ctaPrimary}>
                Browse All Courses →
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
