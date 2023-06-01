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

type ToggleButtonProps = {
    value: boolean;
    onChange: (value: boolean) => void;
    icon: React.ReactNode;
    tooltipText: string;
};

const ToggleButtonWithTooltip: React.FC<ToggleButtonProps> = ({
                                                                  icon,
                                                                  tooltipText,
                                                              }) => {
    const [selected, setSelected] = React.useState(false);

    return (
        <ToggleButton
            color="primary"
            value={"check"}
            onChange={() => {
                setSelected(!selected);
            }} selected={selected}

            aria-label={tooltipText}>
            <Tooltip title={tooltipText} placement="top">
                {icon}
            </Tooltip>
        </ToggleButton>
    );
};

function Filters() {
    const [filters, setFilters]: any = React.useState<string[]>([]);

    const handleFilterToggle = (filter: string) => {
        if (filters.includes(filter)) {
            setFilters((prevFilters) => prevFilters.filter((f) => f !== filter));
        } else {
            setFilters((prevFilters) => [...prevFilters, filter]);
        }
    };


    return (<ToggleButtonGroup value={filters} onChange={handleFilterToggle} aria-label="Filter Toggle">
        <ToggleButtonWithTooltip
            icon={<CasesIcon/>}
            tooltipText="Case Sensitive Search"
        />
        <ToggleButtonWithTooltip
            icon={<AbcIcon/>}
            tooltipText="Regular Expression Search"
        />
        <ToggleButtonWithTooltip
            value={filters.includes('searchFileNames')}
            onChange={() => handleFilterToggle('searchFileNames')}
            icon={<FolderCopyIcon/>}
            tooltipText="Search File Names"
        />
        <ToggleButtonWithTooltip
            value={filters.includes('searchFileContents')}
            onChange={() => handleFilterToggle('searchFileContents')}
            icon={<ContentPasteSearchIcon/>}
            tooltipText="Search File Contents"
        />
        <ToggleButtonWithTooltip
            value={filters.includes('globalSearch')}
            onChange={() => handleFilterToggle('globalSearch')}
            icon={<PublicIcon/>}
            tooltipText="Global Search"
        />
        <ToggleButtonWithTooltip
            value={filters.includes('localSearch')}
            onChange={() => handleFilterToggle('localSearch')}
            icon={<LocalActivityIcon/>}
            tooltipText="Local Search"
        />
        <ToggleButtonWithTooltip
            value={filters.includes('socialMediaSearch')}
            onChange={() => handleFilterToggle('socialMediaSearch')}
            icon={<ConnectWithoutContactIcon/>}
            tooltipText="Social Media Search"
        />
    </ToggleButtonGroup>)
}

export default function SearchPopper() {
    const [open, setOpen] = React.useState(false);
    const [searchText, setSearchText] = React.useState('');
    const [width, setWidth] = React.useState(250);

    const anchorRef = React.useRef<HTMLDivElement | null>(null);

    const handleShortcutKeyPress = React.useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'f' && (event.metaKey || event.ctrlKey)) {
                setOpen(true);
                event.preventDefault();
            }
        },
        []
    );

    const handleClose = () => {
        setOpen(false);
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
                        <div className="handle">
                            <Filters/>
                            <IconButton size="small" color="primary">
                                <SearchIcon/>
                            </IconButton>
                            <TextField
                                size="small"
                                variant="outlined"
                                value={searchText}
                                onChange={handleSearchChange}
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
