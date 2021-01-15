import React, { FC } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

export const ListItem: FC<BoxProps> = ({ children, pl, ...rest }) => {
  return (
    <Box
      {...rest}
      cursor="pointer"
      transition="background 0.1s cubic-bezier(0.65, 0.05, 0.36, 1)"
      _hover={{ backgroundColor: '#243855' }}
    >
      <Box pl={pl}>{children}</Box>
    </Box>
  );
};
