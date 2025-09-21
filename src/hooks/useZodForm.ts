import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, type UseFormProps, useForm } from "react-hook-form";
import type { z } from "zod";

export function useZodForm<
  T extends z.ZodType<FieldValues, FieldValues>,
  TContext = unknown,
>(
  schema: T,
  props?: Omit<UseFormProps<z.input<T>, TContext, z.output<T>>, "resolver">
) {
  return useForm({
    resolver: zodResolver(schema),
    ...props,
  });
}
