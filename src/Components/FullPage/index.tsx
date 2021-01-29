import { Flex, FlexProps } from '@chakra-ui/react';
import React, { FC } from 'react';

interface Props extends FlexProps {
  centered?: boolean;
}

export const FullPage: FC<Props> = ({ children, centered = true }) => {
  return (
    <Flex
      h="100vh"
      justify={centered ? 'center' : undefined}
      align={centered ? 'center' : undefined}
    >
      {children}
    </Flex>
  );
};
