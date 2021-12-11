import { Router } from "express";

import { addCommentToPost, createPost, deletePost, editPost, fetchPost, fetchPosts, fetchUserPost, likeOrUnlikePost } from "../controllers/post.controller";
import { addCommentToPostSchema, createPostSchema, updatePostSchema } from "../schema";
import { singleImageHandler } from "../utils/imageUpload";

const router: Router = Router();


router.get("/getPost", fetchPost);
router.get("/getPosts", fetchPosts);
router.get("/getUserPost/:userId", fetchUserPost);
router.post("/likePost/:id", likeOrUnlikePost)
router.post("/uploadPost", createPostSchema, singleImageHandler, createPost);
router.post("/addCommentToPost/:id", addCommentToPostSchema, addCommentToPost);
router.put("/editPost/:id", updatePostSchema, singleImageHandler, editPost);
router.delete("/deletePost/:id", deletePost);


export default router;
