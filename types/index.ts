import { MaterialCommunityIcons } from '@expo/vector-icons';
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
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
  iconName?: IconName;
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

export type AppRoute =
  | '/new-game'
  | '/categories'
  | '/settings'
  | '/ads'
  | '/players';
