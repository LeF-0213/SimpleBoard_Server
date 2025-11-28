import jwt from "jsonwebtoken";
import { config } from "../config.mjs";
import * as authRepository from "../repository/auth.mjs";

const AUTH_ERROR = { message: "인증 에러" };

export const isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  console.log(authHeader);

  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    console.log("헤더 에러");
    return res.status(401).json(AUTH_ERROR);
  }

  const token = authHeader.split(" ")[1];
  req.token = token;

  /* 
  verify의 callback function은 Error-First Callback의 설계 원칙을 따름. 
  첫 번째 매개변수(error)와 두 번째 매개변수(decoded)로 순서 고정이 되어있음.
  */
  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      console.log("토큰 에러");
      return res.status(401).json(AUTH_ERROR);
    }
    console.log("dedcoded: ", decoded);
    const user = await authRepository.findById(decoded.id);
    if (!user) {
      console.log("아이디 없음");
      return res.status(401).json(AUTH_ERROR);
    }
    console.log("user.id: ", user.id);
    console.log("user.userid: ", user.userid);
    // 요청하는 사용자의 id라는 요청의 속성이 됨
    req.id = user.id;
    next();
  });
};
