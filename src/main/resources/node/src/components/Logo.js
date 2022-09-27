import React from "react";
import {css} from "@emotion/react";
import {Container} from "react-bootstrap";
import {ReactComponent as LogoSvg} from "./mailhoo_logo.svg"

export default function Logo() {
  const style = css`
    margin-top: -1.175rem;
    padding: 0;
    
    svg {
      width: 32px;
      height: 64px;
      margin-right: .25rem;
    }
    
    h1 {
      display: inline;
      position: relative;
      height: 100px;
      top: .3rem;
      margin-left: .5rem;
      font-size: 1.5rem;
    }
  `

  return (<Container css={style}>
    <LogoSvg/><h1>Mailhoo</h1>
  </Container>)
}
