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
import {useDispatch, useSelector} from "react-redux";
import {toggleSearchTool} from "../../redux/main";
import OpenWithIcon from '@mui/icons-material/OpenWith';
import {Autocomplete} from '@mui/material';


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
                    label={<SearchIcon/>}
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
        <Draggable handle=".handle"
                   onDrag={(e: any) => {
                       // get the height and width from rect
                       // let h = e.
                       const topEdge = window.innerHeight - 40
                       const rightEdge = window.innerWidth - 300
                       const leftEdge = 40;
                       if (e.clientX > rightEdge) {
                           e.style.x = rightEdge
                       } else if (e.clientX < leftEdge) {
                           e.style.x = leftEdge
                       }
                       if (e.clientY < 55) {
                           e.style.y = 55
                       } else if (e.clientY > topEdge) {
                           e.style.y = topEdge
                       }
                   }}
        >
            <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start">
                <Resizable width={width} height={30} onResize={handleResize}>
                    <div
                        className={"card"}
                        style={{
                            top: "0px", left: "0px", transform: "translate(50%, 200%)",
                        }}
                    >
                        <IconButton
                            className="handle"><OpenWithIcon/></IconButton>

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
                    </div>
                </Resizable>
            </Popper>
        </Draggable>
    );
}
