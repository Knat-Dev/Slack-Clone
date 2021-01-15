import { Box, List } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { MessageItem } from '..';
import {
  NewChannelMessageDocument,
  RegularChannelFragment,
  useDeleteMessageMutation,
  useNewMessagesQuery,
} from '../../../../../../graphql/generated';

interface Props {
  channel: RegularChannelFragment;
  cursor: string;
}

export const NewMessages: FC<Props> = ({ channel, cursor }) => {
  const [deleteMessage] = useDeleteMessageMutation();
  const { data, subscribeToMore } = useNewMessagesQuery({
    fetchPolicy: 'network-only',
    variables: {
      channelId: channel.id,
      cursor,
    },
  });

  useEffect(() => {
    return subscribeToMore({
      document: NewChannelMessageDocument,
      variables: { channelId: channel.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        return Object.assign({}, prev, {
          newMessages: [subscriptionData.data],
        });
      },
    });
  }, [channel.id]);
  const newMessages = data?.newMessages;

  if (!newMessages) return null;

  const handleDelete = async (messageId: string) => {
    await deleteMessage({ variables: { messageId } });
  };

  return (
    <List w="100%">
      {newMessages.map((message, i) => {
        return (
          <Box key={message.id} onClick={() => handleDelete(message.id)}>
            <MessageItem
              key={i}
              message={message}
              isNotSameUserAsLast={
                i === 0 || newMessages[i - 1].user.id !== newMessages[i].user.id
              }
            />
          </Box>
        );
      })}
    </List>
  );
};
