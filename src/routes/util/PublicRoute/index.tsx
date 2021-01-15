import * as React from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router';

export interface ProtectedRouteProps extends RouteProps {
  isAuthenticated: boolean;
}

export const PublicRoute: React.FC<ProtectedRouteProps> = (props) => {
  const currentLocation = useLocation();

  const isAuth = props.isAuthenticated;
  let redirectPath = currentLocation.pathname;

  if (isAuth) {
    redirectPath = '/view-team';
  }

  if (redirectPath !== currentLocation.pathname && isAuth) {
    const renderComponent = () => <Redirect to={{ pathname: redirectPath }} />;
    return <Route {...props} component={renderComponent} render={undefined} />;
  } else {
    return <Route {...props} />;
  }
};

export default PublicRoute;
