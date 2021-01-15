import { Box, Button, Heading } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router';
import { FullPage } from '../../Components';
import InputField from '../../Components/InputField';
import {
  MeDocument,
  MeQuery,
  useCreateTeamMutation,
  useMeQuery,
} from '../../graphql/generated';
import { toErrorMap } from '../../utils/toErrorMap';

export const CreateTeam: FC<RouteComponentProps> = ({ history, match }) => {
  const [createTeam] = useCreateTeamMutation();
  const { loading } = useMeQuery();
  //   useEffect(() => {
  //     if (!getAccessToken()) authenticateRequest(history, match);
  //   }, []);
  if (loading) return null;
  return (
    <FullPage>
      <Box minW={450} boxShadow="xl" p={5} rounded="md">
        <Formik
          initialValues={{ name: '' }}
          onSubmit={async (values, { setErrors }) => {
            try {
              const { data } = await createTeam({
                variables: values,
                update: (store, { data }) => {
                  if (!data?.createTeam) return null;
                  const oldData = store.readQuery<MeQuery>({
                    query: MeDocument,
                  });

                  // Check if old data exists
                  if (oldData && data.createTeam.team) {
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
                          teams: [
                            ...(oldData.me.teams ?? []),
                            data.createTeam.team,
                          ],
                        },
                      },
                    });
                    // redirect
                    history.push(
                      `/view-team/${data.createTeam.team.id}/${
                        data.createTeam.team.channels &&
                        data.createTeam.team.channels[0].id
                      }`
                    );
                  }
                },
              });
              if (data?.createTeam?.errors) {
                setErrors(toErrorMap(data.createTeam.errors));
              }
            } catch (e) {
              console.log(e.message);
              //   if (e.message === 'Not authenticated')
              //     authenticateRequest(history, match);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Heading size="lg" fontWeight="light" mb={3}>
                Create a team!
              </Heading>

              <Box mt={3}>
                <InputField
                  name="name"
                  placeholder="Enter desired team name here..."
                  label="Team Name"
                  type="text"
                />
              </Box>

              <Button
                isLoading={isSubmitting}
                mt={3}
                type="submit"
                colorScheme="blue"
                w="100%"
              >
                Create
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </FullPage>
  );
};
