import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyles = createGlobalStyle`
    ${reset}

    * {
        box-sizing: border-box;// 모든 box들을 box의 내부로 사용
    }

    body {
        font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 16px;

        @media only screen and (max-width: 1000px) {
            font-size: 14px;
        }
    }

    a {
        color: inherit;
        text-decoration: none;
        font-family: inherit;
    }

    button {
        background-color: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        padding: 0;
        margin: 0;
        font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    main {
        padding-top: 50px;
        min-height: calc(100vh - 120px);
        background-color: white;
    }

    .inner {
        width: 100%;
        max-width: 1400px;
        padding: 0px 80px;
        margin: 0 auto;
    }

    .mobileShow {
        display: none;

        @media only screen and (max-width: 800px) {
            display: block;
        }
    }

    p, span, h1, h2, h3, h4, h5 {
        line-height: 1.5;
    }

    .cardContainer{
        margin-top: 20px;
        margin-right: 20px;
        margin-left: 20px;
        display: flex;
        flex-flow: wrap;
        //   justify-content: space-between;
        justify-content: center;
        align-content: center;
        
    }

    .cardItem{
        padding: 10px;
        height: 150px;
        background-color: white;
        margin: 20px;
        border: 1px solid black;
        /* display: flex; */

        flex: 1 1 45%;
        
        /* width: 300px; */
        /* flex-basis: 300px; */
        /* flex-grow: 1; */
    }

    .innerContainer{
        display: flex;
        flex-flow: nowrap;
        //   justify-content: space-between;
        justify-content: center;
        /* align-content: center; */
    }

    .innerItem{
        flex: 1 1 70%;
        border: 1px solid black;
    }

    .innerItem:nth-child(1){
        flex-basis: 130px;
    }

    .innerItem:nth-child(2){
        /* flex-basis: 75%; */
    }
`;

export default GlobalStyles;
