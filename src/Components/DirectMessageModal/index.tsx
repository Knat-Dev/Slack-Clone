import {
  Button,
  FormControl,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { FC } from 'react';
import { useHistory } from 'react-router';
import Select from 'react-select';
import {
  MeDocument,
  MeQuery,
  RegularChannelFragment,
  RegularUserFragment,
  useCreateChannelMutation,
  useGetTeamMembersQuery,
} from '../../graphql/generated';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedTeamId: string;
  setSelectedChannel: (selectedChannel: RegularChannelFragment) => void;
  currentUserId: string;
}

export const DirectMessageModal: FC<Props> = ({
  isOpen,
  onClose,
  selectedTeamId,
  setSelectedChannel,
  currentUserId,
}) => {
  const history = useHistory();
  if (!selectedTeamId) return null;
  const [createChannel, { client }] = useCreateChannelMutation();
  const { data, loading } = useGetTeamMembersQuery({
    skip: !isOpen,
    fetchPolicy: 'network-only',
    variables: { teamId: selectedTeamId },
    notifyOnNetworkStatusChange: true,
  });
  if (!selectedTeamId || loading) return null;
  return (
    <>
      <Modal
        returnFocusOnClose={false}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Start Direct Messaging!</ModalHeader>
          <ModalBody>
            <Heading size="lg" fontWeight="light" mb={3}></Heading>
            {!loading && (
              <Formik
                initialValues={{
                  selection: { value: '', label: '' },
                  user: null as null | RegularUserFragment,
                }}
                onSubmit={async (values) => {
                  if (values.user) {
                    const name = `private-chat-${
                      currentUserId < values.user.id
                        ? `${currentUserId}-${values.user.id}`
                        : `${values.user.id}-${currentUserId}`
                    }`;
                    const res = await createChannel({
                      variables: {
                        teamId: selectedTeamId,
                        name,
                        users: [
                          { value: currentUserId, label: currentUserId },
                          {
                            value: values.user.id,
                            label: values.user.username,
                          },
                        ],
                        public: false,
                        dm: true,
                      },
                      update: (cache, { data }) => {
                        if (!data?.createChannel) return null;
                        const oldData = cache.readQuery<MeQuery>({
                          query: MeDocument,
                        });

                        // Check if old data exists
                        if (oldData?.me.teams && data.createChannel.channel) {
                          // Write new channel data to cache
                          cache.writeQuery<MeQuery>({
                            query: MeDocument,
                            data: {
                              /**
                               * map over team array.
                               * if the selected team is in the array and the channel was created,
                               * add for that team's channels list the newly created channel.
                               */
                              me: {
                                ...oldData.me,
                                teams: oldData.me.teams.map((team, i) => {
                                  const notAlreadyThere = team.channels?.every(
                                    (channel) =>
                                      channel.id !==
                                      data.createChannel.channel?.id
                                  );
                                  if (
                                    notAlreadyThere &&
                                    team.id === selectedTeamId &&
                                    data.createChannel.channel &&
                                    oldData.me.teams &&
                                    oldData.me.teams[i]
                                  ) {
                                    return {
                                      ...team,
                                      channels: [
                                        ...(oldData.me.teams[i].channels || []),
                                        data.createChannel.channel,
                                      ],
                                    };
                                  }
                                  return team;
                                }),
                              },
                            },
                          });
                        }
                      },
                    });
                    const newChannel = res.data?.createChannel.channel;
                    if (newChannel) {
                      client.cache.evict({
                        fieldName: 'userStatuses',
                        args: { teamId: selectedTeamId },
                      });
                      onClose();

                      setSelectedChannel(newChannel);
                      history.push(
                        `/view-team/${selectedTeamId}/user/${newChannel.id}`
                      );
                    } else if (res.data?.createChannel.errors) {
                      onClose();
                    }
                  }
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <FormControl w="100%">
                      <Select
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            borderColor: state.isFocused
                              ? '#3182ce'
                              : '#E2E8F0',
                            boxShadow: state.isFocused
                              ? '0 0 0 1px #3182ce'
                              : undefined,
                            '&:hover': {
                              borderColor: state.isFocused
                                ? '#3182ce'
                                : '#CBD5E0',
                            },
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor:
                              state.isFocused && state.isSelected
                                ? '#3182ce'
                                : state.isFocused
                                ? '#a7c6e4'
                                : state.isSelected
                                ? '#3182ce'
                                : undefined,
                            color:
                              state.isFocused || state.isSelected
                                ? 'white'
                                : undefined,
                          }),
                        }}
                        className="basic-single"
                        classNamePrefix="select"
                        isSearchable
                        name="color"
                        value={values.selection}
                        onChange={(value) => {
                          const user = data?.getTeamMembers.find(
                            (_user) => _user.id === value?.value
                          );
                          setFieldValue('user', user);
                          setFieldValue('selection', value);
                        }}
                        options={data?.getTeamMembers
                          .filter((member) => member.id !== currentUserId)
                          .map((member) => ({
                            label: member.username,
                            value: member.id,
                          }))}
                      />
                    </FormControl>
                    <Button type="submit" w="100%" colorScheme="blue" mt={4}>
                      Start Messaging
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
