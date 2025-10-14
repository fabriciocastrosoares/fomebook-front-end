import styled from "styled-components";

export const Container = styled.main`
    margin-top: 120px;
    width: 100%;
    max-width: 600px;
    h1 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
    }
`;

export const UserList = styled.ul`
    list-style: none;
`;

export const UserItem = styled.li`
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    border-radius: 8px;
    &:hover { background-color: #f0f2f5; }
    img { width: 50px; height: 50px; border-radius: 50%; margin-right: 15px; }
    span { font-size: 18px; }
`;