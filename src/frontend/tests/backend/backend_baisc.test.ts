import { StoredContract } from "../../../declarations/backend/backend.did";
import { newContract } from "./data_samples";

test("Basic testing", async () => {
  let newUser = await global.newUser();
  let res = await global.actor.deposit_usdt(100);

  const { custom_contract, promise } = newContract();
  promise.receiver = newUser.getPrincipal();
  promise.sender = global.user.getPrincipal();
  promise.amount = 50;
  custom_contract.promises = [promise];

  custom_contract.creator = global.user.getPrincipal();
  expect("Ok" in res).toBeTruthy();

  let to_store: StoredContract = {
    CustomContract: custom_contract,
  };
  res = await global.actor.multi_updates([], [], [to_store], [], []);
  // expect(profile_history.Ok.actions_rate).toBeGreaterThan(0);
  // global.pic.tearDown();
});
