"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, UpdateUserParams, DeleteUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";

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

        const user = await User.findOne({clerkId: userId});

        return user;
    } catch(error){
        console.log(error);
        throw error;
    }
}