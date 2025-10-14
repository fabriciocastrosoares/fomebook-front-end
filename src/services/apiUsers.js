import axios from "axios";
import createConfig from "./createConfig";

function getUser(token) {
    const promise = axios.get(`${process.env.REACT_APP_API_URL}/users/me`, createConfig(token));
    return promise;
};

function searchUsers(token, name) {
    const encodedName = encodeURIComponent(name);
    const promise = axios.get(`${process.env.REACT_APP_API_URL}/users/search?name=${encodedName}`, createConfig(token));
    return promise;
};

function getUserById(token, id) {
    const promise = axios.get(`${process.env.REACT_APP_API_URL}/users/${id}`, createConfig(token));
    return promise;
};

function followUser(token, userId) {
    const promise = axios.post(`${process.env.REACT_APP_API_URL}/users/${userId}/follow`, {}, createConfig(token));
    return promise;
};

function unfollowUser(token, userId) {
    const promise = axios.post(`${process.env.REACT_APP_API_URL}/users/${userId}/unfollow`, {}, createConfig(token));
    return promise;
};

const apiUsers = { getUser, searchUsers, getUserById, followUser, unfollowUser };
export default apiUsers;