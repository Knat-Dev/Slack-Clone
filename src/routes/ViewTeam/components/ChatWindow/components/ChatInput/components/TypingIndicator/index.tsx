import { Box, Flex, Text } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { FC } from 'react';
import { RegularUserFragment } from '../../../../../../../../graphql/generated';

interface Props {
  typingUsers?: RegularUserFragment[];
}

export const TypingIndicator: FC<Props> = ({ typingUsers }) => {
  const isPlural = typingUsers && typingUsers?.length > 1;
  const typingUsersString =
    isPlural && typingUsers ? (
      <>
        <Text as="span" color="blue.700">
          {typingUsers
            .splice(0, typingUsers.length - 1)
            .map((user) => user.username)
            .join(', ')}
        </Text>
        <Text as="span"> and </Text>
        <Text as="span" color="blue.700">
          {typingUsers[typingUsers.length - 1].username}
        </Text>
        <Text as="span" color="gray.700">
          {' are typing'}
        </Text>
      </>
    ) : typingUsers && typingUsers.length > 0 ? (
      <Box color="blue.700">
        <Text as="span">{typingUsers[0].username}</Text>
        <Text as="span" color="gray.700">
          {' is typing'}
        </Text>
      </Box>
    ) : null;

  return (
    <Flex w="100%" h="24px" align="center">
      <AnimatePresence>
        {typingUsers && typingUsers.length > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0,
              translateX: 100,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              translateX: 0,
            }}
            exit={{ opacity: 0, scale: 0, translateX: 100 }}
            style={{ display: 'flex' }}
          >
            <Box className="spinner" mr={2}>
              <Box className="bounce1" />
              <Box className="bounce2" />
              <Box className="bounce3" />
            </Box>
            <Box>{typingUsersString}</Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
  );
};
