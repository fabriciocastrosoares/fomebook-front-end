import styled from "styled-components";
import { IoHeart, IoHeartOutline, IoSearchOutline, IoAddCircle, IoExitOutline } from "react-icons/io5";

export const MyPage = styled.div`
    border: 1px solid #aec8f1ff;
    width: 100vh;
    height: 10vw;
    margin-top: 130px;
    display: flex;
    align-items: center;
    justify-content: space-around;
`;

export const SearchWrapper = styled.div`
    position: relative;
`;

export const SearchContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

export const SearchInput = styled.input`
    height: 40px;
    width: 250px;
    border-radius: 8px;
    border: 1px solid #aec8f1ff;
    padding: 0 40px 0 15px;
    font-size: 16px;
    outline: none;
`;

export const SearchIcon = styled(IoSearchOutline)`
    color: #0864f7;
    width: 30px;
    height: 30px;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
`;

export const ExitIcon = styled(IoExitOutline)`
  color: #0864f7;
  width: 30px;
  height: 30px;
  cursor: pointer; 
`;

export const SearchResultsList = styled.ul`
    position: absolute;
    top: 50px;
    left: 0;
    width: 250px;
    background-color: #e7e7e7;
    border-radius: 8px;
    list-style: none;
    padding: 0;
    margin: 0;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    z-index: 10;
`;

export const SearchResultItem = styled.li`
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: ${props => props.$unclickable ? 'default' : 'pointer'};

    &:hover {
        background-color: #dbe6f8ff;
    }

    img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
    }

    span { font-size: 16px; color: #333; }
`;

export const UserImage = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover; 
    border: 1px solid #aec8f1ff;
`;

export const NameBio = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 10vw;
    padding: 20px;
`;

export const FollowStats = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 10px;
`;

export const Stat = styled.p`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    width: 150px;
    height: 30px;
    color: #0864f7;
    cursor: pointer;
    border-radius: 5px;
    border: 1px solid #aec8f1ff;
`;

export const MyPosts = styled.div`
    border: 1px solid #aec8f1ff;
    width: 100vh;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    position: relative;
`;

export const PostImage = styled.img`
    height: 30vw;
    padding: 20px;
`;

export const LikeAndDate = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const LikeImage = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-left: 20px;
    gap: 5px;
`;

export const IoHeartOutlineStyled = styled(IoHeartOutline)`
    width: 30px;
    height: 30px;
    color: #0864f7;
`;

export const IoHeartFilledStyled = styled(IoHeart)`
    width: 30px;
    height: 30px;
    color: #ff4b4b;
`;

export const DateContainer = styled.div`
    margin-right: 20px;
    font-size: 14px;
    color: #555;
`;

export const AddPostIcon = styled(IoAddCircle)`
    color: #0864f7;
    width: 50px;
    height: 50px;
    position: fixed;
    right: 300px;
    top: 800px;
`;

export const Description = styled.div`
    margin-left: 25px;
    margin-top: 20px;
`;
