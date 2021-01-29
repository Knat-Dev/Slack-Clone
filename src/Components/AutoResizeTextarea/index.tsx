/* eslint-disable react/display-name */
import { Textarea, TextareaProps } from '@chakra-ui/react';
import React from 'react';
import {
  default as ResizeTextarea,
  default as TextareaAutosize,
} from 'react-textarea-autosize';

export const AutoResizeTextarea = React.forwardRef(
  (
    props: TextareaProps,
    ref:
      | string
      | ((instance: HTMLTextAreaElement | null) => void)
      | React.RefObject<HTMLTextAreaElement>
      | null
      | undefined
  ) => {
    return (
      <Textarea
        pr="40px"
        bg="white"
        transition="height none"
        minH="unset"
        overflow="hidden"
        w="100%"
        resize="none"
        ref={ref}
        minRows={1}
        maxRows={10}
        autoComplete="off"
        type="submit"
        as={ResizeTextarea as typeof TextareaAutosize & 'symbol'}
        {...props}
      />
    );
  }
);
