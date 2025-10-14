import styled from "styled-components";
import { IoHeart, IoHeartOutline, IoExitOutline } from "react-icons/io5";

export const FollowButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid
    ${(props) => (props.$isFollowing ? "#ff4b4b" : "#aec8f1ff")};
  background-color: ${(props) =>
    props.$isFollowing ? "#ff4b4b" : "#0864f7"};
  color: white;
  border-radius: 5px;
  width: 200px;
  height: 30px;
  cursor: ${(props) => (props.disabled ? "wait" : "pointer")};
  font-size: 16px;
  font-weight: bold;
`;

export const LikeImage = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  cursor: pointer;
  gap: 5px;
  user-select: none;

  p {
    font-size: 14px;
    color: #333;
  }
`;

export const IoHeartOutlineStyled = styled(IoHeartOutline)`
  width: 30px;
  height: 30px;
  color: #0864f7;
  transition: transform 0.2s ease;
  &:active {
    transform: scale(1.2);
  }
`;

export const IoHeartFilledStyled = styled(IoHeart)`
  width: 30px;
  height: 30px;
  color: #ff4b4b;
  transition: transform 0.2s ease;
  &:active {
    transform: scale(1.2);
  }
`;