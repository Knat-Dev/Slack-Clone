import { Box, Button, Flex, Link, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSessionContext } from '../../context/SessionContext';
import { useLogoutMutation } from '../../graphql/generated';
import { setAccessToken } from '../../utils/accessToken';
export const Navbar: FC = () => {
  const [logout] = useLogoutMutation();
  const [sessionContext, updateSessionContext] = useSessionContext();

  const handleLogout = async () => {
    await logout({
      update: () => {
        setAccessToken('');
        updateSessionContext({
          ...sessionContext,
          isAuthenticated: false,
        });
      },
    });
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      p={2}
      bgColor="blue.600"
      color="white"
      minH="48px"
    >
      <RouterLink to="/">
        <Text fontSize="lg">App</Text>
      </RouterLink>
      <Box>
        {sessionContext.isAuthenticated ? (
          <div>
            <Button
              as={RouterLink}
              to="/create-team"
              color="blue.500"
              size="sm"
              mr={2}
            >
              Create Team
            </Button>
            <Link onClick={handleLogout}>Logout</Link>
          </div>
        ) : (
          <Link as={RouterLink} to="/login">
            Login
          </Link>
        )}
      </Box>
    </Flex>
  );
};
