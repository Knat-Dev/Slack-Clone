import React, { FC } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import { CreateTeam } from './CreateTeam';
// Routes
import { Home } from './Home';
import { Login } from './Login';
import { Register } from './Register';
import { ProtectedRoute, ProtectedRouteProps } from './util/ProtectedRoute';
import PublicRoute from './util/PublicRoute';
import { ViewTeam } from './ViewTeam';

const Routes: FC = () => {
  const [sessionContext, updateSessionContext] = useSessionContext();

  const setRedirectPathOnAuthentication = (path: string) => {
    updateSessionContext({
      ...sessionContext,
      redirectPathOnAuthentication: path,
    });
  };

  const defaultProtectedRouteProps: ProtectedRouteProps = {
    isAuthenticated: !!sessionContext.isAuthenticated,
    authenticationPath: '/login',
    redirectPathOnAuthentication:
      sessionContext.redirectPathOnAuthentication || '',
    setRedirectPathOnAuthentication,
  };

  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Switch>
        <ProtectedRoute
          {...defaultProtectedRouteProps}
          exact
          path="/"
          component={Home}
        />
        <PublicRoute
          isAuthenticated={!!sessionContext.isAuthenticated}
          exact
          path="/register"
          component={Register}
        />
        <PublicRoute
          isAuthenticated={!!sessionContext.isAuthenticated}
          exact
          path="/login"
          component={Login}
        />
        <ProtectedRoute
          {...defaultProtectedRouteProps}
          exact
          path="/create-team"
          component={CreateTeam}
        />
        <ProtectedRoute
          {...defaultProtectedRouteProps}
          path="/view-team/:teamId?/user/:userId?"
          component={ViewTeam}
        />
        <ProtectedRoute
          {...defaultProtectedRouteProps}
          path="/view-team/:teamId?/:channelId?"
          component={ViewTeam}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
