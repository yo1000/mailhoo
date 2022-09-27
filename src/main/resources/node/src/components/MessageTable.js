import React from "react";
import {css} from "@emotion/react";
import {Row, Col} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleRight, faFile} from '@fortawesome/free-solid-svg-icons'

import colors from '../colors'

export default function MessageTable({
  messagesState,
  messageDetailsState,
}) {
  const style = css`
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
  `

  const [getMessages, setMessages] = messagesState
  const [getMessageDetails, setMessageDetails] = messageDetailsState

  const chooseMessage = (message) => {
    setMessageDetails(message)
  }

  return (
    <div css={style}>
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