import axios from "axios";
import createConfig from "./createConfig";

function signin(body) {
    const promise = axios.post(`${process.env.REACT_APP_API_URL}/signin`, body);
    return promise;
};

function signup(body) {
    const promise = axios.post(`${process.env.REACT_APP_API_URL}/signup`, body);
    return promise;
};

function logout(token) {
    const promise = axios.post(`${process.env.REACT_APP_API_URL}/logout`, {}, createConfig(token));
    return promise;
};

const apiAuth = { signin, signup, logout };
export default apiAuth;