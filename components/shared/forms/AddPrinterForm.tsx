"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  //   CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import { CheckIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function ProfileForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  // 3. Render the form.
  return (
    <Form {...form}>
        
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-[640px] mx-auto"
      >
        {/* Start Time */}

        {/* Item #1 */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            // First Input
            <FormItem>
              <FormLabel className="mb-2 font-semibold">
                Pallet number:
              </FormLabel>

              <FormControl>
                <div className="flex flex-row gap-2">
                  <Input
                    className="w-2/3 ouline-none"
                    placeholder="use scanner"
                    {...field}
                  />
                  <Button className="!bg-green-600 text-white font-bold text-md w-1/3">
                    Add
                  </Button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* PREVIEW / CONDITION WORKABLE */}

        <div className="flex flex-row gap-2">
          {/* Printer preview */}
          <div className="flex flex-row gap-2">
            <div className="w-1/3">
              Serial Number:
              <Input
                className=" outline-none"
                placeholder="Enter serial number"
              />
            </div>
            <div className="w-1/3">
              Printer make:
              <Select>
                <SelectTrigger className=" bg-white">
                  <SelectValue placeholder="Choose printer" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="120">120</SelectItem>
                  <SelectItem value="277">277</SelectItem>
                  <SelectItem value="255">255</SelectItem>
                  <SelectItem value="477">477</SelectItem>
                  <SelectItem value="4015">4015</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/3">
              Printer model:
              <Select>
                <SelectTrigger className=" bg-white">
                  <SelectValue placeholder="Choose model" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="D">D</SelectItem>
                  <SelectItem value="DN">DN</SelectItem>
                  <SelectItem value="DNE">DNE</SelectItem>
                  <SelectItem value="FDW">FDW</SelectItem>
                  <SelectItem value="FN">FN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            

          </div>
            <div className="w-1/3 flex self-end">
              <Button type="submit" className="!bg-blue-600 text-white w-full">
                Add to current pallet
              </Button>
            </div>
        </div>


        <Separator className="bg-black" />



        <div className="flex flex-row gap-2 ">

        <Button variant="outline" className="!bg-green-600 text-white">
        Finish Pallet
        </Button>
        </div>
      </form>
    </Form>
  );
}
