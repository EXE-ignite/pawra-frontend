import { Task, HealthMilestone } from '../../types';

export interface TaskSidebarProps {
  selectedDate: string;
  tasks: Task[];
  milestones: HealthMilestone[];
  onAddTask?: () => void;
  onToggleTask?: (taskId: string) => void;
  onClose?: () => void;
}
