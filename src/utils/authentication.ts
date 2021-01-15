import { RouteComponentProps } from 'react-router';

export const authenticateRequest = (
  history: RouteComponentProps['history'],
  match: RouteComponentProps['match']
): void => {
  history.push('/login?next=' + match.path);
};
