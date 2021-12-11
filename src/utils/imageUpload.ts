import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const multiImageHandler = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).any();

export const singleImageHandler = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single("image");
