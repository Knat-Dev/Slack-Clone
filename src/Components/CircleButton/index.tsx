import {
  Box,
  Button,
  ButtonProps,
  Tooltip,
  TooltipProps,
} from '@chakra-ui/react';
import React, { FC } from 'react';

interface Props extends ButtonProps {
  label: string;
  placement?: TooltipProps['placement'];
  larger?: boolean;
}

export const CircleButton: FC<Props> = ({
  children,
  label,
  placement,
  larger,
  ...buttonProps
}) => {
  return (
    <Tooltip label={label} placement={placement || 'top'}>
      <Button
        {...buttonProps}
        h={!larger ? '18px' : '24px'}
        w={!larger ? '18px' : '24px'}
        minW={0}
        borderRadius="50%"
        px={0}
        bg="blue.600"
        color="white"
        _hover={{ background: 'white', color: 'blue.600' }}
      >
        <Box fontSize={larger ? 'lg' : 'md'}>{children}</Box>
      </Button>
    </Tooltip>
  );
};
