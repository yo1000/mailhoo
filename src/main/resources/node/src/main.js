import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import Mailbox from "./components/Mailbox";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Mailbox/>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('main')
)
