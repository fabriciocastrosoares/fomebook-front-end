import axios from "axios";
import createConfig from "./createConfig";

function followUser(token, id) {
  return axios.post(`${process.env.REACT_APP_API_URL}/users/${id}/follow`, {}, createConfig(token));
};

function unfollowUser(token, id) {
  return axios.delete(`${process.env.REACT_APP_API_URL}/users/${id}/unfollow`, createConfig(token));
};

function getFollowing(token, id) {
  return axios.get(`${process.env.REACT_APP_API_URL}/users/${id}/following`, createConfig(token));
};

function getFollowers(token, id) {
  return axios.get(`${process.env.REACT_APP_API_URL}/users/${id}/followers`, createConfig(token));
};

const apiFollowers = { followUser, unfollowUser, getFollowing, getFollowers };

export default apiFollowers;


