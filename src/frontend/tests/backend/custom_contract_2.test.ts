import { UserProfile } from "../../../declarations/backend/backend.did";
import { randomString } from "../../data_processing/data_samples";
import { newContract } from "./data_samples";

test("Test actions rating", async () => {
  let contract_id: string = randomString();

  // -------- init the test -------- \\
  let res;
  let newUser;
  let promises = [];

  // ------ testing the rating ------ \\
  const { custom_contract, promise } = newContract();

  async function userObject(user) {
    global.actor.setIdentity(user);
    let notifications: Array<Notification> =
      await global.actor.get_user_notifications();
    await Promise.all(
      notifications.map(async (value) => {
        let payment = value.content.CPaymentContract[0];
        let contract_id = custom_contract.id;
        expect(payment.contract_id).toEqual(contract_id);
        let res = await global.actor.object_on_cancel(
          payment,
          "I don't like it",
        );
        expect(res).toEqual({ Ok: null });
      }),
    );
  }

  res = await global.actor.deposit_usdt(1900); // TODO is 200 balance.
  promise.amount = 120;
  promise.sender = global.user.getPrincipal();
  promise.status = { None: null };

  /// ---------- dummy promises ---------- \\
  let newUser1 = await global.newUser();
  newUser = newUser1.getPrincipal();
  promises.push(
    ...[1, 2, 3, 4].map((value) => {
      return {
        ...promise,
        id: randomString(),
        receiver: newUser,
      };
    }),
  );

  let newUser2 = await global.newUser();
  newUser = newUser2.getPrincipal();
  promises.push(
    ...[1, 2, 3, 4].map((value) => {
      return {
        ...promise,
        id: randomString(),
        receiver: newUser,
      };
    }),
  );

  let newUser3 = await global.newUser();
  newUser = newUser3.getPrincipal();
  promises.push(
    ...[1, 2, 3, 4].map((value) => {
      return {
        ...promise,
        id: randomString(),
        receiver: newUser,
      };
    }),
  );

  let newUser4 = await global.newUser();
  newUser = newUser4.getPrincipal();
  promises.push(
    ...[3].map((value) => {
      return {
        ...promise,
        id: randomString(),
        receiver: newUser,
      };
    }),
  );

  let newUser5 = await global.newUser();
  newUser = newUser5.getPrincipal();
  promises.push(
    ...[3].map((value) => {
      return {
        ...promise,
        id: randomString(),
        receiver: newUser,
      };
    }),
  );

  promise.status = { Released: null };
  let promises_3 = await Promise.all(
    [1, 2, 3].map(async (value) => {
      newUser = await global.newUser();
      newUser = newUser.getPrincipal();
      return {
        ...promise,
        id: randomString(),
        receiver: newUser,
      };
    }),
  );

  promises.push(...promises_3);
  /// ---------- test case ---------- \\
  custom_contract.creator = global.user.getPrincipal();
  let to_store = {
    CustomContract: { ...custom_contract, promises },
  };
  res = await global.actor.multi_updates([], [], [to_store], [], []);
  // expect(res).toEqual({Ok: "Updates applied successfully."});
  expect("Ok" in res).toBeTruthy();

  //  ---------------- Confirm the promises ---------------- \\
  await userObject(newUser2);
  await userObject(newUser3);
  await userObject(newUser4);
  await userObject(newUser5); // TODO I should get 4 objections but in the backend (backend) it shows 3 fix this
  global.actor.setIdentity(global.user);

  //
  /// ---------------------------- assert the promise was moved to payments ---------------------------- \\
  //

  let profile_history: { Ok: UserProfile } | { Err: string } =
    await global.actor.get_user_profile(global.user.getPrincipal());
  expect(profile_history.Ok.users_interacted).toEqual(3);
  expect(profile_history.Ok.spent).toEqual(360);
  expect(profile_history.Ok.actions_rate).toEqual(3);
  // //
  // //
  // // // ---------------- release the promises ---------------- \\
  promises = promises.map((value) => {
    return {
      ...value,
      status: { Released: null },
    };
  });
  to_store = {
    CustomContract: { ...custom_contract, promises },
  };

  res = await global.actor.multi_updates([], [], [to_store], [], []);
  profile_history = await global.actor.get_user_profile(
    global.user.getPrincipal(),
  );
  expect(profile_history.Ok.users_interacted).toEqual(6);
  expect(profile_history.Ok.spent).toEqual(1800); // TODO You can't spend more than the deposit of 2000
  expect(profile_history.Ok.actions_rate).toEqual(5);
  global.pic.tearDown();
});

test("Basic contract action", async () => {
  let contract_id: string = randomString();

  // -------- init the test -------- \\
  let res;
  // let new_user = await global.newUser();
  // res = await global.actor.deposit_usdt(100);
  // // ------ testing the rating ------ \\
  // const {custom_contract, promise} = newContract();
  // promise.amount = 5;
  // promise.sender = global.user.getPrincipal();
  // promise.status = {Released: null};
  // promise.receiver = new_user.getPrincipal();
  // let to_store = {
  //     "ContractTable": {...custom_contract, promises: [promise]}
  // };
  //
  // res = await global.actor.multi_updates([], [], [to_store], []);
  // expect("Ok" in res).toBeTruthy();
  // let profile_history = await global.actor.get_user_profile(global.user.getPrincipal());
  // expect(profile_history.Ok.users_interacted).toEqual(1);
  // expect(profile_history.Ok.spent).toEqual(5);
  // expect(profile_history.Ok.actions_rate).toEqual(1.5);
});
