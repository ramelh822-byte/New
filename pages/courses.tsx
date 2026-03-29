import Head from 'next/head';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import { courses, categories } from '../data/courses';
import styles from './courses.module.css';

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const allCategories = [
    { id: 'all', label: 'All Courses', emoji: '✨' },
    ...categories.map((c) => ({ id: c.id, label: c.label, emoji: c.emoji })),
  ];

  const filtered = courses.filter((c) => {
    const matchCat =
      activeFilter === 'all' ||
      categories.find((cat) => cat.id === activeFilter)?.label === c.category;
    const matchSearch =
      search === '' ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Head>
        <title>All Courses — Planet Leads Academy</title>
        <meta
          name="description"
          content="Browse all 25 AI-powered courses across Faith, Languages, Music, Programming, and Business."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.page}>
        <Navbar />

        <main className={styles.main}>
          <div className={styles.hero}>
            <div className={styles.heroBg} />
            <div className="container">
              <h1 className={styles.title}>All Courses</h1>
              <p className={styles.sub}>
                {courses.length} AI-powered courses across {categories.length} categories
              </p>
              <div className={styles.searchWrap}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  className={styles.search}
                  type="text"
                  placeholder="Search courses…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button className={styles.searchClear} onClick={() => setSearch('')}>✕</button>
                )}
              </div>
            </div>
          </div>

          <div className="container">
            {/* Filter pills */}
            <div className={styles.filters}>
              {allCategories.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.filterBtn} ${activeFilter === cat.id ? styles.filterActive : ''}`}
                  onClick={() => setActiveFilter(cat.id)}
                >
                  <span>{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Results count */}
            {(search || activeFilter !== 'all') && (
              <p className={styles.resultCount}>
                {filtered.length} course{filtered.length !== 1 ? 's' : ''} found
                {search && <> for &quot;<strong>{search}</strong>&quot;</>}
              </p>
            )}

            {/* Category sections when no filter active */}
            {activeFilter === 'all' && search === '' ? (
              <div className={styles.categorySections}>
                {categories.map((cat) => (
                  <div key={cat.id} className={styles.catSection}>
                    <div className={styles.catHeader}>
                      <span className={styles.catEmoji}>{cat.emoji}</span>
                      <div>
                        <h2 className={styles.catTitle}>{cat.label}</h2>
                        <span className={styles.catCount}>
                          {cat.courses.length} course{cat.courses.length !== 1 ? 's' : ''} · $
                          {cat.courses[0].price.toFixed(2)} each
                        </span>
                      </div>
                    </div>
                    <div className={styles.grid}>
                      {cat.courses.map((course) => (
                        <CourseCard key={course.id} course={course} showCategory={false} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className={styles.grid}>
                {filtered.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>🔍</span>
                <p>No courses found. Try a different search or category.</p>
                <button
                  className={styles.emptyReset}
                  onClick={() => { setSearch(''); setActiveFilter('all'); }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
