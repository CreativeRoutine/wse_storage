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
                Serial number:
              </FormLabel>
              <FormControl>
                <div className="flex flex-row gap-2">
                  <Input
                    className="w-2/3 ouline-none"
                    placeholder="use scanner"
                    {...field}
                  />
                  <Button className="!bg-green-600 text-white font-bold text-md w-1/3">
                    Find / start
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
          <div className="w-1/2">
            <Image
              src="/assets/printers_preview/281.png"
              width={160}
              height={160}
              alt="Printer"
              className=""
            />
            <p className="text-base  text-slate-500 mb-1 font-normal">
              Printer: <span className="text-black font-bold pl-2">281 DN</span>
            </p>
            <p className="text-base  text-slate-500 font-normal">
              S/N:{" "}
              <span className="text-black font-bold pl-2"> TB4726783VB</span>
            </p>
            <p className="text-base text-slate-500 font-normal">
              Tech's name: <span className="text-black font-bold pl-2"> John</span>
            </p>

                    {/* Broken while cleaning */}
        
            <h3 className="mt-8 mb-2 font-semibold">Broken while cleaning</h3>
            <div className="flex flex-row gap-2">

                <Select>
                    <SelectTrigger className=" bg-white">
                        <SelectValue placeholder="Mention broken part" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectItem value="screen">screen</SelectItem>
                        <SelectItem value="front">Front doors</SelectItem>
                        <SelectItem value="tray">Tray</SelectItem>
                        <SelectItem value="Rear doors">Screen</SelectItem>
                    </SelectContent>
                </Select>

                <Button className="!bg-blue-500 text-white font-bold text-md w-1/3">
                Add
                </Button>
            </div>
        

          </div>



          {/* Printer Basic overview */}
          <div className="w-1/2">
            {/* CONDITION */}
            <h3 className="mb-3 font-semibold">Printer' Condition:</h3>
            <ToggleGroup
              type="multiple"
              size="lg"
              className="justify-start flex flex-row flex-wrap gap-2 mb-6"
            >
              <ToggleGroupItem
                value="clean"
                aria-label="Toggle bold"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                Clean
              </ToggleGroupItem>
              <ToggleGroupItem
                value="dirty"
                aria-label="Toggle italic"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                Dirty
              </ToggleGroupItem>
              <ToggleGroupItem
                value="Scratched"
                aria-label="Toggle strikethrough"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                Scratched
              </ToggleGroupItem>
              <ToggleGroupItem
                value="missing parts"
                aria-label="Toggle strikethrough"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                Missing parts
              </ToggleGroupItem>

            </ToggleGroup>

            {/* WORKABLE */}

            <h3 className="mb-3 font-semibold">Works performed:</h3>
            <ToggleGroup
              type="multiple"
              size="lg"
              className="justify-start flex flex-row flex-wrap gap-2"
            >
              <ToggleGroupItem
                value="cleaned"
                aria-label="Toggle Cleaned"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                Cleaned
              </ToggleGroupItem>

              <ToggleGroupItem
                value="tested"
                aria-label="Toggle italic"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                Tested
              </ToggleGroupItem>
              <ToggleGroupItem
                value="packed"
                aria-label="Toggle strikethrough"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                Packed
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>


        <Separator className="bg-black" />



        <div className="flex flex-row gap-2 ">
        <Button variant="outline" className="!bg-orange-600 text-white">
          Finish Later
        </Button>
        <Button variant="outline" className="!bg-green-600 text-white">
          Completed
        </Button>
        </div>
      </form>
    </Form>
  );
}
