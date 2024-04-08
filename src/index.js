//require('dotenv').config({path:'./env'}) .    THIS IMPORT SHOULD AS EARLY AS POSSIBLE TO INITILIZE ENV VARIABLE QUICKLY
// NEXT APPRACH
import dotenv from "dotenv"
import { DB_NAME } from "./constants.js";
import mongoose from "mongoose"
import express from "express"
import connectDB from "./db/db.js";
import {app} from "./app.js"
dotenv.config({
    path:'./env'
})


connectDB() //connectDB is Async function so we can handle it like promise based
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log("App is listning on port:",process.env.PORT)
    })
})
.catch((err)=>{
    console.log("DB Connection errore !!!:",err)
})










/*
    THIS APPROACH IS ALSO USED IN INDUSTRY BUT THIS POLLUTE OUR index.js
export const app = express();
;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("Error :",error);
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Appp is listining at port:${process.env.PORT}`)
        })
    } catch (error) {
           console.log("Error in connecting database:",error);
           throw error
    }

})()
*/