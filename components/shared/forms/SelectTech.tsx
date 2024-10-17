// SelectTech.tsx
"use client";
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { userSearchSchema } from "@/lib/validations";
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

interface User {
  id: string;
  name: string;
}

interface Props {
  users: User[]; // Обратите внимание, что здесь мы типизируем массив users как массив объектов User
  setSelectedUser: (user: User) => void; // Типизируем setSelectedUser, чтобы он ожидал объект User
}

export default function SelectTech({ users, setSelectedUser }: Props) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof userSearchSchema>>({
    resolver: zodResolver(userSearchSchema),
    defaultValues: {
      userName: "",
      id: "",
    },
  });

  // Обработчик выбора техников
  function handleUserSelect(id: string) {
    const selectedUser = users.find(user => user.id === id); // Ищем пользователя по id
    if (selectedUser) {
      setSelectedUser(selectedUser); // Устанавливаем выбранного пользователя
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4 w-full mx-auto">
        <div className='flex gap-6'>
          <div className="w-full">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormControl>
                    <div className="flex">
                      <Select onValueChange={handleUserSelect}>
                        <SelectTrigger className="w-full focus:outline-none bg-dark-600 border-0">
                          <SelectValue placeholder="Tech's name" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-400 p-0 text-white border-0">
                          <SelectGroup className="py-4">
                            {users.map(user => (
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
  );
}
