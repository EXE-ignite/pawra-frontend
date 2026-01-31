'use client';

import React from 'react';
import styles from './Illustration.module.scss';

interface IllustrationProps {
  mode: 'signin' | 'signup';
}

export function Illustration({ mode }: IllustrationProps) {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundShapes}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
        <div className={styles.shape3}></div>
      </div>
      
      <div className={styles.illustrationContent}>
        {mode === 'signin' ? (
          <>
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
            <div className={styles.armchair}></div>
            <div className={styles.laptop}></div>
            <div className={styles.cactus}>
              <div className={styles.cactusPot}></div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.speechBubble}>
              <p>You better fill all the information</p>
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
            <div className={styles.armchair}></div>
            <div className={styles.laptop}></div>
          </>
        )}
      </div>
    </div>
  );
}
