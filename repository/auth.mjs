import MongoDB, { ObjectId } from "mongodb";
import { getUsers } from "../db/database.mjs";

export async function createUser(user) {
  return getUsers()
    .insertOne(user)
    .then((result) => result.insertedId.toString());
}

export async function findByUserid(userid) {
  return getUsers().find({ userid }).next().then(mapOptionalUser);
}

export async function findById(id) {
  return getUsers()
    .find({ _id: new ObjectId(id) })
    .next()
    .then(mapOptionalUser);
}

function mapOptionalUser(user) {
  return user ? { id: user._id.toString(), ...user } : user;
}
