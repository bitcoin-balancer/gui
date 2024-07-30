import React from 'react';
import ReactDOM from 'react-dom/client';
import { SWService } from 'sw-service';
import {
  TooltipProvider,
} from './shared/shadcn/components/ui/tooltip.tsx';
import Router from './router.tsx';
import './index.css';

// register the Service Worker
SWService.register();

// render the app
/* ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TooltipProvider delayDuration={100}>
      <Router />
    </TooltipProvider>
  </React.StrictMode>,
); */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <TooltipProvider delayDuration={100}>
  <Router />
</TooltipProvider>
);
