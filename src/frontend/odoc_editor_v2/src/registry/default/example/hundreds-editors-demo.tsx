import { Plate } from '@udecode/plate-common';

import { editableProps } from '@/lib/plate/demo/editableProps';
import { basicNodesPlugins } from '@/lib/plate/demo/plugins/basicNodesPlugins';
import { createMultiEditorsValue } from '@/lib/plate/demo/values/createMultiEditorsValue';
import { Editor } from '@/registry/default/plate-ui/editor';

const initialValues = createMultiEditorsValue();

function WithPlate({ id, initialValue }: any) {
  return (
    <Plate id={id} initialValue={initialValue} plugins={basicNodesPlugins}>
      <Editor {...editableProps} />
    </Plate>
  );
}

// function Element({ attributes, children, element }: any) {
//   switch (element.type) {
//     case 'h1':
//       return <h1 {...attributes}>{children}</h1>;
//     default:
//       return <p {...attributes}>{children}</p>;
//   }
// }

// function WithoutPlate({ initialValue }: any) {
//   const [value, setValue] = useState(initialValue);
//   const renderElement = useCallback((p) => <Element {...p} />, []);
//   const editor = useMemo(() => withReact(createEditor() as ReactEditor), []);
//
//   return (
//     <Slate
//       editor={editor}
//       value={value}
//       onChange={useCallback((v) => setValue(v), [])}
//     >
//       <Editable renderElement={renderElement} />
//     </Slate>
//   );
// }

export default function HundredsEditorsDemo() {
  return (
    <div className="flex flex-col">
      {initialValues.map((initialValue, idx) => {
        return (
          <div className="p-10" key={idx}>
            <h3 className="mb-2 font-semibold">#{idx + 1}</h3>
            <WithPlate id={idx + 1} initialValue={initialValue} />
            {/* <WithoutPlate initialValue={initialValue} id={idx} /> */}
          </div>
        );
      })}
    </div>
  );
}
