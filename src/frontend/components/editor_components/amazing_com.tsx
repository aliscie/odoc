import {createPluginFactory} from "@udecode/plate-common";

const KEY_AMAZING = 'amazing';

interface Props {
    children: any;
}

function AmazingComponent(p: Props) {
    // const {element} = p;
    // console.log({p});
    return <div style={{color: 'red'}}>{p.children}</div>;
}

const createAmazingPlugin = createPluginFactory({
    key: KEY_AMAZING,
    isElement: true,
    component: AmazingComponent,
});
export {KEY_AMAZING, AmazingComponent};
export default createAmazingPlugin;