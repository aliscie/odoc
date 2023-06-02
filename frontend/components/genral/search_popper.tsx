import * as React from 'react';
import Draggable from 'react-draggable';
import Popper from '@mui/material/Popper';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import {Resizable} from 'react-resizable';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import PublicIcon from '@mui/icons-material/Public';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import AbcIcon from '@mui/icons-material/Abc';
import CasesIcon from '@mui/icons-material/Cases';
import {useDispatch, useSelector} from "react-redux";
import {toggleSearchTool} from "../../redux/main";
import OpenWithIcon from '@mui/icons-material/OpenWith';
import {Autocomplete} from '@mui/material';

type ToggleButtonProps = {
    value: boolean;
    onChange: (value: boolean) => void;
    icon: React.ReactNode;
    tooltipText: string;
};


const options = [
    'A',
    'Search in the current place content',
    'Search the files names',
    '*',
    '..',
];

const MultiSelect = () => {
    const [selectedOptions, setSelectedOptions] = React.useState([]);

    const handleSelect = (_, value) => {
        setSelectedOptions(value);
    };

    return (
        <Autocomplete
            style={{display: "inline-block"}}
            multiple
            options={options}
            value={selectedOptions}
            onChange={handleSelect}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={<div>filter <SearchIcon/></div>}
                />
            )}
        />
    );
};


export default function SearchPopper() {
    const open = useSelector((state: any) => state.searchTool);

    const dispatch = useDispatch();
    const [searchText, setSearchText] = React.useState('');
    const [width, setWidth] = React.useState(250);

    const anchorRef = React.useRef<HTMLDivElement | null>(null);

    const handleShortcutKeyPress = React.useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'f' && (event.metaKey || event.ctrlKey)) {
                dispatch(toggleSearchTool())
                event.preventDefault();
            }
        },
        []
    );

    const handleClose = () => {
        dispatch(toggleSearchTool())
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleResize = (event: any, {size}: any) => {
        setWidth(size.width);
    };


    React.useEffect(() => {
        window.addEventListener('keydown', handleShortcutKeyPress);
        return () => {
            window.removeEventListener('keydown', handleShortcutKeyPress);
        };
    }, [handleShortcutKeyPress]);

    return (
        <Draggable handle=".handle">
            <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start">
                <Resizable width={width} height={30} onResize={handleResize}>
                    <Paper
                        style={{
                            top: "0px", left: "0px", transform: "translate(50%, 200%)",
                        }}
                    >
                        <IconButton className="handle"><OpenWithIcon/></IconButton>

                        <div>
                            <MultiSelect/>

                            <TextField
                                size="small"
                                variant="outlined"
                                value={searchText}
                                onChange={handleSearchChange}
                                id={'search_field'}
                                autoFocus={true}
                                placeholder="Enter text"
                                sx={{minWidth: "50px"}} // Adjust the width of the search field here
                            />
                            <IconButton size="small" color="primary">
                                <ArrowUpwardIcon/>
                            </IconButton>
                            <IconButton size="small" color="primary">
                                <ArrowDownwardIcon/>
                            </IconButton>
                            <IconButton size="small" color="primary" onClick={handleClose}>
                                <CloseIcon/>
                            </IconButton>
                        </div>
                    </Paper>
                </Resizable>
            </Popper>
        </Draggable>
    );
}
