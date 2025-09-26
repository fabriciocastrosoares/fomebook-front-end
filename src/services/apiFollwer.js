import axios from "axios";
import createConfig from "./createConfig";

function getFollowing(token, id) {
    const promise = axios.get(`${process.env.REACT_APP_API_URL}/users/${id}/following`, createConfig(token));
    return promise;
};

function getFollowers(token, id) {
    const promise = axios.get(`${process.env.REACT_APP_API_URL}/users/${id}/followers`, createConfig(token));
    return promise;
};


const apiFollwers = { getFollowing, getFollowers };

export default apiFollwers;

