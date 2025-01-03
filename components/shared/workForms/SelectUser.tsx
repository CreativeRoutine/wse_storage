"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  SelectGroup,
} from "@/components/ui/select";
import { userSearchSchema } from "@/lib/validations";


interface Props {
  users: any;
  setUser: any;
}

export default function SelectUser({ users, setUser}: Props) {

  const form = useForm<z.infer<typeof userSearchSchema>>({
    resolver: zodResolver(userSearchSchema),
    defaultValues: {
      userName: "",
      id: "",
    },
  });


  // Обработчик выбора пользователя
  function handleUserSelect(id: string) {
    const selectedUser = users.find((user: any) => user.id === id);
    if (selectedUser) {
      setUser(selectedUser);
    }

  }

  return (
    <>
      <Form {...form}>
        <form className="space-y-4 w-full mx-auto">
          <div className="flex gap-6">
            <div className="w-full">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <div className="flex">
                      <Select
                        onValueChange={handleUserSelect}
                        defaultValue={String(field.value)}
                      >
                        
                          <SelectTrigger className="w-full border-0 bg-dark-600 focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0">
                            <SelectValue placeholder="User's name" />
                          </SelectTrigger>
                        

                        <SelectContent className="bg-dark-400 p-0 text-white border-0">
                          <SelectGroup className="py-4">
                            {users.map((user: any) => (
                              <SelectItem
                                key={user.id}
                                value={user.id}
                                className="py-2 text-white hover:bg-dark-200"
                              >
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}