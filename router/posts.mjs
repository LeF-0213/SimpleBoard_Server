import express from "express";
import * as postService from "../service/post.mjs";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

const validatePost = [
  body("title").trim().isLength({ min: 1 }).withMessage("최소 1글자 이상 입력"),
  body("text").trim().isLength({ min: 4 }).withMessage("최소 4글자 이상 입력"),
  validate,
];

// 전체 포스트 가져오기
// 특정 아이디에 대한 포스트 가져오기
router.get("/", isAuth, postService.getPosts);

// 글번호에 대한 포스트 가져오기
router.get("/:id", isAuth, postService.getPost);

// 포스트 쓰기
router.post("/", isAuth, validatePost, postService.createPost);

// 포스트 수정하기
router.put("/:id", isAuth, validatePost, postService.updatePost);

// 포스트 삭제하기
router.delete("/:id", isAuth, postService.deletePost);

export default router;
