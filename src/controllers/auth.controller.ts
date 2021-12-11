import { Request, NextFunction, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { validationResult } from "express-validator";
import User from "../models/user.model";
import config from "../config";
import { AuthenticatedRequest, User as UserInterface } from "../interfaces";


export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const password = req.body.password;

    const user = await User.findOne({
      email: req.body.email.toLocaleLowerCase(),
    });

    if (!user) {
      return res.status(400).json({ message: "User With this email does not exist" });
    }

    const doMatch = bcrypt.compareSync(password, user.password);

    if (!doMatch) {
      return res.status(400).json({ message: "you have entered wrong email or password" });
    }

    const token = jwtToken(user);

    return res.status(200).json({ user, token });

  } catch (e) {
    res.status(500).json({ message: "something went wrong in login" });
  }
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const email = req.body.email.toLocaleLowerCase();
    const password = req.body.password;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "the user with this email already exist try other" });
    }

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName: req.body.firstName?.toLocaleLowerCase(),
      lastName: req.body.lastName?.toLocaleLowerCase(),
      dateOfBirth: new Date(req.body.dateOfBirth),
    });

    await newUser.save();
    const token = jwtToken(newUser);

    return res.status(200).json({ user: newUser, token });
  } catch (e) {
    res.status(500).json({ message: "something went wrong in signup" });
  }
};


export const getLoggedInUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(400).json({ message: "No User Found" });
    }

    return res.status(200).json({ user });

  } catch (e) {
    res
      .status(500)
      .json({ message: "something went wrong in getLoggedInUser" });
    console.trace(e);
  }
};

const jwtToken = (user: UserInterface) => {
  return jwt.sign({ user }, config.JWTKEY, {
    expiresIn: "365d",
  });
};
