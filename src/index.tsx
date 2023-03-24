import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from 'router';
import './assets/styles/reset.css';
import { createStandaloneToast } from '@chakra-ui/toast';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const { ToastContainer } = createStandaloneToast();

root.render(
  <React.StrictMode>
    <Router />
    <ToastContainer />
  </React.StrictMode>
);