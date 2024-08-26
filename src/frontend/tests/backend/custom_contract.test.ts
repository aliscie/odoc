import {
  StoredContract,
  UserProfile,
} from "../../../declarations/backend/backend.did";
import {
  custom_contract,
  randomString,
} from "../../data_processing/data_samples";
import { assert } from "vitest";
import { newContract } from "./data_samples";

// TODO Tests
//     1. in the formula.exec.payment.sender == caller()
//     That mean only the caller() can set him self as a sender in formula
//     2. on save execute formula even if formula.exe.payment != caller()
//     3. in promise.sender == caller() (caller can not save a promise with sender != caller())

test("Test custom contract", async () => {
  let newUser = await global.newUser();
  let res = await global.actor.deposit_usdt(100);

  const { custom_contract, promise } = newContract();
  promise.receiver = newUser.getPrincipal();
  promise.sender = global.user.getPrincipal();
  promise.amount = 50;
  custom_contract.promises = [promise];

  custom_contract.creator = global.user.getPrincipal();
  expect("Ok" in res).toBeTruthy();
  // console.log({newUser, me: global.user});

  let to_store: StoredContract = {
    CustomContract: custom_contract,
  };
  res = await global.actor.multi_updates([], [], [to_store], [], []);

  // --------------------- Confirm the promise ---------------------  \\
  global.actor.setIdentity(newUser);
  let notifications: Array<Notification> =
    await global.actor.get_user_notifications();
  let payment = notifications[0].content.CPaymentContract[0];
  let contract_id = custom_contract.id;
  expect(payment.contract_id).toEqual(contract_id);
  res = await global.actor.confirmed_c_payment(payment);
  expect(res).toEqual({ Ok: null });

  // ---------------- sender can't update the promise after conformation ---------------- \\
  global.actor.setIdentity(global.user);

  res = await global.actor.get_initial_data();
  res.Ok.Contracts.forEach((value, key) => {
    expect(value[1].CustomContract.promises[0].status).toEqual({
      Confirmed: null,
    });
  });

  // custom_contract.promises[0].status = {RequestCancellation: null};
  custom_contract.promises[0] = { ...promise, amount: 0 }; // test can't update value after is confirmed
  let to_store3: StoredContract = {
    CustomContract: custom_contract,
  };
  res = await global.actor.multi_updates([], [], [to_store3], [], []);
  expect(res.Ok.includes(" You can't update a promise to None")).toBeTruthy();

  res = await global.actor.get_initial_data();
  res.Ok.Contracts.forEach((value, key) => {
    expect(value[1].CustomContract.promises.length).toEqual(1);
    expect(value[1].CustomContract.promises[0].status).toEqual({
      Confirmed: null,
    });
    expect(value[1].CustomContract.promises[0].amount).toEqual(50);
  });

  //---------------- Release the promise ----------------\\
  global.actor.setIdentity(global.user);
  custom_contract.promises[0].status = { Released: null };
  to_store = {
    CustomContract: custom_contract,
  };

  res = await global.actor.multi_updates([], [], [to_store], [], []);
  assert("Ok" in res);

  // ---------------------------- assert the promise was moved to payments ---------------------------- \\
  res = await global.actor.get_initial_data();
  res.Ok.Contracts.forEach((value, key) => {
    expect(value[1].CustomContract.promises).toEqual([]);
  });

  let profile_history: { Ok: UserProfile } | { Err: string } =
    await global.actor.get_user_profile(global.user.getPrincipal());
  expect(profile_history.Ok.actions_rate).toBeGreaterThan(0);
  global.pic.tearDown();
});

async function userConfirm(user, g) {
  g.actor.setIdentity(user);
  let notifications: Array<Notification> =
    await global.actor.get_user_notifications();
  await Promise.all(
    notifications.map(async (value) => {
      let payment = value.content.CPaymentContract[0];
      let contract_id = custom_contract.id;
      expect(payment.contract_id).toEqual(contract_id);
      let res = await global.actor.confirmed_c_payment(payment);
      expect(res).toEqual({ Ok: null });
    }),
  );
}
