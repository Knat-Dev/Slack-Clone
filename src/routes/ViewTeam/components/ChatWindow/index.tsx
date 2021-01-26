import { useApolloClient } from '@apollo/client';
import { Box, Flex, Text } from '@chakra-ui/react';
import React, { FC, useEffect, useRef } from 'react';
import { Messages } from '..';
import { FileUpload } from '../../../../Components';
import {
  NewUserStatusDocument,
  NewUserStatusSubscription,
  RegularChannelFragment,
  useMeQuery,
  useUserStatusesQuery,
} from '../../../../graphql/generated';
import { Header } from '../Header';
import { ChatInput } from './components';

interface Props {
  selectedChannel: RegularChannelFragment | undefined | null;
  selectedTeamId: string;
  currentUserName: string;
  currentUserId: string;
}

export const ChatWindow: FC<Props> = ({
  selectedChannel,
  selectedTeamId,
  currentUserName,
  currentUserId,
}) => {
  const { loading } = useMeQuery();
  const scrollable = useRef<HTMLDivElement | null>(null);
  const { subscribeToMore } = useUserStatusesQuery({
    variables: { teamId: selectedTeamId },
  });

  // fetch user statuses when teamId changes
  const client = useApolloClient();
  useEffect(() => {
    client.cache.evict({ fieldName: 'userStatuses' });
  }, [selectedTeamId]);

  useEffect(() => {
    return subscribeToMore({
      document: NewUserStatusDocument,
      variables: { teamId: selectedTeamId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        console.log(subscriptionData.data);
        const newStatus = (subscriptionData.data as NewUserStatusSubscription)
          .newUserStatus;
        if (newStatus)
          return Object.assign({}, prev, {
            ...prev,
            userStatuses: prev.userStatuses
              .filter((status) => status.username !== newStatus?.username)
              .concat(newStatus),
          });
        else
          return Object.assign({}, prev, {
            ...prev,
            userStatuses: prev.userStatuses,
          });
      },
    });
  }, [selectedTeamId]);

  if (loading) return null;

  if (!selectedTeamId || !selectedChannel)
    return (
      <Flex
        backgroundColor="#f3f5f7"
        height="100vh"
        justify="center"
        align="center"
      >
        <Text color="blue.800">This team has no channels</Text>
      </Flex>
    );
  return (
    <FileUpload
      to={selectedChannel}
      noClick
      teamId={selectedTeamId}
      channelId={selectedChannel.id}
    >
      <Flex direction="column" h="100vh" backgroundColor="#d6e0e6b3">
        <Header
          currentUserName={currentUserName}
          channelName={selectedChannel.name}
        />

        <Messages channel={selectedChannel} />
        <Box p={2}>
          <ChatInput
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            selectedChannel={selectedChannel}
            selectedTeamId={selectedTeamId}
          />
        </Box>
      </Flex>
    </FileUpload>
  );
};
