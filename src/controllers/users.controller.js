import { ApiError } from "../utils/APiError.js"
import {asyncHnadler} from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAxcessandRefressToken = async (userId)=>{
    try{
    const user = await User.findById(userId);
         const refreshToken = user.generateRefreshToken();
         const accesToken =user.generateAccesToken();
         user.refreshToken = refreshToken;
         await user.save({validateBeforeSave:false});
         return {refreshToken,accesToken};}
         catch(error){
            throw new ApiError(500,"Error in generating Access and refresh token")
         }
}
const registerUser = asyncHnadler(async (req,res)=>{
// get user details from frontend
// validate - all fields are there
// check if user already exist
// check if avatar is there
// if there upload to cloudniary
// create user object 
// console.log(req.body)
 const { username,email,fullName,password}= req.body
 
   if(
    [username,email,fullName,password].some((field)=> field?.trim()==="") //?. optional chaning operator
   ){
    throw new ApiError(400,"All fields are required")
   }
    const existedUser = await User.findOne({$or:[{email},{username}]})
    // console.log(existedUser)
    if(existedUser){
        throw new Error("User already exist")
    }
    //  console.log(req.files);
     const avatarLocalPath = req.files?.avatar[0]?.path 
     let coverImageLocalPath;
        if(req.files&& Array.isArray(req.files.coveImage)&&req.files.coveImage.length>0){
            coverImageLocalPath=req.files.coverImage[0].path
        }   
     if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
     }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400,"Avatar is required");
    }
 
   const user= await User.create({
    fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })
    const createdUser =  await User.findById(user._id,{password:0,refreshToken:0})
      
    if(!createdUser){
        throw new ApiError(500,"Somthing went wrong while registering the user")
    }
   return res.status(200).json(
    new ApiResponse(200,createdUser,"User created")
   )

})



const loginUser = asyncHnadler ( async(req,res)=>{
    // get email and password
    // validate email and passowwrd
    // check if user exist
    // now validate if passowrd is correct
    // if validated generate refress token and axcess toke
    // send refress token and axcess token in cookeis
    const {password,email,username}=req.body;
    if(!password){
        throw new ApiError(400,"Password required");
    }
    if(!email||!username){
        throw new ApiError(400,"Email and username required");
    }
   const user = await User.findOne({$or:[{email},{username}]})
   if(!user){
    throw new ApiError(404,"User does not exist please register")
   }
   const isPasswordValid = await user.isPasswordCorrect(password)
//    console.log(isPasswordValid)
   if(!isPasswordValid){
    throw new ApiError(401,"Password incorrect");
   }
   const {refreshToken,accesToken} = await generateAxcessandRefressToken(user);
   // Now we cannot use prev user as prev user do not have updated refresh token
   // Either we can update user or run a db query
    const loggedInUser =  await User.findById(user._id,{password:0,refreshToken:0})
     
    // settign cookie options
     const options ={
        httpOnly:true,
        secure:true
     }

     res
     .status(200)
     .cookie("accessToken",accesToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(
        new ApiResponse(200,
            {
                user:loggedInUser,
                accesToken,   // We are sending here even if we have sent in cookie because if user is developing a mibile application
                // then there cookie will be not be set
                refreshToken
            },
            "Uer logged In Succefully"
            
            )
     )


})
const logoutUser = asyncHnadler(async (req,res)=>{
    // remove cookies
    // remove refresh token from user
    const userId = req.user._id;
     await  User.findByIdAndUpdate(userId,{
        $set:{
            refreshToken:undefined
        }
      },{
        new:true // the response we wil get will contain updated value
      })
      const options ={
        httpOnly:true,
        secure:true
     }
      res.status(200).clearCookie("accessToken",options)
      .clearCookie("refreshToken",options).json({
        success:true,
        message:"Logged Out"
      })
    
})

export {registerUser,loginUser,logoutUser}