import { IconButton, InputGroup, InputRightElement } from '@chakra-ui/react';
import { randomBytes } from 'crypto';
import { Form, Formik } from 'formik';
import React, { FC, useRef } from 'react';
import { MdSend } from 'react-icons/md';
import { AutoResizeTextarea } from '../../../../../../Components/AutoResizeTextarea';
import {
  MessagesDocument,
  MessagesQuery,
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
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const { data } = useMessagesQuery({
    variables: { channelId: selectedChannel.id, cursor: null },
  });
  if (!selectedChannel || !selectedTeamId) return null;

  const messages = data?.messages.page;
  if (!messages) return null;
  return (
    <Formik
      initialValues={{ text: '' }}
      onSubmit={async (values, actions) => {
        actions.setFieldValue('text', '');
        actions.setSubmitting(false);
        if (!values.text.trim()) return false;
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
              edited: false,
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
            const oldData = store.readQuery<MessagesQuery>({
              query: MessagesDocument,
              variables: {
                channelId: selectedChannel.id,
                cursor: null,
              },
            });
            if (
              data?.createMessage &&
              oldData?.messages &&
              !oldData?.messages.page.some(
                (message) => message.id === data.createMessage?.id
              )
            ) {
              store.writeQuery<MessagesQuery>({
                query: MessagesDocument,
                variables: {
                  channelId: selectedChannel.id,
                  cursor: null,
                },
                data: {
                  messages: {
                    ...oldData.messages,
                    page: [
                      ...(oldData.messages.page || []),
                      data.createMessage,
                    ],
                  },
                },
              });
            }
          },
        });
      }}
    >
      {({ isSubmitting, handleBlur, values, handleChange, handleSubmit }) => (
        <Form>
          <InputGroup alignItems="center">
            <InputRightElement bottom="0" top="auto">
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
            <AutoResizeTextarea
              ref={inputRef}
              autoFocus
              onKeyPress={(e) => {
                if (!e.shiftKey && e.key === 'Enter' && values.text.trim()) {
                  e.preventDefault();
                  e.stopPropagation();
                  return handleSubmit();
                }
              }}
              name="text"
              value={values.text}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={`Message #${selectedChannel.name
                .split(', ')
                .filter((name) => name !== currentUserName)}`}
            />
            {/* <Textarea
              minH="40px"
              px="40px"
              maxRows={2}
              resize="none"
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
              as={ResizeTextarea as typeof TextareaAutosize & 'symbol'}
            /> */}
          </InputGroup>
        </Form>
      )}
    </Formik>
  );
};
