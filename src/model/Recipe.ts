import { z } from 'zod';
import { IngredientUsage } from './IngredientUsage';
import { RecipeId } from './RecipeId';
import { RecipeUnit } from './RecipeUnit';
import { RecipeUsage } from './RecipeUsage';

export interface Recipe {
  id: RecipeId;
  name: string;
  amount: number;
  unit: RecipeUnit;
  cost: number;
  recipes: RecipeUsage[];
  ingredients: IngredientUsage[];
}

export const Recipe: z.ZodType<Omit<Recipe, 'id'>> = z.object({
  name: z.string(),
  amount: z.number(),
  unit: z.enum(RecipeUnit),
  cost: z.number(),
  recipes: z.array(RecipeUsage),
  ingredients: z.array(IngredientUsage),
});

export function calculateRecipeCost(
  recipe: Recipe | null | undefined,
  amount: number
): number {
  if (!recipe) return -1;
  if (!amount) return 0;
  return recipe.amount ? (recipe.cost / recipe.amount) * amount : 0;
}
