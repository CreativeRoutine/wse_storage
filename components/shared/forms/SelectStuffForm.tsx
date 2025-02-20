

// components/shared/forms/SelectTechWrapper.tsx
"use client";

import React, { useState } from "react";
import SelectTech from "@/components/shared/forms/SelectTech"; // Логический клиентский компонент

interface User {
  id: string;
  name: string;
}

interface Props {
  users: any; // Список пользователей, переданный с сервера
  setUser: any;
}

const SelectStuffForm = ({ users, setUser }:Props) => {

  return (
    <div>
      <SelectTech users={users} setUser={setUser} />

    </div>
  );
};

export default SelectStuffForm;