export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Category {
  id: string;
  name: string;
  words: string[];
}

export interface MenuButtonProps {
  title: string;
  onPress: () => void;
  iconName?: string;
  disabled?: boolean;
}

export interface CategoryItemProps {
  category: Category;
  selected: boolean;
  onToggle: () => void;
}

export interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
}
