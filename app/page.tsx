import Link from 'next/link';
import { Button } from '@/modules/shared';
import styles from './page.module.scss';

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          Welcome to Pawra 🐾
        </h1>
        <p className={styles.subtitle}>
          Your comprehensive pet healthcare management platform
        </p>
        <div className={styles.cta}>
          <Link href="/pet-owner">
            <Button variant="primary" size="lg">
              Pet Owner Dashboard
            </Button>
          </Link>
          <Link href="/vet">
            <Button variant="secondary" size="lg">
              Veterinarian Portal
            </Button>
          </Link>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🏥</div>
          <h3 className={styles.featureTitle}>Health Tracking</h3>
          <p className={styles.featureText}>
            Keep track of your pet's health records, vaccinations, and medical history
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📅</div>
          <h3 className={styles.featureTitle}>Easy Scheduling</h3>
          <p className={styles.featureText}>
            Book and manage appointments with veterinarians effortlessly
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>💊</div>
          <h3 className={styles.featureTitle}>Medication Reminders</h3>
          <p className={styles.featureText}>
            Never miss a dose with automated medication reminders
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📱</div>
          <h3 className={styles.featureTitle}>Mobile Access</h3>
          <p className={styles.featureText}>
            Access your pet's information anytime, anywhere
          </p>
        </div>
      </div>
    </div>
  );
}

