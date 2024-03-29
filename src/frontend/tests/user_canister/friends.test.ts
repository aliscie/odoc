import {logger} from "../../dev_utils/log_data";


test("test friends requests", async () => {
    let initial_user = global.user;
    let newUser = await global.newUser();
    let send_friend_request = await global.actor.send_friend_request(newUser.getPrincipal().toText())
    logger({send_friend_request});

    let init = await global.actor.get_initial_data()
    logger({init});

    let confirm = await global.actor.accept_friend_request(newUser.getPrincipal().toText())
    logger({confirm});
    // -----------------\\
    global.actor.setIdentity(newUser);
    let confirm2 = await global.actor.accept_friend_request(newUser.getPrincipal().toText())
    logger({confirm2});

    let confirm3 = await global.actor.accept_friend_request(initial_user.getPrincipal().toText())
    logger({confirm3});


    let init2 = await global.actor.get_initial_data()
    logger({init2});

    // -----------------\\
    global.actor.setIdentity(initial_user);
    let init3 = await global.actor.get_initial_data()
    logger({init3});

});

