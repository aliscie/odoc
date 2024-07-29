import { Plate } from '@udecode/plate-common';

// import { PlaygroundTurnIntoDropdownMenu } from '@/components/plate-ui/playground-turn-into-dropdown-menu';
import { basicNodesPlugins } from '@/lib/plate/demo/plugins/basicNodesPlugins';
import { imagePlugins } from '@/lib/plate/demo/plugins/imagePlugins';
import { basicElementsValue } from '@/lib/plate/demo/values/basicElementsValue';
import { basicMarksValue } from '@/lib/plate/demo/values/basicMarksValue';
import { imageValue } from '@/lib/plate/demo/values/mediaValue';
import { Editor } from '@/registry/default/plate-ui/editor';
import { FixedToolbar } from '@/registry/default/plate-ui/fixed-toolbar';
import { Separator } from '@/registry/default/plate-ui/separator';

export default function MultipleEditorsDemo() {
  return (
    <Plate initialValue={basicElementsValue} plugins={basicNodesPlugins}>
      <Plate
        id="marks"
        initialValue={basicMarksValue}
        plugins={basicNodesPlugins}
      >
        <Plate id="image" initialValue={imageValue} plugins={imagePlugins}>
          <FixedToolbar>
            {/* <PlaygroundTurnIntoDropdownMenu /> */}
          </FixedToolbar>

          <div>
            <Editor />
            <Separator />
            <Editor id="marks" />
            <Separator />
            <Editor id="image" />
          </div>
        </Plate>
      </Plate>
    </Plate>
  );
}
