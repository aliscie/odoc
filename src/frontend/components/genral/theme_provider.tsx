import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useSelector} from "react-redux";


// window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
//     let displayMode = 'browser';
//     if (evt.matches) {
//         displayMode = 'standalone';
//     }
//     // Log display mode change to analytics
//     console.log('DISPLAY_MODE_CHANGED', displayMode);
// });


const users = [
    {name: 'Ali', image: 'https://i.pinimg.com/564x/55/1a/79/551a79b81ca3d42f9ef6437ecfad669a.jpg', is_active: true},
    {name: 'Ali', image: 'https://i.pinimg.com/564x/55/1a/79/551a79b81ca3d42f9ef6437ecfad669a.jpg', is_active: true},
    {name: 'Ali', image: 'https://i.pinimg.com/564x/55/1a/79/551a79b81ca3d42f9ef6437ecfad669a.jpg', is_active: false},
    {name: 'Ali', image: 'https://i.pinimg.com/564x/55/1a/79/551a79b81ca3d42f9ef6437ecfad669a.jpg', is_active: true},
    {name: 'Ali', image: 'https://i.pinimg.com/564x/55/1a/79/551a79b81ca3d42f9ef6437ecfad669a.jpg', is_active: true},
    {name: 'Ali', image: 'https://i.pinimg.com/564x/55/1a/79/551a79b81ca3d42f9ef6437ecfad669a.jpg', is_active: false},
    {name: 'Ali', image: 'https://i.pinimg.com/564x/55/1a/79/551a79b81ca3d42f9ef6437ecfad669a.jpg', is_active: true},
    {name: 'Ali', image: 'https://i.pinimg.com/564x/55/1a/79/551a79b81ca3d42f9ef6437ecfad669a.jpg', is_active: true},
    {name: 'Ali', image: 'https://i.pinimg.com/564x/55/1a/79/551a79b81ca3d42f9ef6437ecfad669a.jpg', is_active: false},
];


function Theme(props: any) {

    let {isDarkMode} = useSelector((state: any) => state.uiReducer);
    const darkTheme = createTheme({palette: {mode: 'dark'}});
    const lightTheme = createTheme({palette: {mode: 'light'}});
    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            {props.children}
            {/*<PwaDownloadPopup/>*/}
            {/*<PersistentDrawerRight>*/}
            {/*    <UserList users={users}/>*/}
            {/*    <SwipeableTextMobileStepper/>*/}
            {/*</PersistentDrawerRight>*/}
        </ThemeProvider>
    );
}

export default Theme;
