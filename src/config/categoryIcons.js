import {
  Tag, Utensils, Car, Home, Film, Tv,
  Briefcase, Globe, Heart, Shield, BookOpen, Scissors, Coffee,
} from "lucide-react";

// Maps icon string names (stored in DB) to React components
export const ICON_MAP = {
  tag: Tag,
  utensils: Utensils,
  car: Car,
  home: Home,
  film: Film,
  tv: Tv,
  briefcase: Briefcase,
  globe: Globe,
  heart: Heart,
  shield: Shield,
  book: BookOpen,
  scissors: Scissors,
  coffee: Coffee,
};

// Flat array for icon picker UI in modals
export const AVAILABLE_ICONS = Object.entries(ICON_MAP).map(([name, icon]) => ({
  name,
  icon,
}));

// Returns a component for a given icon name, falls back to Tag
export const getIconComponent = (iconName) => ICON_MAP[iconName] ?? Tag;
