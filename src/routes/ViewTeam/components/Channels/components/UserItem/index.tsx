import { Box, BoxProps, Flex, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import {
  RegularChannelFragment,
  RegularUserStatusFragment,
} from '../../../../../../graphql/generated';
import { ListItem } from '../ListItem';

interface Props {
  channel: RegularChannelFragment;
  pl?: BoxProps['pl'];
  setSelectedChannel: (selectedChannel: RegularChannelFragment) => void;
  selectedChannel: RegularChannelFragment | null | undefined;
  selectedTeamId: string;
  currentUserName: string;
  isOnline?: boolean;
  closeDrawer?: () => void;
}

export const UserItem: FC<Props> = ({
  channel,
  pl,
  selectedChannel,
  setSelectedChannel,
  selectedTeamId,
  currentUserName,
  isOnline,
  closeDrawer,
}) => {
  const history = useHistory();

  const handleSelectChannel = () => {
    if (closeDrawer) closeDrawer();
    setSelectedChannel(channel);
    history.push(`/view-team/${selectedTeamId}/user/${channel.id}`);
  };

  return (
    <ListItem
      pl={pl}
      backgroundColor={
        selectedChannel?.id === channel.id ? '#243855' : undefined
      }
      onClick={handleSelectChannel}
    >
      <Flex alignItems="center">
        <Box
          width="12px"
          height="12px"
          rounded="6px"
          backgroundColor={isOnline ? 'green.400' : 'gray.500'}
          border="#1e3250 1px solid"
          mr={4}
        />
        <Text>
          {channel.name.split(', ').filter((name) => name !== currentUserName)}
        </Text>
      </Flex>
    </ListItem>
  );
};
