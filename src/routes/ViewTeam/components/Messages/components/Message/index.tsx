import { AspectRatio, Image } from '@chakra-ui/react';
import React, { FC } from 'react';
import { RegularMessageFragment } from '../../../../../../graphql/generated';
import { TextMessage } from './components';

interface Props {
  message: RegularMessageFragment;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleEdit: (message: RegularMessageFragment, text: string) => Promise<void>;
}

export const Message: FC<Props> = ({
  message,
  editing,
  setEditing,
  handleEdit,
}) => {
  const { filetype, url } = message;

  return (
    <div key={message.id}>
      {message.text || !url ? (
        <TextMessage
          editing={editing}
          handleEdit={handleEdit}
          message={message}
          setEditing={setEditing}
        />
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
    </div>
  );
};
