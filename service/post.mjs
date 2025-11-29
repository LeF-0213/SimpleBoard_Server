import * as postRepository from "../repository/post.mjs";

// 모든 포스트를 가져오는 함수(검색 기능 추가)
export async function getPosts(req, res, next) {
  let search = req.query.search;

  // URL 디코딩(한글 처리)
  if (search) {
    search = decodeURIComponent(search);
    console.log("디코딩된 검색어: ", search);
  }
  let data;
  if (search && search.trim() !== '') {
    data = await postRepository.getAllBySearch(search);
  } else {
    data = await postRepository.getAll();
  }
  res.status(200).json(data);
}

// 하나의 포스트를 가져오는 함수
export async function getPost(req, res, next) {
  const id = req.params.id;
  const post = await postRepository.getById(id);
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({ message: `${id}의 포스트가 없습니다.` });
  }
}

// 포스트를 작성하는 함수
export async function createPost(req, res, next) {
  const { title, text } = req.body;
  const post = await postRepository.createPost(title, text, req.id);
  res.status(200).json(post);
}

// 포스트를 수정하는 함수
export async function updatePost(req, res, next) {
  const id = req.params.id;
  const title = req.body.title;
  const text = req.body.text;
  const post = await postRepository.getById(id);
  if (!post) {
    return res.status(400).json({ v });
  }
  if (post.idx !== req.id) {
    return res.sendStatus(403);
  }
  const updated = await postRepository.updatePost(title, text, id);
  res.status(200).json(updated);
}

// 포스트를 삭제하는 함수
export async function deletePost(req, res, next) {
  const id = req.params.id;
  const post = await postRepository.getById(id);
  if (!post) {
    return res.status(404).json({ message: `${id}의 포스트가 없습니다.` });
  }
  if (post.idx !== req.id) {
    return res.sendStatus(403);
  }
  await postRepository.deletePost(id);
  res.sendStatus(204);
}
