import {createPluginFactory} from "@udecode/plate-common";
import SlateCustomContract from "../CustomContract/SlateCustomContract";
import {CustomContractComponent} from "../CustomContract/CustomContract.tsx"
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
