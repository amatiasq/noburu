import { z } from 'zod';
import { Recipe, calculateRecipeCost } from './Recipe';
import { RecipeId } from './RecipeId';
import { RecipeUnit } from './RecipeUnit';

export interface RecipeUsage extends Omit<Recipe, 'ingredients' | 'recipes'> {
  recursive?: boolean;
}

export const RecipeUsage = z.object({
  id: RecipeId,
  name: z.string(),
  amount: z.number(),
  unit: z.enum(RecipeUnit),
  cost: z.number(),
  recursive: z.boolean().optional(),
});

export function recipeToUsage(recipe: Recipe): RecipeUsage {
  return {
    id: recipe.id,
    name: recipe.name,
    cost: 0,
    amount: '' as any,
    unit: recipe.unit,
  };
}

export function calculateRecipesCost(
  root: RecipeId,
  recipes: RecipeUsage[],
  all: Recipe[]
): number {
  for (const recipe of recipes) {
    recipe.recursive = false;

    const match = all.find((x) => x.id === recipe.id);
    const recursives = match?.recipes?.filter((x) => x.id === root);

    if (recipe.id === root || recursives?.length) {
      recipe.recursive = true;
      console.warn('Recursive recipe', recipe.id);
      continue;
    }

    recipe.cost = calculateRecipeCost(match, recipe.amount);
  }

  return recipes.reduce((sum, x) => sum + x.cost, 0);
}
