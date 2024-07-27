import {useCallback, useMemo, useState} from 'react';

import {Plate, type TElement, type Value} from '@udecode/plate-common';
import {createEditor} from 'slate';
import {
    Editable,
    type ReactEditor,
    type RenderElementProps,
    Slate,
    withReact,
} from 'slate-react';

import {editableProps} from '@/lib/plate/demo/editableProps';
import {basicNodesPlugins} from '@/lib/plate/demo/plugins/basicNodesPlugins';
import {createHugeDocumentValue} from '@/lib/plate/demo/values/createHugeDocumentValue';
import {Editor} from '@/registry/default/plate-ui/editor';

const initialValue = createHugeDocumentValue();

function WithPlate() {
    return (
        <Plate initialValue={initialValue} plugins={basicNodesPlugins}>
            <Editor {...editableProps} />
        </Plate>
    );
}

function Element({attributes, children, element}: RenderElementProps) {
    switch ((element as TElement).type) {
        case 'h1': {
            return <h1 {...attributes}>{children}</h1>;
        }
        default: {
            return <p {...attributes}>{children}</p>;
        }
    }
}

function WithoutPlate() {
    const [value, setValue] = useState(initialValue);
    const renderElement = useCallback((p: any) => <Element {...p} />, []);
    const editor = useMemo(() => withReact(createEditor() as ReactEditor), []);
    const onChange = useCallback((newValue: Value) => {
        console.log({newValue})
        setValue(newValue)
    }, []);
    return (
        <Slate editor={editor} initialValue={value} onChange={onChange as any}>
            <Editable renderElement={renderElement} {...(editableProps as any)} />
        </Slate>
    );
}

export default function HundredsBlocksDemo() {
    return (
        <div className="flex">
            <div className="w-1/2 p-4">
                <WithPlate/>
            </div>
            <div className="w-1/2 p-4">
                <WithoutPlate/>
            </div>
        </div>
    );
}
