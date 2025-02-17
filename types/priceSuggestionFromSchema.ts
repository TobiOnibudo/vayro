import { z } from "zod";

export const CONDITIONS = {
  new: 'New',
  used: 'Used',
} as const;

export const CATEGORIES = {
  furniture: 'Furniture',
  electronics: 'Electronics',
  books: 'Books',
  clothing: 'Clothing',
  sports: 'Sports',
  toys: 'Toys',
  home: 'Home',
  garden: 'Garden',
  tools: 'Tools',
  other: 'Other',
} as const;

/**
 * NOTE: this might seem odd but I tried to avoid enum as much as possible as it is a bad pattern in TS.
 * Instead, we use `as const` to make the values immutable and to make sure that we are using the correct values.
 * Then, we use `as [typeof CONDITIONS[keyof typeof CONDITIONS], ...typeof CONDITIONS[keyof typeof CONDITIONS][]]`
 * to make sure that the values are of the correct type.
 * Read more about this pattern here: https://dev.to/maafaishal/you-might-not-need-typescript-enum-1f4n
 */

export type Condition = typeof CONDITIONS[keyof typeof CONDITIONS];
export type Category = typeof CATEGORIES[keyof typeof CATEGORIES];

export const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  condition: z.enum(Object.values(CONDITIONS) as [Condition, ...Condition[]]),  
  category: z.enum(Object.values(CATEGORIES) as [Category, ...Category[]]),  
  boughtInYear: z.number().min(1900).max(new Date().getFullYear()),
});

export type FormSchema = z.infer<typeof schema>;