import React, {useCallback, useState} from "react";
import {css} from "@emotion/react";
import {Button, ButtonGroup, Col, Row, ToggleButton} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowLeft, faFileArrowDown} from '@fortawesome/free-solid-svg-icons'
import dompurify from 'dompurify'

import colors from "../colors"
import {useNavigate} from "react-router-dom";

/**
 *
 * @param message
 * @returns {JSX.Element}
 * @constructor
 */
export default function MessageDetails({message}) {
  const headerStyle = css`
    h2 {
      font-size: 1.5rem;
      font-weight: 400;
    }
    
    &>*:nth-child(n+2) {
      margin-top: 1.5rem;
    }
    
    &>*:last-child {
      margin-bottom: 1.5rem;
    }
    
    .addresses {
      th, td {
        vertical-align: top;
      }

      th {
        font-weight: normal;
        color: ${colors.foregroundSecondary};
      }
      
      ul {
        list-style: none;
        margin: 0 .75rem;
        padding: 0;
      }
      
      b:nth-child(n+2):before {
        margin-right: .5rem;
        font-weight: normal;
        content: ',';
      }
      
      small {
        margin-left: .25rem;
        color: ${colors.foregroundSecondary};

        &:before {
          content: '<';
        }
      
        &:after {
          content: '>';
        }
      }
    }
    
    .dateTime {
      width: 100%;
      
      th {
        font-weight: normal;
        color: ${colors.foregroundSecondary};
      }
    }
    
    .attachments {
      margin-bottom: 0;
      padding: 0;
      list-style: none;
      
      li {
        display: inline;
        margin-right: 1.25rem;
        
        a {
          text-decoration: none;
          color: ${colors.foreground};
          
          svg {
            margin-right: .5rem;
          }
        }
        
        &:hover {
          cursor: pointer;
          
          a {
            color: ${colors.foregroundSecondary};
          }
        }
      }
    }
  `

  const contentStyle = css`
    max-width: 100%;
    overflow: auto;
  `

  const styleHeaders = css`
    color: ${colors.foreground};
  `

  const CONTENT_VIEW_TYPE_INDEXES = {
    HTML: 0,
    PLAIN: 1,
    HEADERS: 2,
  }

  const CONTENT_VIEW_TYPES = [
    { name: 'Html', value: '1' },
    { name: 'Plain', value: '2' },
    { name: 'Headers', value: '3' },
  ]

  const API_BASE_URL = process.env.API_BASE_URL
  const navigate = useNavigate()
  const [getContentViewTypeValue, setContentViewTypeValue] = useState(CONTENT_VIEW_TYPES[0].value)

  const navigateToBack = useCallback(() => navigate(-1), [])
  const toggleContentView = useCallback((event) => setContentViewTypeValue(event.currentTarget.value), [])

  return (<>
    <Button variant="outline-secondary" onClick={navigateToBack}>
      <FontAwesomeIcon icon={faArrowLeft}/> Back
    </Button>

    <div css={headerStyle}>
      <h2>{message && message.subject}</h2>
      <Row>
        <Col sm={8}>
          <table className="addresses">
            <tbody>
            <tr>
              <th>From:</th>
              <td><ul>{
                message && message.sentFrom.map((item) => item.address.displayName
                  ? (<li key={`sentFrom-${item.address.email}`}><b>{item.address.displayName}</b><small>{item.address.email}</small></li>)
                  : (<li key={`sentFrom-${item.address.email}`}><b>{item.address.email}</b></li>)
                )
              }</ul></td>
            </tr>
            <tr>
              <th>To:</th>
              <td><ul>{
                message && message.receivedTo.map((item) => item.address.displayName
                  ? (<li key={`receivedTo-${item.address.email}`}><b>{item.address.displayName}</b><small>{item.address.email}</small></li>)
                  : (<li key={`receivedTo-${item.address.email}`}><b>{item.address.email}</b></li>)
                )
              }</ul></td>
            </tr>
            <tr>
              <th>Cc:</th>
              <td><ul>{
                message && message.receivedCc.map((item) => item.address.displayName
                  ? (<li key={`receivedCc-${item.address.email}`}><b>{item.address.displayName}</b><small>{item.address.email}</small></li>)
                  : (<li key={`receivedCc-${item.address.email}`}><b>{item.address.email}</b></li>)
                )
              }</ul></td>
            </tr>
            <tr>
              <th>Bcc:</th>
              <td><ul>{
                message && message.receivedBcc.map((item) => item.address.displayName
                  ? (<li key={`receivedBcc-${item.address.email}`}><b>{item.address.displayName}</b><small>{item.address.email}</small></li>)
                  : (<li key={`receivedBcc-${item.address.email}`}><b>{item.address.email}</b></li>)
                )
              }</ul></td>
            </tr>
            </tbody>
          </table>
        </Col>
        <Col sm={4}>
          <table className="dateTime">
            <tbody>
            <tr>
              <th>Sent:</th>
              <td>
                {message && <DetailsLocalDateTime dateTime={message.sentDate}/>}
              </td>
            </tr>
            <tr>
              <th>Received:</th>
              <td>
                {message && <DetailsLocalDateTime dateTime={message.receivedDate}/>}
              </td>
            </tr>
            </tbody>
          </table>
        </Col>
      </Row>

      {message && message.attachments && message.attachments.length ? (
        <ul className="attachments">
          {message.attachments.map((item, index) => (
            <li key={`attachment-${item.fileName}`}><a href={`${API_BASE_URL}/messages/${message.id}/attachments/${item.fileName}`}>
              <FontAwesomeIcon icon={faFileArrowDown}/>
              {item.fileName}
            </a></li>
          ))}
        </ul>
      ) : (<></>)}

      <ButtonGroup>
        {CONTENT_VIEW_TYPES.map((contentViewType) => (
          <ToggleButton
            key={`toggle-${contentViewType.value}`}
            id={`content-view-type-${contentViewType.value}`}
            type="radio"
            variant="outline-secondary"
            name="radio"
            value={contentViewType.value}
            checked={getContentViewTypeValue === contentViewType.value}
            onChange={toggleContentView}
          >
            {contentViewType.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </div>
    <div css={contentStyle}>
    { (() => {
      switch (getContentViewTypeValue) {
        case CONTENT_VIEW_TYPES[CONTENT_VIEW_TYPE_INDEXES.HTML].value:
          return (<div dangerouslySetInnerHTML={{__html: dompurify
              .sanitize(message ? message.htmlContent : '')
              .replace(/href/g, "target='_blank' rel='noopener noreferrer' href")
              .replace(/target=["']?[a-zA-Z_]*["']?/g, "target='_blank'")
          }}/>)
        case CONTENT_VIEW_TYPES[CONTENT_VIEW_TYPE_INDEXES.PLAIN].value:
          return (<pre>{message && message.plainContent}</pre>)
        case CONTENT_VIEW_TYPES[CONTENT_VIEW_TYPE_INDEXES.HEADERS].value:
          return (<code css={styleHeaders}><pre>{message && message.headers}</pre></code>)
        default:
          return (<></>)
      }
    })() }
    </div>
  </>)
}

function DetailsLocalDateTime({dateTime}) {
  const d = dateTime && new Date(Date.parse(dateTime))

  return (<>{d.toLocaleDateString(undefined, {
    weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit'
  })} {d.toLocaleTimeString(undefined, {
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
  })}</>)
}
