import { BoxProps, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import {
  RegularChannelFragment,
  RegularUserFragment,
} from '../../../../../../graphql/generated';
import { ListItem } from '../ListItem';

interface Props {
  channel: RegularChannelFragment;
  pl?: BoxProps['pl'];
  setSelectedChannel: (selectedChannel: RegularChannelFragment) => void;
  selectedChannel: RegularChannelFragment | null | undefined;
  selectedTeamId: string | undefined;
}

export const ChannelItem: FC<Props> = ({
  channel,
  pl,
  setSelectedChannel,
  selectedChannel,
  selectedTeamId,
}) => {
  const history = useHistory();
  const match = useRouteMatch<{ teamId: string }>();
  if (!channel) return null;
  const handleSelectChannel = () => {
    setSelectedChannel(channel);
    history.push(`/view-team/${selectedTeamId}/${channel.id}`);
  };
  return (
    <ListItem
      pl={pl}
      onClick={handleSelectChannel}
      backgroundColor={
        selectedChannel?.id === channel.id ? '#243855' : undefined
      }
    >
      <Text as="span" fontWeight="bold" mr={4}>
        #
      </Text>
      {channel.name}
    </ListItem>
  );
};
