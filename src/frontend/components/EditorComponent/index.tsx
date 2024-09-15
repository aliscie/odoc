import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import OdocEditor, { MyMentionItem } from "odoc_editor_v2";
import { Principal } from "@dfinity/principal";
import createContractPlugin, {
  CONTRACT_KEY,
} from "../ContractTable/ContractPlugin";

import TableChartIcon from "@mui/icons-material/TableChart";
import { handleRedux } from "../../redux/store/handleRedux";
import { custom_contract } from "../../DataProcessing/dataSamples";

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
  ];
  const mentions: MyMentionItem[] = all_friends.map((i: any) => {
    return { key: i.id, text: i.name };
  });

  function handleOnInsertComponent(component: any, component_id: string) {
    switch (component.key) {
      case "custom_contract":
        console.log("handleOnInsertComponent");
        custom_contract.id = component_id;
        custom_contract.creator = Principal.fromText(profile.id);
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
      <div>x</div>
    // <OdocEditor
    //   key={props.id}
    //   id={props.id || ""}
    //   readOnly={props.readOnly}
    //   initialValue={content}
    //   onChange={handleInputChange}
    //   extraPlugins={extraPlugins}
    //   onInsertComponent={handleOnInsertComponent}
    //   userMentions={mentions}
    // />
  );
}

export default EditorComponent;
