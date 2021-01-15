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

// const [sessionContext, updateSessionContext] = useSessionContext();
// const isAuthenticated = () => {
//   const token = sessionStorage.getItem('sid');

//   if (!token) return false;

//   try {
//     const decoded: { exp: number } = decode(token);
//     if (Date.now() >= decoded.exp * 1000) {
//       console.log(decoded);
//       fetch('http://localhost:8080/refresh', {
//         credentials: 'include',
//         method: 'POST',
//       })
//         .then(async (res) => {
//           const data = await res.json();
//           const { accessToken } = data;
//           setAccessToken(accessToken);
//           if (accessToken) {
//             updateSessionContext({
//               ...sessionContext,
//               isAuthenticated: true,
//             });
//             return true;
//           } else return false;
//         })
//         .catch((e) => {
//           console.log(e);
//           return false;
//         });
//     }
//   } catch (e) {
//     console.log(e);
//     return false;
//   }
//   return true;
// };
