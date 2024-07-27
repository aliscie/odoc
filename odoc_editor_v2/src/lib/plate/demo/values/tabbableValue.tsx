/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@udecode/plate-test-utils';

jsx;

export const tabbableValue: any = (
  <fragment>
    <hh2>Tabbable</hh2>
    <hp>
      Ensure a smooth tab navigation experience within your editor with the
      Tabbable plugin.
    </hp>
    <hp>
      Properly handle tab orders for void nodes, allowing for seamless
      navigation and interaction. Without this plugin, DOM elements inside void
      nodes come after the editor in the tab order.
    </hp>
    <element type="tabbable_element">
      <htext />
    </element>
    <element type="tabbable_element">
      <htext />
    </element>
    <hp>Place your cursor here and try pressing tab or shift+tab.</hp>
    <hul>
      <hli>
        <hlic>List item 1</hlic>
      </hli>
      <hli>
        <hlic>List item 2</hlic>
      </hli>
      <hli>
        <hlic>List item 3</hlic>
      </hli>
    </hul>
    <hcodeblock lang="javascript">
      <hcodeline>if (true) {'{'}</hcodeline>
      <hcodeline>
        {'// <-'} Place cursor at start of line and press tab
      </hcodeline>
      <hcodeline>{'}'}</hcodeline>
    </hcodeblock>
    <hp>
      In this example, the plugin is disabled when the cursor is inside a list
      or a code block. You can customise this using the{' '}
      <htext code>query</htext> option.
    </hp>
    <element type="tabbable_element">
      <htext />
    </element>
    <hp>
      When you press tab at the end of the editor, the focus should go to the
      button below.
    </hp>
  </fragment>
);
