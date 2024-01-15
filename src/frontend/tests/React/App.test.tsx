import {render} from '@testing-library/react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import SharesContractComponent from "../../components/contracts/shares_contract"; // Assuming you have redux-mock-store installed


// Create a mock Redux store
// const mockStore = configureStore([]);
// const initialState = {
//     uiReducer: {
//         isNavOpen: false,
//         isDarkMode: false,
//         isLoggedIn: false,
//         searchTool: false,
//     },
//     filesReducer: {
//         profile: null,
//         current_file: null,
//         files: {},
//     },
// };


test('Test share contract', () => {


    const share_contract_sample = {
        "id": "8ehxm4", "type": "shares_contract", "data": [], "children": [{
            "id": "m0r694", "type": "", "data": [{
                "Table": {
                    "rows": [{"id": "ckyqvc", "contract": [{"SharesContract": "ckyqvc"}], "cells": []}],
                    "columns": [{
                        "id": "q245md",
                        "_type": {"Text": null},
                        "field": "receiver",
                        "filters": [],
                        "permissions": [],
                        "dataValidator": [],
                        "editable": true,
                        "formula": []
                    }, {
                        "id": "2l96mk",
                        "_type": {"Text": null},
                        "field": "accumulation",
                        "filters": [],
                        "permissions": [],
                        "dataValidator": [],
                        "editable": false,
                        "formula": []
                    }, {
                        "id": "r63ut5",
                        "_type": {"Text": null},
                        "field": "share%",
                        "filters": [],
                        "permissions": [],
                        "dataValidator": [],
                        "editable": true,
                        "formula": []
                    }, {
                        "id": "n1y4g2",
                        "_type": {"Text": null},
                        "field": "confirmed",
                        "filters": [],
                        "permissions": [],
                        "dataValidator": [],
                        "editable": false,
                        "formula": []
                    }]
                }
            }], "text": ""
        }]
    };

    const redux_sample = {
        "current_file": {
            "id": "l835mg",
            "permission": {"CanView": null},
            "share_id": [],
            "name": "test contract",
            "children": [],
            "author": "uz5jz-jxm6u-jjnku-3rdor-vencv-2odkg-ftjkf-lsflq-xhdu4-3rkxm-lqe",
            "users_permissions": [],
            "parent": []
        },
        "all_friends": [{
            "id": "uz5jz-jxm6u-jjnku-3rdor-vencv-2odkg-ftjkf-lsflq-xhdu4-3rkxm-lqe",
            "name": "Ali",
            "description": "d",
            "photo": {}
        }],
        "profile": {
            "id": "shkli-aw442-igi7a-2hld6-qrx4l-osmnr-dshrq-ppn3g-vew6b-cnmpj-vae",
            "name": "New",
            "description": "x",
            "photo": {}
        },
        "contracts": {
            "8e59bi": {
                "shares": [{
                    "share_contract_id": "riew5w",
                    "accumulation": "0",
                    "confirmed": false,
                    "share": "100",
                    "receiver": {"__principal__": "2vxsx-fae"},
                    "extra_cells": []
                }],
                "payments": [],
                "contract_id": "8e59bi",
                "shares_requests": [],
                "payment_options": [{"id": "", "title": "", "date": "", "description": "", "amount": "0"}],
                "author": "shkli-aw442-igi7a-2hld6-qrx4l-osmnr-dshrq-ppn3g-vew6b-cnmpj-vae"
            }, "m0r694": {
                "payment_options": [{
                    "id": "zlekq6",
                    "title": "B",
                    "date": "",
                    "description": "",
                    "amount": "12"
                }, {"id": "", "title": "A", "date": "", "description": "", "amount": "10"}],
                "shares": [{
                    "extra_cells": [],
                    "share_contract_id": "ul3ng0",
                    "accumulation": "0",
                    "share": "0",
                    "confirmed": true,
                    "receiver": {"__principal__": "uz5jz-jxm6u-jjnku-3rdor-vencv-2odkg-ftjkf-lsflq-xhdu4-3rkxm-lqe"}
                }, {
                    "extra_cells": [],
                    "share_contract_id": "7yuunl",
                    "accumulation": "0",
                    "share": "0",
                    "confirmed": true,
                    "receiver": {"__principal__": "uz5jz-jxm6u-jjnku-3rdor-vencv-2odkg-ftjkf-lsflq-xhdu4-3rkxm-lqe"}
                }, {
                    "extra_cells": [],
                    "share_contract_id": "n5z5k8",
                    "accumulation": "0",
                    "share": "0",
                    "confirmed": true,
                    "receiver": {"__principal__": "uz5jz-jxm6u-jjnku-3rdor-vencv-2odkg-ftjkf-lsflq-xhdu4-3rkxm-lqe"}
                }, {
                    "extra_cells": [],
                    "share_contract_id": "ckyqvc",
                    "accumulation": "0",
                    "share": "100",
                    "confirmed": true,
                    "receiver": {"__principal__": "shkli-aw442-igi7a-2hld6-qrx4l-osmnr-dshrq-ppn3g-vew6b-cnmpj-vae"}
                }, {
                    "extra_cells": [],
                    "share_contract_id": "pzn9vd",
                    "accumulation": "0",
                    "share": "0",
                    "confirmed": true,
                    "receiver": {"__principal__": "uz5jz-jxm6u-jjnku-3rdor-vencv-2odkg-ftjkf-lsflq-xhdu4-3rkxm-lqe"}
                }, {
                    "extra_cells": [],
                    "share_contract_id": "b7lv7v",
                    "accumulation": "0",
                    "share": "0",
                    "confirmed": true,
                    "receiver": {"__principal__": "shkli-aw442-igi7a-2hld6-qrx4l-osmnr-dshrq-ppn3g-vew6b-cnmpj-vae"}
                }, {
                    "extra_cells": [],
                    "share_contract_id": "qje7oq",
                    "accumulation": "0",
                    "share": "0",
                    "confirmed": true,
                    "receiver": {"__principal__": "uz5jz-jxm6u-jjnku-3rdor-vencv-2odkg-ftjkf-lsflq-xhdu4-3rkxm-lqe"}
                }],
                "payments": [],
                "contract_id": "m0r694",
                "author": "uz5jz-jxm6u-jjnku-3rdor-vencv-2odkg-ftjkf-lsflq-xhdu4-3rkxm-lqe",
                "shares_requests": [["uv9b3g", {
                    "id": "uv9b3g",
                    "requester": {"__principal__": "shkli-aw442-igi7a-2hld6-qrx4l-osmnr-dshrq-ppn3g-vew6b-cnmpj-vae"},
                    "shares": [{
                        "extra_cells": [],
                        "share_contract_id": "pzgauu",
                        "accumulation": "0",
                        "share": "50",
                        "confirmed": false,
                        "receiver": {"__principal__": "shkli-aw442-igi7a-2hld6-qrx4l-osmnr-dshrq-ppn3g-vew6b-cnmpj-vae"}
                    }, {
                        "extra_cells": [],
                        "share_contract_id": "0v92z3",
                        "accumulation": "0",
                        "share": "50",
                        "confirmed": true,
                        "receiver": {"__principal__": "shkli-aw442-igi7a-2hld6-qrx4l-osmnr-dshrq-ppn3g-vew6b-cnmpj-vae"}
                    }],
                    "is_applied": false,
                    "name": "name",
                    "approvals": []
                }]]
            }
        }
    }
    const store = mockStore(redux_sample);
    render(
        <Provider store={store}>
            <SharesContractComponent {...share_contract_sample} />
        </Provider>
    );
    // expect x to be true
    expect(true).toBe(false);

});
