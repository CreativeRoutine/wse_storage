"use client";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { totalPageCountSchema } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  label: string;
  reset: boolean;
  pages: any;
  onResetComplete?: () => void;
  placeholder?: string; // Placeholder для ввода
}

export default function TotalPageCount({ label, reset, pages, placeholder = "0", onResetComplete }: Props) {
  const form = useForm<z.infer<typeof totalPageCountSchema>>({
    resolver: zodResolver(totalPageCountSchema),
    defaultValues: {
      totalPageCount: 0,

    },
  });

  useEffect(() => {
    if (reset) {
      form.reset({ totalPageCount: 0 });
      if (onResetComplete) {
        onResetComplete();
      }
    }
  }, [reset, form, onResetComplete]);

  return (
    <Form {...form}>
      <form className="space-y-4 w-full mx-auto">
        <div className="mb-4">
          <FormField
            control={form.control}
            name="totalPageCount"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center space-y-0">
                  <FormLabel
                    className={`w-2/3 text-md font-semibold ${
                      !!form.watch("totalPageCount") ? "text-green-500" : "text-slate-300"
                    }`}
                  >
                    {label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full mb-4 outline-none bg-dark-600 text-white border-0 rounded-lg no-focus text-right pr-6"
                      placeholder=""
                      {...field}
                      onChange={(e) => {
                        const value = Number(e.target.value); // Преобразование в число
                        field.onChange(e); // Обновление формы
                        pages(value); // Вызов функции из родителя
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}