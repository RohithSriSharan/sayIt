'use server'

import { connectDB } from "../mongoose"
import Thread from "../models/thread.models"
import User from "../models/user.models";
import { revalidatePath } from "next/cache";
import { connect } from "http2";
interface Params{
    text:string,
    author:string,
    communityId: string | null,
    path:string,
}

export async function createThread({text, author, communityId, path}:Params){
    
    try{
        connectDB();
    const createdThread = await Thread.create(
        {
            text,
            author,
            community: null,
        }
    );


    await User.findByIdAndUpdate(author, {
        $push: { threads: createdThread._id },
      });
  
    revalidatePath(path)
    }catch(error){
            console.log(error)
    }
    
    
}


export async function fetchPosts(pageNumber = 1, pageSize = 20){
    try{
        connectDB();
        //calucuate the number of posts to skip
        const skipAmount = (pageNumber - 1 ) * pageSize;

        //fetch the posts that have no parents
       const postsQuery = Thread.find({parentId:{$in:[null, undefined]}})
            .sort({createdAt:'desc'})
            .skip(skipAmount)
            .limit(pageSize)
            .populate({path:'author', model:User})
            .populate({
                path:'children',
                populate:{
                    path:'author',
                    model:User,
                    select:'_id name parentId image'
                }
            })

            const totalPostsCount = await Thread.countDocuments({
                parentId:{
                    $in:[null, undefined]
                }
            })

            const posts = await postsQuery.exec();
            const isNext = totalPostsCount > skipAmount +  posts.length;

            return {posts, isNext}
    }catch (error){
        console.log(error)
    }
}

export async function fetchThreadById(threadId: string) {
    connectDB();
  
    try {
      const thread = await Thread.findById(threadId)
        .populate({
          path: "author",
          model: User,
          select: "_id id name image",
        }) // Populate the author field with _id and username
        .populate({
          path: "children", // Populate the children field
          populate: [
            {
              path: "author", // Populate the author field within children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
            {
              path: "children", // Populate the children field within children
              model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
              populate: {
                path: "author", // Populate the author field within nested children
                model: User,
                select: "_id id name parentId image", // Select only _id and username fields of the author
              },
            },
          ],
        })
        .exec();
  
      return thread;
    } catch (err) {
      console.error("Error while fetching thread:", err);
      throw new Error("Unable to fetch thread");
    }
  }