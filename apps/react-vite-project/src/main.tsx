import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const ROOT_ID = 'root';

const rootElement = document.getElementById(ROOT_ID);

if (!rootElement) {
  throw new Error(`Could not find the element with id ${ROOT_ID}`);
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
