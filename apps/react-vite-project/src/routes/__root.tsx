import { Fragment } from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';

const RootComponent = () => {
  return (
    <Fragment>
      <div>Hello "__root"!</div>
      <Outlet />
    </Fragment>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
