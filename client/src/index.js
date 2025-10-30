import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // ← doit pointer vers App.js
import reportWebVitals from './reportWebVitals';
import './i18n';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
