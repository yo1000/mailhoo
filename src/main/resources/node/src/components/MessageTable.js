import React from "react";
import {css} from "@emotion/react";
import {Button, ButtonGroup, ButtonToolbar, Col, Row} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFile, faRotateRight} from '@fortawesome/free-solid-svg-icons'
import dompurify from 'dompurify'

import colors from '../colors'
import {NavLink, useLocation, useNavigate} from "react-router-dom";

/**
 *
 * @param page
 * @returns {JSX.Element}
 * @constructor
 */
export default function MessageTable({page}) {
  const style = css`
    .mutex.lock {
      cursor: not-allowed;
      
      input,
      button,
      li {
        pointer-events: none;
        color: ${colors.foregroundSecondary};
      }
    }
    
    .header {
      margin: 0 0 1.5rem;
      position: relative;
      
      .reload {
        width: 10rem;
        max-width: 10rem;
      }
      
      .paginator {
        .btn-toolbar {
          float: right;
        }
        
        .btn-group:last-child {
          margin:0 !important;
        }
        
        .btn {
          min-width: 2.375rem;
          
          &.current {
            color: ${colors.formControl.foregroundActive};
            background-color: ${colors.formControl.backgroundActive};
            border-color: ${colors.formControl.backgroundActive};
          }
        }
      }
    }
    
    .messages {
      .row {
        height: 2.5rem;
        margin: auto;
        border-bottom: 1px solid ${colors.backgroundActive};
        
        &:first-child {
          margin-top: 2rem;
          height: 1.5rem;
          
          font-size: .75rem;
          font-weight: bold;          
          color: ${colors.foregroundSecondary};

          border-top: 1px solid ${colors.backgroundActive};
          border-bottom: 2px solid ${colors.backgroundActive};          
        }
        
        &:hover {
          background: ${colors.backgroundActive};
          cursor: pointer;
        }
        
        .email,
        .subject,
        .attachment,
        .received {
          margin: auto;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .email {
          max-width: 12rem;
        }
        
        .subject {
          span {
            color: ${colors.foregroundSecondary};
            font-weight: 300;
            -webkit-font-smoothing: antialiased;
          }
        }
        
        .attachment {
          width: 3rem;
          max-width: 3rem;
          
          text-align: right;
        }
        
        .received {
          width: 8rem;
          max-width: 8rem;
          
          text-align: right;
          
          code {
            color: ${colors.foreground};
          }
        }
      }
    }
  `

  const createPaginatorIndexes = (currentPage, totalPages) => {
    const start =
      totalPages < 10 ? 0 :
      currentPage - 4 <= 0 ? 0 :
      currentPage + 5 > totalPages ? totalPages - 10 :
      currentPage -4
    const end =
      totalPages < 10 ? totalPages :
      currentPage - 4 <= 0 ? 10 :
      currentPage + 5 > totalPages ? totalPages :
      currentPage + 5

    let a = []
    for (let i = start; i < end; i++) {
      a.push(i)
    }

    return a
  }

  const navigate = useNavigate()
  const location = useLocation()
  const basePath = location.pathname.replace(/\/[0-9]+$/, '')

  return (
    <div css={style}>
      <div className="header">
        <Row>
          <Col className="reload mutex">
            <Button variant="outline-secondary" onClick={() =>
              navigate(location.pathname)
            }>
              <FontAwesomeIcon icon={faRotateRight}/> Reload
            </Button>
          </Col>
          <Col className="paginator mutex">
            {
              (page && page.totalPages)
                ? (
                <ButtonToolbar>
                  {
                    (page.totalPages >= 14) && (page.number > 4) && (
                      <ButtonGroup className="me-2">
                        <NavLink className={({isActive}) =>
                          `btn btn-outline-secondary ${isActive ? 'current' : ''}`
                        } to={`${basePath}/${0}`}>{1}</NavLink>
                      </ButtonGroup>
                    )
                  }
                  <ButtonGroup className="me-2">
                    {
                      createPaginatorIndexes(page.number, page.totalPages).map((i, index) => (
                        <NavLink key={`pageNumber-${index}`} className={({isActive}) =>
                          `btn btn-outline-secondary ${isActive ? 'current' : ''}`
                        } to={`${basePath}/${i}`}>{i + 1}</NavLink>
                      ))
                    }
                  </ButtonGroup>
                  {
                    (page.totalPages >= 14) && (page.number + 5 < page.totalPages) && (
                      <ButtonGroup className="me-2">
                        <NavLink className={({isActive}) =>
                          `btn btn-outline-secondary ${isActive ? 'current' : ''}`
                        } to={`${basePath}/${page.totalPages - 1}`}>{page.totalPages}</NavLink>
                      </ButtonGroup>
                    )
                  }
                </ButtonToolbar>
              ) : <></>
            }
          </Col>
        </Row>
      </div>

      <div className="messages">
        <Row className="row">
          <Col className="email">
            Receiver
          </Col>
          <Col className="email">
            Sender
          </Col>
          <Col className="subject">
            Subject - Content
          </Col>
          <Col className="attachment">
          </Col>
          <Col className="received">
            Date
          </Col>
        </Row>
        {
          page && page.content && page.content.map((m, index) => (
            <Row key={`pageContent-${index}`} className="row" onClick={() =>
              navigate(`../m/${m.id}`)
            }>
              <Col className="email">
                <ItemReceiver receivedTo={m.receivedTo} receivedCc={m.receivedCc} receivedBcc={m.receivedBcc}/>
              </Col>
              <Col className="email">
                <ItemSender sentFrom={m.sentFrom}/>
              </Col>
              <Col className="subject">
                <ItemSubjectContent subject={m.subject} plainContent={m.plainContent} htmlContent={m.htmlContent}/>
              </Col>
              <Col className="attachment">
                <ItemAttachment attachments={m.attachments}/>
              </Col>
              <Col className="received">
                <ItemLocalDateTime dateTime={m.receivedDate}/>
              </Col>
            </Row>
          ))
        }
      </div>
    </div>
  )
}

