import {createPluginFactory} from "@udecode/plate-common";

const DATA_GIRD = 'data_grid';

interface Props {
    children: any;
}

function DataGridCom(p: Props) {
    return <div style={{color: 'red'}}>{p.children}</div>;
}

const createDataGrid = createPluginFactory({
    key: DATA_GIRD,
    isElement: true,
    component: DataGridCom,
});
export {DATA_GIRD, DataGridCom};
export default createDataGrid;