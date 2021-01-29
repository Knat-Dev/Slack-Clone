import { BoxProps, Flex, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { RegularChannelFragment } from '../../../../../../graphql/generated';
import { ListItem } from '../ListItem';

interface Props {
  channel: RegularChannelFragment;
  pl?: BoxProps['pl'];
  setSelectedChannel: (selectedChannel: RegularChannelFragment) => void;
  selectedChannel: RegularChannelFragment | null | undefined;
  selectedTeamId: string | undefined;
  closeDrawer?: () => void;
}

export const ChannelItem: FC<Props> = ({
  channel,
  pl,
  setSelectedChannel,
  selectedChannel,
  selectedTeamId,
  closeDrawer,
}) => {
  const history = useHistory();
  const match = useRouteMatch<{ teamId: string }>();
  if (!channel) return null;
  const handleSelectChannel = () => {
    if (closeDrawer) closeDrawer();
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
      <Flex>
        <Text as="span" fontWeight="bold" mr={4}>
          #
        </Text>
        <Text isTruncated textOverflow="ellipsis">
          {channel.name}
        </Text>
      </Flex>
    </ListItem>
  );
};
