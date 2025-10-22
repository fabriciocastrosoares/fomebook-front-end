import styled from "styled-components";

export const Page = styled.div`
    background-color: white;
    display: flex;
    height: 100%;
    width: 100%;
`;

export const Top = styled.div`
    background-color: #dbe6f8ff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90px;
    width: 100%;
    border-bottom: 1px solid #aec8f1ff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
`;

export const Options = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    position: fixed;
    right: 60px;
    top: 20px;
`;

export const OptionLink = styled.h5`
    cursor: pointer;
    color: ${props => props.$primary === false ? '#777' : ''};
`;

export const Left = styled.div`
    background-color: #c2d7f8ff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 70%;
    height: 100%;
`;


export const InputWrapper = styled.div`
    position: relative;
    width: 400px;
    height: ${props => props.$isBig ? "120px" : "60px"};
    textarea:focus + label {
        top: 6px;
        font-size: 12px;
        font-weight: 500;
        color: #0864f7;
    }
`;

export const TextArea = styled.textarea`
    box-sizing: border-box;
    font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: black;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    border: 1px solid #aec8f1ff;
    padding: 20px 22px 0 22px;
    outline: none;
    resize: none; 
    &:focus { border-color: #0864f7; }
`;

export const ContanerLogin = styled.div`
     background-color: #dbe6f8ff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 40%;
      gap: 25px;
`;