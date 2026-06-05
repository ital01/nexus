import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/app';

const ROOT_ID = 'root';

const rootElement = document.getElementById(ROOT_ID);

if (!rootElement) {
  throw new Error(`Could not find the element with id ${ROOT_ID}`);
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
