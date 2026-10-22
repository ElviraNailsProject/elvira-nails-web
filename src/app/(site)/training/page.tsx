import Link from "next/link";
import { PublicCasesFrame } from "@/features/student-cases/public/PublicCases";
import styles from "@/features/student-cases/public/public-cases.module.css";

export default function TrainingPage() {
  return (
    <PublicCasesFrame locale="EN">
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Elvira · Professional training</p>
        <h1>Training</h1>
        <Link className={styles.button} href="/student-cases?locale=en">
          Student results <span aria-hidden="true">↗</span>
        </Link>
      </header>
    </PublicCasesFrame>
  );
}
