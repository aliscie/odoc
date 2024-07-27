'use client';
import './index.css';
import React, {ComponentType, SVGProps, useMemo, useRef} from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';


import {cn} from '@udecode/cn';
import {createAlignPlugin} from '@udecode/plate-alignment';
import {createAutoformatPlugin} from '@udecode/plate-autoformat';
import {
    createBoldPlugin,
    createCodePlugin,
    createItalicPlugin,
    createStrikethroughPlugin,
    createSubscriptPlugin,
    createSuperscriptPlugin,
    createUnderlinePlugin,
} from '@udecode/plate-basic-marks';
import {createBlockquotePlugin, ELEMENT_BLOCKQUOTE,} from '@udecode/plate-block-quote';
import {createExitBreakPlugin, createSingleLinePlugin, createSoftBreakPlugin,} from '@udecode/plate-break';
import {createCaptionPlugin} from '@udecode/plate-caption';
import {createCodeBlockPlugin, ELEMENT_CODE_BLOCK,} from '@udecode/plate-code-block';
import {createCommentsPlugin} from '@udecode/plate-comments';
import {createPlugins, insertNode, Plate, PlateEditor, PlatePluginComponent} from '@udecode/plate-common';
import {createDndPlugin} from '@udecode/plate-dnd';
import {createEmojiPlugin} from '@udecode/plate-emoji';
import {createExcalidrawPlugin} from '@udecode/plate-excalidraw';
import {createFontBackgroundColorPlugin, createFontColorPlugin, createFontSizePlugin,} from '@udecode/plate-font';
import {
    createHeadingPlugin,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
} from '@udecode/plate-heading';
import {createHighlightPlugin} from '@udecode/plate-highlight';
import {createHorizontalRulePlugin} from '@udecode/plate-horizontal-rule';
import {createIndentPlugin} from '@udecode/plate-indent';
import {createIndentListPlugin, ListStyleType, toggleIndentList} from '@udecode/plate-indent-list';
import {createJuicePlugin} from '@udecode/plate-juice';
import {createKbdPlugin} from '@udecode/plate-kbd';
import {createColumnPlugin} from '@udecode/plate-layout';
import {createLineHeightPlugin} from '@udecode/plate-line-height';
import {createLinkPlugin} from '@udecode/plate-link';
import {createListPlugin, createTodoListPlugin} from '@udecode/plate-list';
import {createMediaEmbedPlugin,} from '@udecode/plate-media';
import {createMentionPlugin} from '@udecode/plate-mention';
import {createNodeIdPlugin} from '@udecode/plate-node-id';
import {createNormalizeTypesPlugin} from '@udecode/plate-normalizers';
import {createParagraphPlugin, ELEMENT_PARAGRAPH,} from '@udecode/plate-paragraph';
import {createResetNodePlugin} from '@udecode/plate-reset-node';
import {createDeletePlugin, createSelectOnBackspacePlugin,} from '@udecode/plate-select';
import {createBlockSelectionPlugin} from '@udecode/plate-selection';
import {createDeserializeDocxPlugin} from '@udecode/plate-serializer-docx';
import {createDeserializeMdPlugin} from '@udecode/plate-serializer-md';
import {createSlashPlugin} from '@udecode/plate-slash-command';
import {createTabbablePlugin} from '@udecode/plate-tabbable';
import {createTablePlugin} from '@udecode/plate-table';
import {createTogglePlugin, ELEMENT_TOGGLE} from '@udecode/plate-toggle';
import {createTrailingBlockPlugin} from '@udecode/plate-trailing-block';

