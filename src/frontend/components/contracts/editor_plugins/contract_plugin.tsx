import {createPluginFactory} from "@udecode/plate-common";
import  {CustomContractComponent} from '../custom_contract/custom_contract'
import SlateCustomContract from "../custom_contract/slate_custom_contract";
import {randomString} from "../../../data_processing/data_samples";

const CONTRACT_KEY = 'custom_contract';

interface Props {
    children: any;
}

// function ContractPlugin(p: Props) {
//     return <div style={{color: 'red'}}>{p.children}</div>;
// }

const createContractPlugin = createPluginFactory({
    key: CONTRACT_KEY,
    isElement: true,
    component: SlateCustomContract,
});
export {CONTRACT_KEY, CustomContractComponent};
export default createContractPlugin;
