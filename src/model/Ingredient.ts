import { z } from 'zod';
import type { IngredientId } from './IngredientId';
import { convert, Unit } from './Unit';

export interface Ingredient {
  id: IngredientId;
  name: string;
  pkgSize: number;
  pkgUnit: Unit;
  pkgPrice: number;
}

export const Ingredient: z.ZodType<Omit<Ingredient, 'id'>> = z.object({
  name: z.string(),
  pkgSize: z.number().positive(),
  pkgUnit: z.enum(Unit),
  pkgPrice: z.number().positive(),
});

export function calculateIngredientCost(
  ingredient: Ingredient | null | undefined,
  amount: number,
  unit: Unit
) {
  if (!ingredient) return -1;
  if (!amount || !unit) return 0;
  const base = convert(amount, unit, ingredient.pkgUnit);
  return (ingredient.pkgPrice / ingredient.pkgSize) * base;
}
