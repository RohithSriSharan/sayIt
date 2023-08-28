'use client'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import * as z from 'zod';
import Image from "next/image";
import { CommentValidation } from "@/lib/validations/threads";


// import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";

// import Thread from "@/lib/models/thread.models";
// import { createThread } from "@/lib/actions/thread.actions";

interface Props{
    threadId:string;
    currentUserImg:string;
    currentUserId:string;
}

const Comment = ({threadId, currentUserImg, currentUserId}:Props) => {

    const router = useRouter();
    
    const form = useForm({
        resolver:zodResolver(CommentValidation),
        defaultValues: {
          thread:''
        },
      })

    const onSubmit = ()  => {

    }
    
    return (
        <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="mt-10 flex flex-col justify-start gap-10">
        <FormField
            control={form.control}
            name='thread'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-light-2'>
                 Comment
                </FormLabel>
                <FormControl className=" no-focus border border-dark-4 bg-dark-3 text-light-1"> 
                  <Input
                      type="text"
                      placeholder="Comment..."
                      className="no-focus text-light-1 outline-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='bg-primary-500'>Post Thread</Button>
          </form>
        </Form>
    )
}

export default Comment;