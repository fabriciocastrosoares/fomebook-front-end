import axios from "axios";
import createConfig from "./createConfig";

function createPost(token, body) {
    const promise = axios.post(`${process.env.REACT_APP_API_URL}/posts`, body, createConfig(token));
    return promise;
};

function getPosts(token) {
  const promisse = axios.get(`${process.env.REACT_APP_API_URL}/posts}`, createConfig(token));
  return promisse
};

function getUserPosts(token, userId) {
  const promisse = axios.get(`${process.env.REACT_APP_API_URL}/posts/user/${userId}`, createConfig(token));
  return promisse
};


function likePost(token, postId) {
    const promise = axios.post(`${process.env.REACT_APP_API_URL}/posts/${postId}/like`, {}, createConfig(token));
    return promise;
};

function dislikePost(token, postId) {
    const promise = axios.delete(`${process.env.REACT_APP_API_URL}/posts/${postId}/unlike`, createConfig(token));
    return promise;
};

const apiPosts = { createPost, getPosts, getUserPosts, likePost, dislikePost };
export default apiPosts;