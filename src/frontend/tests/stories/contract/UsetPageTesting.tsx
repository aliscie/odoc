import React from "react";
// import {CustomContractComponent} from "../../../components/contracts/custom_contract/custom_contract";
// import {createCContract} from "../../../components/contracts/custom_contract/utls";
// import {CContract} from "../../../../declarations/backend/backend.did";
// import {newContract} from "../../backend/data_samples";
// import {createCContract} from "../../../components/ContractTable/utils";
import { CustomContractComponent } from "../../../components/ContractTable";
import UserPage from "../../../pages/user";
import { vi } from "vitest";
import { UserProfile } from "../../../../declarations/backend/backend.did";
import { Principal } from "@dfinity/principal";
import { useBackendContext } from "../../../contexts/BackendContext";
// import {custom_contract} from "../../../DataProcessing/dataSamples";
// import {CustomContractComponent} from "../../../components/ContractTable";

export interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: "small" | "medium" | "large";
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
}));

vi.mock("notistack", () => ({
  useSnackbar: vi.fn(),
}));

// Mock BackendContext
vi.mock("../../contexts/BackendContext", () => ({
  useBackendContext: vi.fn(),
}));

vi.mock("@dfinity/principal", () => ({
  Principal: {
    fromText: vi.fn().mockReturnValue({}),
  },
}));
export const UsetPageTesting = ({
  primary = false,
  size = "medium",
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  let id = "trp5a-o2ilp-mov7c-jzihs-aepzm-ipkwf-msvc-rrrvz-p3jof-k4x7v-zae";
  let user: UserProfile = {
    id: Principal.fromText(id),
    actions_rate: 0,
    balance: 100,
    rates_by_actions: [],
    name: "John",
    description: "any",
    total_debt: 100,
    spent: 10,
    rates_by_others: [],
    users_rate: 0,
    users_interacted: 0,
    photo: [],
    debts: [],
    received: 0,
  };
  mockBackendActor.get_user_profile({ Ok: user });

  // Mock useBackendContext to return the correct structure
  useBackendContext.mockReturnValue({
    backendActor: mockBackendActor,
    authClient: null,
    agent: null,
    isAuthenticating: false,
    login: vi.fn(),
    logout: vi.fn(),
  });

  const mockSearchValue = `?user_id=${id}`;
  delete window.location;
  window.location = { search: mockSearchValue } as any;
  return <UserPage />;
};
