import React from "react";
import SelectTechWrapper from "@/components/shared/forms/SelectStuffForm";

interface Props {
  users: any;
  setUser: any;
}

export default function StuffForm({ users, setUser }: Props) {
  return (
    <SelectTechWrapper users={users} setUser={setUser} />
  );
}