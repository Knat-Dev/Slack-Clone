import { AspectRatio, Image, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { RegularMessageFragment } from '../../../../../../graphql/generated';

interface Props {
  message: RegularMessageFragment;
}

export const Message: FC<Props> = ({ message }) => {
  const { filetype, url } = message;

  return message.text || !url ? (
    <Text color="#40455e">{message.text}</Text>
  ) : filetype?.includes('image') ? (
    <Image
      my={1}
      boxSize="150px"
      objectFit="cover"
      src={url}
      alt={message.user.username}
    />
  ) : filetype?.includes('video') ? (
    <AspectRatio ratio={16 / 9} minW={350}>
      <video muted autoPlay loop src={url}></video>
    </AspectRatio>
  ) : (
    <div>unknown type</div>
  );
};
