import { Flex, Text, useMediaQuery } from '@chakra-ui/react';
import React, { FC } from 'react';
import { MdMenu } from 'react-icons/md';
import { CircleButton } from '../../../../Components';

interface Props {
  channelName: string;
  currentUserName: string;
  onOpen: () => void;
}

export const Header: FC<Props> = ({ channelName, currentUserName, onOpen }) => {
  const [isLargerThan880] = useMediaQuery('(min-width: 880px)');
  const splitArray = channelName.split(', ');
  return (
    <Flex
      position="relative"
      align="center"
      justify="center"
      bgColor="blue.800"
      color="white"
      minH="40px"
    >
      {!isLargerThan880 && (
        <CircleButton
          left={2}
          position="absolute"
          label="Menu"
          onClick={() => onOpen()}
          larger
        >
          <MdMenu />
        </CircleButton>
      )}
      <Text fontSize="md">
        {splitArray.length > 1 ? '@' : '#'}
        {splitArray.filter((name) => name !== currentUserName).join(', ')}
        {splitArray.length > 1 && ' and you'}
      </Text>
    </Flex>
  );
};
