"use client";
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { userSearchSchema } from "@/lib/validations";
import { useRouter, usePathname } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import moment from 'moment-timezone';

interface Props {
  users: any;
  setSelectedUser: any;
}

export default function SelectTech({ users, setSelectedUser }: Props) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  const form = useForm<z.infer<typeof userSearchSchema>>({
    resolver: zodResolver(userSearchSchema),
    defaultValues: {
      userName: "",
      id: "",
    },
  });

  // Обработчик отправки
  async function onSubmit(values: z.infer<typeof userSearchSchema>) {
    setIsSubmitting(true);
    const createdOn = moment().tz("America/Chicago").toDate();
    createdOn.setHours(createdOn.getHours() - 5); 

    try {
      const response = "response"; //await createPrinter();
      setIsSubmitting(false); // Сбрасываем состояние отправки

      response ? (
        toast({
          title: "User successfully set!",
          variant: 'default',
        })
      ) : (
        toast({
          title: "User was not found in DataBase!",
          description: "Something went wrong.",
          variant: 'custom',
        })
      );
    } catch (error) {
      console.error("THIS IS AN ERROR", error); 
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">
          <div className='flex gap-6'>
            <div className="w-full">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormControl>
                      <div className="flex">
                        <Select
                          onValueChange={(id) => {
                            const selectedUser = users.find((user: { id: string }) => user.id === id);
                            if (selectedUser) {
                              setSelectedUser({
                                id: selectedUser.id,
                                name: selectedUser.name
                              });
                            }
                            form.handleSubmit(onSubmit)(); // Отправляем форму
                          }}
                        >
                          <SelectTrigger className="w-full focus:outline-none focus:ring-0 focus:shadow-none bg-dark-600 border-0">
                            <SelectValue placeholder="Tech's name" />
                          </SelectTrigger>
                          <SelectContent className="bg-dark-400 p-0 text-white border-0">
                            <SelectGroup className="py-4">
                              {users.map((user: { name: string; id: string }) => (
                                <SelectItem key={user.id} value={user.id} className='py-2 text-white hover:bg-dark-200'>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
