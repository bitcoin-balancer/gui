import React from 'react';
import ReactDOM from 'react-dom/client';
import { SWService } from 'sw-service';
import Router from './router.tsx';
import './index.css';

// register the Service Worker
SWService.register();

// render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);
