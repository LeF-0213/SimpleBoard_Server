import express from "express";
import * as authService from "../service/auth.mjs";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

const validateLogin = [
  body("userid")
    .trim()
    .isLength({ min: 4 })
    .withMessage("아이디는 최소 4자 이상 입력")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("특수문자 사용불가"),
  body("password").trim().isLength({ min: 8 }).withMessage("최소 8자 이상 입력"),
  validate,
];

const validateSignup = [
  ...validateLogin,
  body("email").trim().isEmail().withMessage("이메일 형식 확인"),
  body("nickname").trim().notEmpty().withMessage("nickname을 입력"),
  validate,
];

// 회원 가입
router.post("/signup", validateSignup, authService.signup);

// 로그인
router.post("/login", validateLogin, authService.login);

// 로그인 유지
router.post("/me", isAuth, authService.me);

export default router;
