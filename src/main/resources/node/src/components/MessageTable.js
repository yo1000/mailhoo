import React from "react";
import {css} from "@emotion/react";
import {Row, Col, Button, ButtonGroup, ButtonToolbar} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleRight, faFile, faRotateRight, faAngleLeft} from '@fortawesome/free-solid-svg-icons'
import {ReplyIcon} from "@primer/octicons-react";

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
        {
          viewState.pagedMessages && viewState.pagedMessages.content && viewState.pagedMessages.content.map(m => (
            <Row className="row" onClick={() => viewState.chooseMessage(m)}>
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
      
      .arrow {
        margin-left: .5rem;
        margin-right: .25rem;
        width: .9rem;
        height: .9rem;
        
        transform: rotate(180deg);
      }
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
        <ReplyIcon size={14} className="arrow"/>
        {/*<FontAwesomeIcon icon={faTurnUp} className="arrow"/>*/}
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