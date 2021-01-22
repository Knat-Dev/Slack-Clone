import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { FullPage } from '../../Components';
import InputField from '../../Components/InputField';
import { useSessionContext } from '../../context/SessionContext';
import { useLoginMutation } from '../../graphql/generated';
import { setAccessToken } from '../../utils/accessToken';
import { toErrorMap } from '../../utils/toErrorMap';

export const Login: FC<RouteComponentProps> = ({ history }) => {
  const [login] = useLoginMutation();
  const [sessionContext, updateSessionContext] = useSessionContext();

  return (
    <FullPage>
      <Box minW={350}>
        <Formik
          initialValues={{ usernameOrEmail: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {
            try {
              const response = await login({
                variables: values,
                update: (store, { data }) => {
                  if (!data?.login || data.login.errors) return null;
                  else history.replace('/view-team');
                },
              });
              if (response.data?.login.errors) {
                setErrors(toErrorMap(response.data?.login.errors));
              } else if (response.data?.login.accessToken) {
                setAccessToken(response.data.login.accessToken);
                updateSessionContext({
                  ...sessionContext,
                  isAuthenticated: true,
                });
              }
            } catch (e) {
              console.log(e.message);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Heading size="lg" fontWeight="light" mb={3}>
                Sign-in
              </Heading>
              <Box my={3}>
                <InputField
                  name="usernameOrEmail"
                  placeholder="Enter username or email..."
                  label="Username or Email"
                  type="text"
                  autoComplete="username"
                />
              </Box>

              <Box mt={3}>
                <InputField
                  name="password"
                  placeholder="Enter your password..."
                  label="Password"
                  type="password"
                />
              </Box>
              <Flex>
                <Box
                  mt={1}
                  fontSize="sm"
                  w="100%"
                  textAlign="right"
                  color="gray.500"
                >
                  Forgot password? click{' '}
                  <RouterLink to="forgot-password">
                    {' '}
                    <Link as="span" color="blue.400">
                      here
                    </Link>
                  </RouterLink>
                </Box>
              </Flex>
              <Button
                isLoading={isSubmitting}
                mt={3}
                type="submit"
                colorScheme="blue"
                w="100%"
              >
                Login
              </Button>
              <Flex>
                <Box
                  mt={2}
                  fontSize="sm"
                  w="100%"
                  textAlign="center"
                  color="gray.500"
                >
                  {"Don't have an account yet? click "}
                  <RouterLink to="/register">
                    <Link as="span" color="blue.400">
                      here
                    </Link>
                  </RouterLink>
                </Box>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>
    </FullPage>
  );
};
