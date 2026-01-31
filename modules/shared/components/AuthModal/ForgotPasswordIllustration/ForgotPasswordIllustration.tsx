'use client';

import React from 'react';
import styles from './ForgotPasswordIllustration.module.scss';

export function ForgotPasswordIllustration() {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundShapes}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
        <div className={styles.shape3}></div>
      </div>
      
      <div className={styles.illustrationContent}>
        <div className={styles.signpost}>
          <div className={styles.signpostPost}></div>
          <div className={styles.signpostBar}></div>
          <div className={styles.sign}>
            <div className={styles.signTitle}>Forgot Password?</div>
            <div className={styles.signForm}>
              <div className={styles.signInput}>
                <div className={styles.signIcon}></div>
                <div className={styles.signLine}></div>
              </div>
              <div className={styles.signButton}></div>
            </div>
          </div>
        </div>
        
        <div className={styles.catContainer}>
          <div className={styles.cat}>
            <div className={styles.catBody}></div>
            <div className={styles.catHead}>
              <div className={styles.catEyes}>
                <div className={styles.eye}></div>
                <div className={styles.eye}></div>
              </div>
              <div className={styles.catNose}></div>
            </div>
            <div className={styles.catPaws}>
              <div className={styles.paw}></div>
              <div className={styles.paw}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
