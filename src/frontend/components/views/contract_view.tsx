import useViews from "./switch_view";
import * as React from "react";
import Box from "@mui/material/Box";
import PaymentContract from "../contracts/payment_contract";
import TextField from '@mui/material/TextField';
import {useDemoData} from '@mui/x-data-grid-generator';
import GalleryView from "./galarry";

function ContractView(props: any) {
    const VISIBLE_FIELDS = [props.children[0].data[0].Table.columns.map((c: any) => c.field)];

    const {data, setFilterModel} = useDemoData({
        dataSet: 'Employee',
        visibleFields: VISIBLE_FIELDS,
        rowLength: 100,
    });

    let views = [
        {id: 'dlkjfoi23', name: "table", component: <PaymentContract {...props} />},
        {id: 'lksdjifow', name: "gallery", component: <GalleryView items={props.children[0].data[0].Table.rows}/>}
    ];

    const {OptionsComponent, ViewsComponent} = useViews({views, default: 'dlkjfoi23'})



    const handleCustomFilter = React.useCallback(
        (value: string) => {
            setFilterModel((prevFilterModel) => ({
                ...prevFilterModel,
                items: [
                    {
                        columnField: 'name',
                        operatorValue: 'contains',
                        value,
                    },
                ],
            }));
        },
        [setFilterModel],
    );

    return <Box
        sx={{
            width: '100%',
        }}
        contentEditable={false}
    >
        <Box
            sx={{
                borderBottom: 1, borderColor: 'divider',
                // opacity: isOver ? 1 : 0, transition: '0.3s',
                // position:"absolute",
            }}
        >
            {OptionsComponent}
            <TextField
                label="Custom Search"
                variant="outlined"
                onChange={(e) => handleCustomFilter(e.target.value)}
                size="small" // Set the size to "small" to make the input thinner
            />
        </Box>

        {ViewsComponent}

    </Box>
}

export default ContractView;