import { CalendarEvent } from '../../types';

export interface CalendarViewProps {
  month: number;
  year: number;
  events: CalendarEvent[];
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
  onMonthChange?: (month: number, year: number) => void;
  onAddTask?: () => void;
}
