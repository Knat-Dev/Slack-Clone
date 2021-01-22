import { Box, List } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { MessageItem } from '..';
import {
  NewChannelMessageDocument,
  NewChannelMessageSubscription,
  RegularChannelFragment,
  useDeleteMessageMutation,
  useNewMessagesQuery,
} from '../../../../../../graphql/generated';

interface Props {
  channel: RegularChannelFragment;
  cursor: string | null;
}

export const NewMessages: FC<Props> = ({ channel, cursor }) => {
  const { data, subscribeToMore } = useNewMessagesQuery({
    variables: {
      channelId: channel.id,
      cursor,
    },
  });

  useEffect(() => {
    return subscribeToMore({
      document: NewChannelMessageDocument,
      variables: { channelId: channel.id, cursor },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessage = (subscriptionData.data as NewChannelMessageSubscription)
          .newChannelMessage;
        // if current user sent the message, filter it out, we dont want to see it twice
        if (prev.newMessages.some((message) => message.id === newMessage?.id))
          return Object.assign({}, prev, {
            newMessages: [...prev.newMessages],
          });
        else
          return Object.assign({}, prev, {
            newMessages: [
              ...prev.newMessages,
              (subscriptionData.data as NewChannelMessageSubscription)
                .newChannelMessage,
            ],
          });
      },
    });
  }, [channel.id]);
  const newMessages = data?.newMessages;

  if (!newMessages) return null;

  return (
    <List w="100%">
      {newMessages.map((message, i) => {
        return (
          <Box key={message.id}>
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
