'use client';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import {
  useColorDropdownMenu,
  useColorDropdownMenuState,
} from '@udecode/plate-font';

import { DEFAULT_COLORS, DEFAULT_CUSTOM_COLORS } from './color-constants';
import { ColorPicker } from './color-picker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { ToolbarButton } from './toolbar';

export type TColor = {
  isBrightColor: boolean;
  name: string;
  value: string;
};

type ColorDropdownMenuProps = {
  nodeType: string;
  tooltip?: string;
} & DropdownMenuProps;

export function ColorDropdownMenu({
  children,
  nodeType,
  tooltip,
}: ColorDropdownMenuProps) {
  const state = useColorDropdownMenuState({
    closeOnSelect: true,
    colors: DEFAULT_COLORS,
    customColors: DEFAULT_CUSTOM_COLORS,
    nodeType,
  });

  const { buttonProps, menuProps } = useColorDropdownMenu(state);

  return (
    <DropdownMenu modal={false} {...menuProps}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton tooltip={tooltip} {...buttonProps}>
          {children}
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <ColorPicker
          clearColor={state.clearColor}
          color={state.selectedColor || state.color}
          colors={state.colors}
          customColors={state.customColors}
          updateColor={state.updateColorAndClose}
          updateCustomColor={state.updateColor}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
