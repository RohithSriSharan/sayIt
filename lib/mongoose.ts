import mongoose from 'mongoose'

let isConnected = false;

export const connectDB = async () =>{
    mongoose.set('strictQuery', true);

    if (!process.env.MONGODB_URL) return console.log('MONGODB URL Not Found')

    if(isConnected) return console.log('Already Connected to MongoDB');

    try{
        await mongoose.connect(process.env.MONGODB_URL);
    }catch(error){
        console.log(error)
    }
}