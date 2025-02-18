import React, { useCallback, useRef, useState } from "react";
import { useTheme } from "@mui/material";
import { useVoiceInput } from "./useVoiceInput";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import ChatDialog from "./chtDilog";
import { handelAIValue } from "./handleAiValue";
import ThemedFineTuneComponent from "./fineTuneCompnent";
import AnimatedFloatingFineTune from "./floatingButtonFineTune";

const ConversationInput = ({ calendar }) => {
  const { profile } = useSelector((state: any) => state.filesState);
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const textFieldRef = useRef(null);
  const dispatch = useDispatch();

  const { isRecording, startRecording, stopRecording, recordingError } =
    useVoiceInput();

  const { transcript, resetTranscript } = useSpeechRecognition();

  const handleSubmit = useCallback(
    async (value) => {
      // setMessages((prev) => [...prev, { sender: "user", content: value }]);
      // e.preventDefault();
      if (value.trim()) {
        setIsThinking(true);
        let actions = await handelAIValue(
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
        resetTranscript();
      }
    },
    [resetTranscript, calendar, messages, dispatch],
  );

  // const toggleRecording = useCallback(() => {
  //   if (isRecording) {
  //     stopRecording();
  //     if (transcript) {
  //       setInputValue((prev) => `${prev} ${transcript}`.trim());
  //     }
  //   } else {
  //     startRecording();
  //     resetTranscript();
  //   }
  // }, [isRecording, startRecording, stopRecording, transcript, resetTranscript]);

  return (
    <div
      elevation={3}
      // sx={{
      //   position: "fixed",
      //   bottom: theme.spacing(2),
      //   left: theme.spacing(2),
      //   right: theme.spacing(2),
      //   zIndex: 1000,
      //   p: 2,
      //   // backgroundColor: theme.palette.background.paper,
      //   borderTop: `1px solid ${theme.palette.divider}`,
      // }}
    >
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
