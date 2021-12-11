import express from "express";

import { editUserProfile, getUserById } from "../controllers/user.controller";
import { updateUserProfileSchema } from "../schema";
import { singleImageHandler } from "../utils/imageUpload";

const router = express.Router();

router.put("/editUserProfile/:userId", updateUserProfileSchema, singleImageHandler, editUserProfile);
router.get("/getUserById/:userId", getUserById);

export default router;
