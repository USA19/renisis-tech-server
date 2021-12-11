import { Request, NextFunction, Response } from "express";
import { validationResult } from "express-validator";

import { deleteFile } from "../utils/imageDelete";
import Post from "../models/post.model";
import { AuthenticatedRequest } from "../interfaces";

export const createPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    if (!req.body.description && !req.file) {
      return res.status(400).json({ message: "Required Fields are not provided" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is not provided" });
    }

    let post = await Post.create({
      description: req.body.description,
      postedBy: req.user?._id,
      imageUrl: req.file.path
    });

    let createdPost = await Post.findById(post._id).populate('postedBy').populate("comments.commentedBy")
    res.status(201).json(createdPost);
  } catch (e) {
    res.status(500).json({ message: "something went wrong in creating Posts" });
  }
};

export const editPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id).populate('postedBy').populate("likes.likedBy").populate("comments.commentedBy");
    if (!post) {
      return res.status(400).json({ message: "Post does not found" });
    }

    post.description = req.body.description;
    if (req.file) {
      deleteFile(post.imageUrl);
      post.imageUrl = req.file.path
    }

    await post.save();
    res.status(200).json(post);
  } catch (e) {
    res.status(500).json({ message: "something went wrong in editing Posts" });
    console.trace(e);
  }
};

export const deletePost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id).populate("postedBy");

    if (!post) {
      return res.status(400).json({ message: "Post does not found" });
    }

    await Post.findByIdAndDelete(req.params.id);

    if (post.imageUrl) {
      deleteFile(post.imageUrl);
    }

    res.status(200).json({ message: "post deleted successfully" });
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: "something went wrong in Deleting Posts" });
  }
};

export const fetchPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page: string = req.query.page ? String(req.query.page) : "1";
    const limit: string = req.query.page ? String(req.query.limit) : "10";

    const posts = await Post.find()
      .populate('postedBy').populate("likes.likedBy").populate("comments.commentedBy")
      .skip((parseInt(page) - 1) * parseInt(limit)).limit(parseInt(limit)).sort({ createdAt: -1 })

    const count = await Post.countDocuments();
    const pages = Math.ceil(count / parseInt(limit));

    res.status(200).json({ posts, count: pages });
  } catch (e) {
    res.status(500).json({ message: "something went wrong in Fetching Posts" });
    console.trace(e);
  }
};

export const fetchPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = Post.findById(req.params.id).populate('postedBy').populate("likes.likedBy").populate("comments.commentedBy");
    if (!post) {
      return res.status(400).json({ message: "no post has been found with this id" })
    }

    res.status(200).json(post);
  } catch (e) {
    res.status(500).json({ message: "something went wrong in Fetching Post" });
    console.trace(e);
  }
};

export const fetchUserPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page: string = req.query.page ? String(req.query.page) : "1";
    const limit: string = req.query.page ? String(req.query.limit) : "10";

    const posts = Post.find({ postedBy: req.params.userId }).populate('postedBy').populate("likes.likedBy").populate("comments.commentedBy")
      .skip((parseInt(page) - 1) * parseInt(limit)).limit(parseInt(limit)).sort({ createdAt: -1 })

    const count = await Post.countDocuments();
    const pages = Math.ceil(count / parseInt(limit));

    res.status(200).json({ posts: posts, count: pages });

  } catch (e) {
    res.status(500).json({ message: "something went wrong in Fetching Post" });
    console.trace(e);
  }
};

export const likeOrUnlikePost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let post = await Post.findById(req.params.id).populate('postedBy').populate("likes.likedBy").populate("comments.commentedBy");

    if (!post) {
      return res.status(400).json({ message: "no post has been found with this id" })
    }

    const isLikedByTheCurrentUser = await Post.findOne({
      $and: [
        { _id: req.params.id },
        { likes: { $elemMatch: { likedBy: req.user?._id } } }
      ]
    });

    if (!isLikedByTheCurrentUser) {
      post.likes = [...post.likes, { likedBy: req.user?._id || "" }]
      await post.save()
    }
    else {
      post = await Post.findByIdAndUpdate({ _id: req.params.id }, { $pull: { likes: { likedBy: req.user?._id as any } } }, { safe: true, multi: true });
    }

    post = await Post.findById(req.params.id).populate('postedBy').populate("likes.likedBy").populate("comments.commentedBy");

    res.status(200).json(post);

  } catch (e) {
    res.status(500).json({ message: "something went wrong in Liking or Disliking Post" });
    console.trace(e);
  }
}

export const addCommentToPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let post = await Post.findById(req.params.id).populate('postedBy').populate("likes.likedBy").populate("comments.commentedBy");

    if (!post) {
      return res.status(400).json({ message: "no post has been found with this id" })
    }

    post.comments = [{ commentedBy: req.user?._id, comment: req.body.comment }, ...post.comments];
    await post.save();

    post = await Post.findById(req.params.id).populate('postedBy').populate("likes.likedBy").populate("comments.commentedBy");

    res.status(200).json(post);

  } catch (e) {
    res.status(500).json({ message: "something went wrong in Liking or Add CommentToPost Post" });
    console.trace(e);
  }
}
