import React, {useEffect, useState} from "react";
import {css} from "@emotion/react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faInbox, faAt} from '@fortawesome/free-solid-svg-icons'
import colors from "../colors";
import {useLocation, useNavigate} from "react-router-dom";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function DomainList() {
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

  const navigate = useNavigate()
  const location = useLocation()
  const basePath = location.pathname.replace(/\/[pm]\/.+$/, '')

  const [fromDomains, setFromDomains] = useState()
  const [toDomains, setToDomains] = useState()
  const [ccDomains, setCcDomains] = useState()
  const [bccDomains, setBccDomains] = useState()

  useEffect(() => {
    const API_BASE_URL = process.env.API_BASE_URL

    fetch(`${API_BASE_URL}/domains/from`)
      .then(resp => resp.json())
      .then(domains => setFromDomains(domains))

    fetch(`${API_BASE_URL}/domains/to`)
      .then(resp => resp.json())
      .then(domains => setToDomains(domains))

    fetch(`${API_BASE_URL}/domains/cc`)
      .then(resp => resp.json())
      .then(domains => setCcDomains(domains))

    fetch(`${API_BASE_URL}/domains/bcc`)
      .then(resp => resp.json())
      .then(domains => setBccDomains(domains))
  }, [location])

  return (
    <div css={style}>
      <ul className="mutex">
        <li className={basePath === '' ? 'current' : ''} onClick={(event) => {
          navigate('/')
        }}>
          <FontAwesomeIcon icon={faInbox}/>
          Inbox
        </li>
      </ul>
      <h3>From</h3>
      <ul className="mutex">
        {
          fromDomains && fromDomains.map((d, index) => (
            <li key={`fromDomains-${index}`} className={basePath === `/domains/from/${d}` ? 'current' : ''} onClick={(event) => {
              navigate(`/domains/from/${d}`)
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
          toDomains && toDomains.map((d, index) => (
            <li key={`toDomains-${index}`} className={basePath === `/domains/to/${d}` ? 'current' : ''} onClick={(event) => {
              navigate(`/domains/to/${d}`)
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
          ccDomains && ccDomains.map((d, index) => (
            <li key={`ccDomains-${index}`} className={basePath === `/domains/cc/${d}` ? 'current' : ''} onClick={(event) => {
              navigate(`/domains/cc/${d}`)
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
          bccDomains && bccDomains.map((d, index) => (
            <li key={`bccDomains-${index}`} className={basePath === `/domains/bcc/${d}` ? 'current' : ''} onClick={(event) => {
              navigate(`/domains/bcc/${d}`)
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
