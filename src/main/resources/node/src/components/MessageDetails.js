import React, {useState} from "react";
import {css} from "@emotion/react";
import {Row, Col, ButtonGroup, ToggleButton, Button} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowLeft, faFileArrowDown} from '@fortawesome/free-solid-svg-icons'
import dompurify from 'dompurify'

import colors from "../colors"

export default function MessageDetails({
  messageDetailsState
}) {
  const style = css`
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

  const styleHeaders = css`
    color: ${colors.foreground};
  `

  const CONTENT_VIEW_TYPE_INDEXES = {
    PLAIN: 0,
    HTML: 1,
    HEADERS: 2,
  }

  const CONTENT_VIEW_TYPES = [
    { name: 'Plain', value: '1' },
    { name: 'Html', value: '2' },
    { name: 'Headers', value: '3' },
  ]

  const [getMessageDetails, setMessageDetails] = messageDetailsState
  const [getContentViewTypeValue, setContentViewTypeValue] = useState(CONTENT_VIEW_TYPES[0].value);

  return (<>
    <Button variant="outline-secondary" onClick={() => {
      setMessageDetails(null)
    }}>
      <FontAwesomeIcon icon={faArrowLeft}/> Back
    </Button>

    <div css={style}>
      <h2>{getMessageDetails.subject}</h2>
      <Row>
        <Col sm={8}>
          <table className="addresses">
            <tbody>
            <tr>
              <th>From:</th>
              <td><ul>{
                getMessageDetails.sentFrom.map(item => item.address.displayName
                  ? (<li><b>{item.address.displayName}</b><small>{item.address.email}</small></li>)
                  : (<li><b>{item.address.email}</b></li>)
                )
              }</ul></td>
            </tr>
            <tr>
              <th>To:</th>
              <td><ul>{
                getMessageDetails.receivedTo.map(item => item.address.displayName
                  ? (<li><b>{item.address.displayName}</b><small>{item.address.email}</small></li>)
                  : (<li><b>{item.address.email}</b></li>)
                )
              }</ul></td>
            </tr>
            <tr>
              <th>Cc:</th>
              <td><ul>{
                getMessageDetails.receivedCc.map(item => item.address.displayName
                  ? (<li><b>{item.address.displayName}</b><small>{item.address.email}</small></li>)
                  : (<li><b>{item.address.email}</b></li>)
                )
              }</ul></td>
            </tr>
            <tr>
              <th>Bcc:</th>
              <td><ul>{
                getMessageDetails.receivedBcc.map(item => item.address.displayName
                  ? (<li><b>{item.address.displayName}</b><small>{item.address.email}</small></li>)
                  : (<li><b>{item.address.email}</b></li>)
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
                <DetailsLocalDateTime dateTime={getMessageDetails.sentDate}/>
              </td>
            </tr>
            <tr>
              <th>Received:</th>
              <td>
                <DetailsLocalDateTime dateTime={getMessageDetails.receivedDate}/>
              </td>
            </tr>
            </tbody>
          </table>
        </Col>
      </Row>

      {getMessageDetails.attachments && getMessageDetails.attachments.length ? (
        <ul className="attachments">
          {getMessageDetails.attachments.map(item => (
            <li><a href={`/messages/${getMessageDetails.id}/attachments/${item.fileName}`}>
              <FontAwesomeIcon icon={faFileArrowDown}/>
              {item.fileName}
            </a></li>
          ))}
        </ul>
      ) : (<></>)}

      <ButtonGroup>
        {CONTENT_VIEW_TYPES.map((contentViewType, index) => (
          <ToggleButton
            key={index}
            id={`content-view-type-${contentViewType.value}`}
            type="radio"
            variant="outline-secondary"
            name="radio"
            value={contentViewType.value}
            checked={getContentViewTypeValue === contentViewType.value}
            onChange={(event) => setContentViewTypeValue(event.target.value)}
          >
            {contentViewType.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </div>
    <div>
    {
      getContentViewTypeValue === CONTENT_VIEW_TYPES[CONTENT_VIEW_TYPE_INDEXES.PLAIN].value
        ? (<p>{getMessageDetails.plainContent}</p>) :
      getContentViewTypeValue === CONTENT_VIEW_TYPES[CONTENT_VIEW_TYPE_INDEXES.HTML].value
        ? (<div dangerouslySetInnerHTML={{__html: dompurify
            .sanitize(getMessageDetails.htmlContent)
            .replace(/href/g, "target='_blank' rel='noopener noreferrer' href")
            .replace(/target=["']?[a-zA-Z_]*["']?/g, "target='_blank'")
        }}/>) :
      getContentViewTypeValue === CONTENT_VIEW_TYPES[CONTENT_VIEW_TYPE_INDEXES.HEADERS].value
        ? (<code css={styleHeaders}><pre>{getMessageDetails.headers}</pre></code>)
        : (<></>)
    }
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
