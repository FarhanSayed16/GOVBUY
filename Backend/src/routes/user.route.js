import {Router} from "express"
import rateLimit from 'express-rate-limit';
import { 
    login,
    registerUser,
    logout,
    refreshAcessToken,
    changeCurrentPassword,
    updateAccountDetails,
    getCurrentUser,
    deleteUser,
    getAllUsers,
    updateUserRoleAndStatus,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/roleCheck.middleware.js";

const router = Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 login/register requests per windowMs
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
    standardHeaders: true,
});

router.route("/register").post(authLimiter, registerUser);
router.route("/login").post(authLimiter, login); 
router.route("/logout",verifyJWT).post(logout);
router.route("/refresh-access-token",verifyJWT).post(refreshAcessToken);
router.route("/change-password").patch(verifyJWT,changeCurrentPassword);
router.route("/update-account-details").patch(verifyJWT,updateAccountDetails);
router.route("/me").get(verifyJWT,getCurrentUser);

//admin only
router.route("/delete-user/:userId").delete(verifyJWT,  checkRole("admin"), deleteUser);
router.route("/get-all-users").get(verifyJWT,  checkRole("admin"), getAllUsers);
router.route("/update-role-status/:userId").patch(verifyJWT,  checkRole("admin"), updateUserRoleAndStatus);

export default router;