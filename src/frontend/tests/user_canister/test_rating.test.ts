import {Rating, RegisterUser} from "../../../declarations/user_canister/user_canister.did";
import {Identity} from "@dfinity/agent";
import {createIdentity} from "@hadronous/pic";
import {randomString} from "../../data_processing/data_samples";
import {Principal} from "@dfinity/principal";
import {logger} from "../../dev_utils/log_data";


test("Test render login", async () => {
    let input: RegisterUser = {
        'name': ["name1"],
        'description': ["Somthing"],
        'photo': [[]],
    };
    // register user 1
    let res = await global.actor.register(input);
    expect("Ok" in res).toBeTruthy();

    // register user 2
    const user2: Identity = createIdentity("2");
    global.actor.setIdentity(user2);
    input.name = ["name2"]
    let res2 = await global.actor.register(input);
    expect("Ok" in res2).toBeTruthy();

    // rate user 1
    let rating: Rating = {
        'id': randomString(),
        'date': Date.now() * 1e6,
        'user_id': Principal.anonymous(),
        'comment': "He is a nice person",
        'rating': 0.4,
    }
    let res3 = await global.actor.rate_user(Principal.fromText(res.Ok.id),rating)
    expect("Ok" in res3).toBeTruthy();

    // let res4 = await global.actor.get_user_profile(Principal.fromText(res.Ok.id))
    // logger({total_rate: res4.Ok[1].total_rate})
});
