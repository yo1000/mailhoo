import React from "react";
import {css} from "@emotion/react";
import {Row, Col, Button, ButtonGroup, ButtonToolbar} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleRight, faFile, faRotateRight} from '@fortawesome/free-solid-svg-icons'

import colors from '../colors'

export default function MessageTable({
  messagesState,
  messageDetailsState,
  viewConditionState,
}) {
  const style = css`
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
        }
      }
    }
    
    .messages {
      .row {
        height: 2.5rem;
        margin: auto;
        border-bottom: 1px solid ${colors.backgroundActive};
        
        &:first-child {
          border-top: 1px solid ${colors.backgroundActive};
        }
        
        &:hover {
          background: ${colors.backgroundActive};
          cursor: pointer;
        }
        
        .email {
          width: 14rem;
          max-width: 14rem;
          white-space: nowrap;
          overflow: hidden;
          
          svg {
            margin-left: -3px;
            margin-right: .125rem;
          }
        }
        
        .subject,
        .attachment,
        .received {
          margin: auto;
        }
        
        .subject {
          width: 100%;
          max-width: 100%;
          
          white-space: nowrap;
          overflow: hidden;
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

  const API_BAE_URL = process.env.API_BASE_URL

  const [getMessages, setMessages] = messagesState
  const [getMessageDetails, setMessageDetails] = messageDetailsState

  /**
   * { list: 'all' }
   * { listBySearchQuery: ... }
   * { listByFromDomain: ... }
   * { listByToDomain: ... }
   * { listByCcDomain: ... }
   * { listByBccDomain: ... }
   */
  const [getViewCondition, setViewCondition] = viewConditionState

  const updateMessages = (page) => {
    fetch(`${API_BAE_URL}/messages${page ? `?page=${page}` : ''}`)
      .then(resp => resp.json())
      .then(messages => {
        setViewCondition({ list: 'all' })
        setMessages(messages)
        setMessageDetails(null)
      })
  }

  const updateMessagesByFromDomain = (domainName, page) => {
    fetch(`${API_BAE_URL}/messages?fromDomain=${domainName}${page ? `&page=${page}` : ''}`)
      .then(resp => resp.json())
      .then(messages => {
        setViewCondition({ listByFromDomain: domainName })
        setMessages(messages)
        setMessageDetails(null)
      })
  }

  const updateMessagesByToDomain = (domainName, page) => {
    fetch(`${API_BAE_URL}/messages?toDomain=${domainName}${page ? `&page=${page}` : ''}`)
      .then(resp => resp.json())
      .then(messages => {
        setViewCondition({ listByToDomain: domainName })
        setMessages(messages)
        setMessageDetails(null)
      })
  }

  const updateMessagesByCcDomain = (domainName, page) => {
    fetch(`${API_BAE_URL}/messages?ccDomain=${domainName}${page ? `&page=${page}` : ''}`)
      .then(resp => resp.json())
      .then(messages => {
        setViewCondition({ listByCcDomain: domainName })
        setMessages(messages)
        setMessageDetails(null)
      })
  }

  const updateMessagesByBccDomain = (domainName, page) => {
    fetch(`${API_BAE_URL}/messages?bccDomain=${domainName}${page ? `&page=${page}` : ''}`)
      .then(resp => resp.json())
      .then(messages => {
        setViewCondition({ listByBccDomain: domainName })
        setMessages(messages)
        setMessageDetails(null)
      })
  }

  const updateMessagesBySearchQuery = (searchQuery, page) => {
    fetch(`${API_BAE_URL}/messages/search?q=${searchQuery}${page ? `&page=${page}` : ''}`)
      .then(resp => resp.json())
      .then(messages => {
        setViewCondition({ listBySearchQuery: searchQuery })
        setMessages(messages)
        setMessageDetails(null)
        deactivateDomainFilterStyle()
      })
  }

  const reload = (page) => {
    if (getViewCondition && getViewCondition.listBySearchQuery) {
      updateMessagesBySearchQuery(getViewCondition.listBySearchQuery, page)
    } else if (getViewCondition && getViewCondition.listByFromDomain) {
      updateMessagesByFromDomain(getViewCondition.listByFromDomain, page)
    } else if (getViewCondition && getViewCondition.listByToDomain) {
      updateMessagesByToDomain(getViewCondition.listByToDomain, page)
    } else if (getViewCondition && getViewCondition.listByCcDomain) {
      updateMessagesByCcDomain(getViewCondition.listByCcDomain, page)
    } else if (getViewCondition && getViewCondition.listByBccDomain) {
      updateMessagesByBccDomain(getViewCondition.listByBccDomain, page)
    } else {
      updateMessages(page)
    }
  }

  const chooseMessage = (message) => {
    setMessageDetails(message)
  }

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

  return (
    <div css={style}>
      <div className="header">
        <Row>
          <Col className="reload">
            <Button variant="outline-secondary" onClick={() => {reload(getMessages.number)}}>
              <FontAwesomeIcon icon={faRotateRight}/> Reload
            </Button>
          </Col>
          <Col className="paginator">
            {
              getMessages && getMessages.totalPages && (
                <ButtonToolbar>
                  {
                    (getMessages.totalPages >= 14) && (getMessages.number > 4) && (
                      <ButtonGroup className="me-2">
                        <Button variant="outline-secondary" onClick={
                          () => reload(0)
                        }>{1}</Button>
                      </ButtonGroup>
                    )
                  }
                  <ButtonGroup className="me-2">
                    {
                      createPaginatorIndexes(getMessages.number, getMessages.totalPages).map(i => (
                        <Button variant="outline-secondary"
                                className={i === getMessages.number && 'active'} onClick={
                          () => reload(i)
                        }>{i + 1}</Button>
                      ))
                    }
                  </ButtonGroup>
                  {
                    (getMessages.totalPages >= 14) && (getMessages.number + 5 < getMessages.totalPages) && (
                      <ButtonGroup className="me-2">
                        <Button variant="outline-secondary" onClick={
                          () => reload(getMessages.totalPages - 1)
                        }>{getMessages.totalPages}</Button>
                      </ButtonGroup>
                    )
                  }
                </ButtonToolbar>
              )
            }
          </Col>
        </Row>
      </div>

      <div className="messages">
        {
          getMessages && getMessages.content && getMessages.content.map(m => (
            <Row className="row" onClick={() => chooseMessage(m)}>
              <Col className="email">
                <ItemEmail sentFrom={m.sentFrom}
                           receivedTo={m.receivedTo}
                           receivedCc={m.receivedCc}
                           receivedBcc={m.receivedBcc}/>
              </Col>
              <Col className="subject">
                <ItemSubjectContent subject={m.subject}
                                    plainContent={m.plainContent}
                                    htmlContent={m.htmlContent}/>
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

function ItemEmail({
  sentFrom,
  receivedTo,
  receivedCc,
  receivedBcc
}) {
  const style = css`
    .sender,
    .receiver {
      font-size: .9rem;
    }
    
    .sender {
      margin-bottom: -4px;
      color: #202124;
    }
    
    .receiver {
      color: #5f6368;
    }
  
    .arrow {
      margin-left: .0625rem;
      margin-right: .0625rem;
      width: .9rem;
      height: .9rem;
    }
  `

  const fromList = sentFrom && sentFrom.filter(item => item.address).map(item => item.address.displayName || item.address.email)
  const toList = receivedTo && receivedTo.filter(item => item.address).map(item => item.address.displayName || item.address.email)
  const ccList = receivedCc && receivedCc.filter(item => item.address).map(item => item.address.displayName || item.address.email)
  const bccList = receivedBcc && receivedBcc.filter(item => item.address).map(item=> item.address.displayName || item.address.email)

  return (
    <div css={style}>
      <div className="sender">
        {fromList.join(', ')}
      </div>
      <div className="receiver">
        <FontAwesomeIcon icon={faAngleRight} className="arrow"/>
        {toList.concat(ccList).concat(bccList).join(', ')}
      </div>
    </div>
  )
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
  const style =css`
    .subject {
      color: #202124;
    }
    
    .content,
    .content::before {
      color: #5f6368;
    }
    
    .content::before {
      content: ' - ';
    }
  `

  return (
    <div css={style}>
      <span className="subject">
        {subject}
      </span>
      <span className="content">
        {plainContent || htmlContent}
      </span>
    </div>
  )
}