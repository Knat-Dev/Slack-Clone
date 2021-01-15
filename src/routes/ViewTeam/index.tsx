import { useMediaQuery } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { Sidebar } from '../../containers';
import {
  RegularChannelFragment,
  RegularTeamFragment,
  useMeQuery,
} from '../../graphql/generated';
import { AppLayout, ChatWindow } from './components';

export const ViewTeam: FC<
  RouteComponentProps<{ teamId: string; channelId: string; userId?: string }>
> = ({ match }) => {
  const [isLargerThan880] = useMediaQuery('(min-width: 880px)');
  const [selectedChannel, setSelectedChannel] = useState<
    RegularChannelFragment | null | undefined
  >(null);
  const [selectedTeam, setSelectedTeam] = useState<RegularTeamFragment | null>(
    null
  );

  const startSetSelectedTeam = (selectedTeam: RegularTeamFragment): void => {
    setSelectedTeam(selectedTeam);
  };
  const startSetSelectedChannel = (
    selectedChannel: RegularChannelFragment
  ): void => {
    setSelectedChannel(selectedChannel);
  };
  const { data, loading } = useMeQuery();

  useEffect(() => {
    if (match.params.teamId) {
      if (data?.me && data.me.teams && typeof data.me.teams !== 'undefined') {
        const index = data.me.teams.findIndex(
          (team) => team.id === match.params.teamId
        );
        if (index !== -1) {
          const team = data.me.teams[index];
          if (team) setSelectedTeam(team);
        } else if (data?.me.teams[0]) setSelectedTeam(data?.me.teams[0]);

        // Regular channel messages
        if (index !== -1 && match.params.channelId) {
          if (
            data.me.teams[index] &&
            typeof data.me.teams[index].channels !== 'undefined'
          ) {
            const i = data.me.teams[index].channels?.findIndex(
              (channel) => channel.id === match.params.channelId
            );
            const team = data?.me.teams[index];
            if (team.channels) {
              const channel = team.channels[i];
              if (i && i !== -1) setSelectedChannel(channel);
              else if (team.channels && team.channels[0])
                setSelectedChannel(team.channels[0]);
            }
          }
          // Direct Messages
        } else if (index !== -1 && match.params.userId) {
          console.log('direct messaging path');
          if (
            data.me.teams[index] &&
            typeof data.me.teams[index].channels !== 'undefined'
          ) {
            const i = data.me.teams[index].channels?.findIndex(
              (member) => member.id === match.params.userId
            );
            const team = data?.me.teams[index];
            if (team.channels && typeof i !== 'undefined') {
              const member = team.channels[i];
              if (i !== -1) setSelectedChannel(member);
              else if (team.channels && team.channels[0] && !selectedChannel) {
                setSelectedChannel(team.channels[0]);
              } else if (!selectedChannel) {
                if (team.channels && team.channels[0])
                  setSelectedChannel(team.channels[0]);
              }
            }
          }
        } else {
          if (
            match.params.channelId &&
            data?.me &&
            data.me.teams[0] &&
            data.me.teams[0].channels &&
            data?.me.teams[0].channels[0]
          ) {
            setSelectedChannel(data.me.teams[0].channels[0]);
          }
        }
      }
    } else if (data?.me.teams && data?.me.teams[0]) {
      setSelectedTeam(data?.me.teams[0]);
      if (data?.me.teams[0].channels && data?.me.teams[0].channels[0]) {
        setSelectedChannel(data.me.teams[0].channels[0]);
      }
    }
  }, [match, data?.me]);

  const { loading: meLoading } = useMeQuery();

  if (loading || meLoading) return null;
  if (!data?.me.teams?.length) return <Redirect to="/create-team" />;
  return (
    <AppLayout mediaQuery={isLargerThan880}>
      {isLargerThan880 ? (
        <>
          <Sidebar
            me={data?.me}
            setSelectedChannel={startSetSelectedChannel}
            selectedChannel={selectedChannel}
            selectedTeam={selectedTeam}
            setSelectedTeam={startSetSelectedTeam}
          />
        </>
      ) : null}
      <ChatWindow
        currentUserName={data.me.username}
        selectedChannel={selectedChannel}
        selectedTeamId={selectedTeam?.id}
      />
    </AppLayout>
  );
};
