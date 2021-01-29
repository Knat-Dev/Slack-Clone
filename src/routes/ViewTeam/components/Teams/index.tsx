import { AddIcon } from '@chakra-ui/icons';
import { Box, Flex, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Channel,
  MeQuery,
  RegularTeamFragment,
} from '../../../../graphql/generated';
import { TeamItem } from './components';

interface Props {
  teams: MeQuery['me']['teams'];
  setSelectedTeam: (selectedTeam: RegularTeamFragment) => void;
  selectedId: string;
  setSelectedChannel: (
    selectedChannel: {
      __typename?: 'Channel' | undefined;
    } & Pick<Channel, 'id' | 'name' | 'public'>
  ) => void;
  selectedChannelId: string | undefined;
}

export const Teams: FC<Props> = ({
  teams,
  setSelectedTeam,
  selectedId,
  setSelectedChannel,
  selectedChannelId,
}) => {
  return (
    <Flex
      h="100vh"
      overflow="auto"
      css={{
        '&::-webkit-scrollbar': {
          width: 0,
        },
        '&::-webkit-scrollbar-track': {
          width: 0,
        },
        '&::-webkit-scrollbar-thumb': {},
      }}
      background="#253853"
      color="#afc4d2"
      borderRight="1px #3b4d66  solid"
      align="center"
      flexDir="column"
    >
      {teams &&
        teams.map((team) => (
          <TeamItem
            key={team.id}
            team={team}
            setSelectedTeam={setSelectedTeam}
            selectedId={selectedId}
            setSelectedChannel={setSelectedChannel}
            selectedChannelId={selectedChannelId}
          />
        ))}
      <Box mb={2}>
        <Tooltip label="Create a team" placement="right">
          <Flex
            as={RouterLink}
            to="/create-team"
            align="center"
            justify="center"
            backgroundColor="purple.600"
            borderRadius="50%"
            mt={2}
            width={10}
            height={10}
            color="white"
            _hover={{ backgroundColor: 'purple.500', borderRadius: '25%' }}
            transition="all 0.1s ease-in-out"
            cursor="pointer"
          >
            <AddIcon fontSize="xs" />
          </Flex>
        </Tooltip>
      </Box>
    </Flex>
  );
};
