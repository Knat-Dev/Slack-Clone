import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { FC, useEffect, useRef } from 'react';
import { MdAdd, MdSend } from 'react-icons/md';
import { FileUpload } from '../../../../../../Components';
import {
  NewMessagesDocument,
  NewMessagesQuery,
  RegularChannelFragment,
  useCreateMessageMutation,
} from '../../../../../../graphql/generated';
interface Props {
  selectedChannel: RegularChannelFragment | null | undefined;
  selectedTeamId: string | undefined;
  currentUserName: string;
}
export const ChatInput: FC<Props> = ({
  selectedChannel,
  selectedTeamId,
  currentUserName,
}) => {
  const [createMessage] = useCreateMessageMutation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  if (!selectedChannel || !selectedTeamId) return <div>hi</div>;

  useEffect(() => {
    if (selectedChannel) inputRef.current?.focus();
  }, [selectedChannel]);

  return (
    <Formik
      initialValues={{ text: '' }}
      onSubmit={async (values, actions) => {
        actions.setFieldValue('text', '');
        if (selectedChannel.__typename === 'Channel') {
          await createMessage({
            variables: {
              text: values.text,
              channelId: selectedChannel.id,
              teamId: selectedTeamId,
            },
            // optimisticResponse: {
            //   __typename: 'Mutation',
            //   createMessage: {
            //     channelId: selectedChannel.id,
            //     createdAt: new Date().getTime().toString(),
            //     updatedAt: new Date().getTime().toString(),
            //     id: '-1',
            //     user: { username: currentUserName, id: '-1' },
            //     text: values.text,
            //   },
            // },
            // update: (store, { data }) => {
            //   const oldData = store.readQuery<NewMessagesQuery>({
            //     query: NewMessagesDocument,
            //   });
            //   if (data?.createMessage) {
            //     store.writeQuery<NewMessagesQuery>({
            //       query: NewMessagesDocument,
            //       data: {
            //         newMessages: [
            //           ...(oldData?.newMessages || []),
            //           data.createMessage,
            //         ],
            //       },
            //     });
            //   }
            // },
          });
        }
      }}
    >
      {({ isSubmitting, handleBlur, values, handleChange }) => (
        <Form>
          <InputGroup alignItems="center">
            <InputLeftElement>
              <FileUpload
                to={selectedChannel}
                channelId={selectedChannel.id}
                teamId={selectedTeamId}
              >
                <IconButton
                  colorScheme="blue"
                  aria-label="upload file"
                  size="sm"
                >
                  <MdAdd />
                </IconButton>
              </FileUpload>
            </InputLeftElement>
            <InputRightElement>
              <IconButton
                isLoading={isSubmitting}
                colorScheme="blue"
                aria-label="Send message"
                size="sm"
                type="submit"
              >
                <MdSend />
              </IconButton>
            </InputRightElement>
            <Input
              ref={inputRef}
              backgroundColor="white"
              value={values.text}
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus
              name="text"
              type="text"
              placeholder={`Message #${selectedChannel.name
                .split(', ')
                .filter((name) => name !== currentUserName)}`}
              autoComplete="off"
            />
          </InputGroup>
        </Form>
      )}
    </Formik>
  );
};
