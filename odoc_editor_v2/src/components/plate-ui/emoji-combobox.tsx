// import { ComboboxItemProps } from "@ariakit/react";
// import {
//     // EmojiItemData,
//     KEY_EMOJI,
//     // TEmojiCombobox,
//     // useEmojiComboboxState,
// } from "@udecode/plate-emoji";

// import { Combobox } from "@ariakit/react";

// export function EmojiComboboxItem({item}: ComboboxItemProps) {
//     const {
//         data: {id, emoji},
//     } = item;

//     return (
//         <div>
//             {emoji} :{id}:
//         </div>
//     );
// }

// export function EmojiCombobox({
//                                   pluginKey = KEY_EMOJI,
//                                   id = pluginKey,
//                                   ...props
//                               }) {
//     // const { trigger, onSelectItem } = useEmojiComboboxState({ pluginKey });

//     return (
//         <Combobox
//             id={id}
//             // trigger={trigger}
//             controlled
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             // onSelectItem={onSelectItem as any}
//             onRenderItem={EmojiComboboxItem}
//             {...props}
//         />
//     );
// }
