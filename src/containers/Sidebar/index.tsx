/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useDisclosure } from '@chakra-ui/react';
import decode from 'jwt-decode';
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
}

export const Sidebar: FC<Props> = ({
  setSelectedChannel,
  selectedChannel,
  selectedTeam,
  setSelectedTeam,
  me,
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

  const getUsername = (): string => {
    const token = sessionStorage.getItem('sid');
    const decoded = decode<{ username: string }>(token || '');
    return decoded.username;
  };

  const getUserId = (): string => {
    const token = sessionStorage.getItem('sid');
    const decoded = decode<{ userId: string }>(token || '');
    return decoded.userId;
  };
  const { loading } = useMeQuery();

  if (loading || !selectedTeam) return null;

  return (
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
        username={getUsername()}
        channels={selectedTeam?.channels.filter((channel) => !channel.dm)}
        dmChannels={selectedTeam?.channels.filter((channel) => channel.dm)}
        onInviteOpen={onInviteOpen}
        onDirectMessageOpen={onDirectMessageOpen}
      />
      <>
        {directMessageOpen && (
          <DirectMessageModal
            isOpen={directMessageOpen}
            onClose={onDirectMessageClose}
            selectedTeamId={selectedTeam.id}
            setSelectedChannel={setSelectedChannel}
            currentUserId={getUserId()}
          />
        )}
        {isOpen && (
          <AddChannelModal
            isOpen={isOpen}
            onClose={onClose}
            selectedTeamId={selectedTeam.id}
            setSelectedChannel={setSelectedChannel}
            currentUserId={getUserId()}
          />
        )}
        {inviteOpen && (
          <InvitePeopleModal
            isOpen={inviteOpen}
            onClose={onInviteClose}
            selectedTeamId={selectedTeam.id}
          />
        )}
      </>
    </>
  );
};
