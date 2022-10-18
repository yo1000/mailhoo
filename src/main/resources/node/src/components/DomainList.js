import React from "react";
import {css} from "@emotion/react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faInbox, faAt} from '@fortawesome/free-solid-svg-icons'
import colors from "../colors";

/**
 *
 * @param {ViewState} viewState
 * @returns {JSX.Element}
 * @constructor
 */
export default function DomainList({viewState}) {
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
  
        &.current,
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
      <ul className="mutex">
        <li className="current" onClick={(event) => {
          viewState.updateMessages(null, null,
            `${viewState.API_BASE_URL}/messages?all`,
            { list: 'all', number: null, dir: null },
            () => { viewState.activateDomainFilterStyle(event) }
          )
        }}>
          <FontAwesomeIcon icon={faInbox}/>
          Inbox
        </li>
      </ul>
      <h3>From</h3>
      <ul className="mutex">
        {
          viewState.fromDomains && viewState.fromDomains.map(d => (
            <li onClick={(event) => {
              viewState.render({n: 'max', dir:'prev', filter: {from: d}})
              viewState.activateDomainFilterStyle(event)
            }}>
              <FontAwesomeIcon icon= {faAt}/>
              {d}
            </li>
          ))
        }
      </ul>
      <h3>To</h3>
      <ul className="mutex">
        {
          viewState.toDomains && viewState.toDomains.map(d => (
            <li onClick={(event) => {
              viewState.render({n: 'max', dir:'prev', filter: {to: d}})
              viewState.activateDomainFilterStyle(event)
            }}>
              <FontAwesomeIcon icon= {faAt}/>
              {d}
            </li>
          ))
        }
      </ul>
      <h3>Cc</h3>
      <ul className="mutex">
        {
          viewState.ccDomains && viewState.ccDomains.map(d => (
            <li onClick={(event) => {
              viewState.render({n: 'max', dir:'prev', filter: {cc: d}})
              viewState.activateDomainFilterStyle(event)
            }}>
              <FontAwesomeIcon icon= {faAt}/>
              {d}
            </li>
          ))
        }
      </ul>
      <h3>Bcc</h3>
      <ul className="mutex">
        {
          viewState.bccDomains && viewState.bccDomains.map(d => (
            <li onClick={(event) => {
              viewState.render({n: 'max', dir:'prev', filter: {bcc: d}})
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
