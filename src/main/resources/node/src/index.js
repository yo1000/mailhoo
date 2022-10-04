import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {css} from "@emotion/react";
import {Row, Col, Stack, Form, Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {MarkGithubIcon} from '@primer/octicons-react'

import DomainList from "./components/DomainList";
import MessageTable from "./components/MessageTable"
import MessageDetails from "./components/MessageDetails"
import Logo from "./components/Logo"
import ViewState from "./ViewState";
import colors from "./colors"

function Layout() {
  const style = css`
    margin: 1rem 1.5rem 0;
    padding: 0;
    color: ${colors.foreground};
    
    .search form {
      margin-top: -30px;
      
      input {
        &::placeholder {
          padding-left: 1.5rem;
          color: ${colors.foregroundSecondary};
        }
        
        &:focus {
          border-color: #6c757d;
          box-shadow: 0 0 0 0.25rem rgb(108 117 125 / 50%);
        }
      }
      
      svg {
        position: relative;
        top: 2rem;
        left: .75rem;
        color: ${colors.foregroundSecondary};
      }
      
      &.hidden {
        svg,
        input::placeholder {
          opacity: 0;
        }
      }
    }
    
    .github {
      width: 48px;
      max-width: 48px;
      
      a {
        color: ${colors.foreground};
        
        &:hover {
          color: ${colors.foregroundSecondary};
        }
      }
    }
    
    .messageTableContainer {
      &>*:nth-child(1) {
        margin-top: 1rem;
      }
      
      &>*:nth-child(2) {
        margin-top: 2rem;
      }
    }
  `

  const viewState = new ViewState({
    initializedState: useState(false),
    fromDomainsState: useState(),
    toDomainsState: useState(),
    ccDomainsState: useState(),
    bccDomainsState: useState(),
    pagedMessagesState: useState(),
    messageDetailsState: useState(),
    viewConditionState: useState()
  })

  const focusSearch = () => {
    document.querySelectorAll('.search form').forEach(elm => {
      elm.classList.add('hidden')
    })
  }

  const blurSearch = () => {
    const q = document.getElementById('searchQuery').value
    document.querySelectorAll('.search form').forEach(elm => {
      if (!q) {
        elm.classList.remove('hidden')
      }
    })
  }

  useEffect(() => {
    if (!viewState.initialized) {
      viewState.reload()
      viewState.setInitialized(true)
    }
  })

  return (
    <div css={style}>
      <Row>
        <Col sm={2}>
          <Logo/>
          <DomainList viewState={viewState}/>
        </Col>
        <Col sm={10}>
          <Stack>
            <Row>
              <Col className="search">
                <Form onSubmit={(event) => {
                  event.preventDefault()
                  const q = document.getElementById('searchQuery').value
                  viewState.updateMessagesBySearchQuery(q, 0)
                }}>
                  <FontAwesomeIcon icon={faMagnifyingGlass}/>
                  <Form.Control type="text" placeholder="Search mail"
                                id="searchQuery"
                                onFocus={focusSearch}
                                onBlur={blurSearch}/>
                </Form>
              </Col>
              <Col className="github">
                <a href="https://github.com/yo1000/mailhoo" target="_blank" rel="noopener noreferrer">
                  <MarkGithubIcon size={24}/>
                </a>
              </Col>
            </Row>
            <Row>
              <Col sm={12} className="messageTableContainer">
                {
                  viewState.isDetailsView() ? (<MessageDetails viewState={viewState}/>) :
                  viewState.isListView() ? (<MessageTable viewState={viewState}/>) : <></>
                }
              </Col>
            </Row>
          </Stack>
        </Col>
      </Row>
    </div>
  )
}

const main = document.getElementById('main')
ReactDOM.render(<Layout/>, main)
