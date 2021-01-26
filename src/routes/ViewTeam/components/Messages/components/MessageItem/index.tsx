import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Avatar, Box, Flex, ListItem, Text } from '@chakra-ui/react';
import moment from 'moment';
import React, { FC, useState } from 'react';
import { Message } from '..';
import { CircleIconButton } from '../../../../../../Components';
import {
  RegularChannelFragment,
  RegularMessageFragment,
} from '../../../../../../graphql/generated';
import { MdEdit, MdDelete } from 'react-icons/md';

interface Props {
  currentUserId: string;
  message: RegularMessageFragment;
  isNotSameUserAsLast: boolean;
  handleDelete: (message: RegularMessageFragment) => Promise<void>;
}
export const MessageItem: FC<Props> = ({
  currentUserId,
  message,
  isNotSameUserAsLast,
  handleDelete,
}) => {
  const [hover, setHover] = useState(false);
  //RedisPubSub workaround, below if date === date it means it's not a float
  const date = new Date(message.createdAt).getTime();
  return (
    <ListItem
      mt={isNotSameUserAsLast ? 2 : undefined}
      py="0.1rem"
      position="relative"
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
          <Flex direction="column" pl="72px" w="100%">
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
            <Box w="100%">
              <Message message={message} />
            </Box>
          </Flex>
        </Flex>
      )}
      <Flex align="flex-start">
        {hover && !isNotSameUserAsLast && (
          <Text
            position="absolute"
            fontSize="xs"
            color="#6f819b"
            left="16px"
            top="5px"
          >
            {moment(
              date === date ? message.createdAt : parseFloat(message.createdAt)
            ).format('h:mm A')}
          </Text>
        )}
        {hover && currentUserId === message.user.id && (
          <Flex
            background=" rgba(230, 235, 241, 0.733)"
            boxSizing="content-box"
            borderRadius={8}
            position="absolute"
            right="20px"
            top="-16px"
            align="center"
            boxShadow="0 0 4px rgba(0,0,0,0.2)"
            px={2}
            py={1}
          >
            <CircleIconButton
              color="white"
              size="regular"
              icon={MdDelete}
              label="Delete Message.."
              placement="top"
              mr={1}
              onClick={() => handleDelete(message)}
            />
            <CircleIconButton
              color="white"
              size="regular"
              icon={MdEdit}
              label="Edit Message.."
              placement="top"
            />
          </Flex>
        )}
        {!isNotSameUserAsLast && (
          <Box w="100%" pl="72px" pr="100px">
            <Message message={message} />
          </Box>
        )}
      </Flex>
    </ListItem>
  );
};
