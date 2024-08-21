// import { AppActions } from '../actions';

// export const handleRedux = (type: AppActions, data?: any) => ({
//     type,
//     ...data
// });


// handleRedux.ts
import { BaseAction } from '../actions/chatsActions';

export const handleRedux = (type: string, payload?: any): BaseAction => ({
    type,
    payload,
});

