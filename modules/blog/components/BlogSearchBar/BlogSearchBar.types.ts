export interface BlogSearchBarProps {
  value: string;
  onSearch: (query: string) => void;
  onFilterClick: () => void;
  onCreateClick: () => void;
}
