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
  let content = props.content;

  let extraPlugins = [
    { plugin: createContractPlugin, key: CONTRACT_KEY, icon: TableChartIcon },
    // {
    //   plugin: createCustomTablePlugin,
    //   key: TABLE_KEY,
    //   icon: TableRowsIcon,
    // },
  ];
  const mentions: MyMentionItem[] = all_friends.map((i: any) => {
    return { key: i.id, text: i.name };
  });

  function handleOnInsertComponent(component: any, component_id: string) {
    switch (component.key) {
      case "custom_contract":
        // TODO Also, when user remove contract from content page
        //  Delete the contract if it has no data.
        // console.log("handleOnInsertComponent");
        custom_contract.id = component_id;
        custom_contract.creator = profile.id;
        custom_contract.date_created = Date.now() * 1e6;
        dispatch(handleRedux("ADD_CONTRACT", { contract: custom_contract }));
        return null;

      case "data_grid":
        return null;
      default:
        return null;
      // case "data_grid":
      //     dispatch(handleRedux("CONTRACT_CHANGES", {changes: contract_sample}));
    }
  }

  // const handleInputChange = useCallback(
  //     debounce((changes: string) => {
  //         if (changes !== content) {
  //             props.onChange(changes);
  //         }
  //     }, 600),
  //     [dispatch],
  // );

  const handleInputChange = (changes: any) => {
    props.onChange(changes);
  };
  return (
    <OdocEditor
      // key={String(props.editorKey || "")}
      id={String(props.editorKey || "")}
      readOnly={props.readOnly}
      initialValue={content}
      onChange={handleInputChange}
      extraPlugins={extraPlugins}
      onInsertComponent={handleOnInsertComponent}
      // onOnRemoveCompnt={handleOnInsertComponent}
      userMentions={mentions}
    />
  );
}

export default React.memo(EditorComponent);
