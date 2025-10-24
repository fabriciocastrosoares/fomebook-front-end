import styled from "styled-components";

export const Page = styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    @media (min-width: 768px) { 
        flex-direction: row; 
    }
`;

export const Top = styled.div`
    background-color: #dbe6f8ff;
    display: flex;
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
    }
`;

export const Options = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;

    @media (max-width: 600px) {
        width: 100%;
    }
`;

export const OptionLink = styled.h5`
    cursor: pointer;
    color: ${props => props.$primary === false ? '#777' : ''};
    font-size: 1em; 

    @media (max-width: 480px) {
        font-size: 0.9em; 
    }
`;

export const Left = styled.div`
    background-color: #c2d7f8ff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 100%; 
    min-height: 50vh; 
    padding: 20px;
    box-sizing: border-box;

    @media (min-width: 768px) {
        width: 70%; 
        min-height: 100vh;
    }
`;


export const InputWrapper = styled.div`
    position: relative;
    width: 90%; 
    max-width: 400px; 
    height: ${props => props.$isBig ? "120px" : "60px"};
    margin-bottom: 5px;

    input, textarea {
        background-color: #FFFFFF;
        width: 100%;
        height: 100%;
        border-radius: 12px;
        border: 1px solid #aec8f1ff;
        padding: 20px 22px 0 22px;
        box-sizing: border-box;
        outline: none;
        font-size: 14px;

        &:focus { border-color: #0864f7; }
    }

    label {
        position: absolute;
        left: 22px;
        top: 50%;
        transform: translateY(-50%);
        transition: all 0.2s ease-in-out;
        pointer-events: none;
        color: #777;
    }

    input:focus + label,
    input:not(:placeholder-shown) + label,
    textarea:focus + label,
    textarea:not(:placeholder-shown) + label {
        top: 6px;
        font-size: 12px;
        font-weight: 500;
        color: #0864f7;
    }

    @media (max-width: 480px) {
        height: ${props => props.$isBig ? "100px" : "50px"};
        margin-bottom: 15px;
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
      width: 100%; 
      gap: 5px;
      padding: 20px;
      box-sizing: border-box;

      form {
        width: 90%; 
        max-width: 450px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px; 
      }

      h2 {
        font-size: 2em; 
        margin-bottom: 10px;
      }

      button {
        width: 90%; 
        max-width: 400px;
        height: 60px;
        border: none;
        border-radius: 12px;
        background-color: #0864f7;
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
        cursor: pointer;
        outline: none;
        transition: background-color 0.2s ease;
      }

      p {
        font-size: 0.9em;
      }

      @media (min-width: 768px) {
        width: 30%; 
        min-height: 100vh;
      }
`;