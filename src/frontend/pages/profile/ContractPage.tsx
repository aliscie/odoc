import CustomContractComponent from "../../components/ContractTable";
import React from "react";
import { CustomContract } from "../../../declarations/backend/backend.did";
import { useDispatch, useSelector } from "react-redux";
import { LinearProgress } from "@mui/material";

function ContractPage() {
  // url = http://localhost:5173/contract?id=224e02a4-3f3d-4702-ae74-030a952f1b44
  const contractId = window.location.search.split("id=")[1];
  const { contracts, profile, all_friends } = useSelector(
    (state: any) => state.filesState,
  );
  if (!profile) {
    return
  }
  const dispatch = useDispatch();
  const onContractChange = (contract: CustomContract) => {
    dispatch({
      type: "UPDATE_CONTRACT",
      contract,
    });
  };
  return (
    <CustomContractComponent
      onContractChange={onContractChange}
      profile={profile}
      all_friends={all_friends}
      contractId={contractId}
    />
  );
}
export default ContractPage;
