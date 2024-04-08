/// We are first uloding file to our local storage temporarly
// THen uploading to loudinary
// after uploading we are removing
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"



cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY, 
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
  });




const uploadOnCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath) return null;
     const response=  await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file uploaded
        // console.log("File is uploaded succesfully",response.url)
        return response;
    } catch (error) {
        // if there is problem then unlik file i.e delete
        fs.unlinkSync(localFilePath)//Sync me this will complete then it will procede
        return null;
        
    }
   

}


export {uploadOnCloudinary}



  