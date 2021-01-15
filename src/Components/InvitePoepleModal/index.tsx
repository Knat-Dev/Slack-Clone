import {
  Box,
  Button,
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
import { useInvitePeopleMutation } from '../../graphql/generated';
import { toErrorMap } from '../../utils/toErrorMap';
import InputField from '../InputField';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedTeamId: string;
}

export const InvitePeopleModal: FC<Props> = ({
  isOpen,
  onClose,
  selectedTeamId,
}) => {
  const [invitePeople] = useInvitePeopleMutation();
  if (!selectedTeamId) return null;
  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add people to your team</ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                email: '',
                teamId: selectedTeamId,
              }}
              onSubmit={async (values, { setErrors }) => {
                try {
                  const response = await invitePeople({
                    variables: values,
                  });
                  if (response.data?.addTeamMember.errors) {
                    setErrors(toErrorMap(response.data.addTeamMember.errors));
                  } else onClose();
                } catch (e) {
                  console.log(e.message);
                }
              }}
            >
              {({ handleBlur, isSubmitting }) => (
                <Form>
                  <Heading size="lg" fontWeight="light" mb={3}></Heading>
                  <Box my={3}>
                    <InputField
                      autoFocus
                      onBlur={handleBlur}
                      name="email"
                      placeholder="Enter user email..."
                      label="User's Email"
                      type="text"
                      autoComplete="email"
                    />
                  </Box>

                  <Button
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    mt={3}
                    type="submit"
                    colorScheme="blue"
                    w="100%"
                  >
                    Add Member
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
