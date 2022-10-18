import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {css} from "@emotion/react";
import {Row, Col, Stack, Form, InputGroup} from "react-bootstrap";
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

    .mutex.lock {
      cursor: not-allowed;
      
      input,
      button,
      li {
        pointer-events: none;
        color: ${colors.foregroundSecondary};
      }
    }
    
    .search form {
      margin-top: -7px;
      
      .form-select {
        max-width: 10rem;
        padding-left: 1.75rem;
        border-right: 0;
      }
      
      input {
        &::placeholder {
          color: ${colors.foregroundSecondary};
        }
        
        &:-internal-autofill-selected,
        &:-internal-autofill-selected:focus {
          -webkit-box-shadow: 0 0 0px 10rem ${colors.background} inset;
        }
      }
      
      .form-select:focus,
      input:focus {
        border-color: #6c757d;
        box-shadow: 0 0 0 0.25rem rgb(108 117 125 / 50%);
      }
      
      svg {
        position: absolute;
        top: .75rem;
        left: .75rem;
        z-index: 10;
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
      viewState.renderWithUpdateDomains({})
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
                  const f = document.getElementById('searchField').value
                  viewState.updateMessages(null, null,
                    `${viewState.API_BASE_URL}/messages/search?q=${q}&f=${f}`,
                    { listBySearchQuery: { q: q, f: f }, number: null, dir: null },
                    () => { viewState.deactivateDomainFilterStyle() }
                  )
                }}>
                  <InputGroup className="mb-3">
                    <Form.Select id="searchField">
                      <option value="subject">Subject</option>
                      <option value="content">Content</option>
                      <option value="from">From</option>
                      <option value="to">To</option>
                      <option value="cc">Cc</option>
                      <option value="bcc">Bcc</option>
                      <option value="attachment">Attachment</option>
                    </Form.Select>
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    <Form.Control type="text" placeholder="Search mail"
                                  id="searchQuery"/>
                  </InputGroup>
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
