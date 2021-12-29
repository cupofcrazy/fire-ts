import { createGlobalStyle } from "styled-components";
import { mq } from "../utils";

export const GlobalStyles = createGlobalStyle`
  
  /* Box sizing rules */
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Remove default padding */
  ul[class],
  ol[class] {
    /* padding: 0; */
  }

  /* Remove default margin */
  body,
  h1,
  h2,
  h3,
  h4,
  p,
  ul[class],
  ol[class],
  figure,
  blockquote,
  dl,
  dd {
    margin: 0;
    line-height: 1;
  }

  :root {
    --black: #111111;
    --white: #FFFFFF;
    --gray: #DDDDDD;
    --yellow: ff9900;
    --light-yellow: #fff3d1; 
  }

  /* Set core root defaults */
  html {
    scroll-behavior: smooth;
    font-size: 14px;
    font-family: SF Pro Text, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }

  ::-webkit-scrollbar {
    width: 0px;
    /* height: 10px; */
  }
  ::-webkit-scrollbar-track {
      background: transparent;
  }
  ::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,.2);
  }

  /* Set core body defaults */
  body {
    min-height: 100vh;
    text-rendering: optimizeSpeed;
  }

  /* Remove list styles on ul, ol elements with a class attribute */
  ul[class],
  ol[class] {
    list-style: none;
  }

  /* A elements that don't have a class get default styles */
  a:not([class]) {
    text-decoration-skip-ink: auto;
  }

  /* Make images easier to work with */
  img,
  picture {
    max-width: 100%;
    display: block;
  }

  /* Natural flow and rhythm in articles by default */
  article > * + * {
    margin-top: 1em;
  }

  /* Inherit fonts for inputs and buttons */
  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  /* Blur images when they have no alt attribute */
  img:not([alt]) {
    filter: blur(10px);
  }

  /* Remove all animations and transitions for people that prefer not to see them */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
  }


  button {
    font-family: inherit;
    cursor: pointer;
    border: 0;
    display: block;
    background: transparent;

    &:disabled {
      cursor: not-allowed;
      opacity: .5;
    }
  }
`