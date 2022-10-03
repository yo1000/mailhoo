import React from "react";
import {css} from "@emotion/react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faInbox, faAt} from '@fortawesome/free-solid-svg-icons'

/**
 *
 * @param {ViewState} viewState
 * @returns {JSX.Element}
 * @constructor
 */
export default function DomainList({viewState}) {
  const style = css`
    h3 {
      margin-bottom: .75rem;
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    ul {
      list-style: none;
      padding: 0;
      
      li {
        margin-left: -1rem;
        padding: .25rem .25rem .25rem 1rem;
        border-radius: 2rem;
  
        &.active,
        &:hover {
          background: rgba(0, 0, 0, .075);
        }
        
        &:hover {
          cursor: pointer;
        }
      
        svg {
          margin-right: .5rem;
        }
      }
    }
  `

  return (
    <div css={style}>
      <ul>
        <li className="active" onClick={(event) => {
          viewState.updateMessages()
          viewState.activateDomainFilterStyle(event)
        }}>
          <FontAwesomeIcon icon={faInbox}/>
          Inbox
        </li>
      </ul>
      <h3>From</h3>
      <ul>
        {
          viewState.fromDomains && viewState.fromDomains.map(d => (
            <li onClick={(event) => {
              viewState.updateMessagesByFromDomain(d)
              viewState.activateDomainFilterStyle(event)
            }}>
              <FontAwesomeIcon icon= {faAt}/>
              {d}
            </li>
          ))
        }
      </ul>
      <h3>To</h3>
      <ul>
        {
          viewState.toDomains && viewState.toDomains.map(d => (
            <li onClick={(event) => {
              viewState.updateMessagesByToDomain(d)
              viewState.activateDomainFilterStyle(event)
            }}>
              <FontAwesomeIcon icon= {faAt}/>
              {d}
            </li>
          ))
        }
      </ul>
      <h3>Cc</h3>
      <ul>
        {
          viewState.ccDomains && viewState.ccDomains.map(d => (
            <li onClick={(event) => {
              viewState.updateMessagesByCcDomain(d)
              viewState.activateDomainFilterStyle(event)
            }}>
              <FontAwesomeIcon icon= {faAt}/>
              {d}
            </li>
          ))
        }
      </ul>
      <h3>Bcc</h3>
      <ul>
        {
          viewState.bccDomains && viewState.bccDomains.map(d => (
            <li onClick={(event) => {
              viewState.updateMessagesByBccDomain(d)
              viewState.activateDomainFilterStyle(event)
            }}>
              <FontAwesomeIcon icon= {faAt}/>
              {d}
            </li>
          ))
        }
      </ul>
    </div>
  )
}
