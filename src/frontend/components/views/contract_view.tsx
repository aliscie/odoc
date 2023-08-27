import useViews from "./switch_view";
import * as React from "react";
import Box from "@mui/material/Box";
import PaymentContract from "../contracts/payment_contract";
import TextField from '@mui/material/TextField';
import {useDemoData} from '@mui/x-data-grid-generator';
import GalleryView from "./galarry";
import {useState} from "react";
import Fade from '@mui/material/Fade';
import {TransitionGroup} from 'react-transition-group';
import {Collapse} from "@mui/material";

function ContractView(props: any) {
    const VISIBLE_FIELDS = [props.children[0].data[0].Table.columns.map((c: any) => c.field)];

    const {data, setFilterModel} = useDemoData({
        dataSet: 'Employee',
        visibleFields: VISIBLE_FIELDS,
        rowLength: 100,
    });
    // console.log({data})

    let views = [
        {id: 'xxx', name: "table", component: <PaymentContract {...props} />},
        {id: 'yyy', name: "galary", component: <GalleryView items={props.children[0].data[0].Table.rows}/>}
    ];

    const {OptionsComponent, ViewsComponent} = useViews({views, default: 'xxx'})


    // const columns = React.useMemo(
    //     () => data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)),
    //     [data.columns],
    // );
    // console.log({columns})

    const handleCustomFilter = React.useCallback(
        (value: string) => {
            setFilterModel((prevFilterModel) => ({
                ...prevFilterModel,
                items: [
                    {
                        columnField: 'name', // Replace 'name' with the field you want to filter
                        operatorValue: 'contains',
                        value,
                    },
                ],
            }));
        },
        [setFilterModel],
    );
    // let [isOver, setOver] = useState(false);

    return <Box
        sx={{
            width: '100%',
            // transition: 'height 0.3s', // Add transition property for the height
        }}
        // onMouseLeave={() => setOver(false)}
        // onMouseEnter={() => setOver(true)}
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