import React, { InputHTMLAttributes } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { useField } from 'formik';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  variant?: 'input' | 'textarea';
};

const InputField: React.FC<Props> = (props) => {
  const [field, { error }] = useField(props.name);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      {props.variant === 'textarea' ? (
        <Textarea {...field} type={props.type} id={field.name} />
      ) : (
        <Input
          {...field}
          type={props.type}
          id={field.name}
          placeholder={props.placeholder}
        />
      )}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default InputField;
