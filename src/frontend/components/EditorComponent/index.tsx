import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import OdocEditor, { MyMentionItem } from "odoc_editor_v2";
import createContractPlugin, {
  CONTRACT_KEY,
} from "../ContractTable/ContractPlugin";
import TableChartIcon from "@mui/icons-material/TableChart";
import { handleRedux } from "../../redux/store/handleRedux";
import { custom_contract } from "../../DataProcessing/dataSamples";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

interface Props {
  handleOnInsertComponent?: any;
  onChange?: any;
  searchValue?: string;
  editorKey?: any;
  content: any[];
  readOnly?: boolean;
  id?: string;
}

function EditorComponent(props: Props) {
  const dispatch = useDispatch();

  const { all_friends, profile } = useSelector(
    (state: any) => state.filesState,
  );

  const extraPlugins = React.useMemo(
    () => [
      { plugin: createContractPlugin, key: CONTRACT_KEY, icon: TableChartIcon },
    ],
    [],
  );

  const mentions: MyMentionItem[] = React.useMemo(
    () =>
      all_friends.map((i: any) => ({
        key: i.id,
        text: i.name,
      })),
    [all_friends],
  );

  const handleOnInsertComponent = React.useCallback(
    (component: any, component_id: string) => {
      switch (component.key) {
        case "custom_contract":
          const newContract = {
            ...custom_contract,
            id: component_id,
            creator: profile.id,
            date_created: Date.now() * 1e6,
          };
          dispatch(handleRedux("ADD_CONTRACT", { contract: newContract }));
          return null;
        case "data_grid":
        default:
          return null;
      }
    },
    [dispatch, profile?.id],
  );

  const handleInputChange = React.useCallback(
    (changes: any) => {
      props.onChange?.(changes);
    },
    [props.onChange],
  );

  return (
    <OdocEditor
      id={String(props.editorKey || "")}
      readOnly={props.readOnly}
      initialValue={props.content}
      onChange={handleInputChange}
      extraPlugins={extraPlugins}
      onInsertComponent={handleOnInsertComponent}
      userMentions={mentions}
    />
  );
}

// Memoize the component with a custom comparison function
export default React.memo(EditorComponent, (prevProps, nextProps) => {
  // Return true if we DON'T need to re-render
  return (
    prevProps.readOnly === nextProps.readOnly &&
    prevProps.editorKey === nextProps.editorKey &&
    prevProps.onChange === nextProps.onChange &&
    prevProps.content === nextProps.content && // Assuming content is immutable
    prevProps.id === nextProps.id &&
    prevProps.searchValue === nextProps.searchValue
  );
});
