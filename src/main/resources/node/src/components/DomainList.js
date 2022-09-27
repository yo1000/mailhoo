import React from "react";
import {css} from "@emotion/react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faInbox, faAt} from '@fortawesome/free-solid-svg-icons'

export default function DomainList({
  fromDomainsState,
  toDomainsState,
  ccDomainsState,
  bccDomainsState,
  messagesState,
  messageDetailsState,
  viewConditionState,
}) {
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

  const [getFromDomains, setFromDomains] = fromDomainsState
  const [getToDomains, setToDomains] = toDomainsState
  const [getCcDomains, setCcDomains] = ccDomainsState
  const [getBccDomains, setBccDomains] = bccDomainsState
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

  const updateMessages = () => {
    fetch('/messages')
      .then(resp => resp.json())
      .then(messages => {
        setViewCondition({ list: 'all' })
        setMessages(messages)
        setMessageDetails(null)
      })
  }

  const updateMessagesByFromDomain = (domainName) => {
    fetch(`/messages?fromDomain=${domainName}`)
      .then(resp => resp.json())
      .then(messages => {
        setViewCondition({ listByFromDomain: domainName })
        setMessages(messages)
        setMessageDetails(null)
      })
  }

  const updateMessagesByToDomain = (domainName) => {
    fetch(`/messages?toDomain=${domainName}`)
      .then(resp => resp.json())
      .then(messages => {
        setViewCondition({ listByToDomain: domainName })
        setMessages(messages)
        setMessageDetails(null)
      })
  }

  const updateMessagesByCcDomain = (domainName) => {
    fetch(`/messages?ccDomain=${domainName}`)
      .then(resp => resp.json())
      .then(messages => {
        setViewCondition({ listByCcDomain: domainName })
        setMessages(messages)
        setMessageDetails(null)
      })
  }

  const updateMessagesByBccDomain = (domainName) => {
    fetch(`/messages?bccDomain=${domainName}`)
      .then(resp => resp.json())
      .then(messages => {
        setViewCondition({ listByBccDomain: domainName })
        setMessages(messages)
        setMessageDetails(null)
      })
  }

  const activateDomainFilterStyle = (event) => {
    document.querySelectorAll('.active').forEach(elm => {
      elm.classList.remove('active')
    })
    event.target.classList.add('active')
  }

  return (
    <div css={style}>
      <ul>
        <li className="active" onClick={(event) => {
          updateMessages()
          activateDomainFilterStyle(event)
        }}>
          <FontAwesomeIcon icon={faInbox}/>
          Inbox
        </li>
      </ul>
      <h3>From</h3>
      <ul>
        {
          getFromDomains && getFromDomains.map(d => (
            <li onClick={(event) => {
              updateMessagesByFromDomain(d)
              activateDomainFilterStyle(event)
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
          getToDomains && getToDomains.map(d => (
            <li onClick={(event) => {
              updateMessagesByToDomain(d)
              activateDomainFilterStyle(event)
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
          getCcDomains && getCcDomains.map(d => (
            <li onClick={(event) => {
              updateMessagesByCcDomain(d)
              activateDomainFilterStyle(event)
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
          getBccDomains && getBccDomains.map(d => (
            <li onClick={(event) => {
              updateMessagesByBccDomain(d)
              activateDomainFilterStyle(event)
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
