import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormProps, useForm, type FieldValues } from "react-hook-form";
import type { z } from "zod";

export function useZodForm<
  TSchema extends z.ZodTypeAny,
  TFieldValues extends FieldValues = z.infer<TSchema> extends FieldValues
    ? z.infer<TSchema>
    : FieldValues,
  TContext = unknown,
>(
  schema: TSchema,
  props?: Omit<UseFormProps<TFieldValues, TContext>, "resolver">
) {
  // zodResolver type definitions are strict about the Zod schema input type.
  // Cast schema to `any` here to satisfy resolver overloads while keeping
  // the inferred form field type via TFieldValues.
  return useForm<TFieldValues, TContext>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    ...props,
  });
}
