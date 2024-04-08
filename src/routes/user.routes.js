import {Router} from "express"
import { loginUser, logoutUser, registerUser } from "../controllers/users.controller.js"
import { isAuthenticated } from "../middlewares/authenticatioon.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router =Router();


router.route('/Register').post( 
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },{
            name:"coveImage",
            maxCount:1
        }]
    ),
    registerUser)
    router.route('/Login').post(loginUser)

    router.route('/Logout').get(isAuthenticated,logoutUser)



export default router