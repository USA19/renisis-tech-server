import { RequestHandler, NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../interfaces";

import config from "../config";

export const isAuthenticated: RequestHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const header = req.headers["authorization"];

    if (typeof header === "undefined") {
      return res.status(401).json({ message: "authentication credentials are not provided" });
    }

    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "authentication credentials were not provided" });
    }
    const decoded = jwt.verify(token, config.JWTKEY);

    if (!decoded) {
      return res.status(401).json({ message: "failed to authenticate token" });
    }

    req.user = (decoded as any).user;
    next();
  } catch (e) {
    return res.status(500).json({ message: "Server side Error isAuth" });
  }
};

