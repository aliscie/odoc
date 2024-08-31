import Payments from "./Payments";
import Promises from "./Promises";
import React from "react";
import { CONTRACT, PAYMENTS, PROMISES } from "../types";
import {
  CContract,
  CustomContract,
} from "../../../../declarations/backend/backend.did";
import CustomTable from "./CustomTable";

export type VIEW_OPTIONS = {
  content?: string;
  name: string;
  contract?: CContract;
  onClick: (e: VIEW_OPTIONS, contract?: CustomContract) => void;
};

interface Props {
  view: VIEW_OPTIONS;
  contract: CustomContract;
}

function RenderViews(props: Props) {

  switch (props.view.content) {
    case PROMISES:
      return <Promises contract={props.contract} />;
    case PAYMENTS:
      return <Payments contract={props.contract} />;
    case CONTRACT:
      return <CustomTable view={props.view} contract={props.contract} />;
    default:
      return <div>Unknown</div>;
  }
}

export default RenderViews;
