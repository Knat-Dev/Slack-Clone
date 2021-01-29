/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Grid, useDisclosure } from '@chakra-ui/react';
import React, { FC } from 'react';
import {
  AddChannelModal,
  DirectMessageModal,
  InvitePeopleModal,
} from '../../Components';
import {
  MeQuery,
  RegularChannelFragment,
  RegularTeamFragment,
  useMeQuery,
} from '../../graphql/generated';
import { Channels, Teams } from '../../routes/ViewTeam/components';

interface Props {
  setSelectedChannel: (selectedChannel: RegularChannelFragment) => void;
  selectedChannel: RegularChannelFragment | undefined | null;
  selectedTeam: RegularTeamFragment | null;
  setSelectedTeam: (selectedTeam: RegularTeamFragment) => void;
  me: MeQuery['me'];
  isDrawer?: () => void;
}

export const Sidebar: FC<Props> = ({
  setSelectedChannel,
  selectedChannel,
  selectedTeam,
  setSelectedTeam,
  me,
  isDrawer,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: directMessageOpen,
    onOpen: onDirectMessageOpen,
    onClose: onDirectMessageClose,
  } = useDisclosure();
  const {
    isOpen: inviteOpen,
    onOpen: onInviteOpen,
    onClose: onInviteClose,
  } = useDisclosure();

  const { loading } = useMeQuery();

  if (loading || !selectedTeam) return null;

  return (
    <>
      {!isDrawer ? (
        <>
          <Teams
            selectedId={selectedTeam.id}
            setSelectedTeam={setSelectedTeam}
            setSelectedChannel={setSelectedChannel}
            selectedChannelId={selectedChannel?.id}
            teams={me.teams}
          />
          <Channels
            currentUserName={me.username}
            onOpen={onOpen}
            selectedChannel={selectedChannel}
            setSelectedChannel={setSelectedChannel}
            selectedTeam={selectedTeam}
            teamName={selectedTeam?.name}
            channels={selectedTeam?.channels.filter((channel) => !channel.dm)}
            dmChannels={selectedTeam?.channels.filter((channel) => channel.dm)}
            onInviteOpen={onInviteOpen}
            onDirectMessageOpen={onDirectMessageOpen}
          />
        </>
      ) : (
        <Grid templateColumns="60px 240px" maxW="300px">
          <Teams
            selectedId={selectedTeam.id}
            setSelectedTeam={setSelectedTeam}
            setSelectedChannel={setSelectedChannel}
            selectedChannelId={selectedChannel?.id}
            teams={me.teams}
          />
          <Channels
            currentUserName={me.username}
            onOpen={onOpen}
            selectedChannel={selectedChannel}
            setSelectedChannel={setSelectedChannel}
            selectedTeam={selectedTeam}
            teamName={selectedTeam?.name}
            channels={selectedTeam?.channels.filter((channel) => !channel.dm)}
            dmChannels={selectedTeam?.channels.filter((channel) => channel.dm)}
            onInviteOpen={onInviteOpen}
            onDirectMessageOpen={onDirectMessageOpen}
            closeDrawer={isDrawer}
          />
        </Grid>
      )}

      <DirectMessageModal
        isOpen={directMessageOpen}
        onClose={onDirectMessageClose}
        selectedTeamId={selectedTeam.id}
        setSelectedChannel={setSelectedChannel}
        currentUserId={me.id}
      />
      <AddChannelModal
        isOpen={isOpen}
        onClose={onClose}
        selectedTeamId={selectedTeam.id}
        setSelectedChannel={setSelectedChannel}
        currentUserId={me.id}
      />
      <InvitePeopleModal
        isOpen={inviteOpen}
        onClose={onInviteClose}
        selectedTeamId={selectedTeam.id}
      />
    </>
  );
};
