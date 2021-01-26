import { Box, Flex, List, ListItem, Spinner, Text } from '@chakra-ui/react';
import React, { FC, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  DeletedMessageDocument,
  DeletedMessageSubscription,
  MessagesDocument,
  MessagesQuery,
  NewChannelMessageDocument,
  NewChannelMessageSubscription,
  RegularChannelFragment,
  RegularMessageFragment,
  useDeleteMessageMutation,
  useMeQuery,
  useMessagesQuery,
} from '../../../../graphql/generated';
import { MessageItem } from './components';

interface Props {
  channel: RegularChannelFragment;
}
export const Messages: FC<Props> = ({ channel }) => {
  const { data: meData } = useMeQuery();
  const bottom = useRef<HTMLDivElement>(null);
  const scrollable = useRef<HTMLDivElement>(null);
  const [deleteMessage] = useDeleteMessageMutation();
  const { data, fetchMore, subscribeToMore, client } = useMessagesQuery({
    variables: { channelId: channel.id, cursor: null },
  });

  useEffect(() => {
    client.cache.evict({ fieldName: 'messages' });
    bottom.current?.scrollIntoView();
  }, [channel.id]);

  useEffect(() => {
    return subscribeToMore({
      document: NewChannelMessageDocument,
      variables: { channelId: channel.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessage = (subscriptionData.data as NewChannelMessageSubscription)
          .newChannelMessage;
        // if current user sent the message, filter it out, we don't want to see it twice
        if (prev.messages.page.some((message) => message.id === newMessage?.id))
          return Object.assign({}, prev, {
            messages: {
              ...prev.messages,
            },
          });
        else
          return Object.assign({}, prev, {
            messages: {
              ...prev.messages,
              page: [
                ...prev.messages.page,
                (subscriptionData.data as NewChannelMessageSubscription)
                  .newChannelMessage,
              ],
            },
          });
      },
    });
  }, [channel.id]);

  useEffect(() => {
    return subscribeToMore({
      document: DeletedMessageDocument,
      variables: { channelId: channel.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const deletedMessage = (subscriptionData.data as DeletedMessageSubscription)
          .deletedMessage;

        if (
          !prev.messages.page.some(
            (message) => message.id === deletedMessage?.id
          )
        )
          return Object.assign({}, prev, {
            messages: {
              ...prev.messages,
            },
          });
        else
          return Object.assign({}, prev, {
            messages: {
              ...prev.messages,
              page: prev.messages.page.filter(
                (message) => message.id !== deletedMessage?.id
              ),
            },
          });
      },
    });
  }, [channel.id]);

  const messages = data?.messages.page;
  const hasMore = data?.messages.hasMore;
  if (!messages || !meData?.me.id)
    return (
      <Flex grow={1} align="center" justify="center">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );

  const handleDelete = async (message: RegularMessageFragment) => {
    await deleteMessage({
      variables: { messageId: message.id },
      optimisticResponse: { deleteMessage: message },
      update: (store, { data }) => {
        const deletedMessage = data?.deleteMessage;
        const old = store.readQuery<MessagesQuery>({
          query: MessagesDocument,
          variables: { channelId: channel.id },
        });
        if (old && deletedMessage) {
          if (
            old.messages.page.some(
              (message) => message.id === deletedMessage.id
            )
          )
            store.writeQuery<MessagesQuery>({
              query: MessagesDocument,
              variables: { channelId: channel.id },
              data: {
                messages: {
                  ...old.messages,
                  page: old.messages.page.filter(
                    (message) => message.id !== deletedMessage.id
                  ),
                },
              },
            });
        }
      },
    });
  };

  const fetchMoreData = async () => {
    await fetchMore({
      query: MessagesDocument,
      variables: {
        channelId: channel.id,
        cursor: messages[0].createdAt,
      },
    });
  };

  return (
    <Flex
      id="scrollableDiv"
      direction="column-reverse"
      flexGrow={1}
      overflow="auto"
      ref={scrollable}
      onScroll={() => {
        if (scrollable.current?.scrollTop && scrollable.current.scrollTop > 0)
          scrollable.current.scrollTop = 0;
      }}
    >
      <div ref={bottom} />

      <InfiniteScroll
        dataLength={messages.length}
        next={() => fetchMoreData()}
        style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
        inverse={true}
        hasMore={hasMore ? hasMore : false}
        loader={
          <Flex
            justify="center"
            align="center"
            p={2}
            direction="column"
            color="blue.500"
          >
            <Spinner size="sm" mb={1} />
            <Text fontSize="sm">Loading past messages..</Text>
          </Flex>
        }
        scrollableTarget="scrollableDiv"
        scrollThreshold={'750px'}
        initialScrollY={0}
      >
        <List w="100%">
          <ListItem textAlign="center">
            {hasMore ? null : (
              <Box color="#6f819b" textAlign="center">
                Chat began here..
              </Box>
            )}
          </ListItem>
          {messages.map((message, i) => (
            <Box key={message.id}>
              <MessageItem
                handleDelete={handleDelete}
                currentUserId={meData.me.id}
                message={message}
                isNotSameUserAsLast={
                  i === 0 || messages[i - 1].user.id !== messages[i].user.id
                }
              />
            </Box>
          ))}
        </List>
      </InfiniteScroll>
    </Flex>
  );
};
