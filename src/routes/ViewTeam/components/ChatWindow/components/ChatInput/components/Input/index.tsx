import {
  IconButton,
  InputGroup,
  InputRightElement,
  usePrevious,
} from '@chakra-ui/react';
import { useField, useFormikContext } from 'formik';
import React, { FC, useEffect } from 'react';
import { MdSend } from 'react-icons/md';
import { AutoResizeTextarea } from '../../../../../../../../Components/AutoResizeTextarea';
import {
  RegularChannelFragment,
  TypingUsersDocument,
  TypingUsersQuery,
  useSetUserTypingMutation,
} from '../../../../../../../../graphql/generated';

interface Props {
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  selectedChannel: RegularChannelFragment;
  currentUserId: string;
  currentUserName: string;
}

export const Input: FC<Props> = ({
  inputRef,
  selectedChannel,
  currentUserId,
  currentUserName,
}) => {
  const { handleSubmit, isSubmitting } = useFormikContext();
  const [setUserTyping, { client }] = useSetUserTypingMutation();
  const [{ value, onChange, onBlur }] = useField<string>('text');
  // will be replaced with mutations
  const prevValue = usePrevious(value);

  useEffect(() => {
    const old = client.readQuery<TypingUsersQuery>({
      query: TypingUsersDocument,
      variables: { channelId: selectedChannel.id },
    });
    let timeOutId: NodeJS.Timeout;
    if (
      value.length > 0 &&
      prevValue.length < value.length &&
      old?.typingUsers.every((user) => user.id !== currentUserId)
    ) {
      setUserTyping({
        variables: { channelId: selectedChannel.id, isTyping: true },
        optimisticResponse: {
          setUserTyping: {
            id: currentUserId,
            username: currentUserName,
            typing: true,
          },
        },
        update: (store, { data }) => {
          const postTimeoutOld = client.readQuery<TypingUsersQuery>({
            query: TypingUsersDocument,
            variables: { channelId: selectedChannel.id },
          });
          if (postTimeoutOld && data?.setUserTyping) {
            store.writeQuery<TypingUsersQuery>({
              query: TypingUsersDocument,
              variables: { channelId: selectedChannel.id },
              data: {
                typingUsers: [
                  ...postTimeoutOld.typingUsers,
                  {
                    id: data.setUserTyping.id,
                    username: data.setUserTyping.username,
                  },
                ],
              },
            });
          }
        },
      });

      timeOutId = setTimeout(() => {
        const postTimeoutOld = client.readQuery<TypingUsersQuery>({
          query: TypingUsersDocument,
          variables: { channelId: selectedChannel.id },
        });
        setUserTyping({
          variables: { channelId: selectedChannel.id, isTyping: false },
          update: (store, { data }) => {
            if (postTimeoutOld && data?.setUserTyping) {
              store.writeQuery<TypingUsersQuery>({
                query: TypingUsersDocument,
                variables: { channelId: selectedChannel.id },
                data: {
                  __typename: 'Query',
                  typingUsers: postTimeoutOld.typingUsers.filter(
                    (user) => user.id !== data.setUserTyping?.id
                  ),
                },
              });
            }
          },
        });
      }, 10000);
    } else if (value.length > 0) {
      timeOutId = setTimeout(() => {
        const postTimeoutOld = client.readQuery<TypingUsersQuery>({
          query: TypingUsersDocument,
          variables: { channelId: selectedChannel.id },
        });
        setUserTyping({
          variables: { channelId: selectedChannel.id, isTyping: false },
          update: (store, { data }) => {
            if (postTimeoutOld && data?.setUserTyping) {
              store.writeQuery<TypingUsersQuery>({
                query: TypingUsersDocument,
                variables: { channelId: selectedChannel.id },
                data: {
                  typingUsers: postTimeoutOld.typingUsers.filter(
                    (user) => user.id !== data.setUserTyping?.id
                  ),
                },
              });
            }
          },
        });
      }, 10000);
    } else if (prevValue && prevValue.length > 0 && value.length === 0) {
      setUserTyping({
        variables: { channelId: selectedChannel.id, isTyping: false },
        update: (store, { data }) => {
          if (old && data?.setUserTyping) {
            store.writeQuery<TypingUsersQuery>({
              query: TypingUsersDocument,
              variables: { channelId: selectedChannel.id },
              data: {
                typingUsers: old.typingUsers.filter(
                  (user) => user.id !== data.setUserTyping?.id
                ),
              },
            });
          }
        },
      });
    }
    return () => {
      if (timeOutId) clearTimeout(timeOutId);
    };
  }, [value, prevValue]);

  // remove typing user when changing channel
  useEffect(() => {
    return () => {
      console.log('changed');
      const old = client.readQuery<TypingUsersQuery>({
        query: TypingUsersDocument,
        variables: { channelId: selectedChannel.id },
      });
      setUserTyping({
        variables: { channelId: selectedChannel.id, isTyping: false },
        update: (store, { data }) => {
          if (old && data?.setUserTyping) {
            store.writeQuery<TypingUsersQuery>({
              query: TypingUsersDocument,
              variables: { channelId: selectedChannel.id },
              data: {
                typingUsers: old.typingUsers.filter(
                  (user) => user.id !== data.setUserTyping?.id
                ),
              },
            });
          }
        },
      });
    };
  }, [selectedChannel.id]);

  return (
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
        dir="auto"
        textAlign="left"
        style={{ unicodeBidi: 'isolate' }}
        autoFocus
        ref={inputRef}
        onKeyPress={(e) => {
          if (!e.shiftKey && e.key === 'Enter' && value.trim()) {
            e.preventDefault();
            e.stopPropagation();
            return handleSubmit();
          }
        }}
        name="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={`Message #${selectedChannel.name
          .split(', ')
          .filter((name) => name !== currentUserName)}`}
      />
    </InputGroup>
  );
};
