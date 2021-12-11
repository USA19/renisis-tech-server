import { Router } from "express";

import { login, signup, getLoggedInUser } from "../controllers/auth.controller";
import { registrationSchema, loginSchema } from "../schema";
import { isAuthenticated } from "../utils";

const router: Router = Router();

router.post("/login", loginSchema, login);
router.post("/signup", registrationSchema, signup);
router.get("/loggedInUser", isAuthenticated, getLoggedInUser);

export default router;
