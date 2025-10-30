import styled from "styled-components";
import { IoPaperPlaneOutline } from "react-icons/io5";

export const CommentsContainer = styled.div`
    background-color: #f3f3f3;
    border-radius: 0 0 5px 5px;
    padding: 20px;
    margin: 0 -20px -20px -20px; /* Para alinhar com as bordas do post */
    margin-top: 20px;
`;

export const CommentList = styled.ul`
    list-style: none;
    padding: 0;
    max-height: 200px;
    overflow-y: auto;
`;

export const CommentItem = styled.li`
    display: flex;
    align-items: flex-start;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;

    &:last-child {
        border-bottom: none;
    }

    img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 15px;
    }
`;

export const CommentContent = styled.div`
    display: flex;
    flex-direction: column;

    strong {
        font-size: 16px;
        color: #333;
        margin-bottom: 5px;
    }

    p {
        font-size: 14px;
        color: #555;
        word-break: break-word;
    }
`;

export const NewCommentForm = styled.form`
    display: flex;
    align-items: center;
    margin-top: 20px;
    position: relative;

    img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 15px;
    }

    input {
        flex: 1;
        height: 40px;
        border-radius: 8px;
        border: 1px solid #ddd;
        padding: 0 45px 0 15px;
        font-size: 14px;
        outline: none;
    }
`;

export const SendCommentIcon = styled(IoPaperPlaneOutline)`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    color: #0864f7;
    cursor: pointer;
`;