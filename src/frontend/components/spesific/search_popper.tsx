import * as React from 'react';
import {useEffect} from 'react';
import Draggable from 'react-draggable';
import Popper from '@mui/material/Popper';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import {Resizable} from 'react-resizable';
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import OpenWithIcon from '@mui/icons-material/OpenWith';
import {Box, Card, CardContent, Tooltip} from '@mui/material';
import AbcIcon from '@mui/icons-material/Abc';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import MultiAutoComplete from "../genral/multi_autocompelte";
import useSearchFiles from "./search_popper/search_files_content";
import ResultFile from "./search_popper/result_file";
import TitleIcon from '@mui/icons-material/Title';

export function OptionItem(props: any) {
    return (
        <Tooltip {...props} title={props.title}>
            <IconButton color={"secondary"}>
                {props.icon}
            </IconButton>
        </Tooltip>
    );
}


const search_options = [
    {
        title: <OptionItem title={"Case sensitive"} icon={<AbcIcon/>}/>,
        value: "case_sensitive",
    },
    {
        title: <OptionItem title={"Files content"} icon={<TravelExploreIcon/>}/>,
        value: "files_contents",
    },
    {
        title: <OptionItem title={"Files titles"} icon={<TitleIcon/>}/>,
        value: "files_titles",
    },
    // {
    //     title: <OptionItem title={"Search in current file"} icon={<FindInPageIcon/>}/>,
    //     value: "current_file",
    // },
    // {
    //     title: <OptionItem title={"Search with AI"} icon={<AutoFixHighIcon/>}/>,
    //     value: "ai",
    // },
    {
        title: <OptionItem title={"Search using regular expression"} icon={<AcUnitIcon/>}/>,
        value: "regex",
    },
    // {
    //     title: <OptionItem title={"Global search"} icon={<OpenWithIcon/>}/>,
    //     value: "global",
    // },
];

function SearchPopper() {
    const dispatch = useDispatch();


    const {searchValue, searchTool} = useSelector((state: any) => state.uiReducer);
    const [width, setWidth] = React.useState(250);
    const [currentOptions, setOptions] = React.useState([]);
    const anchorRef = React.useRef<HTMLDivElement | null>(null);
    // const [searchRes, setSearchRes] = React.useState <undefined | Array<[string, Array<[string, ContentNode]>]>>(null);
    const [searchRes, setSearchRes] = React.useState <undefined | any>(null);

    const handleShortcutKeyPress = React.useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'f' && (event.metaKey || event.ctrlKey) && !event.shiftKey) {
                dispatch(handleRedux("SEARCH_TOOL"));
                event.preventDefault();
            }
        },
        []
    );

    const handleClose = () => {
        dispatch(handleRedux("SEARCH_TOOL"));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(handleRedux("SEARCH", {searchValue: event.target.value}));
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
    const handleSelectSearchOption = (event: any, options: any) => {
        setOptions(options.map((opt) => opt.value));
    }
    let {SearchFilesContent, SearchFilesTitles} = useSearchFiles();
    useEffect(() => {
        let case_sensitive = false;
        if (currentOptions.includes("case_sensitive")) {
            case_sensitive = true;
        }
        if (currentOptions.includes("files_contents")) {
            // (async () => {
            // let res: Array<[string, Array<[string, ContentNode]>]> = await actor.search_files_content(searchValue, true);
            let res: [string] | undefined = SearchFilesContent(searchValue, case_sensitive);
            setSearchRes(res);
            // let normalized = normalize_files_contents(res);
            // setSearchRes(normalized);
            // })();
        } else if (currentOptions.includes("files_titles")) {

            let res: [string] | undefined = SearchFilesTitles(searchValue, case_sensitive);
            setSearchRes(res);
        }
    }, [searchValue]);


    return (
        <Draggable
            handle=".handle"
            onDrag={(e: any) => {
                const topEdge = window.innerHeight - 40;
                const rightEdge = window.innerWidth - 300;
                const leftEdge = 40;
                if (e.clientX > rightEdge) {
                    e.style.x = rightEdge;
                } else if (e.clientX < leftEdge) {
                    e.style.x = leftEdge;
                }
                if (e.clientY < 55) {
                    e.style.y = 55;
                } else if (e.clientY > topEdge) {
                    e.style.y = topEdge;
                }
            }}
        >
            <Popper
                style={{
                    zIndex: 1000, // Increase the z-index to make it appear on top of everything
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)', // Position in the middle of the page
                }}
                open={searchTool}
                anchorEl={anchorRef.current}
                placement="bottom-start"
            >
                <Resizable width={width} height={30} onResize={handleResize}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <IconButton className="handle">
                                    <OpenWithIcon/>
                                </IconButton>

                                <MultiAutoComplete onChange={handleSelectSearchOption} options={search_options}
                                                   multiple={true}/>

                                <TextField
                                    size="small"
                                    variant="outlined"
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                    id={'search_field'}
                                    autoFocus={true}
                                    placeholder="Enter text"
                                    sx={{minWidth: "300px"}} // Adjust the width of the search_popper field here
                                />

                                <Box display="flex" alignItems="center">
                                    <IconButton size="small" color="primary">
                                        <ArrowUpwardIcon/>
                                    </IconButton>
                                    <IconButton size="small" color="primary">
                                        <ArrowDownwardIcon/>
                                    </IconButton>
                                    <IconButton size="small" color="primary" onClick={handleClose}>
                                        <CloseIcon/>
                                    </IconButton>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Resizable>

                {searchRes && searchRes.length > 0 && searchRes.map((res) => {
                    return <ResultFile file_id={res}/>
                })
                }
            </Popper>
        </Draggable>
    );
}

export default SearchPopper;