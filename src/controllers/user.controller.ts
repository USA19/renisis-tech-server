import { Request, NextFunction, Response } from "express";
import { validationResult } from "express-validator";

import User from "../models/user.model";
import { deleteFile } from "../utils";


export const editUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(400).json({ message: "no user with id exist" });
    }

    user.firstName = req.body.firstName?.toLocaleLowerCase();
    user.lastName = req.body.lastName?.toLocaleLowerCase();
    user.dateOfBirth = new Date(req.body.dateOfBirth)

    if (req.file) {
      if (user.profileImageUrl !== "images/default.png") {
        deleteFile(user.profileImage);
      }

      user.profileImageUrl = req.file.path
    }

    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ message: "something went wrong in editUserProfile" });
  }
};


export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).json({ message: "No User Found" });
    }

    return res.status(200).json({ user });
  } catch (e) {
    res.status(500).json({ message: "something went wrong in getUserById" });
  }
};


