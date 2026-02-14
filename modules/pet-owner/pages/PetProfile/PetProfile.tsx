'use client';

import React from 'react';
import { PetProfilePageProps } from './PetProfile.types';
import {
  PetProfileHeader,
  HealthRecords,
  GrowthChart,
  DailyRoutine,
  DocumentVault,
} from '../../components';
import styles from './PetProfile.module.scss';

export function PetProfilePage({
  petProfile,
  onShareProfile,
  onLogEntry,
  onEditHealth,
  onEditGrowth,
  onEditRoutine,
  onUploadDocument,
  onViewDocument,
  onToggleActivity,
}: PetProfilePageProps) {
  const weightChange = petProfile.weightHistory.length >= 2
    ? petProfile.weightHistory[petProfile.weightHistory.length - 1].weight -
      petProfile.weightHistory[0].weight
    : 0;

  return (
    <div className={styles.container}>
      <PetProfileHeader
        name={petProfile.name}
        breed={petProfile.breed}
        age={petProfile.age}
        ageMonths={petProfile.ageMonths}
        weight={petProfile.weight || 0}
        imageUrl={petProfile.imageUrl}
        onShareProfile={onShareProfile}
        onLogEntry={onLogEntry}
      />

      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <HealthRecords
            vaccinations={petProfile.vaccinations}
            medications={petProfile.medications}
            onEdit={onEditHealth}
          />

          <DailyRoutine
            activities={petProfile.routine}
            onToggle={onToggleActivity}
            onEdit={onEditRoutine}
          />
        </div>

        <div className={styles.rightColumn}>
          <GrowthChart
            weightHistory={petProfile.weightHistory}
            currentWeight={petProfile.weight || 0}
            weightChange={weightChange}
            onEdit={onEditGrowth}
          />

          <DocumentVault
            documents={petProfile.documents}
            onUpload={onUploadDocument}
            onView={onViewDocument}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          {petProfile.name}'s Profile • ID: PET-{petProfile.id} • Last synced: 2 minutes ago
        </p>
      </div>
    </div>
  );
}