function ItemSender({
  sentFrom
}) {
  const fromList = sentFrom && sentFrom.filter(item => item.address).map(item => item.address.displayName || item.address.email)

  return (<>
    {fromList.join(', ')}
  </>)
}

function ItemReceiver({
  receivedTo,
  receivedCc,
  receivedBcc
}) {
  const toList = receivedTo && receivedTo.filter(item => item.address).map(item => item.address.displayName || item.address.email)
  const ccList = receivedCc && receivedCc.filter(item => item.address).map(item => item.address.displayName || item.address.email)
  const bccList = receivedBcc && receivedBcc.filter(item => item.address).map(item=> item.address.displayName || item.address.email)

  return (<>
    {toList.concat(ccList).concat(bccList).join(', ')}
  </>)
}

function ItemLocalDateTime({dateTime}) {
  const received = dateTime && new Date(Date.parse(dateTime))
  const now12hAgo = new Date()
  now12hAgo.setHours(-12)

  const displayDateTime = Date.parse(received) > Date.parse(now12hAgo)
    ? received.toLocaleTimeString(undefined, {
      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
    })
    : received.toLocaleDateString(undefined, {
      weekday: undefined, year: 'numeric', month: '2-digit', day: '2-digit'
    })

  return (<code>{displayDateTime}</code>)
}

function ItemAttachment({attachments}) {
  return (attachments && attachments.length
    ? <FontAwesomeIcon icon={faFile}/>
    : <></>)
}

function ItemSubjectContent({subject, plainContent, htmlContent}) {
  const content = dompurify.sanitize(htmlContent || plainContent, {ALLOWED_TAGS: ['#text']})
  return (<>
    {subject}
    <span>{content && ` - ${content}`}</span>
  </>)
}
