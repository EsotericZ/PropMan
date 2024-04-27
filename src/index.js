import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";

import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTHO_CLIENT_ID;

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Auth0Provider
                domain={domain}
                clientId={clientId}
                redirectUri={window.location.origin}
            >
                <Routes>
                    <Route path="/*" element={<App />} />
                </Routes>
            </Auth0Provider>
        </Router>
    </React.StrictMode>,
    document.getElementById("root")
);