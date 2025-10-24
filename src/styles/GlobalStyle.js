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

  input, button, textarea, select {
    font-family: inherit; /* Garante que elementos de formulário herdem a fonte */
  }

`;

export default GlobalStyle;
