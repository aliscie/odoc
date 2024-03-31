import {logger} from "../../dev_utils/log_data";


test("test friends requests", async () => {
    let initial_user = global.user;
    let newUser = await global.newUser();
    let send_friend_request = await global.actor.send_friend_request(newUser.getPrincipal().toText())
    logger({send_friend_request});

    let init = await global.actor.get_initial_data()
    expect(init.Ok.Friends.length).toEqual(1)

    let confirm = await global.actor.accept_friend_request(newUser.getPrincipal().toText())
    logger({confirm});
    // let notifications = global.actor.get_notifications()
    // expect(Object.values(notifications).length).toEqual(1)
    // -----------------\\
    global.actor.setIdentity(newUser);
    let confirm2 = await global.actor.accept_friend_request(newUser.getPrincipal().toText())
    logger({confirm2});
    let notifications2 = global.actor.get_notifications()
    expect(Object.values(notifications2).length).toEqual(1)

    let confirm3 = await global.actor.accept_friend_request(initial_user.getPrincipal().toText())
    logger({confirm3});


    let init2 = await global.actor.get_initial_data()
    logger({init2});

    // -----------------\\
    global.actor.setIdentity(initial_user);
    let init3 = await global.actor.get_initial_data()
    logger({init3});


    let unfriend = await global.actor.unfriend(newUser.getPrincipal().toText())
    logger({unfriend});


    let init4 = await global.actor.get_initial_data()
    logger({init4});

});

