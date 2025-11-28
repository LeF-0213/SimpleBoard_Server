import MongoDB, { ObjectId, ReturnDocument } from "mongodb";
import { getPosts } from "../db/database.mjs";
import * as userRepository from "./auth.mjs";

// 모든 포스트를 가져오기
export async function getAll() {
  return getPosts().find().sort({ createdAt: -1 }).toArray();
}

// 사용자 아이디(userid)에 대한 포스트 가져오기
export async function getAllByUserid(userid) {
  return getPosts().find({ userid }).sort({ createdAt: -1 }).toArray();
}

// 글 번호(id)에 대한 포스트를 가져오기
export async function getById(id) {
  return getPosts()
    .find({ _id: new ObjectId(id) })
    .next()
    .then(mapOptionalPost);
}

// 포스트 작성
export async function createPost(title, text, id) {
  return userRepository
    .findById(id)
    .then((user) =>
      getPosts().insertOne({
        title,
        text,
        createdAt: new Date(),
        idx: user.id,
        nickname: user.nickname,
        userid: user.userid,
      })
    )
    .then((result) => {
      return getPosts().findOne({ _id: result.insertedId });
    });
}

// 포스트 변경
export async function updatePost(title, text, id) {
  return getPosts()
    .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { title, text } }, { ReturnDocument: "after" })
    .then((result) => result);
}

// 포스트 삭제
export async function deletePost(id) {
  return getPosts().deleteOne({ _id: new ObjectId(id) });
}

function mapOptionalPost(post) {
  return post ? { id: post._id.toString(), ...post } : post;
}
