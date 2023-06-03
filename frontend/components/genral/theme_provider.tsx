// This is an important note:
// Please minimise your approaches for example this component is unnecessary in which we are using pure css for dark mode.
// Please, separate your code, in which the dark them 100% handle in the css and there is no need to disturbed our html code with theme.
// for example Notice: autodox_libraries where we have all development tools and shortcuts operated in a different place and there is no need to disturbed our project with that code so it has it's own sperated reposstry
// Notice the autodox-editor package also operated in a different place
// I am against the idea of mono-repo project and I prefer to put each part in operated repository, because each developer can focus on their own package, and that help us focus on each proelem speratedly instead of distracting our attention and distruping our code and distributing our git commit history. the opposed of mono-repo is pluginization in which we have a central app and plugins inject in it that can be easily replaced in the future
// pluginization also make it easy to introduce our project to new developers because they can focus on the central code and understand that the plugs does secondary tasks

import * as React from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';

const ColorModeContext = React.createContext({
    toggleColorMode: () => {
    }
});


export default function ModeThemeProvider(props: any) {
    const [mode, setMode] = React.useState<'light' | 'dark'>('light');
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                {props.children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}