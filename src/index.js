import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElm = document.getElementById('root');

const Root = ReactDOM.createRoot(rootElm);
Root.render(<StrictMode>{<App />}</StrictMode>);
