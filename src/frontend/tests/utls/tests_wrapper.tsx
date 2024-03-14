import {SnackbarProvider} from "notistack";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {Provider} from 'react-redux';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);


const initialState = {

    current_file: {id: null, name: null},
    is_files_saved: true,
    files: {},
    files_content: {},
    friends: [{friends: [], friend_requests: []}],
    changes: {files: {}, contents: {}, contracts: {}, delete_contracts: []},
    notifications: [],
    profile_history: null,
};

const store = mockStore(initialState);

function TestRapper(props) {
    return (
        <Provider store={store}>
            <SnackbarProvider>
                {props.children}
            </SnackbarProvider>
        </Provider>

    )
}

export default TestRapper;