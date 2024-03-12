import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { Input } from "@/components/ui/input";

import Link from "next/link";
import Image from "next/image";
import AddUserForm from "@/components/shared/forms/AddUserForm";

const employees = [
  {
    name: "John Doe",
    role: "tech",
    printersDone: 101,
    printersReturned: 0,
    reasonForReturn: "bad fuser",
    percentReturned: 0.0,
  },
  {
    name: "Jane Smith",
    role: "cleaner",
    printersDone: 83,
    printersReturned: 5,
    reasonForReturn: "miss some part",
    percentReturned: 6.02,
  },
  {
    name: "Alex Johnson",
    role: "tech",
    printersDone: 142,
    printersReturned: 5,
    reasonForReturn: "problems with screen",
    percentReturned: 3.52,
  },
  {
    name: "Maria Garcia",
    role: "tech",
    printersDone: 73,
    printersReturned: 4,
    reasonForReturn: "bad fuser",
    percentReturned: 5.48,
  },
  {
    name: "Michael Brown",
    role: "cleaner",
    printersDone: 83,
    printersReturned: 8,
    reasonForReturn: "dirty",
    percentReturned: 9.64,
  },
  {
    name: "Isabella Anderson",
    role: "cleaner",
    printersDone: 83,
    printersReturned: 3,
    reasonForReturn: "dirty",
    percentReturned: 9.64,
  },
  {
    name: "Olivia Martinez",
    role: "tech",
    printersDone: 67,
    printersReturned: 4,
    reasonForReturn: "bad fuser",
    percentReturned: 5.48,
  },
];

const parts = [
  { name: "left side", belongsToModels: [148, 130, 1515] },
  {
    name: "right side",
    belongsToModels: [4200, 4250, 4300, 252, 255, 277, 4014, 4015],
  },
  { name: "top", belongsToModels: [452, 454] },
  { name: "tray", belongsToModels: [1300, 1320, 4200, 4250, 4300] },
  { name: "rare doors", belongsToModels: [1300, 1320] },
  { name: "belt", belongsToModels: [477, 479, 1300, 1320] },
  { name: "fuser", belongsToModels: [1515] },
  { name: "solenoid", belongsToModels: [1300, 1320, 1515] },
  {
    name: "solenoid 2",
    belongsToModels: [452, 454, 4200, 4250, 4300, 4014, 4015],
  },
  {
    name: "pressure roll",
    belongsToModels: [4200, 4250, 4300, 4014, 4015, 1515],
  },
  { name: "roll", belongsToModels: [477, 479, 148, 130, 1515] },
  { name: "front", belongsToModels: [1300, 1320] },
  { name: "screen", belongsToModels: [252, 255, 277] },
  { name: "scanner", belongsToModels: [148, 130] },
];

const changes = [
  "removing laser guard",
  "left side replacement",
  "right side replacement",
  "front replacement",
  "tray replacement",
  "tray front",
  "tray body",
  "formator replacement",
];

