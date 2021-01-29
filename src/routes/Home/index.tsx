import React, { FC } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

export const Home: FC<RouteComponentProps> = () => {
  return <Redirect to="/view-team" />;
};
