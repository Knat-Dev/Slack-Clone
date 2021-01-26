import {
  Flex,
  ButtonProps,
  FlexProps,
  Tooltip,
  Button,
  TooltipProps,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { IconType } from 'react-icons';

interface Props extends FlexProps {
  size: 'small' | 'regular';
  icon: IconType;
  label: string;
  placement?: TooltipProps['placement'];
}

export const CircleIconButton: FC<Props> = ({
  size,
  icon: Icon,
  onClick,
  label,
  placement,
  ...flexProps
}) => {
  return (
    <Tooltip hasArrow placement={placement || 'right'} label={label}>
      <Flex
        {...flexProps}
        onClick={onClick}
        backgroundColor="blue.600"
        cursor="pointer"
        align="center"
        justify="center"
        borderRadius="50%"
        boxSize={size === 'small' ? '20px' : '22px'}
        _hover={{ backgroundColor: 'blue.400', borderRadius: '25%' }}
        transition="all 0.1s ease-in-out"
      >
        <Icon size={size === 'small' ? '18px' : '16px'} />
      </Flex>
    </Tooltip>
  );
};
