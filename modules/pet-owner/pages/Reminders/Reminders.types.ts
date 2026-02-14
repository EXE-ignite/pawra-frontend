import { CalendarEvent, Task, HealthMilestone } from '../../types';

export interface RemindersPageProps {
  events: CalendarEvent[];
  tasks: Task[];
  milestones: HealthMilestone[];
  onDateSelect?: (date: string) => void;
  onAddTask?: () => void;
  onToggleTask?: (taskId: string) => void;
}
