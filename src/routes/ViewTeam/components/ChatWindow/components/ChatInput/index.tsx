import { useApolloClient } from '@apollo/client';
import { randomBytes } from 'crypto';
import { Form, Formik } from 'formik';
import React, { FC, useEffect } from 'react';
import {
  MessagesDocument,
  MessagesQuery,
  NewTypingUserDocument,
  NewTypingUserSubscription,
  RegularChannelFragment,
  useCreateMessageMutation,
  useMessagesQuery,
  useTypingUsersQuery,
} from '../../../../../../graphql/generated';
import { Input } from './components';
import { TypingIndicator } from './components/TypingIndicator';
interface Props {
  selectedChannel: RegularChannelFragment;
  selectedTeamId: string | undefined;
  currentUserName: string;
  currentUserId: string;
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}
export const ChatInput: FC<Props> = ({
  selectedChannel,
  selectedTeamId,
  currentUserName,
  currentUserId,
  inputRef,
}) => {
  const {
    data: typingUsersData,
    loading: typingUsersLoading,
    subscribeToMore,
  } = useTypingUsersQuery({
    variables: { channelId: selectedChannel?.id },
  });
  const [createMessage] = useCreateMessageMutation();
  const { data } = useMessagesQuery({
    variables: { channelId: selectedChannel.id, cursor: null },
  });

  const client = useApolloClient();
  useEffect(() => {
    client.cache.evict({
      fieldName: 'typingUsers',
    });
  }, [selectedChannel.id]);

  useEffect(() => {
    return subscribeToMore({
      document: NewTypingUserDocument,
      variables: { channelId: selectedChannel.id },
      updateQuery: (prev, { subscriptionData }) => {
        const newTypingUser = (subscriptionData.data as NewTypingUserSubscription)
          .newTypingUser;
        if (!newTypingUser) return prev;
        const prevWithoutNewUser = prev.typingUsers.filter(
          (user) => user.id !== newTypingUser.id && user.id !== currentUserId
        );
        if (newTypingUser.typing === true)
          return Object.assign({
            typingUsers: [
              ...prevWithoutNewUser,
              {
                __typename: 'TypingUser',
                id: newTypingUser.id,
                username: newTypingUser.username,
              },
            ],
          });
        else {
          return Object.assign({
            typingUsers: prevWithoutNewUser.filter(
              (user) => user.id !== newTypingUser.id
            ),
          });
        }
      },
    });
  }, [selectedChannel.id]);

  if (!selectedTeamId) return null;

  const typingUsers = typingUsersData?.typingUsers.filter(
    (user) => user.id !== currentUserId
  );
  const messages = data?.messages.page;
  if (!messages || typingUsersLoading) return null;
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
      {() => (
        <Form>
          <Input
            currentUserName={currentUserName}
            currentUserId={currentUserId}
            inputRef={inputRef}
            selectedChannel={selectedChannel}
          />
          <TypingIndicator typingUsers={typingUsers} />
        </Form>
      )}
    </Formik>
  );
};
