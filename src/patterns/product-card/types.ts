export interface ProductCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  brand?: string;
  vendor?: string;
  imageUrl?: string;
  imageAlt?: string;
  price?: string;
  currency?: string;
  badges?: readonly string[];
  meta?: readonly {
    label: string;
    value: string;
  }[];
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPress?: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}
