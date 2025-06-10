import { useForm, UseFormProps, UseFormReturn, FieldValues } from "react-hook-form";

export function useAppForm<T extends FieldValues>(options?: UseFormProps<T>): UseFormReturn<T> {
  return useForm<T>(options);
}