import {logger} from "../../dev_utils/log_data";


test("test friends requests", async () => {
    let initial_user = global.user;
    let newUser = await global.newUser();
    let send_friend_request = await global.actor.send_friend_request(newUser.getPrincipal().toText())
    logger({send_friend_request});

    let init = await global.actor.get_initial_data()
    expect(init.Ok.Friends.length).toEqual(1)
    // global.actor.setIdentity(newUser);
    let confirm = await global.actor.accept_friend_request(newUser.getPrincipal().toText())
    // expect Ok in confirm
    expect("Err" in confirm).toBeTruthy()
    let notifications = await global.actor.get_user_notifications()
    expect(Object.values(notifications).length).toEqual(0)
    // // -----------------\\
    global.actor.setIdentity(newUser);

    let confirm2 = await global.actor.accept_friend_request(global.user.getPrincipal().toText())
    expect("Ok" in confirm2).toBeTruthy()
    global.actor.setIdentity(newUser);
    let notifications2: Array<Notification> = await global.actor.get_user_notifications()
    expect(notifications2.length).toEqual(1)
    //
    let confirm3 = await global.actor.accept_friend_request(initial_user.getPrincipal().toText())
    expect("Err" in confirm3).toBeTruthy()

});


test("test un-friends requests", async () => {

});