import {settingsStore} from '@/components/context/settings-store';
import {PlaygroundFloatingToolbarButtons} from '@/components/plate-ui/playground-floating-toolbar-buttons';
import {captionPlugin} from '@/lib/plate/demo/plugins/captionPlugin';
import {createPlateUI} from '@/lib/plate/create-plate-ui';
import {CommentsProvider} from '@/lib/plate/demo/comments/CommentsProvider';
import {editableProps} from '@/lib/plate/demo/editableProps';
import {isEnabled} from '@/lib/plate/demo/is-enabled';
import {alignPlugin} from '@/lib/plate/demo/plugins/alignPlugin';
import {autoformatIndentLists} from '@/lib/plate/demo/plugins/autoformatIndentLists';
import {autoformatLists} from '@/lib/plate/demo/plugins/autoformatLists';
import {autoformatRules} from '@/lib/plate/demo/plugins/autoformatRules';
import {dragOverCursorPlugin} from '@/lib/plate/demo/plugins/dragOverCursorPlugin';
import {exitBreakPlugin} from '@/lib/plate/demo/plugins/exitBreakPlugin';
import {forcedLayoutPlugin} from '@/lib/plate/demo/plugins/forcedLayoutPlugin';
import {lineHeightPlugin} from '@/lib/plate/demo/plugins/lineHeightPlugin';
import {linkPlugin} from '@/lib/plate/demo/plugins/linkPlugin';
import {resetBlockTypePlugin} from '@/lib/plate/demo/plugins/resetBlockTypePlugin';
import {selectOnBackspacePlugin} from '@/lib/plate/demo/plugins/selectOnBackspacePlugin';
import {softBreakPlugin} from '@/lib/plate/demo/plugins/softBreakPlugin';
import {tabbablePlugin} from '@/lib/plate/demo/plugins/tabbablePlugin';
import {trailingBlockPlugin} from '@/lib/plate/demo/plugins/trailingBlockPlugin';
// import { Prism } from '@/components/plate-ui/code-block-combobox';
import {CommentsPopover} from '@/components/plate-ui/comments-popover';
import {CursorOverlay} from '@/registry/default/plate-ui/cursor-overlay';
import {Editor} from '@/components/plate-ui/editor';
import {FloatingToolbar} from '@/components/plate-ui/floating-toolbar';
// import {ImagePreview} from '@/registry/default/plate-ui/image-preview';
import {FireLiComponent, FireMarker,} from '@/registry/default/plate-ui/indent-fire-marker-component';
import {TodoLi, TodoMarker,} from '@/registry/default/plate-ui/indent-todo-marker-component';
import {Prism} from "@/registry/default/plate-ui/code-block-combobox";
import {withDraggables} from "@/registry/default/plate-ui/with-draggables";
import {Icons} from "@/components/icons";
import {MyMentionItem} from "@/lib/plate/demo/values/mentionables";
import {ValueId} from "../../config/customizer-plugins";
// import {captionPlugin} from "../../lib/plate/demo/plugins/captionPlugin";


