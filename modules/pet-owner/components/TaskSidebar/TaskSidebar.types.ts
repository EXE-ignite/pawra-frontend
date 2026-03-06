import { Task, HealthMilestone } from '../../types';

export interface PetFilterItem {
  id: string;
  name: string;
}

export interface TaskSidebarProps {
  selectedDate: string | null;
  tasks: Task[];
  milestones: HealthMilestone[];
  pets?: PetFilterItem[];
  selectedPetId?: string | null;
  onPetFilterChange?: (petId: string | null) => void;
  onAddTask?: () => void;
  onToggleTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onEditTask?: (taskId: string) => void;
  onClose?: () => void;
}
