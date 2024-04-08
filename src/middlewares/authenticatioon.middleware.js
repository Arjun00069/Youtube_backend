import { ApiError } from "../utils/APiError.js";
import { asyncHnadler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
// here in parmeter res is not used therefore we have written res as _
const isAuthenticated = asyncHnadler(async (req,_,next)=>{
    try {
        const token = req.cookies?.accessToken|| req.header("Authorization")?.split(' ')[1]
        if(!token){
           throw new ApiError(4001,"Unauthorized request");
        }
      const decodedToekn = jwt.verify(token,process.env.jwnefio_wf_wefwjncoe5nviefev);
      const user = await User.findById(decodedToekn._id,{password:0,refreshToken:0});
      if(!user){
        throw new ApiError(401,"Invalid axcess token");
      }
      req.user= user;
      next();
    } catch (error) {
        throw new ApiError(401,error?.message||"Invalid Axcess token");
    }
    
})
export {isAuthenticated}