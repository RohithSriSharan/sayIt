"use server"
import { revalidatePath } from "next/cache";
import User from "../models/user.models";
import { connectDB } from "../mongoose";


interface Params{
    userId:string,
    username:string,
    name:String,
    bio:string,
    image:string,
    path:string
}

export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path
}:Params
    
    ):Promise<void> {
    connectDB();

    try{
        await User.findOneAndUpdate(
            {id:userId},
            {
            username: username.toLowerCase(),
            name,
            bio,
            image,
            onboarded: true,
            },
            {upsert:true}
            )
            if (path === '/profile/edit'){
                revalidatePath(path)
            }
    }catch(error){
        console.log(error)
    }
}