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
            <p className="text-base  text-slate-500 font-normal">
              Return: <span className="text-black font-bold pl-2"> Yes</span>
            </p>
            <p className="text-base  text-slate-500 font-normal">
              Reason:{" "}
              <span className="text-black font-bold pl-2">
                {" "}
                "Prints blank pages"
              </span>
            </p>
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
                value="dirty inside"
                aria-label="Toggle strikethrough"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                Dirty inside
              </ToggleGroupItem>
              <ToggleGroupItem
                value="bended"
                aria-label="Toggle strikethrough"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                Bended
              </ToggleGroupItem>
              <ToggleGroupItem
                value="missing parts"
                aria-label="Toggle strikethrough"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                Missing parts
              </ToggleGroupItem>
              <ToggleGroupItem
                value="parts"
                aria-label="Toggle strikethrough"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                For parts
              </ToggleGroupItem>
            </ToggleGroup>

            {/* WORKABLE */}

            <h3 className="mb-3 font-semibold">Printer workable:</h3>
            <ToggleGroup
              type="multiple"
              size="lg"
              className="justify-start flex flex-row flex-wrap gap-2"
            >
              <ToggleGroupItem
                value="yes"
                aria-label="Toggle bold"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                Yes
              </ToggleGroupItem>
              <ToggleGroupItem
                value="no"
                aria-label="Toggle italic"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                No
              </ToggleGroupItem>
              <ToggleGroupItem
                value="dirty inside"
                aria-label="Toggle strikethrough"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                Need parts
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>


        <Separator className="bg-black" />

        {/* TAKE PRINTER APART */}

        <div className="flex flex-col">
          {/* Add part button */}
          <div className="flex  justify-between mb-3">
            <h3 className="font-bold text-md">If choosed "For parts" or "Not workable":</h3>
          <Button
            variant="outline"
            className="!bg-blue-600 text-white self-end"
          >
            Add part to storage
          </Button>
          </div>

          <div className="flex flex-row gap-2">
            <div className="w-1/3">
              Serial Number:
              <Input
                className=" outline-none"
                placeholder="Enter serial number"
              />
            </div>
            <div className="w-1/3">
              Part Name:
              <Select>
                <SelectTrigger className=" bg-white">
                  <SelectValue placeholder="Choose preview picture" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="leftSide">Left side</SelectItem>
                  <SelectItem value="rightSide">Right side</SelectItem>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="screen">Screen</SelectItem>
                  <SelectItem value="frontDoor">Front door</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-1/3 flex self-end">
              <Button type="submit" className="!bg-blue-600 text-white w-full">
                Add part to storage
              </Button>
            </div>
          </div>
        </div>
        <div>
            <ul>
                <li><span className="min-w-[120px]">"Left side"</span> - S/N 1234567890 - added to storage</li>
                <li><span className="min-w-[120px]">"Screen"</span> - S/N 1234567890 - added to storage</li>
            </ul>
        </div>

        <Separator className="bg-black" />

        {/* MISSING PARTS ADD*/}

        <div>
            <div className="flex  justify-between mb-3">
                <h3 className="font-bold text-md">If choosed "Missing parts":</h3>
                <Button
                    variant="outline"
                    className="!bg-blue-600 text-white self-end"
                >Add input</Button>
            </div>
            <div className="flex  justify-between gap-2">
              
              <Input
                className=" outline-none"
                placeholder="Serial Number"
              />

              <Button type="submit" className="!bg-blue-600 text-white w-full">Part added to printer</Button>

            </div>
        </div>

        <Separator className="bg-black" />

        {/* WORK PERFORMED */}
        <div>
        <h3 className="mb-3 font-semibold">Work Performed:</h3>
            <ToggleGroup
              type="multiple"
              size="lg"
              className="justify-start flex flex-row flex-wrap gap-2 mb-6"
            >
              <ToggleGroupItem
                value="network"
                aria-label="Toggle bold"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                Network
              </ToggleGroupItem>
              <ToggleGroupItem
                value="topRoll"
                aria-label="Toggle italic"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                Top roll
              </ToggleGroupItem>
              <ToggleGroupItem
                value="tray Roll"
                aria-label="Toggle strikethrough"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                Tray roll
              </ToggleGroupItem>
              <ToggleGroupItem
                value="laserGuard"
                aria-label="Toggle strikethrough"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
               Laser guard
              </ToggleGroupItem>
              <ToggleGroupItem
                value="solenoid"
                aria-label="Toggle strikethrough"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                Solenoid
              </ToggleGroupItem>
              <ToggleGroupItem
                value="topSolenoid"
                aria-label="Toggle strikethrough"
                className="bg-white data-[state=on]:bg-black data-[state=on]:text-white"
              >
                Top solenoid
              </ToggleGroupItem>
            </ToggleGroup>

        </div>

        <Button variant="outline" className="!bg-green-600 text-white">
          Finish Time
        </Button>
      </form>
    </Form>
  );
}
