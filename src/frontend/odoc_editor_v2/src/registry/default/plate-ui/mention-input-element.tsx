import { useState } from 'react';

import { cn, withRef } from '@udecode/cn';
import { PlateElement } from '@udecode/plate-common';
import { getMentionOnSelectItem } from '@udecode/plate-mention';

import { MENTIONABLES } from '@/lib/plate/demo/values/mentionables';

import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxInput,
  InlineComboboxItem,
} from './inline-combobox';

const onSelectItem = getMentionOnSelectItem();

export const MentionInputElement = withRef<typeof PlateElement>(
  ({ className, ...props }, ref) => {
    const { children, editor, element } = props;
    const [search, setSearch] = useState('');

    return (
      <PlateElement
        as="span"
        data-slate-value={element.value}
        ref={ref}
        {...props}
      >
        <InlineCombobox
          element={element}
          setValue={setSearch}
          showTrigger={false}
          trigger="@"
          value={search}
        >
          <span
            className={cn(
              'inline-block rounded-md bg-muted px-1.5 py-0.5 align-baseline text-sm ring-ring focus-within:ring-2',
              className
            )}
          >
            <InlineComboboxInput />
          </span>

          <InlineComboboxContent className="my-1.5">
            <InlineComboboxEmpty>No results found</InlineComboboxEmpty>

            {MENTIONABLES.map((item) => (
              <InlineComboboxItem
                key={item.key}
                onClick={() => onSelectItem(editor, item, search)}
                value={item.text}
              >
                {item.text}
              </InlineComboboxItem>
            ))}
          </InlineComboboxContent>
        </InlineCombobox>

        {children}
      </PlateElement>
    );
  }
);
