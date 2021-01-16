import { Box, Button, Flex, List, ListItem } from '@chakra-ui/react';
import React, { FC, useEffect, useRef } from 'react';
import {
  MessagesDocument,
  NewChannelMessageDocument,
  RegularChannelFragment,
  useDeleteMessageMutation,
  useMessagesQuery,
  useNewMessagesQuery,
} from '../../../../graphql/generated';
import { MessageItem, NewMessages } from './components';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
  channel: RegularChannelFragment;
}
export const Messages: FC<Props> = ({ channel }) => {
  const bottom = useRef<HTMLDivElement>(null);
  const scrollable = useRef<HTMLDivElement>(null);
  const [deleteMessage] = useDeleteMessageMutation();
  const { data, fetchMore, client } = useMessagesQuery({
    variables: { channelId: channel.id, cursor: null },
  });

  useEffect(() => {
    // const bool = client.cache.evict({ fieldName: 'messages' });
    // console.log(bool);
    bottom.current?.scrollIntoView();
  }, [channel.id]);

  const messages = data?.messages.page;
  const hasMore = data?.messages.hasMore;
  if (!messages) return <Flex grow={1} />;

  const handleDelete = async (messageId: string) => {
    await deleteMessage({ variables: { messageId } });
  };

  const fetchMoreData = async () => {
    console.log('fetching');
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
    >
      <div ref={bottom} />
      <NewMessages
        channel={channel}
        cursor={
          messages.length > 0 ? messages[messages.length - 1].createdAt : null
        }
      />
      <InfiniteScroll
        dataLength={messages.length}
        next={() => fetchMoreData()}
        style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
        inverse={true}
        hasMore={hasMore ? hasMore : false}
        loader={<h4>Loading...</h4>}
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
