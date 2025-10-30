import axios from "axios";
import createConfig from "./createConfig";

function createComment(token, postId, body){
    return axios.post(`${process.env.REACT_APP_API_URL}/comments/${postId}`, body, createConfig(token));
};

const apiComments = { createComment };

export default apiComments;