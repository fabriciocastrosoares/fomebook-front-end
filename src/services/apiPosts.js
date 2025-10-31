import axios from "axios";
import createConfig from "./createConfig";

function createPost(token, body) {
  const promise = axios.post(`${process.env.REACT_APP_API_URL}/posts`, body, createConfig(token));
  return promise;
};

function deletePost(token, postId) {
  const promise = axios.delete(`${process.env.REACT_APP_API_URL}/posts/${postId}`, createConfig(token));
  return promise;
};

function getUserPosts(token, userId) {
  const promisse = axios.get(`${process.env.REACT_APP_API_URL}/posts/user/${userId}`, createConfig(token));
  return promisse;
};

function likePost(token, postId) {
  const promise = axios.post(`${process.env.REACT_APP_API_URL}/posts/${postId}/like`, {}, createConfig(token));
  return promise;
};

function dislikePost(token, postId) {
  const promise = axios.delete(`${process.env.REACT_APP_API_URL}/posts/${postId}/unlike`, createConfig(token));
  return promise;
};

function updatePosts(token, id, body) {
  const promise = axios.put(`${process.env.REACT_APP_API_URL}/posts/${id}`, body, createConfig(token));
  return promise;
};

function getTimeLine(token) {
  const promise = axios.get(`${process.env.REACT_APP_API_URL}/timeline`, createConfig(token));
  return promise;
};

function repostPost(token, postId) {
    const promise = axios.post(`${process.env.REACT_APP_API_URL}/posts/${postId}/repost`, {}, createConfig(token));
    return promise; 
}

const apiPosts = { createPost, deletePost, getUserPosts, likePost, dislikePost, updatePosts, getTimeLine, repostPost};
export default apiPosts;