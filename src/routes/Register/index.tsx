import { Heading, Box, Flex, Button, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { FullPage } from '../../Components';
import InputField from '../../Components/InputField';
import { useRegisterMutation } from '../../graphql/generated';
import { toErrorMap } from '../../utils/toErrorMap';

export const Register: FC<RouteComponentProps> = ({ history }) => {
  const [register] = useRegisterMutation();

  return (
    <FullPage>
      <Box minW={350}>
        <Formik
          initialValues={{ username: '', email: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {
            const response = await register({ variables: values });
            if (response.data?.register.errors) {
              setErrors(toErrorMap(response.data.register.errors));
            } else {
              if (response.data?.register.ok) history.push('/login');
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Heading size="lg" fontWeight="light" mb={3}>
                Sign-up
              </Heading>
              <Box my={3}>
                <InputField
                  name="username"
                  placeholder="Username"
                  label="Username"
                  type="text"
                  autoComplete="username"
                />
              </Box>
              <Box my={3}>
                <InputField
                  name="email"
                  placeholder="Email"
                  label="Email"
                  type="text"
                  autoComplete="email"
                />
              </Box>
              <Box mt={3}>
                <InputField
                  name="password"
                  placeholder="Password"
                  label="Password"
                  type="password"
                />
              </Box>

              <Button
                isLoading={isSubmitting}
                mt={5}
                type="submit"
                colorScheme="blue"
                w="100%"
              >
                Register
              </Button>
              <Flex>
                <Box
                  mt={2}
                  fontSize="sm"
                  w="100%"
                  textAlign="center"
                  color="gray.500"
                >
                  {'Already got an account? click '}
                  <RouterLink to="/login">
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
