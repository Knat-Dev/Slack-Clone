import * as React from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router';

export interface ProtectedRouteProps extends RouteProps {
  isAuthenticated: boolean;
  authenticationPath: string;
  redirectPathOnAuthentication: string;
  setRedirectPathOnAuthentication: (path: string) => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  const currentLocation = useLocation();

  const isAuth = props.isAuthenticated;
  let redirectPath = props.redirectPathOnAuthentication;

  if (!isAuth) {
    redirectPath = props.authenticationPath;
  }

  React.useEffect(() => {
    if (!isAuth) {
      props.setRedirectPathOnAuthentication(currentLocation.pathname);
    }
  }, [isAuth]);

  if (redirectPath !== currentLocation.pathname && !isAuth) {
    const renderComponent = () => <Redirect to={{ pathname: redirectPath }} />;
    return <Route {...props} component={renderComponent} render={undefined} />;
  } else {
    return <Route {...props} />;
  }
};

export default ProtectedRoute;
