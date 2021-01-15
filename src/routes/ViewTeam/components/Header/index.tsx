import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';

interface Props {
  channelName: string;
  currentUserName: string;
}

export const Header: FC<Props> = ({ channelName, currentUserName }) => {
  const splitArray = channelName.split(', ');
  return (
    <Box bgColor="blue.800" color="white" textAlign="center">
      {splitArray.length > 1 ? '@' : '#'}
      {splitArray.filter((name) => name !== currentUserName).join(', ')}
      {splitArray.length > 1 && ' and you'}
    </Box>
  );
};
