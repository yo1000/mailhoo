import React from "react";
import {css} from "@emotion/react";
import {Row, Col, Button, ButtonGroup, ButtonToolbar} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFile, faRotateRight} from '@fortawesome/free-solid-svg-icons'
import dompurify from 'dompurify'

import colors from '../colors'

/**
 *
 * @param {ViewState} viewState
 * @returns {JSX.Element}
 * @constructor
 */
export default function MessageTable({viewState}) {
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

  return (
    <div css={style}>
      <div className="header">
        <Row>
          <Col className="reload mutex">
            <Button variant="outline-secondary" onClick={() => viewState.renderWithUpdateDomains({})}>
              <FontAwesomeIcon icon={faRotateRight}/> Reload
            </Button>
          </Col>
          <Col className="paginator mutex">
            {
              (viewState.pagedMessages && viewState.pagedMessages.totalPages)
                ? (
                <ButtonToolbar>
                  {
                    (viewState.pagedMessages.totalPages >= 14) && (viewState.pagedMessages.number > 4) && (
                      <ButtonGroup className="me-2">
                        <Button variant="outline-secondary" onClick={
                          () => viewState.render({n: 0})
                        }>{1}</Button>
                      </ButtonGroup>
                    )
                  }
                  <ButtonGroup className="me-2">
                    {
                      createPaginatorIndexes(viewState.pagedMessages.number, viewState.pagedMessages.totalPages).map(i => (
                        <Button variant="outline-secondary"
                                className={i === viewState.pagedMessages.number && 'active current'} onClick={
                          () => viewState.render({n: i})
                        }>{i + 1}</Button>
                      ))
                    }
                  </ButtonGroup>
                  {
                    (viewState.pagedMessages.totalPages >= 14) && (viewState.pagedMessages.number + 5 < viewState.pagedMessages.totalPages) && (
                      <ButtonGroup className="me-2">
                        <Button variant="outline-secondary" onClick={
                          () => viewState.render({n: viewState.pagedMessages.totalPages - 1})
                        }>{viewState.pagedMessages.totalPages}</Button>
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
        <Row className="row" onClick={() => viewState.chooseMessage(m)}>
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
          viewState.pagedMessages && viewState.pagedMessages.content && viewState.pagedMessages.content.map(m => (
            <Row className="row" onClick={() => viewState.chooseMessage(m)}>
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
