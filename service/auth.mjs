import { config } from "../config.mjs";
import * as authRepository from "../repository/auth.mjs";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secretKey = config.jwt.secretKey;
const bcryptSaltRounds = config.bcrypt.saltRounds;
const expiresInSec = config.jwt.expiredInSec;

async function createJwtToken(id) {
  /* 
  sign은 JWT를 생성하고 서명하는 메서드이다. 
  개발자가 제공한 데이터(Payload)와 Secret Key를 사용하여 JWT의 세 부분(Header, Payload, Signature)를 조합하여,
  최종적으로 보안이 보장된 토큰 문자열을 반환한다.
    /*
    payload는 토큰에 담을 데이터이다.
    일반적으로 사용자 ID, 권한, 역할등의 정보가 포함된 js객체이다.
  */
  return jwt.sign({ id }, secretKey, { expiresIn: expiresInSec });
}

export async function signup(req, res, next) {
  const { userid, password, email, nickname } = req.body;

  const found = await authRepository.findByUserid(userid);
  if (found) {
    return res.status(400).json({ message: `${userid}이 이미 있습니다.` });
  }

  const hashed = bcrypt.hashSync(password, bcryptSaltRounds);
  const user = await authRepository.createUser({ userid, password: hashed, email, nickname });
  const token = await createJwtToken(user.id);
  console.log(token);
  res.status(201).json({ token, user });
}

export async function login(req, res, next) {
  const { userid, password } = req.body;
  const user = await authRepository.findByUserid(userid);
  if (!user) {
    res.status(401).json(`${userid}를 찾을 수 없음`);
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: `아이디 또는 비밀번호 확인` });
  }

  const token = await createJwtToken(user.id);
  res.status(200).json({ token, user });
}

export async function me(req, res, next) {
  const user = await authRepository.findById(req.id);
  if (!user) {
    return res.status(404).json({ message: "일치하는 사용자가 없음" });
  }
  res.status(200).json({ token: req.token, userid: user.userid });
}

export async function findUserByUserid(req, res, next) {
  const user = await authRepository.findByUserid(req.userid);
  if (!user) {
    return res.status(404).json({ message: "일치하는 사용자가 없음" });
  }
  res.status(200).json({ token: req.token, userid: user.userid });
}
