"use server"

import User from "@/database/user.model";
import Employee from "@/database/employee.model";
import Printer from "@/database/printer.model";
import mongoose from 'mongoose';
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, UpdateUserParams, DeleteUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import { IPrinter } from "@/database/printer.model";

export async function createUser(userData:CreateUserParams){
    try{
        connectToDatabase()

        const newUser = await User.create(userData)

        return newUser

    } catch(error){
        console.log(error)
        throw error;
    }
}

export async function updateUser(params:UpdateUserParams){
    try{
        connectToDatabase()

        const {clerkId, updateData, path} = params;

        await User.findOneAndUpdate({clerkId}, updateData, {new: true})

        revalidatePath(path)

    } catch(error){
        console.log(error)
        throw error;
    }
}

export async function deleteUser(params:DeleteUserParams){
    try{
        connectToDatabase()

        const {clerkId} = params;

        const user = await User.findOneAndDelete({clerkId})

        if(!user){
            throw new Error("User not Found");
        }

        // Delete all data related to this user, but not the work performed or some important for statisic.

    } catch(error){
        console.log(error)
        throw error;
    }
}

export async function getUserById(params: any){

    try {
        connectToDatabase();

        const {userId} = params;

        const user = await User.findOne({clerkId: userId})
        .populate({path: 'employees', model: Employee, select: "name lastName nickName department"})
        .populate({path: 'printers', model: Printer, select: "name "})
        .lean();

        return user;
    } catch(error){
        console.log(error);
        throw error;
    }
}

