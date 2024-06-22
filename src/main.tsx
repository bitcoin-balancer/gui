import React from 'react';
import ReactDOM from 'react-dom/client';
import { SWService } from 'sw-service';
import { App } from './components/app.component.tsx';
import './index.css';

// register the Service Worker
SWService.register();



// render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
