import React, {type ReactNode} from 'react';

import {CommentsProvider as CommentsProviderPrimitive} from '@udecode/plate-comments';

import {commentsData, usersData} from '@/lib/plate/demo/values/commentsValue';
// import {useEditorRef} from "@udecode/plate-common";
// import {Operation} from "slate";
// import {ELEMENT_SLASH_INPUT} from "@udecode/plate-slash-command";

export function CommentsProvider({children}: { children: ReactNode }) {
    // TODO
    //     const editor = useEditorRef();
    //     const {onChange} = editor;
    //     editor.onChange = (changes: {
    //         operation?: Operation;
    //     }) => {
    //         if (changes.operation.node.type === ELEMENT_SLASH_INPUT) {
    //             // onInserComponent(changes);
    //         }
    //         // editor.apply(changes.operation)
    //         // return changes;
    //         console.log({ELEMENT_SLASH_INPUT, changes})
    //         return onChange(changes);
    //     }
    return (
        <CommentsProviderPrimitive
            comments={commentsData}
            myUserId="1"
            /* eslint-disable no-console */
            onCommentAdd={(comment) => console.log('Comment added', comment)}
            onCommentDelete={(comment) => console.log('Comment deleted', comment)}
            onCommentUpdate={(comment) => console.log('Comment updated', comment)}
            users={usersData}
            /* eslint-enable no-console */
        >
            {children}
        </CommentsProviderPrimitive>
    );
}