export async function getUserById____________(params: any) {
    try {
      await connectToDatabase();
  
      const { userId, from, to } = params;
  
      const matchDateCondition = {
        ...(from && { $gte: new Date(from) }),
        ...(to && { $lte: new Date(to) }),
      };
  
      const user = await User.aggregate([
        { $match: { clerkId: userId } }, // Найти пользователя по clerkId
        {
          $lookup: {
            from: "printers",
            localField: "printers",
            foreignField: "_id",
            as: "printers",
          },
        },
        {
          $addFields: {
            printers: {
              $filter: {
                input: "$printers", // Список принтеров
                as: "printer",
                cond: {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: "$$printer.tasksPerformed", // Фильтруем `tasksPerformed`
                          as: "task",
                          cond: {
                            $and: [
                              { $gte: ["$$task.date", new Date(from)] },
                              { $lte: ["$$task.date", new Date(to)] },
                            ],
                          },
                        },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      ]);
  
      console.log("USER FROM ACTION =>", JSON.stringify(user, null, 2));
  
      if (!user || user.length === 0) {
        console.error("No user found or printers do not match conditions");
        return null;
      }
  
      return user[0]; // Возвращаем пользователя с отфильтрованными принтерами
    } catch (error) {
      console.error("Error in getUserById:", error);
      throw error;
    }
  }


export async function getUserBy_Id(params: any){

    try {
        connectToDatabase();

        const {_id} = params;

        const user = await User.findOne({_id: _id})
        .populate({path: 'employees', model: Employee, select: "name lastName nickName"}).lean();

        return user;
    } catch(error){
        console.log(error);
        throw error;
    }
}

export async function getUsers(params: any){

    try {
        connectToDatabase();

        const user = await User.find({}).lean();

        const users = JSON.parse(JSON.stringify(user));


        return {users};
    } catch(error){
        console.log(error);
        throw error;
    }
}

export async function getEmployees(params: any){

    try {
        connectToDatabase();

        const user = await Employee.find({}).lean();

        const users = JSON.parse(JSON.stringify(user));


        return {users};
    } catch(error){
        console.log(error);
        throw error;
    }
}

export async function getEmployeesById__GOOD__OLD(params: any){

    try {
        connectToDatabase();

        const {_id} = params;

        const user = await Employee.findOne({_id})
        .populate({
          path: 'printers.printerId', // Подгружаем данные по printerId
          model: Printer, 
          select: "name ponumber sn productNumber barcode"})
        
        .lean();

        console.log("ACTION",user)

        return user;
    } catch(error){
        console.log(error);
        throw error;
    }
}

export async function getEmployeesById__FINAL_BEFORE_CLEANERS(params: any) {
  try {
    await connectToDatabase();

    const { _id } = params;

    // Находим пользователя и заполняем принтеры
    const user:any = await Employee.findOne({ _id })
      .populate({
        path: "printers.printerId", // Связываем с коллекцией Printer
        model: Printer,
        select: "name tasksPerformed", // Выбираем только нужные поля
      })
      .lean();

    if (!user) {
      console.error("User not found");
      return null;
    }

    console.log(user.department)

    // Обрабатываем принтеры
    user.printers = user.printers.map((printer: any) => {

      if (!printer.printerId) return printer;

      // Отфильтровываем tasksPerformed по user._id
      const relevantTasks = printer.printerId.tasksPerformed.filter(
        (task: any) => task.user && task.user.toString() === _id.toString()
      );

      // Извлекаем все status из отфильтрованных tasksPerformed
      const statuses = relevantTasks
        .map((task: any) => task.status)
        .filter((status: any) => status); // Убираем пустые или undefined

      // Добавляем статус в printerId, если он существует
      if (statuses.length > 0) {
        printer.printerId = {
          ...printer.printerId,
          status: statuses, // Добавляем массив статусов
        };
      }

      return printer;
    });

    // console.log("Processed user printers:", user.printers);
    return user;
  } catch (error) {
    console.error("Error in getEmployeesById:", error);
    throw error;
  }
}

export async function getEmployeesById(params: any) {
  try {
    await connectToDatabase();

    const { _id } = params;

    // Находим пользователя и заполняем принтеры
    const user: any = await Employee.findOne({ _id })
      .populate({
        path: "printers.printerId", // Связываем с коллекцией Printer
        model: Printer,
        select: "name tasksPerformed", // Выбираем только нужные поля
      })
      .lean();

    if (!user) {
      console.error("User not found");
      return null;
    }

    // Обрабатываем принтеры в зависимости от department
    user.printers = user.printers.map((printer: any) => {
      if (!printer.printerId) return printer;

      let relevantTasks = [];

      if (user.department === "tech") {
        // Фильтрация для department "tech"
        relevantTasks = printer.printerId.tasksPerformed.filter(
          (task: any) => task.user && task.user.toString() === _id.toString()
        );
      } else if (user.department === "cleaner") {
        // Фильтрация для department "cleaner" на уровне performedCleaner
        relevantTasks = printer.printerId.tasksPerformed
          .flatMap((task: any) => task.performedCleaner || []) // Извлекаем performedCleaner
          .filter(
            (cleanerTask: any) =>
              cleanerTask.user && cleanerTask.user.toString() === _id.toString()
          );
      }

      // Извлекаем все status из отфильтрованных задач
      const statuses = relevantTasks
        .map((task: any) => task.status)
        .filter((status: any) => status); // Убираем пустые или undefined

      // Добавляем статус в printerId, если он существует
      if (statuses.length > 0) {
        printer.printerId = {
          ...printer.printerId,
          status: statuses, // Добавляем массив статусов
        };
      }

      return printer;
    });

    return user;
  } catch (error) {
    console.error("Error in getEmployeesById:", error);
    throw error;
  }
}


// export async function getEmployeesById(params: any) {
//   try {
//     connectToDatabase();

//     const { _id } = params;

//     // Находим сотрудника
//     const user:any = await Employee.findOne({ _id })
//       .populate({
//         path: "printers.printerId", // Указываем связь с коллекцией Printer
//         select: "name status tasksPerformed performedCleaner", // Возвращаем только нужные поля
//       })
//       .lean();

//     // Если пользователь не найден
//     if (!user) {
//       return null;
//     }

//     // console.log("USER FROM ACTION =>", user);

//     const department = user?.department; // Безопасное извлечение
//     if (!department) {
//       throw new Error("Department is not defined for the user");
//     }

//     // Добавляем только нужные данные в принтеры
//     user.printers = user.printers.map((printer: any) => {
//       const printerDetails = printer.printerId || {}; // Получаем данные принтера

//       console.log("Детали принтера ===> ",printerDetails)

//       // Определяем данные на основе department
//       let relevantTasks = [];
//       if (department === "tech") {
//         relevantTasks =
//           printerDetails.tasksPerformed?.map((task: any) => ({
//             date: task.date,
//             status: task.status,
//             user: task.user,
//           })) || [];
//       } else if (department === "cleaner") {
//         relevantTasks =
//           printerDetails.performedCleaner?.map((task: any) => ({
//             date: task.date,
//             status: task.status,
//             user: task.user,
//           })) || [];
//       }

//       return {
//         _id: printer._id,
//         printerId: printer.printerId?._id,
//         timeSpent: printer.timeSpent,
//         date: printer.date,
//         name: printerDetails.name || "Unknown",
//         status: printerDetails.status || "Unknown",
//         tasks: relevantTasks, // Добавляем задачи на основе department
//       };
//     });

//     return user;
//   } catch (error) {
//     console.error("Error in getEmployeesById:", error);
//     throw error;
//   }
// }

export async function getEmployeesById__USE_THIS_AFTER(params: any) {
  try {
    connectToDatabase();

    const { _id, from, to } = params;

    // Приведение дат к числовому формату (Unix timestamp)
    const fromDate = from ? new Date(from).getTime() : null;
    const toDate = to ? new Date(to).getTime() : null;

    console.log("Parsed params===>", fromDate, toDate); // Для проверки

    // Находим сотрудника с привязкой к принтерам
    const employee: any = await Employee.findOne({ _id })
      .populate({
        path: "printers",
        model: "Printer",
        select: "printerId timeSpent date tasksPerformed",
      })
      .lean();

    if (!employee || !employee.printers) {
      return employee; // Если сотрудник или принтеры отсутствуют
    }

    // Фильтруем принтеры по диапазону дат
    employee.printers = employee.printers.filter((printer: any) => {
      const printerDate = new Date(printer.date).getTime(); // Приводим к Unix timestamp
      return (
        (!fromDate || printerDate >= fromDate) &&
        (!toDate || printerDate <= toDate)
      );
    });

    return employee;
  } catch (error) {
    console.error("Error in getEmployeesById:", error);
    throw error;
  }
}

export async function getEmployeesByDate(params: any) {
  try {
    connectToDatabase();

    const { _id, date } = params;

    console.log("Params===>",date); // Для проверки

    const selectedDate = date ? new Date(date) : null;

    const employee: any = await Employee.findOne({ _id })
      .populate({
        path: "printers",
        model: "Printer",
        select: "printerId timeSpent date tasksPerformed",
      })
      .lean();

    if (!employee || !employee.printers) {
      return employee;
    }

    // Фильтруем принтеры по точной дате
    employee.printers = employee.printers.filter((printer: any) => {
      const printerDate = new Date(printer.date).toISOString().split("T")[0];
      if (!selectedDate) {
        // Если дата не выбрана, возвращаем все принтеры
        return true;
      }
      const selectedDateString = new Date(selectedDate).toISOString().split("T")[0];
      return printerDate === selectedDateString;
    });

    return employee;
  } catch (error) {
    console.error("Error in getEmployeesByDate:", error);
    throw error;
  }
}

export async function getEmployeesByDate11(params: any) {
  try {
    await connectToDatabase();

    const { userId } = params;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const user = await User.aggregate([
      { $match: { clerkId: userId } }, // Найти пользователя по clerkId
      {
        $lookup: {
          from: "printers",
          localField: "printers",
          foreignField: "_id",
          as: "printers",
        },
      },
      {
        $addFields: {
          totalPrintersCount: { $size: "$printers" }, // Общее количество записей в printers[]
          todayPrintersCount: {
            $size: {
              $filter: {
                input: "$printers",
                as: "printer",
                cond: {
                  $gte: [
                    {
                      $size: {
                        $filter: {
                          input: "$$printer.tasksPerformed",
                          as: "task",
                          cond: {
                            $and: [
                              { $gte: ["$$task.date", startOfDay] },
                              { $lte: ["$$task.date", endOfDay] },
                            ],
                          },
                        },
                      },
                    },
                    1, // Условие: хотя бы одна запись за сегодняшний день
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    console.log("USER FROM ACTION =>", JSON.stringify(user, null, 2));

    if (!user || user.length === 0) {
      console.error("No user found or printers do not match conditions");
      return null;
    }

    return {
      user: user[0], // Пользователь с данными
      totalPrintersCount: user[0].totalPrintersCount, // Общее количество записей в printers[]
      todayPrintersCount: user[0].todayPrintersCount, // Количество записей за сегодняшний день
    };
  } catch (error) {
    console.error("Error in getUserByIdWithCounts:", error);
    throw error;
  }
}




export async function changeUserDepartment(params: any){
    try {
        connectToDatabase();

        const {_id, department, path} = params;

        const user = await User.findOne({ _id: _id });
        if (!user) {
          return "This printer already exists in the database";
        }
    
        await User.findOneAndUpdate(user._id, { $set: { department: department.slice(1, -1) } });
        
        revalidatePath(path);

    } catch(error){
        console.log(error);
        throw error;
    }
}

export async function changeUserAdmin(params: any){
    try {
        connectToDatabase();

        const {_id, admin, path} = params;

        const user = await User.findOne({ _id: _id });
        if (!user) {
          return "This printer already exists in the database";
        }
    
        await User.findOneAndUpdate(user._id, { $set: { admin: admin } });
        
        revalidatePath(path);
    } catch(error){
        console.log(error);
        throw error;
    }
}

export async function addEmployee(params: any) {
    try {
        connectToDatabase();

        const { _id, name, lastName, nickName, department, path } = params;

        // Находим текущего пользователя по ID
        const user = await User.findOne({ _id });
        if (!user) {
            return "This user not found in the database";
        }

        // Создаем нового сотрудника
        const newEmployee = new Employee({
            name: name,
            lastName: lastName,
            nickName: nickName,
            department: user.department
        });

        // Сохраняем нового сотрудника в базе данных
        await newEmployee.save();

        // Добавляем ссылку на нового сотрудника в массив employees текущего пользователя
        user.employees.push(newEmployee._id);

        // Сохраняем изменения в текущем пользователе
        await user.save();

        // Обновляем кеш страницы
        revalidatePath(path);

    } catch (error) {
        console.log(error);
        throw error;
    }
}



export async function changeUserSupervisor(params: any){
    try {
        connectToDatabase();

        const {_id, supervisor, path} = params;

        const user = await User.findOne({ _id: _id });
        if (!user) {
          return "This printer already exists in the database";
        }
    
        await User.findOneAndUpdate(user._id, { $set: { supervisor: supervisor } });
        
        revalidatePath(path);
    } catch(error){
        console.log(error);
        throw error;
    }
}

export async function changeUserName(params: any){
    try {
        connectToDatabase();

        const {_id, name, lastName, nickName,  path} = params;

        const user = await Employee.findOne({ _id: _id });
        if (!user) {
          return "This printer already exists in the database";
        }
    
        await Employee.findOneAndUpdate(user._id, { $set: { name: name, lastName: lastName, nickName: nickName  } });
        
        revalidatePath(path);
    } catch(error){
        console.log(error);
        throw error;
    }
}