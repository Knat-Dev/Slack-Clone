import { Grid } from '@chakra-ui/react';
import React, { FC } from 'react';

interface Props {
  mediaQuery: boolean;
}

export const AppLayout: FC<Props> = ({ children, mediaQuery }) => {
  return (
    <Grid h="100vh" templateColumns={!mediaQuery ? '1fr' : '60px 240px auto'}>
      {children}
    </Grid>
  );
};
