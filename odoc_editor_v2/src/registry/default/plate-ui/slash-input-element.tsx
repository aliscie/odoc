import React, {type ComponentType, type SVGProps} from 'react';

import {withRef} from '@udecode/cn';
import {
    type PlateEditor,
    PlateElement,
    toggleNodeType,
} from '@udecode/plate-common';
import {ELEMENT_H1, ELEMENT_H2, ELEMENT_H3} from '@udecode/plate-heading';
import {ListStyleType, toggleIndentList} from '@udecode/plate-indent-list';

import {Icons} from '@/components/icons';

import {
    InlineCombobox,
    InlineComboboxContent,
    InlineComboboxEmpty,
    InlineComboboxInput,
    InlineComboboxItem,
} from './inline-combobox';
import {slateSlashRules} from "@/components/pages/editor";


export const SlashInputElement = withRef<typeof PlateElement>(
    ({className, ...props}, ref) => {
        const {children, editor, element} = props;
        // console.log({slateSlashRules})
        return (
            <PlateElement
                as="span"
                data-slate-value={element.value}
                ref={ref}
                {...props}
            >
                <InlineCombobox element={element} trigger="/">
                    <InlineComboboxInput/>

                    <InlineComboboxContent>
                        <InlineComboboxEmpty>
                            No matching commands found
                        </InlineComboboxEmpty>

                        {slateSlashRules.length > 0 && slateSlashRules.map(({
                                                                                icon: Icon,
                                                                                keywords,
                                                                                onSelect,
                                                                                value
                                                                            }) => (
                            <InlineComboboxItem
                                key={value}
                                keywords={keywords}
                                onClick={() => onSelect(editor)}
                                value={value}
                            >
                                <Icon aria-hidden className="mr-2 size-4"/>
                                {value}
                            </InlineComboboxItem>
                        ))}
                    </InlineComboboxContent>
                </InlineCombobox>

                {children}
            </PlateElement>
        );
    }
);