const Settings = () => {
  return (
    <>
      {/* HEADING */}
      <div className="py-4 px-8 mb-12 bg-slate-100 rounded-2xl flex items-center justify-between border-slate-200 shadow-md">
        <h1 className="text-2xl font-semibold">Settings Page</h1>
      </div>

      {/* TABS */}
      <div className="flex">
        <Tabs defaultValue="users" className="w-full">
          {/* ======================== */}
          {/* TABS HEADINGS -- BUTTONS */}
          {/* ======================== */}
          <TabsList className="w-full mb-6 gap-2 flex justify-between">
            {/* Button #1 */}
            <TabsTrigger
              className="w-1/4 text-lg bg-blue-700 text-white hover:text-blue-700  hover:bg-transparent hover:border-2 hover:border-blue-700 active:text-blue-700  active:bg-transparent active:border-2 active:border-blue-700 rounded-md p-4"
              value="users"
            >
              Users
            </TabsTrigger>
            {/* Button #2 */}
            <TabsTrigger
              className="w-1/4 text-lg bg-blue-700 text-white hover:text-blue-700 hover:bg-transparent hover:border-2 hover:border-blue-700 rounded-md p-4"
              value="printers"
            >
              Printers
            </TabsTrigger>

            {/* Button #3 */}
            <TabsTrigger
              className="w-1/4 text-lg bg-blue-700 text-white hover:text-blue-700 hover:bg-transparent hover:border-2 hover:border-blue-700 rounded-md p-4"
              value="parts"
            >
              Parts
              <Badge variant="outline" className="text-xs ml-3 mt-[-12px]">
                Tag
              </Badge>
            </TabsTrigger>
            {/* Button #4 */}
            <TabsTrigger
              className="w-1/4 text-lg bg-blue-700 text-white hover:text-blue-700 hover:bg-transparent hover:border-2 hover:border-blue-700  rounded-md p-4"
              value="changes"
            >
              Changes
              <Badge variant="outline" className="text-xs ml-3 mt-[-12px]">
                Tag
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* ====================== */}
          {/* TABS CONTENT -- FIELDS */}
          {/* ====================== */}

          {/* TAB #1 Users */}
          <TabsContent value="users" className="mt-6">
            <div className="mt-4 mb-6 py-4 px-8 flex rounded-lg justify-between items-center bg-slate-100">
              <h3 className="h3-bold ">List of current employees.</h3>
              <Dialog>
                <DialogTrigger className="flex flex-row px-6 py-3 bg-blue-600 text-white hover:bg-blue-400 font-semibold  rounded-lg">
                  <Image
                    src="/assets/icons/plus.svg"
                    width={20}
                    height={20}
                    alt="Add User"
                    className="mr-2 pt-[2px]"
                  />
                  Add User
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Add new User:</DialogTitle>
                    <DialogDescription className="mb-6">
                      Add new user according to his/her role in team.
                    </DialogDescription>
                  </DialogHeader>

                  {/* ----------- */}
                  {/* Item #1 */}

                  <div className="mb-3">
                    <h3 className="mb-2">Name:</h3>
                    <div className="flex flex-row gap-1">
                      <Input className="w-2/3 ouline-none" />
                      <Select>
                        <SelectTrigger className="w-1/3">
                          <SelectValue placeholder="Tittle" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="light">Cleaner</SelectItem>
                          <SelectItem value="light">Tech</SelectItem>
                          <SelectItem value="light">Warehouse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <h3 className="mb-2">Role:</h3>
                    <div className="flex flex-row gap-1">
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Admin" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="light">Admin</SelectItem>
                          <SelectItem value="light">Supervisor</SelectItem>
                          <SelectItem value="light">Stuff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* ------------- */}
                  <DialogFooter>
                    <Button asChild>
                      <Link
                        href="/users"
                        className="primary-gradient text-white"
                      >
                        Add
                      </Link>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-slate-100 rounded-md py-4 px-8 mt-4 mb-8">
              <div className="h4-bold text-lg font-bold mt-2">Techs:</div>
              <Table>
                <TableBody>
                  {employees
                    .filter((employee) => employee.role === "tech")
                    .map((employee, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium flex flex-row justify-between items-center">
                          <div>{employee.name}</div>
                          <div className="flex gap-2">
                            <Button asChild>
                              <Link
                                href="/user"
                                className="bg-green-600 text-white w-[80px]"
                              >
                                Info
                              </Link>
                            </Button>
                            <Button asChild>
                              <Link
                                href="/"
                                className="bg-red-600 text-white w-[80px]"
                              >
                                Delete
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            <div className="bg-slate-100 rounded-md py-4 px-8 mt-4 mb-8">
              <div className="h4-bold text-lg font-bold mt-2">Cleaners:</div>
              <Table>
                <TableBody>
                  {employees
                    .filter((employee) => employee.role === "tech")
                    .map((employee, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium flex flex-row justify-between items-center">
                          <div>{employee.name}</div>
                          <div className="flex gap-2">
                            <Button asChild>
                              <Link
                                href="/"
                                className="bg-green-600 text-white w-[80px]"
                              >
                                Info
                              </Link>
                            </Button>

                            <Button asChild>
                              <Link
                                href="/"
                                className="bg-red-600 text-white w-[80px]"
                              >
                                Delete
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            <div>
              {/* <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-lg font-bold">Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Done</TableHead>
                    <TableHead>Returned</TableHead>
                    <TableHead>MSG</TableHead>
                    <TableHead className="text-right">Returned %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {employee.name}
                      </TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>{employee.printersDone}</TableCell>
                      <TableCell>{employee.printersReturned}</TableCell>
                      <TableCell>{employee.reasonForReturn}</TableCell>
                      <TableCell className="text-right">
                        {employee.percentReturned}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table> */}
            </div>
          </TabsContent>

          {/* TAB #2 Printers */}
          <TabsContent value="printers" className="mt-6">
            <div className="mt-4 mb-8 py-4 px-8 flex rounded-lg justify-between items-center bg-slate-100">
              <h3 className="h3-bold ">
                List of parts avaliable for replacement.
              </h3>
            </div>
            <div className="flex flex-col w-1/2 bg-slate-100 rounded-lg px-4 py-6">
              <div className="mb-3">
                <h3 className="mb-2">Printer Make / Model:</h3>
                <div className="flex flex-row gap-1">
                  <Input className="w-2/3 ouline-none" />
                  <ToggleGroup type="multiple" className="ml-4">
                    <ToggleGroupItem
                      value="D"
                      className="border border-slate-900 rounded-lg data-[state=on]:bg-slate-900 data-[state=on]:text-white"
                    >
                      D
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="N"
                      className="border border-slate-900 rounded-lg data-[state=on]:bg-slate-900 data-[state=on]:text-white"
                    >
                      N
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="E"
                      className="border border-slate-900 rounded-lg data-[state=on]:bg-slate-900 data-[state=on]:text-white"
                    >
                      E
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="F"
                      className="border border-slate-900 rounded-lg data-[state=on]:bg-slate-900 data-[state=on]:text-white"
                    >
                      F
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="W"
                      className="border border-slate-900 rounded-lg data-[state=on]:bg-slate-900 data-[state=on]:text-white"
                    >
                      W
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="C"
                      className="border border-slate-900 rounded-lg data-[state=on]:bg-slate-900 data-[state=on]:text-white"
                    >
                      C
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
              <div className="mb-3">
                <h3 className="mb-2">Preview:</h3>
                <div className="flex flex-row gap-1">
                  <Select>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Choose preview picture" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="281">281.png</SelectItem>
                      <SelectItem value="477">477.png</SelectItem>
                      <SelectItem value="4015">4015.png</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-start mt-6">
                  <Button asChild>
                    <Link href="/" className="primary-gradient text-white">
                      Add printer
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB #3 Parts */}
          <TabsContent value="parts" className="mt-6">
            <div className="mt-4 mb-8 py-4 px-8 flex rounded-lg justify-between items-center bg-slate-100">
              <h3 className="h3-bold ">
                List of printers our company work with.
              </h3>
            </div>
            <div className="flex flex-col w-1/2 bg-slate-100 rounded-lg px-4 py-6">
              <div className="mb-3">
                <h3 className="mb-2">Part name:</h3>
                <div className="flex flex-row gap-1">
                  <Input className=" ouline-none" />
                </div>
              </div>
              <div className="mb-3">
                <h3 className="mb-2">Belongs to printer:</h3>
                <div className="flex flex-row gap-1">
                  <Select>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Choose" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="255">255</SelectItem>
                      <SelectItem value="277">277</SelectItem>
                      <SelectItem value="281">281</SelectItem>
                      <SelectItem value="477">477</SelectItem>
                      <SelectItem value="4015">4015</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-start mt-6">
                  <Button asChild>
                    <Link href="/" className="primary-gradient text-white">
                      Add part
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <h3 className="h3-bold mt-8">List of parts.</h3>
            <div>
              <Table className="w-1/2 mt-6">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Belongs to models</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parts.map((part, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{part.name}</TableCell>
                      <TableCell>
                        {part.belongsToModels.map((model, index) => (
                          <span key={index} className="mr-2">
                            {model}
                          </span>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* TAB #4 Changes */}
          <TabsContent value="changes" className="mt-6">
            <div className="mt-4 mb-8 py-4 px-8 flex rounded-lg justify-between items-center bg-slate-100">
              <h3 className="h3-bold ">List of tasks.</h3>
            </div>
            <div className="flex flex-col w-1/2 bg-slate-100 rounded-lg px-4 py-6">
              <div className="mb-3">
                <h3 className="mb-2">Task name:</h3>
                <div className="flex flex-row gap-1">
                  <Input className=" ouline-none" />
                </div>
              </div>
              <div className="mb-3">
                <h3 className="mb-2">Belongs to printer:</h3>
                <div className="flex flex-row gap-1">
                  <Select>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Choose" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="255">255</SelectItem>
                      <SelectItem value="277">277</SelectItem>
                      <SelectItem value="281">281</SelectItem>
                      <SelectItem value="477">477</SelectItem>
                      <SelectItem value="4015">4015</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-start mt-6">
                  <Button asChild>
                    <Link href="/" className="primary-gradient text-white">
                      Add part
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Table className="mt-6">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold text-xl mt-6">
                      All tasks
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {changes.map((change, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{change}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* End of Tabs */}
        </Tabs>
      </div>
      {/* ==== */}
      {/* SAVE */}
      {/* ==== */}
    </>
  );
};

export default Settings;
