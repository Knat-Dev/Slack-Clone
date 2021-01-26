import {
  Box,
  List,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Menu,
} from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { MdAdd } from 'react-icons/md';
import { CircleIconButton } from '../../../../Components';
import { useSessionContext } from '../../../../context/SessionContext';
import {
  NewUserStatusDocument,
  RegularChannelFragment,
  RegularTeamFragment,
  useLogoutMutation,
  useMeQuery,
  useUserStatusesQuery,
} from '../../../../graphql/generated';
import { setAccessToken } from '../../../../utils/accessToken';
import { ChannelItem, UserItem } from './components';
import { ListItem } from './components/ListItem';

interface Props {
  teamName: string | undefined;
  username: string;
  channels: (RegularChannelFragment | null | undefined)[] | null | undefined;
  dmChannels: RegularChannelFragment[] | null | undefined;

  setSelectedChannel: (selectedChannel: RegularChannelFragment) => void;
  selectedChannel: RegularChannelFragment | null | undefined;
  onOpen: () => void;
  onInviteOpen: () => void;
  onDirectMessageOpen: () => void;
  selectedTeam: RegularTeamFragment;
  currentUserName: string;
}

export const Channels: FC<Props> = ({
  teamName,
  username,
  channels,
  dmChannels,
  setSelectedChannel,
  selectedChannel,
  onOpen,
  onInviteOpen,
  onDirectMessageOpen,
  selectedTeam,
  currentUserName,
}) => {
  const [logout, { client }] = useLogoutMutation();
  const { data } = useUserStatusesQuery({
    fetchPolicy: 'cache-only',
    variables: { teamId: selectedTeam.id },
  });
  const [sessionContext, updateSessionContext] = useSessionContext();

  const { loading: meLoading, data: meData } = useMeQuery();

  const handleLogout = async () => {
    await logout();
    await client.clearStore();
    setAccessToken('');
    updateSessionContext({
      ...sessionContext,
      isAuthenticated: false,
    });
    window.location.href = '/login';
  };

  if (meLoading || !meData) return null;
  return (
    <Box background="blue.800" color="#afc4d2">
      <Box ml={4} mt={2}>
        <Menu>
          <MenuButton as={Text} color="white" cursor="pointer">
            {username}
          </MenuButton>
          <MenuList minWidth={100} p={0}>
            <MenuItem onClick={handleLogout}>
              <Text color="blue.500">Sign out</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <Text ml={4}>Team {teamName}</Text>

      <Box
        mb={1}
        display="flex"
        alignItems="center"
        ml={4}
        mt={2}
        color="white"
      >
        <div>Channels</div>
        {selectedTeam?.admin && (
          <CircleIconButton
            label="Add new channel"
            onClick={onOpen}
            ml={2}
            size="small"
            icon={MdAdd}
          />
        )}
      </Box>

      <List>
        {channels &&
          channels.map((channel) =>
            !channel ? null : (
              <ChannelItem
                key={channel.id}
                channel={channel}
                pl={4}
                selectedChannel={selectedChannel}
                setSelectedChannel={setSelectedChannel}
                selectedTeamId={selectedTeam?.id}
              />
            )
          )}
      </List>
      <Box
        mb={1}
        display="flex"
        alignItems="center"
        ml={4}
        mt={2}
        color="white"
      >
        <div>Direct Messages</div>
        <CircleIconButton
          label="Start direct messaging"
          onClick={onDirectMessageOpen}
          ml={2}
          size="small"
          icon={MdAdd}
        />
      </Box>
      <List>
        {dmChannels &&
          selectedTeam?.id &&
          dmChannels.map((channel) => (
            <UserItem
              key={channel.id}
              channel={channel}
              selectedChannel={selectedChannel}
              setSelectedChannel={setSelectedChannel}
              selectedTeamId={selectedTeam.id}
              pl={4}
              currentUserName={currentUserName}
              isOnline={data?.userStatuses.some((userStatus) => {
                return (
                  userStatus.online &&
                  userStatus.username ===
                    channel.name
                      .split(', ')
                      .filter((username) => username !== currentUserName)[0]
                );
              })}
            />
          ))}
      </List>
      {selectedTeam?.admin && (
        <ListItem pl={4} mt={4} onClick={onInviteOpen}>
          <Text as="span" fontWeight="bold" mr={4}>
            +
          </Text>
          Invite People
        </ListItem>
      )}
    </Box>
  );
};
