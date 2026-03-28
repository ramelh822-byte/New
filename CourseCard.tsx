import { Course } from '../data/courses';
import styles from './CourseCard.module.css';

interface Props {
  course: Course;
  showCategory?: boolean;
}

export default function CourseCard({ course, showCategory = true }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.emoji}>{course.emoji}</span>
        {showCategory && <span className={styles.category}>{course.category}</span>}
      </div>
      <h3 className={styles.title}>{course.title}</h3>
      <p className={styles.desc}>{course.description}</p>
      <div className={styles.footer}>
        <span className={styles.price}>${course.price.toFixed(2)}</span>
        <a
          href={course.gumroadLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btn}
        >
          Enroll Now
        </a>
      </div>
    </div>
  );
}
