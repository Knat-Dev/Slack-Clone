import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { FC } from 'react';
import { useHistory } from 'react-router';
import Select from 'react-select';
import {
  Channel,
  MeDocument,
  MemberMultiselect,
  MeQuery,
  useCreateChannelMutation,
  useGetTeamMembersQuery,
} from '../../graphql/generated';
import { toErrorMap } from '../../utils/toErrorMap';
import InputField from '../InputField';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedTeamId: string;
  setSelectedChannel: (
    selectedChannel: {
      __typename?: 'Channel' | undefined;
    } & Pick<Channel, 'id' | 'name' | 'public'>
  ) => void;
  currentUserId: string;
}

export const AddChannelModal: FC<Props> = ({
  isOpen,
  onClose,
  selectedTeamId,
  setSelectedChannel,
  currentUserId,
}) => {
  if (!selectedTeamId) return null;
  const [createChannel] = useCreateChannelMutation();
  const { data, loading } = useGetTeamMembersQuery({
    skip: !isOpen,
    variables: { teamId: selectedTeamId },
    fetchPolicy: 'network-only',
  });
  const history = useHistory();
  if (!selectedTeamId || loading || !data) return null;
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
          <ModalHeader>Create a team channel</ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                name: '',
                teamId: selectedTeamId,
                public: true,
                users: [] as MemberMultiselect[],
              }}
              onSubmit={async (values, { setErrors }) => {
                try {
                  const response = await createChannel({
                    variables: values,
                    // Update cache on channel created
                    update: (store, { data }) => {
                      // If channel could not be created
                      if (!data?.createChannel || !data.createChannel.ok)
                        return null;

                      // Fetch old data from cache
                      const oldData = store.readQuery<MeQuery>({
                        query: MeDocument,
                      });

                      // Check if old data exists
                      if (oldData?.me.teams && data.createChannel.channel) {
                        // Write new channel data to cache
                        store.writeQuery<MeQuery>({
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
                                if (
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
                  if (response.data?.createChannel.errors) {
                    setErrors(toErrorMap(response.data?.createChannel.errors));
                  } else if (response.data?.createChannel.channel) {
                    // Close madal after cache was updated
                    history.push(
                      `/view-team/${selectedTeamId}/${response.data.createChannel.channel?.id}`
                    );
                    setSelectedChannel(response.data.createChannel.channel);
                    onClose();
                  }
                } catch (e) {
                  console.log(e.message);
                }
              }}
            >
              {({
                handleBlur,
                handleChange,
                isSubmitting,
                setFieldValue,
                values,
                errors,
              }) => (
                <Form>
                  <Heading size="lg" fontWeight="light" mb={3}></Heading>
                  <Box my={3}>
                    <InputField
                      autoFocus
                      onBlur={handleBlur}
                      name="name"
                      placeholder="Enter channel name..."
                      label="Channel Name"
                      type="text"
                      autoComplete="false"
                    />
                  </Box>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="public-channel" mb="0">
                      Make channel private?
                    </FormLabel>
                    <Switch
                      onBlur={handleBlur}
                      id="public-channel"
                      checked={!values.public}
                      onChange={(e) => {
                        setFieldValue('public', !e.target.checked);
                        if (!e.target.checked)
                          setFieldValue('users', [] as MemberMultiselect[]);
                      }}
                    />
                  </FormControl>
                  {!values.public && (
                    <>
                      <FormLabel mt={2}>Add private chat members</FormLabel>
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
                          multiValueLabel: (base) => ({
                            ...base,
                            backgroundColor: '#3182ce',
                            color: 'white',
                            borderRadius: 0,
                          }),
                          multiValueRemove: (base) => ({
                            ...base,
                            backgroundColor: '#3182ce',
                            color: 'white',
                            borderRadius: 0,
                            cursor: 'pointer',
                            transition: 'all 0.1s ease',
                            '&:hover': {
                              background: '#c5245a',
                              color: 'white',
                            },
                          }),
                        }}
                        onChange={(newArr) => {
                          setFieldValue('users', newArr);
                        }}
                        defaultValue={[]}
                        isMulti
                        name="members"
                        placeholder="Select members..."
                        value={values.users}
                        options={data?.getTeamMembers
                          .filter((member) => member.id !== currentUserId)
                          .map((member) => ({
                            value: member.id,
                            label: member.username,
                          }))}
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                      <Text fontSize="sm" color="gray.500">
                        You will be invited to this channel automatically
                      </Text>
                    </>
                  )}

                  {/* General Errors Start*/}
                  {errors.teamId && (
                    <Alert status="error">
                      <AlertIcon />
                      <AlertTitle mr={2}>Error!</AlertTitle>
                      <AlertDescription>{errors.teamId}</AlertDescription>
                    </Alert>
                  )}
                  {/* General Errors End*/}

                  <Button
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    mt={3}
                    type="submit"
                    colorScheme="blue"
                    w="100%"
                  >
                    Create Channel
                  </Button>
                </Form>
              )}
            </Formik>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
