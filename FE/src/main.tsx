import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import store from './redux/store.ts';
import './i18n.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
