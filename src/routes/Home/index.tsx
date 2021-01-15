import React, { FC } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { useAllUsersQuery } from '../../graphql/generated';

export const Home: FC<RouteComponentProps> = () => {
  return <Redirect to="/view-team" />;
};
