import React from 'react';
import { GrowthChartProps } from './GrowthChart.types';
import styles from './GrowthChart.module.scss';

export function GrowthChart({ weightHistory, currentWeight, weightChange, onEdit }: GrowthChartProps) {
  // Simple chart visualization
  const maxWeight = Math.max(...weightHistory.map(r => r.weight));
  const minWeight = Math.min(...weightHistory.map(r => r.weight));
  const range = maxWeight - minWeight || 1;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.icon}>📈</span>
          Growth Chart
        </h2>
        {onEdit && (
          <button className={styles.editButton} onClick={onEdit}>
            ✏️
          </button>
        )}
      </div>

      <div className={styles.chartContainer}>
        <svg className={styles.chart} viewBox="0 0 400 150" preserveAspectRatio="none">
          {/* Chart line */}
          <polyline
            className={styles.chartLine}
            points={weightHistory.map((record, index) => {
              const x = (index / (weightHistory.length - 1)) * 400;
              const y = 150 - ((record.weight - minWeight) / range) * 100 - 25;
              return `${x},${y}`;
            }).join(' ')}
          />
          {/* Data points */}
          {weightHistory.map((record, index) => {
            const x = (index / (weightHistory.length - 1)) * 400;
            const y = 150 - ((record.weight - minWeight) / range) * 100 - 25;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                className={styles.chartPoint}
              />
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className={styles.xAxis}>
          {weightHistory.map((record, index) => (
            <span key={index} className={styles.axisLabel}>
              {new Date(record.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Current Weight</p>
          <p className={styles.statValue}>{currentWeight} kg</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Change (3mo)</p>
          <p className={`${styles.statValue} ${weightChange > 0 ? styles.positive : ''}`}>
            {weightChange > 0 ? '+' : ''}{weightChange} kg
          </p>
        </div>
      </div>
    </div>
  );
}
