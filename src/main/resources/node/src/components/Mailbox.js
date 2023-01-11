import React, {useEffect, useState} from "react";
import {css} from "@emotion/react";
import {Col, Row, Stack} from "react-bootstrap";
import {MarkGithubIcon} from '@primer/octicons-react'

import SideBar from "./SideBar";
import MessageTable from "./MessageTable"
import MessageDetails from "./MessageDetails"
import Logo from "./Logo"
import colors from "../colors"
import SearchBox from "./SearchBox";
import {Navigate, Route, Routes, useLocation, useParams} from "react-router-dom";

export default function Mailbox() {
  const style = css`
    margin: 1rem 1.5rem 0;
    padding: 0;
    color: ${colors.foreground};

    .sidebar {
      width: 15.5rem;
    }
    
    .main-contents {
      width: calc(100% - 15.5rem);
    }

    .mutex.lock {
      cursor: not-allowed;
      
      input,
      button,
      li {
        pointer-events: none;
        color: ${colors.foregroundSecondary};
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

  return (
    <div css={style}>
      <Row>
        <Col className="sidebar" sm={2}>
          <Logo/>
          <Routes>
            <Route path="*" element={<SideBar/>}/>
          </Routes>
        </Col>
        <Col className="main-contents" sm={10}>
          <Stack>
            <Row>
              <Col className="search">
                <SearchBox/>
              </Col>
              <Col className="github">
                <a href="https://github.com/yo1000/mailhoo" target="_blank" rel="noopener noreferrer">
                  <MarkGithubIcon size={24}/>
                </a>
              </Col>
            </Row>
            <Row>
              <Col sm={12} className="messageTableContainer">
                <Routes>
                  <Route path="/domains/:filterType/:filterValue">
                    <Route path="p/:p-:s" element={<FilteredMessageTable/>}/>
                    <Route path="m/:id" element={<SelectedMessageDetails/>}/>
                    <Route path="" element={<Navigate to="p/0-20" replace/>}/>
                  </Route>
                  <Route path="/search/:queryType/:queryValue">
                    <Route path="p/:p-:s" element={<QueriedMessageTable/>}/>
                    <Route path="m/:id" element={<SelectedMessageDetails/>}/>
                    <Route path="" element={<Navigate to="p/0-20" replace/>}/>
                  </Route>
                  <Route path="/unread">
                    <Route path="p/:p-:s" element={<UnreadMessageTable/>}/>
                    <Route path="m/:id" element={<SelectedMessageDetails/>}/>
                    <Route path="" element={<Navigate to="p/0-20" replace/>}/>
                  </Route>
                  <Route path="/">
                    <Route path="p/:p-:s" element={<InboxMessageTable/>}/>
                    <Route path="m/:id" element={<SelectedMessageDetails/>}/>
                    <Route path="" element={<Navigate to="p/0-20" replace/>}/>
                  </Route>
                </Routes>
              </Col>
            </Row>
          </Stack>
        </Col>
      </Row>
    </div>
  )
}

function InboxMessageTable() {
  const {p, s} = useParams()
  const location = useLocation()
  const [page, setPage] = useState()

  useEffect(() => {
    async function fetchPage() {
      const API_BASE_URL = process.env.API_BASE_URL
      const pageQuery = !p && p !== '0' ? '' : `page=${p}&size=${s}`

      await fetch(`${API_BASE_URL}/messages?all&${pageQuery}`)
        .then(resp => resp.json())
        .then(pageResp => {
          setPage(pageResp)
        })
    }

    fetchPage()
  }, [location])

  return <MessageTable page={page}/>
}

function UnreadMessageTable() {
  const {p, s} = useParams()
  const location = useLocation()
  const [page, setPage] = useState()

  useEffect(() => {
    async function fetchPage() {
      const API_BASE_URL = process.env.API_BASE_URL
      const pageQuery = !p && p !== '0' ? '' : `page=${p}&size=${s}`

      await fetch(`${API_BASE_URL}/messages?unread=true&${pageQuery}`)
        .then(resp => resp.json())
        .then(pageResp => {
          setPage(pageResp)
        })
    }

    fetchPage()
  }, [location])

  return <MessageTable page={page}/>
}

function FilteredMessageTable() {
  const {filterType, filterValue, p, s} = useParams()
  const location = useLocation()
  const [page, setPage] = useState()

  useEffect(() => {
    async function fetchPage() {
      const API_BASE_URL = process.env.API_BASE_URL
      const pageQuery = !p && p !== '0' ? '' : `page=${p}&size=${s}`

      await fetch(`${API_BASE_URL}/messages?${filterType}Domain=${filterValue}&${pageQuery}`)
        .then(resp => resp.json())
        .then(pageResp => {
          setPage(pageResp)
        })
    }

    fetchPage()
  }, [location])

  return <MessageTable page={page}/>
}

function QueriedMessageTable() {
  const {queryType, queryValue, p, s} = useParams()
  const location = useLocation()
  const [page, setPage] = useState()

  useEffect(() => {
    async function fetchPage() {
      const API_BASE_URL = process.env.API_BASE_URL
      const pageQuery = !p && p !== '0' ? '' : `page=${p}&size=${s}`

      await fetch(`${API_BASE_URL}/messages/search?${queryType}=${queryValue}&${pageQuery}`)
        .then(resp => resp.json())
        .then(pageResp => {
          setPage(pageResp)
        })
    }

    fetchPage()
  }, [location])

  return <MessageTable page={page}/>
}

function SelectedMessageDetails() {
  const {id} = useParams()
  const location = useLocation()
  const [message, setMessage] = useState()

  useEffect(() => {
    async function fetchMessage() {
      const API_BASE_URL = process.env.API_BASE_URL

      await fetch(`${API_BASE_URL}/messages/${id}`)
        .then(resp => resp.json())
        .then(messageResp => {
          setMessage(messageResp)
        })

      await fetch(`${API_BASE_URL}/messages/${id}/unread`, {
        method: 'PATCH',
        headers: {
          "Content-Type": 'application/json'
        },
        body: 'false'
      })
    }

    fetchMessage()
  }, [location])

  return <MessageDetails message={message}/>
}
