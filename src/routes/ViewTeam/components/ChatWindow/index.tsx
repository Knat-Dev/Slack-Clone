import { Box, Flex, Text } from '@chakra-ui/react';
import React, { FC, useRef } from 'react';
import { Messages } from '..';
import { FileUpload } from '../../../../Components';
import {
  RegularChannelFragment,
  useMeQuery,
} from '../../../../graphql/generated';
import { Header } from '../Header';
import { ChatInput } from './components';

interface Props {
  selectedChannel: RegularChannelFragment | undefined | null;
  selectedTeamId: string | undefined;
  currentUserName: string;
}

export const ChatWindow: FC<Props> = ({
  selectedChannel,
  selectedTeamId,
  currentUserName,
}) => {
  const { loading } = useMeQuery();
  const scrollable = useRef<HTMLDivElement | null>(null);

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
            currentUserName={currentUserName}
            selectedChannel={selectedChannel}
            selectedTeamId={selectedTeamId}
          />
        </Box>
      </Flex>
    </FileUpload>
  );
};
