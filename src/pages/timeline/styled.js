import styled from "styled-components";
import { FaFacebookF } from "react-icons/fa6";

export const MyLogo = styled.div`
    display: flex;   
    font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 700;
    font-size: 60px;
    color: #0864f7;
    cursor: pointer; 
    margin-right: auto;
`;

export const FacebookIcon = styled(FaFacebookF)`
    margin-right: -10px;
    font-size: 60px;
    
`;

export const Topo = styled.div`
    background-color: #dbe6f8ff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    min-height: 90px;
    width: 100%;
    border-bottom: 1px solid #aec8f1ff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    padding: 0 20px; 
    box-sizing: border-box; 

    @media (max-width: 600px) {
        flex-direction: column;
        padding: 10px 20px;
        gap: 10px;
    }img {
        width: 70px;
        height: 70px;
        border: 2px solid #aec8f1ff;
    }

`;

export const ContainerPosts = styled.div`
    margin-top: 20px;
`;

export const AuthorInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    cursor: pointer;

    img {
        width: 50px;
        height: 50px;
        border: 2px solid #aec8f1ff;
    }
    span { font-weight: bold; font-size: 18px; }
`;

export const MyPosts = styled.div`
    border: 1px solid #aec8f1ff;
    width: 95%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    position: relative;
    border-radius: 5px;
    margin-top: 120px;
    p {
        word-break: break-word; 
    }
`;

export const RepostBanner = styled.div`
    background-color: #1E1E1E;
    color: white;
    padding: 8px 12px;
    border-radius: 8px 8px 0 0;
    margin: 10px -20px 0 -20px;
    display: flex;
    align-items: center;
    gap: 6px;

    p {
        font-size: 14px;
        strong { font-weight: bold; }
    }
`;


export const NewPostsButton = styled.button`
    width: 95%;
    max-width: 800px;
    padding: 15px;
    margin-bottom: 20px;
    background-color: #1877f2;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: background-color 0.2s;
    &:hover { background-color: #166fe5; }
`;

export const DesktopSearchWrapper = styled.div`
    @media (max-width: 600px) {
        display: none;
    }
`;