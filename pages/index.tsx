import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import { featuredCourses } from '../data/courses';
import styles from './index.module.css';

const stats = [
  { value: '25+', label: 'Courses' },
  { value: '10K+', label: 'Students' },
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
