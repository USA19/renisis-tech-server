import { Request } from "express";

export interface User {
  _id: string,
  firstName: string,
  lastName: string,
  dateOfBirth: Date,
  password: string,
  gender: string,
  email: string,
  resetToken?: string,
  resetTokenExpiration?: Date,
  profileImageUrl: string,
  createdAt: string
  updatedAt: string
}

interface LikeInterface {
  likedBy: User
}

interface comment {
  comment: string,
  commentedBy: User,
  date: Date
}

export interface Post {
  _id: string,
  postedBy: User,
  description: string,
  imageUrl: string,
  likes: LikeInterface[],
  comments: comment[]
  createdAt: string,
  updatedAt: string,
}

export interface AuthenticatedRequest extends Request {
  user?: User
}
