import * as React from "react";
import { useEffect, useState } from "react";
import useGetChats from "../components/Chat/utils/useGetChats";
import { FEChat } from "../../declarations/backend/backend.did";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector } from "react-redux";
import MessagesList from "../components/ChatNotifications/MessagesList";
import { handleRedux } from "../redux/store/handleRedux";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Paper,
  Grid,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  chatListContainer: {
    width: "300px",
    borderRight: "1px solid #ccc",
    padding: theme.spacing(2),
    height: "100vh",
    overflowY: "auto",
  },
  chatItem: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  messagesContainer: {
    flex: 1,
    padding: theme.spacing(2),
    height: "100vh",
    overflowY: "auto",
  },
  chatListHeader: {
    marginBottom: theme.spacing(2),
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
}));

function ChatItem(props: FEChat) {
  const classes = useStyles();
  const dispatch = useDispatch();
  let { getOther } = useGetChats();
  let user = getOther(props);

  return (
    <ListItem
      key={props.id}
      className={classes.chatItem}
      onClick={async () => {
        dispatch(
          handleRedux("OPEN_CHAT", {
            current_chat_id: props.id,
            current_user: user,
          }),
        );
      }}
    >
      <ListItemAvatar>
        <Avatar className={classes.avatar}>{user?.name?.[0]}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={user ? user.name : "null"} />
    </ListItem>
  );
}

function ChatsPage(props: Props) {
  const classes = useStyles();
  const { current_user } = useSelector((state: any) => state.chatsState);
  const { profile } = useSelector((state: any) => state.filesState);
  const dispatch = useDispatch();
  let { getChats } = useGetChats();

  const [chats, setChats] = useState<Array<FEChat>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        let res: undefined | Array<FEChat> = await getChats();
        if (res) {
          setChats(res);
        } else {
          setError("No chats found.");
        }
      } catch (err) {
        setError("Failed to fetch chats. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []); // Only run once when the component mounts

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Paper className={classes.chatListContainer}>
                  <Typography variant="h6" className={classes.chatListHeader}>
                    Chats
                  </Typography>
                  {loading ? (
                    <Typography variant="body1">Loading...</Typography>
                  ) : error ? (
                    <Typography variant="body1" color="error">
                      {error}
                    </Typography>
                  ) : (
                    <List>
                      {chats.map((chat: FEChat) => (
                        <ChatItem key={chat.id} {...chat} />
                      ))}
                    </List>
                  )}
                </Paper>

                <Paper className={classes.messagesContainer}>
                  <MessagesList />
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ChatsPage;
