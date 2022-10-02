import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {css} from "@emotion/react";
import {Row, Col, Stack, Form, Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRotateRight, faArrowLeft, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {MarkGithubIcon} from '@primer/octicons-react'

import DomainList from "./components/DomainList";
import MessageTable from "./components/MessageTable"
import MessageDetails from "./components/MessageDetails"
import Logo from "./components/Logo"
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

  const API_BAE_URL = process.env.API_BASE_URL

  const [getInitialized, setInitialized] = useState()

  const fromDomainsState = useState()
  const [getFromDomains, setFromDomains] = fromDomainsState

  const toDomainsState = useState()
  const [getToDomains, setToDomains] = toDomainsState

  const ccDomainsState = useState()
  const [getCcDomains, setCcDomains] = ccDomainsState

  const bccDomainsState = useState()
  const [getBccDomains, setBccDomains] = bccDomainsState

  const messagesState = useState()
  const [getMessages, setMessages] = messagesState

  const messageDetailsState = useState()
  const [getMessageDetails, setMessageDetails] = messageDetailsState

  /**
   * { list: 'all' }
   * { listBySearchQuery: ... }
   * { listByFromDomain: ... }
   * { listByToDomain: ... }
   * { listByCcDomain: ... }
   * { listByBccDomain: ... }
   */
  const viewConditionState = useState()
  const [getViewCondition, setViewCondition] = viewConditionState

  const updateFromDomains = () => {
    fetch(`${API_BAE_URL}/domains/from`)
      .then(resp => resp.json())
      .then(domains => setFromDomains(domains))
  }

  const updateToDomains = () => {
    fetch(`${API_BAE_URL}/domains/to`)
      .then(resp => resp.json())
      .then(domains => setToDomains(domains))
  }

  const updateCcDomains = () => {
    fetch(`${API_BAE_URL}/domains/cc`)
      .then(resp => resp.json())
      .then(domains => setCcDomains(domains))
  }

  const updateBccDomains = () => {
    fetch(`${API_BAE_URL}/domains/bcc`)
      .then(resp => resp.json())
      .then(domains => setBccDomains(domains))
  }

  const updateMessages = () => {
    fetch(`${API_BAE_URL}/messages`)
      .then(resp => resp.json())
      .then(messages => {
        setViewCondition({ list: 'all' })
        setMessages(messages)
        setMessageDetails(null)
      })
  }

  const updateMessagesByFromDomain = (domainName) => {
    fetch(`${API_BAE_URL}/messages?fromDomain=${domainName}`)
      .then(resp => resp.json())
      .then(messages => {
        setViewCondition({ listByFromDomain: domainName })
        setMessages(messages)
        setMessageDetails(null)
      })
  }

  const updateMessagesByToDomain = (domainName) => {
    fetch(`${API_BAE_URL}/messages?toDomain=${domainName}`)
      .then(resp => resp.json())
      .then(messages => {
        setViewCondition({ listByToDomain: domainName })
        setMessages(messages)
        setMessageDetails(null)
      })
  }

  const updateMessagesByCcDomain = (domainName) => {
    fetch(`${API_BAE_URL}/messages?ccDomain=${domainName}`)
      .then(resp => resp.json())
      .then(messages => {
        setViewCondition({ listByCcDomain: domainName })
        setMessages(messages)
        setMessageDetails(null)
      })
  }

  const updateMessagesByBccDomain = (domainName) => {
    fetch(`${API_BAE_URL}/messages?bccDomain=${domainName}`)
      .then(resp => resp.json())
      .then(messages => {
        setViewCondition({ listByBccDomain: domainName })
        setMessages(messages)
        setMessageDetails(null)
      })
  }

  const updateMessagesBySearchQuery = (searchQuery) => {
    fetch(`${API_BAE_URL}/messages/search?q=${searchQuery}`)
      .then(resp => resp.json())
      .then(messages => {
        setViewCondition({ listBySearchQuery: searchQuery })
        setMessages(messages)
        setMessageDetails(null)
        deactivateDomainFilterStyle()
      })
  }

  const reload = () => {
    updateFromDomains()
    updateToDomains()
    updateCcDomains()
    updateBccDomains()

    if (getViewCondition && getViewCondition.listBySearchQuery) {
      updateMessagesBySearchQuery(getViewCondition.listBySearchQuery)
    } else if (getViewCondition && getViewCondition.listByFromDomain) {
      updateMessagesByFromDomain(getViewCondition.listByFromDomain)
    } else if (getViewCondition && getViewCondition.listByToDomain) {
      updateMessagesByToDomain(getViewCondition.listByToDomain)
    } else if (getViewCondition && getViewCondition.listByCcDomain) {
      updateMessagesByCcDomain(getViewCondition.listByCcDomain)
    } else if (getViewCondition && getViewCondition.listByBccDomain) {
      updateMessagesByBccDomain(getViewCondition.listByBccDomain)
    } else {
      updateMessages()
    }
  }

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

  const deactivateDomainFilterStyle = () => {
    document.querySelectorAll('.active').forEach(elm => {
      elm.classList.remove('active')
    })
  }

  useEffect(() => {
    if (!getInitialized) {
      reload()
      setInitialized(true)
    }
  })

  return (
    <div css={style}>
      <Row>
        <Col sm={2}>
          <Logo/>
          <DomainList fromDomainsState={fromDomainsState}
                      toDomainsState={toDomainsState}
                      ccDomainsState={ccDomainsState}
                      bccDomainsState={bccDomainsState}
                      messagesState={messagesState}
                      messageDetailsState={messageDetailsState}
                      viewConditionState={viewConditionState}/>
        </Col>
        <Col sm={10}>
          <Stack>
            <Row>
              <Col className="search">
                <Form onSubmit={(event) => {
                  event.preventDefault()
                  const q = document.getElementById('searchQuery').value
                  updateMessagesBySearchQuery(q)
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
                  getMessageDetails ? (<>
                    <Button variant="outline-secondary" onClick={() => {
                      setMessageDetails(null)
                      reload()
                    }}>
                      <FontAwesomeIcon icon={faArrowLeft}/> Back
                    </Button>
                    <MessageDetails messageDetailsState={messageDetailsState}/>
                  </>) :
                  /*
                   * { list: 'all' }
                   * { listBySearchQuery: ... }
                   * { listByFromDomain: ... }
                   * { listByToDomain: ... }
                   * { listByCcDomain: ... }
                   * { listByBccDomain: ... }
                   */
                  getViewCondition && (getViewCondition.list
                  || getViewCondition.listBySearchQuery
                  || getViewCondition.listByFromDomain
                  || getViewCondition.listByToDomain
                  || getViewCondition.listByCcDomain
                  || getViewCondition.listByBccDomain) ? (<>
                    <Button variant="outline-secondary" onClick={reload}>
                      <FontAwesomeIcon icon={faRotateRight}/> Reload
                    </Button>
                    <MessageTable messagesState={messagesState}
                                  messageDetailsState={messageDetailsState}/>
                  </>) :
                  <></>
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
