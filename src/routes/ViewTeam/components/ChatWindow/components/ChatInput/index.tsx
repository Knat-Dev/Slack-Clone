import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { randomBytes } from 'crypto';
import { Form, Formik } from 'formik';
import React, { FC, useEffect, useRef } from 'react';
import { MdAdd, MdSend } from 'react-icons/md';
import { FileUpload } from '../../../../../../Components';
import {
  NewMessagesDocument,
  NewMessagesQuery,
  RegularChannelFragment,
  useCreateMessageMutation,
  useMessagesQuery,
} from '../../../../../../graphql/generated';
interface Props {
  selectedChannel: RegularChannelFragment;
  selectedTeamId: string | undefined;
  currentUserName: string;
  currentUserId: string;
}
export const ChatInput: FC<Props> = ({
  selectedChannel,
  selectedTeamId,
  currentUserName,
  currentUserId,
}) => {
  const [createMessage] = useCreateMessageMutation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { data } = useMessagesQuery({
    variables: { channelId: selectedChannel.id, cursor: null },
  });
  if (!selectedChannel || !selectedTeamId) return <div>hi</div>;

  useEffect(() => {
    if (selectedChannel) inputRef.current?.focus();
  }, [selectedChannel]);

  const messages = data?.messages.page;
  if (!messages) return null;
  const cursor =
    messages.length > 0 ? messages[messages.length - 1].createdAt : null;
  return (
    <Formik
      initialValues={{ text: '' }}
      onSubmit={async (values, actions) => {
        actions.setFieldValue('text', '');
        actions.setSubmitting(false);
        await createMessage({
          variables: {
            text: values.text,
            channelId: selectedChannel.id,
            teamId: selectedTeamId,
          },
          optimisticResponse: {
            createMessage: {
              __typename: 'Message',
              channelId: selectedChannel.id,
              createdAt: new Date().getTime().toString(),
              updatedAt: new Date().getTime().toString(),
              id: randomBytes(12).toString('hex'),
              user: {
                username: currentUserName,
                id: currentUserId,
                __typename: 'User',
              },
              text: values.text,
              filetype: null,
              url: null,
            },
          },
          update: (store, { data }) => {
            const oldData = store.readQuery<NewMessagesQuery>({
              query: NewMessagesDocument,
              variables: {
                channelId: selectedChannel.id,
                cursor,
              },
            });
            if (
              data?.createMessage &&
              !oldData?.newMessages.some(
                (message) => message.id === data.createMessage?.id
              )
            ) {
              store.writeQuery<NewMessagesQuery>({
                query: NewMessagesDocument,
                variables: {
                  channelId: selectedChannel.id,
                  cursor,
                },
                data: {
                  newMessages: [
                    ...(oldData?.newMessages || []),
                    data.createMessage,
                  ],
                },
              });
            }
          },
        });
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
