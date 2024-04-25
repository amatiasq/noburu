import { z } from 'zod';

export type RecipeId = `snowflake RecipeId`;
export const RecipeId = z.string() as any as z.ZodEnum<[RecipeId]>;
