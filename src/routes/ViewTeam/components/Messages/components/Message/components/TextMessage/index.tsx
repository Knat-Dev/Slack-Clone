import {
  Box,
  Flex,
  InputGroup,
  Input,
  InputRightAddon,
  ButtonGroup,
  Text,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React, { FC, useEffect, useRef } from 'react';
import { MdSave, MdClose } from 'react-icons/md';
import { CircleButton } from '../../../../../../../../Components';
import { RegularMessageFragment } from '../../../../../../../../graphql/generated';
import {
  default as ResizeTextarea,
  default as TextareaAutosize,
} from 'react-textarea-autosize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { duotoneDark as style } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  editing: boolean;
  message: RegularMessageFragment;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleEdit: (message: RegularMessageFragment, text: string) => Promise<void>;
}

export const TextMessage: FC<Props> = ({
  editing,
  message,
  setEditing,
  handleEdit,
}) => {
  const codeBlockRegex = /```([a-zA-Z]*[\s\S]*?)\n?([a-zA-Z]*[\s\S]*?)\n?```/;
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      const len = inputRef.current?.value.length;
      console.log(len);

      inputRef.current.setSelectionRange(len, len);
    }
  }, [editing]);
  const edited = message.edited && (
    <Text
      lineHeight="24px"
      ml={1}
      as="span"
      fontSize="xs"
      color="rgba(0,0,0,0.4)"
    >
      (edited)
    </Text>
  );

  const isCodeBlock = () => {
    return message.text && codeBlockRegex.test(message.text);
  };

  const parsedCodeblock = () => {
    if (!message.text) return null;
    const codeBlockData = message.text.split(codeBlockRegex);

    console.log(codeBlockData[1]);
    return (
      <SyntaxHighlighter language={codeBlockData[1]} style={style}>
        {codeBlockData[2]}
      </SyntaxHighlighter>
    );
  };

  return !editing ? (
    <Box>
      {message.text && message.text.includes('\n') ? (
        !isCodeBlock() ? (
          <div>
            {message.text.split('\n').map((line, i, arr) =>
              i === arr.length - 1 ? (
                <Flex key={line + '-' + i} py="0.1rem">
                  <Text lineHeight="24px" color="#40455e">
                    {line}
                  </Text>
                  {edited}
                </Flex>
              ) : (
                <Box key={line + '-' + i} py="0.1rem">
                  <Text>{line}</Text>
                </Box>
              )
            )}
          </div>
        ) : (
          parsedCodeblock()
        )
      ) : (
        <Flex py="0.1rem">
          <Text lineHeight="24px" color="#40455e">
            {message.text}
          </Text>
          {edited}
        </Flex>
      )}
    </Box>
  ) : message.text ? (
    <Formik
      initialValues={{ text: message.text }}
      onSubmit={async (values) => {
        setEditing(false);
        if (values.text.trim() && values.text.trim() !== message.text?.trim())
          await handleEdit(message, values.text.trim());
      }}
    >
      {({ values, handleChange, handleBlur, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Box>
            <InputGroup>
              <Input
                ref={inputRef}
                name="text"
                resize="none"
                transition="height none"
                minH="unset"
                value={values.text}
                onKeyPress={(e) => {
                  if (!e.shiftKey && e.key === 'Enter') {
                    if (
                      !e.shiftKey &&
                      e.key === 'Enter' &&
                      values.text.trim()
                    ) {
                      e.preventDefault();
                      e.stopPropagation();
                      return handleSubmit();
                    }
                  }
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                pl={1}
                fontSize="md"
                borderColor="blue.300"
                _hover={{ borderColor: 'blue.400' }}
                _focus={{ boxShadow: 'none', borderColor: 'blue.600' }}
                as={ResizeTextarea as typeof TextareaAutosize & 'symbol'}
              />
              <InputRightAddon
                maxHeight="26px"
                px={1}
                m={0}
                bg="#2b6cb0"
                borderColor="#2b6cb0"
              >
                <Flex align="center">
                  <ButtonGroup borderRadius="0" spacing={0}>
                    <CircleButton label="Save Edit!" mr={1} type="submit">
                      <MdSave />
                    </CircleButton>
                    <CircleButton
                      label="Revert Edit!"
                      onClick={() => setEditing(false)}
                    >
                      <MdClose />
                    </CircleButton>
                  </ButtonGroup>
                </Flex>
              </InputRightAddon>
            </InputGroup>
          </Box>
        </Form>
      )}
    </Formik>
  ) : null;
};
