import type { ValueId } from '@/config/customizer-plugins';

import {
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
} from '@udecode/plate-basic-marks';
import { useEditorReadOnly } from '@udecode/plate-common';

import { Icons } from '@/components/icons';
import { isEnabled } from '@/lib/plate/demo/is-enabled';
import { CommentToolbarButton } from '@/registry/default/plate-ui/comment-toolbar-button';
import { LinkToolbarButton } from '@/registry/default/plate-ui/link-toolbar-button';
import { MarkToolbarButton } from '@/registry/default/plate-ui/mark-toolbar-button';
import { ToolbarSeparator } from '@/registry/default/plate-ui/toolbar';

// import { PlaygroundMoreDropdownMenu } from '../../../../plate/apps/www/src/components/plate-ui/playground-more-dropdown-menu';
// import { PlaygroundTurnIntoDropdownMenu } from '../../../../plate/apps/www/src/components/plate-ui/playground-turn-into-dropdown-menu';

export function PlaygroundFloatingToolbarButtons({ id }: { id?: string }) {
  const readOnly = useEditorReadOnly();

  return (
    <>
      {!readOnly && (
        <>
          {/* <PlaygroundTurnIntoDropdownMenu /> */}

          <MarkToolbarButton nodeType={MARK_BOLD} tooltip="Bold (⌘+B)">
            <Icons.bold />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType={MARK_ITALIC} tooltip="Italic (⌘+I)">
            <Icons.italic />
          </MarkToolbarButton>
          <MarkToolbarButton
            nodeType={MARK_UNDERLINE}
            tooltip="Underline (⌘+U)"
          >
            <Icons.underline />
          </MarkToolbarButton>
          <MarkToolbarButton
            nodeType={MARK_STRIKETHROUGH}
            tooltip="Strikethrough (⌘+⇧+M)"
          >
            <Icons.strikethrough />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType={MARK_CODE} tooltip="Code (⌘+E)">
            <Icons.code />
          </MarkToolbarButton>

          <ToolbarSeparator />

          {isEnabled('link', id) && <LinkToolbarButton />}
        </>
      )}

      {isEnabled('comment', id) && <CommentToolbarButton />}

      {/* <PlaygroundMoreDropdownMenu /> */}
    </>
  );
}
