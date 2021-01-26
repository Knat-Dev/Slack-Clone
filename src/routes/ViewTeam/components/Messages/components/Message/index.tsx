import { AspectRatio, Box, Image, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { RegularMessageFragment } from '../../../../../../graphql/generated';

interface Props {
  message: RegularMessageFragment;
}

export const Message: FC<Props> = ({ message }) => {
  const { filetype, url } = message;

  return (
    <>
      {message.text || !url ? (
        <Text color="#40455e">{message.text}</Text>
      ) : filetype?.includes('image') ? (
        <AspectRatio ratio={4 / 3} maxH={400} maxW={400}>
          <Image src={url} alt={message.user.username} />
        </AspectRatio>
      ) : filetype?.includes('video') ? (
        <AspectRatio ratio={16 / 9} maxW={450} mr={5}>
          <video muted autoPlay loop src={url}></video>
        </AspectRatio>
      ) : (
        <div>unknown type</div>
      )}
    </>
  );
};
