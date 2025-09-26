// src/styles/GlobalStyle.js
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    /* Aplique a fonte globalmente no body (não em * com aninhamento) */
    font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    font-style: normal;
    font-weight: 400;
    background: #fff;
    color: #000;
  }

  /* Cabeçalhos — separe-os, não os aninhe dentro de * */
  h1, h2, h3, h5, h4, h6 {
    font-family: inherit; /* herda a mesma font-family do body */
    margin: 0;
    color: #0864f7;
    font-weight: 700;
  }

  h2 {
    font-size: 36px;
  }

  /* ajustes úteis */
  /* input, button, textarea, select {
    font-family: inherit;
  } */

      
    button{
        font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
        width: 182px;
        height: 60px;
        outline: none;
        border: none;
        border-radius: 12px;
        background-color: #0864f7;
        cursor: pointer;
        padding: 12px; 
    }
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 25px;
        margin-top: 200px;
    }  

   input {
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

        &:focus {
            border-color: #0864f7;
        }
    }

        label {
        position: absolute;
        left: 22px;
        top: 20px;
        font-size: 14px;
        font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        font-weight: 400;
        color: #777;
        transition: 0.2s ease;
        pointer-events: none;
    }

    input:focus + label,
    .filled {
        top: 6px;
        font-size: 12px;
        font-weight: 500;
        color: #0864f7;
    }

`;

export default GlobalStyle;