export const usePlaygroundPlugins = (inputs: {
    components?: Record<string, PlatePluginComponent>;
    id?: ValueId;
}) => {
    const {components, id} = inputs;
    const enabled = settingsStore.use.checkedPlugins();

    const autoformatOptions = {
        enableUndoOnDelete: true,
        rules: [...autoformatRules],
    };

    if (id === 'indentlist') {
        autoformatOptions.rules.push(...autoformatIndentLists);
    } else if (id === 'list') {
        autoformatOptions.rules.push(...autoformatLists);
    } else if (enabled.listStyleType) {
        autoformatOptions.rules.push(...autoformatIndentLists);
    } else if (enabled.list) {
        autoformatOptions.rules.push(...autoformatLists);
    }

    return useMemo(
        () => {
            return createPlugins(
                [
                    // Nodes
                    createParagraphPlugin({enabled: !!enabled.p}),
                    createHeadingPlugin({enabled: !!enabled.heading}),
                    createBlockquotePlugin({enabled: !!enabled.blockquote}),
                    createCodeBlockPlugin({
                        enabled: !!enabled.code_block,
                        options: {
                            prism: Prism,
                        },
                    }),
                    createHorizontalRulePlugin({enabled: !!enabled.hr}),
                    createLinkPlugin({...linkPlugin, enabled: !!enabled.a}),
                    createListPlugin({
                        enabled: id === 'list' || !!enabled.list,
                    }),
                    // createImagePlugin({
                    //     enabled: !!enabled.img,
                    //     renderAfterEditable: ImagePreview,
                    // }),
                    createMediaEmbedPlugin({enabled: !!enabled.media_embed}),
                    createCaptionPlugin({...captionPlugin, enabled: !!enabled.caption}),
                    createMentionPlugin({
                        enabled: !!enabled.mention,
                        options: {
                            triggerPreviousCharPattern: /^$|^[\s"']$/,
                        },
                    }),
                    createSlashPlugin(),
                    createTablePlugin({
                        enabled: !!enabled.table,
                        options: {
                            enableMerging: id === 'tableMerge',
                        },
                    }),
                    createTodoListPlugin({enabled: !!enabled.action_item}),
                    createTogglePlugin({enabled: !!enabled.toggle}),
                    createExcalidrawPlugin({enabled: !!enabled.excalidraw}),

                    // Marks
                    createBoldPlugin({enabled: !!enabled.bold}),
                    createItalicPlugin({enabled: !!enabled.italic}),
                    createUnderlinePlugin({enabled: !!enabled.underline}),
                    createStrikethroughPlugin({enabled: !!enabled.strikethrough}),
                    createCodePlugin({enabled: !!enabled.code}),
                    createSubscriptPlugin({enabled: !!enabled.subscript}),
                    createSuperscriptPlugin({enabled: !!enabled.superscript}),
                    createFontColorPlugin({enabled: !!enabled.color}),
                    createFontBackgroundColorPlugin({
                        enabled: !!enabled.backgroundColor,
                    }),
                    createFontSizePlugin({enabled: !!enabled.fontSize}),
                    createHighlightPlugin({enabled: !!enabled.highlight}),
                    createKbdPlugin({enabled: !!enabled.kbd}),

                    // Block Style
                    createAlignPlugin({
                        ...alignPlugin,
                        enabled: !!enabled.align,
                    }),
                    createIndentPlugin({
                        enabled: !!enabled.indent,
                        inject: {
                            props: {
                                validTypes: [
                                    ELEMENT_PARAGRAPH,
                                    ELEMENT_H1,
                                    ELEMENT_H2,
                                    ELEMENT_H3,
                                    ELEMENT_H4,
                                    ELEMENT_H5,
                                    ELEMENT_H6,
                                    ELEMENT_BLOCKQUOTE,
                                    ELEMENT_CODE_BLOCK,
                                    ELEMENT_TOGGLE,
                                ],
                            },
                        },
                    }),
                    createIndentListPlugin({
                        enabled: id === 'indentlist' || !!enabled.listStyleType,
                        inject: {
                            props: {
                                validTypes: [
                                    ELEMENT_PARAGRAPH,
                                    ELEMENT_H1,
                                    ELEMENT_H2,
                                    ELEMENT_H3,
                                    ELEMENT_H4,
                                    ELEMENT_H5,
                                    ELEMENT_H6,
                                    ELEMENT_BLOCKQUOTE,
                                    ELEMENT_CODE_BLOCK,
                                    ELEMENT_TOGGLE,
                                ],
                            },
                        },
                        options: {
                            listStyleTypes: {
                                fire: {
                                    liComponent: FireLiComponent,
                                    markerComponent: FireMarker,
                                    type: 'fire',
                                },
                                todo: {
                                    liComponent: TodoLi,
                                    markerComponent: TodoMarker,
                                    type: 'todo',
                                },
                            },
                        },
                    }),
                    createLineHeightPlugin({
                        ...lineHeightPlugin,
                        enabled: !!enabled.lineHeight,
                    }),

                    // Functionality
                    createAutoformatPlugin({
                        enabled: !!enabled.autoformat,
                        options: autoformatOptions,
                    }),
                    createBlockSelectionPlugin({
                        enabled: id === 'blockselection' || !!enabled.blockSelection,
                        options: {
                            disableContextMenu: true,
                            sizes: {
                                bottom: 0,
                                top: 0,
                            },
                        },
                    }),
                    createDndPlugin({
                        enabled: !!enabled.dnd,
                        options: {enableScroller: true},
                    }),
                    createEmojiPlugin({enabled: !!enabled.emoji}),
                    createExitBreakPlugin({
                        ...exitBreakPlugin,
                        enabled: !!enabled.exitBreak,
                    }),
                    createNodeIdPlugin({enabled: !!enabled.nodeId}),
                    createNormalizeTypesPlugin({
                        ...forcedLayoutPlugin,
                        enabled: !!enabled.normalizeTypes,
                    }),
                    createResetNodePlugin({
                        ...resetBlockTypePlugin,
                        enabled: !!enabled.resetNode,
                    }),
                    createSelectOnBackspacePlugin({
                        ...selectOnBackspacePlugin,
                        enabled: !!enabled.selectOnBackspace,
                    }),
                    createDeletePlugin({
                        enabled: !!enabled.delete,
                    }),
                    createSingleLinePlugin({
                        enabled: id === 'singleline' || !!enabled.singleLine,
                    }),
                    createSoftBreakPlugin({
                        ...softBreakPlugin,
                        enabled: !!enabled.softBreak,
                    }),
                    createTabbablePlugin({
                        ...tabbablePlugin,
                        enabled: !!enabled.tabbable,
                    }),
                    createTrailingBlockPlugin({
                        ...trailingBlockPlugin,
                        enabled: id !== 'singleline' && !!enabled.trailingBlock,
                    }),
                    {...dragOverCursorPlugin, enabled: !!enabled.dragOverCursor},

                    // Collaboration
                    createCommentsPlugin({enabled: !!enabled.comment}),

                    // Deserialization
                    createDeserializeDocxPlugin({enabled: !!enabled.deserializeDocx}),
                    createDeserializeMdPlugin({enabled: !!enabled.deserializeMd}),
                    createJuicePlugin({enabled: !!enabled.juice}),
                    createColumnPlugin({enabled: !!enabled.column}),


                ],
                {
                    components,
                }
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [enabled]
    );
};

// reset editor when initialValue changes

interface SlashCommandRule {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    onSelect: (editor: PlateEditor) => void;
    value: string;
    keywords?: string[];
}


export let slateSlashRules: SlashCommandRule[] = [
    {
        icon: Icons.h1,
        value: 'Heading 1',
        onSelect: (editor) => {
            insertNode(editor, {
                type: 'h1',
                children: [{text: ""}]
            });
        },
    },
    {
        icon: Icons.h2,
        value: 'Heading 2',
        onSelect: (editor) => {
            insertNode(editor, {
                type: 'h2',
                children: [{text: ""}]
            });
        },
    },
    {
        icon: Icons.h3,
        value: 'Heading 3',
        onSelect: (editor) => {
            insertNode(editor, {
                type: 'h3',
                children: [{text: ""}]
            });
        },
    },
    {
        icon: Icons.ul,
        keywords: ['ul', 'unordered list'],
        onSelect: (editor) => {
            toggleIndentList(editor, {
                listStyleType: ListStyleType.Disc,
            });
        },
        value: 'Bulleted list',
    },
    {
        icon: Icons.ol,
        keywords: ['ol', 'ordered list'],
        onSelect: (editor) => {
            toggleIndentList(editor, {
                listStyleType: ListStyleType.Decimal,
            });
        },
        value: 'Numbered list',
    },
];

export const MENTIONABLES: MyMentionItem[] = [
    {key: 'test', text: 'test'},
];

interface OdocEditorProps {
    id: string;
    initialValue: any;
    onChange: (value: any) => void;
    extraPlugins: any[];
    userMentions: MyMentionItem[];
    onInsertComponent: (component: any) => void;

}

export function OdocEditor(props: OdocEditorProps) {
    const containerRef = useRef(null);
    const enabled = settingsStore.use.checkedComponents();
    const {id, initialValue, onChange, extraPlugins, userMentions, onInsertComponent} = props;

    const plugins = usePlaygroundPlugins({
        components: withDraggables(createPlateUI()),
        id,
    });

    if (Array.isArray(userMentions)) {
        userMentions.map(item => {
            if (!MENTIONABLES.find(mention => mention.key === item.key)) {
                MENTIONABLES.push({
                    key: item.key,
                    text: item.text
                });
            }
        });
    }
    


    if (Array.isArray(extraPlugins)) {
        extraPlugins.map((item, index) => {
            if (!slateSlashRules.find(rule => rule.value === item.key)) {
                slateSlashRules.push({
                    icon: item.icon,
                    onSelect: (editor) => {
                        insertNode(editor, { type: item.key, children: [{ text: "" }] });
                        onInsertComponent(item);
                    },
                    value: item.key
                });
            }
        });
    }

    function initializeExtraPlugins(plugins) {
        if (!plugins) {
          console.warn("plugins parameter is undefined. Initializing as an empty array.");
          return [];
        }
        return plugins.map(item => item.plugin());
      }
      
      let instantiatedExtraPlugins = initializeExtraPlugins(extraPlugins);
      

    const combinedPlugins = [...plugins, ...instantiatedExtraPlugins];

    // function handleKeyDown(e, k) {
    //     console.log({e, k})
    // }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="relative">
                <Plate

                    initialValue={initialValue}
                    key={id}
                    normalizeInitialValue
                    plugins={combinedPlugins}
                    onChange={onChange}
                >
                    <CommentsProvider>
                        {/*{enabled['fixed-toolbar'] && (*/}
                        {/*    <FixedToolbar className="no-scrollbar">*/}
                        {/*        {enabled['fixed-toolbar-buttons'] && (*/}
                        {/*            <PlaygroundFixedToolbarButtons id={id}/>*/}
                        {/*        )}*/}
                        {/*    </FixedToolbar>*/}
                        {/*)}*/}

                        <div
                            className="flex w-full"
                            id="editor-playground"
                            style={
                                {
                                    '--editor-px': 'max(5%,24px)',
                                } as any
                            }
                        >
                            <div
                                className={cn(
                                    'relative flex w-full overflow-x-auto',
                                    '[&_.slate-start-area-top]:!h-4',
                                    '[&_.slate-start-area-left]:!w-[var(--editor-px)] [&_.slate-start-area-right]:!w-[var(--editor-px)]'
                                )}
                                ref={containerRef}
                            >
                                <Editor
                                    {...editableProps}
                                    className={cn(
                                        editableProps.className,
                                        'max-h-[800px] overflow-x-hidden px-[var(--editor-px)]',
                                        !id && 'pb-[20vh] pt-4',
                                        id && 'pb-8 pt-2'
                                    )}
                                    focusRing={false}
                                    placeholder={'place holder test'}
                                    size="md"
                                    variant="ghost"
                                />

                                {enabled['floating-toolbar'] && (
                                    <FloatingToolbar>
                                        {enabled['floating-toolbar-buttons'] && (
                                            <PlaygroundFloatingToolbarButtons id={id}/>
                                        )}
                                    </FloatingToolbar>
                                )}

                                {isEnabled('cursoroverlay', id) && (
                                    <CursorOverlay containerRef={containerRef}/>
                                )}
                            </div>

                            {isEnabled('comment', id, enabled['comments-popover']) && (
                                <CommentsPopover/>
                            )}
                        </div>
                    </CommentsProvider>
                </Plate>
            </div>
        </DndProvider>
    );
}
export default OdocEditor;
