import { CalendarEvent, Task, HealthMilestone } from '../../types';

export interface PetFilterItem {
  id: string;
  name: string;
}

export interface RemindersPageProps {
  events: CalendarEvent[];
  tasks: Task[];
  milestones: HealthMilestone[];
  pets?: PetFilterItem[];
  onDateSelect?: (date: string) => void;
  onAddTask?: () => void;
  onToggleTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onEditTask?: (taskId: string) => void;
}
