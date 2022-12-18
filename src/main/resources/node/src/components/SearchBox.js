import React from "react";
import {Form, InputGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {css} from "@emotion/react";
import colors from "../colors";
import {useNavigate} from "react-router-dom";

export default function SearchBox() {
  const style = css`
    margin-top: -7px;

    .form-select {
      max-width: 10rem;
      padding-left: 1.75rem;
      border-right: 0;
    }

    input {
      &::placeholder {
        color: ${colors.foregroundSecondary};
      }

      &:-internal-autofill-selected,
      &:-internal-autofill-selected:focus {
        -webkit-box-shadow: 0 0 0px 10rem ${colors.background} inset;
      }
    }

    .form-select:focus,
    input:focus {
      border-color: ${colors.formControl.backgroundActive};
      box-shadow: 0 0 0 0.25rem rgb(108 117 125 / 50%);
    }

    svg {
      position: absolute;
      top: .75rem;
      left: .75rem;
      z-index: 10;
      color: ${colors.foregroundSecondary};
    }

    &.hidden {
      svg,
      input::placeholder {
        opacity: 0;
      }
    }
  `

  const navigate = useNavigate()

  return (<Form css={style} onSubmit={(event) => {
    event.preventDefault()
    const queryType = document.getElementById('queryType').value
    const queryValue = document.getElementById('queryValue').value

    navigate(`/search/${queryType}/${queryValue}`)
  }}>
    <InputGroup className="mb-3">
      <Form.Select id="queryType">
        <option value="subject">Subject</option>
        <option value="content">Content</option>
        <option value="from">From</option>
        <option value="to">To</option>
        <option value="cc">Cc</option>
        <option value="bcc">Bcc</option>
        <option value="attachment">Attachment</option>
      </Form.Select>
      <FontAwesomeIcon icon={faMagnifyingGlass}/>
      <Form.Control type="text" placeholder="Search mail" id="queryValue"/>
    </InputGroup>
  </Form>)
}
