import React, { useCallback, useRef, useState } from "react";
import { useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import ChatDialog from "./chtDilog";
import handleAIValue from "./handleAiValue";
import AnimatedFloatingFineTune from "./floatingButtonFineTune";

const ConversationInput = ({ calendar }) => {
  const { profile } = useSelector((state: any) => state.filesState);
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const textFieldRef = useRef(null);
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    async (value) => {
      // setMessages((prev) => [...prev, { sender: "user", content: value }]);
      // e.preventDefault();
      if (value.trim()) {
        setIsThinking(true);
        let actions = await handleAIValue(
          value.trim(),
          calendar,
          messages,
          setMessages,
          enqueueSnackbar,
          dispatch,
          profile,
        );
        console.log({ calendar, actions });
        actions?.forEach((action) => {
          dispatch(action);
        });
        setIsThinking(false);
        // onSubmit(inputValue.trim());
      }
    },
    [calendar, messages, dispatch],
  );

  return (
    <div elevation={3}>
      <AnimatedFloatingFineTune />
      <ChatDialog
        initialMessages={messages}
        isThinking={isThinking}
        disabled={isThinking}
        ref={textFieldRef}
        onSubmit={handleSubmit}
        // onChange={(value) => setInputValue(value)}
      />
    </div>
  );
};

export default ConversationInput;
