import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Burger } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBurgerName = (burger: Burger): string => {
  return typeof burger.name === 'string' ? burger.name : burger.name.ko;
};

export const getNutritionalValue = (value: any): string => {
  if (!value) return 'N/A';
  return typeof value === 'object' ? `${value.value}${value.unit}` : `${value}g`;
};
