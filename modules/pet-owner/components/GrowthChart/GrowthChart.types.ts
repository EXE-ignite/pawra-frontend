import { WeightRecord } from '../../types';

export interface GrowthChartProps {
  weightHistory: WeightRecord[];
  currentWeight: number;
  weightChange: number;
  onEdit?: () => void;
}
