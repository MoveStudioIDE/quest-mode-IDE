import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import {WalletProvider} from '@suiet/wallet-kit';
// import '@suiet/wallet-kit/style.css';


import { BrowserRouter, Routes, Route } from "react-router-dom";

import { WalletKitProvider } from "@mysten/wallet-kit";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <App/>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
