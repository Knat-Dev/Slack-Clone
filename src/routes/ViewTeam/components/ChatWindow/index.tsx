import { useApolloClient } from '@apollo/client';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { FC, useEffect, useRef } from 'react';
import { Messages } from '..';
import { FileUpload } from '../../../../Components';
import { Sidebar } from '../../../../containers';
import {
  MeQuery,
  NewUserStatusDocument,
  NewUserStatusSubscription,
  RegularChannelFragment,
  RegularTeamFragment,
  useMeQuery,
  useUserStatusesQuery,
} from '../../../../graphql/generated';
import { Header } from '../Header';
import { ChatInput } from './components';

interface Props {
  selectedChannel: RegularChannelFragment | undefined | null;
  setSelectedChannel: (channel: RegularChannelFragment) => void;
  selectedTeam: RegularTeamFragment;
  selectedTeamId: string;
  setSelectedTeam: (team: RegularTeamFragment) => void;
  currentUserName: string;
  currentUserId: string;
  me: MeQuery['me'];
}

export const ChatWindow: FC<Props> = ({
  selectedChannel,
  setSelectedChannel,
  selectedTeam,
  selectedTeamId,
  setSelectedTeam,
  currentUserName,
  currentUserId,
  me,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
          onOpen={onOpen}
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
      <Drawer
        placement="left"
        onClose={onClose}
        isOpen={isOpen}
        returnFocusOnClose={false}
        onOverlayClick={() => onClose()}
      >
        <DrawerOverlay>
          <DrawerContent maxW="300px">
            <DrawerBody p={0}>
              <Sidebar
                isDrawer={onClose}
                setSelectedChannel={setSelectedChannel}
                setSelectedTeam={setSelectedTeam}
                selectedChannel={selectedChannel}
                selectedTeam={selectedTeam}
                me={me}
              />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </FileUpload>
  );
};
