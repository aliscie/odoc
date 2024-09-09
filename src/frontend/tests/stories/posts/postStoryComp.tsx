import React from "react";
import { BackendProvider } from "../../../contexts/BackendContext";
import store from "../../../redux/store";
import { Provider } from "react-redux";
import Discover from "../../../pages/Discover";

export interface Props {}

export const PostStoryCom = (props: Props) => {
  return (
    <Provider store={store}>
      <BackendProvider>
        {" "}
        <Discover />
      </BackendProvider>
    </Provider>
  );
};
