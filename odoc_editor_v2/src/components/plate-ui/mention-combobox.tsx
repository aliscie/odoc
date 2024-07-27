import { ComboboxProps } from "@ariakit/react";
// import { useEditorRef } from "@udecode/plate-common";
import {
  ELEMENT_MENTION,
  // getMentionOnSelectItem,
  // MentionPlugin,
} from "@udecode/plate-mention";

import { Combobox } from "@ariakit/react";

export function MentionCombobox({
  pluginKey = ELEMENT_MENTION,
  id = pluginKey,
  ...props
}: Partial<ComboboxProps> & {
  pluginKey?: string;
}) {
  // const editor = useEditorRef();

  // const { trigger } = getPluginOptions<MentionPlugin>(editor, pluginKey);

  return (
    <div onMouseDown={(e) => e.preventDefault()}>
      <Combobox
        id={id}
        // trigger={trigger!}
        // controlled
        // onSelectItem={getMentionOnSelectItem({
        //   key: pluginKey,
        // })}
        {...props}
      />
    </div>
  );
}
