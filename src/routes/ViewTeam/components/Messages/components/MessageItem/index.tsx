import { Avatar, Box, Flex, ListItem, Text } from '@chakra-ui/react';
import moment from 'moment';
import React, { FC, useState } from 'react';
import { Message } from '..';
import { RegularMessageFragment } from '../../../../../../graphql/generated';

interface Props {
  message: RegularMessageFragment;
  isNotSameUserAsLast: boolean;
}
export const MessageItem: FC<Props> = ({ message, isNotSameUserAsLast }) => {
  const [hover, setHover] = useState(false);
  const date = new Date(message.createdAt).getTime();
  return (
    <ListItem
      onMouseOver={() => {
        if (!hover) setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      background={hover ? 'rgb(214, 224, 230)' : undefined}
    >
      {isNotSameUserAsLast && (
        <Flex align="start" position="relative">
          <Avatar
            boxSize="40px"
            src={undefined}
            position="absolute"
            left="16px"
          />
          <Flex direction="column" pl="72px">
            <Flex align="center">
              <Text color="blue.600" fontWeight="bold" mr={2}>
                {message.user.username}
              </Text>
              <Text fontSize="xs" color="#6f819b">
                {moment(
                  date === date
                    ? message.createdAt
                    : parseFloat(message.createdAt)
                ).calendar()}
              </Text>
            </Flex>
            <Message message={message} />
          </Flex>
        </Flex>
      )}
      <Flex position="relative" align="flex-start">
        {hover && !isNotSameUserAsLast && (
          <Text
            position="absolute"
            fontSize="xs"
            color="#6f819b"
            left="16px"
            top="4px"
          >
            {moment(parseFloat(message.createdAt)).format('h:mm A')}
          </Text>
        )}
        {!isNotSameUserAsLast && (
          <Box pl="72px">
            <Message message={message} />
          </Box>
        )}
      </Flex>
    </ListItem>
  );
};
