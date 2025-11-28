import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  /* 
  validationResult 함수는 이전 미들웨어에서 'express-validator'가 수행한 모든 유효성 검사 결과를 모아서 Express의 req객체로부터 추출하는 역할을 한다. 
  정의된 검사 규칙들이 미들웨어로 실행되고,
  규칙에 어긋나는 오류가 발생하면,
  오류 정보는 req 객체에 저장된다.
  따라서 validationResult(req)를 호출하면 req객체에 저장된 오류 정보를 가져올 수 있다.
  */
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  // msg는 개발자가 규칙을 정의할 때 직접 설정했던 메시지 내용
  return res.status(400).json({ message: errors.array()[0].msg });
};
