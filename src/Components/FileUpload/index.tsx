import { Box, BoxProps } from '@chakra-ui/react';
import React, { FC, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  RegularChannelFragment,
  useUploadFileMutation,
} from '../../graphql/generated';

interface Props extends BoxProps {
  noClick?: boolean;
  teamId: string;
  channelId: string;
  to: RegularChannelFragment;
}

export const FileUpload: FC<Props> = ({
  children,
  height,
  noClick = false,
  teamId,
  channelId,
  to,
}) => {
  const [uploadFile] = useUploadFileMutation();

  const onDrop = useCallback(
    async ([f]) => {
      const file: any = new Blob([f], { type: f.type });
      file.name = f.name;
      if (file) {
        try {
          await uploadFile({ variables: { file, teamId, channelId } });
        } catch (e) {
          console.log(e);
        }
      }
    },
    [to]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick,
  });
  return (
    <Box height={height} {...getRootProps()} _focus={{ outline: 'none' }}>
      <div>
        <input {...getInputProps()} />
        {children}
      </div>
    </Box>
  );
};
