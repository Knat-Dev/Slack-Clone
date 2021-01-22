import { Avatar, Flex, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useHistory } from 'react-router';
import {
  Channel,
  RegularTeamFragment,
} from '../../../../../../graphql/generated';

interface Props {
  team: RegularTeamFragment;
  setSelectedTeam: (selectedTeam: RegularTeamFragment) => void;
  selectedId: string | undefined;
  setSelectedChannel: (
    selectedChannel: {
      __typename?: 'Channel' | undefined;
    } & Pick<Channel, 'id' | 'name' | 'public'>
  ) => void;
  selectedChannelId: string | undefined;
}

export const TeamItem: FC<Props> = ({
  team,
  setSelectedTeam,
  selectedId,
  setSelectedChannel,
  selectedChannelId,
}) => {
  const history = useHistory();
  return (
    <Flex align="center" justify="center" direction="column">
      <Tooltip placement="right" label={team.name}>
        <Avatar
          onClick={() => {
            setSelectedTeam(team);
            if (team.channels && team.channels[0]) {
              setSelectedChannel(team.channels[0]);
              history.replace(`/view-team/${team.id}/${team.channels[0].id}`);
            }
          }}
          backgroundColor={selectedId === team.id ? '#235699' : '#262f3b'}
          mt={2}
          src={undefined}
          name={team.name}
          width={10}
          height={10}
          color="white"
          transition="all 0.1s cubic-bezier(0.65, 0.05, 0.36, 1)"
          _hover={{
            backgroundColor: selectedId !== team.id ? '#457dc5' : '#457dc5',
            borderRadius: '25%',
          }}
          cursor="pointer"
        />
      </Tooltip>
    </Flex>
  );
};
