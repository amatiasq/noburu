import { z } from 'zod';

export type IngredientId = `snowflake IngredientId`;
export const IngredientId = z.string() as unknown as z.ZodEnum<[IngredientId]>;
