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

function getPosts(token) {
  const promisse = axios.get(`${process.env.REACT_APP_API_URL}/posts`, createConfig(token));
  return promisse;
};

function getUserPosts(token, userId) {
  const promisse = axios.get(`${process.env.REACT_APP_API_URL}/posts/user/${userId}`, createConfig(token));
  return promisse;
};

function getLikers(token, postId) { // Renomeado de getPostLikes para getLikers
  const promise = axios.get(`${process.env.REACT_APP_API_URL}/posts/${postId}/likes`, createConfig(token)); // Corrigido: axios.get retorna a promise diretamente
  return promise;
}

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
}

const apiPosts = { createPost, deletePost, getPosts, getUserPosts, getLikers, likePost, dislikePost, updatePosts }; // Atualizado para exportar getLikers
export default apiPosts;