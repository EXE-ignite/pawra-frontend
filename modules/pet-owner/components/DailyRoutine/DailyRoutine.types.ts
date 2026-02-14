import { RoutineActivity } from '../../types';

export interface DailyRoutineProps {
  activities: RoutineActivity[];
  onToggle?: (activityId: string) => void;
  onEdit?: () => void;
}
