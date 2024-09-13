import { useDispatch, useSelector } from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import { Principal } from "@dfinity/principal";
import { CustomContractComponent } from "../../components/ContractTable";
import {
  custom_contract,
  randomString,
} from "../../DataProcessing/dataSamples";
import { handleRedux } from "../../redux/store/handleRedux";
import { CustomContract } from "../../../declarations/backend/backend.did";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { v4 as uuidv4 } from "uuid";

function ContractsHistory(props: any) {
  const dispatch = useDispatch();
  const { contracts, profile } = useSelector((state: any) => state.filesState);

  const handleClick = () => {
    try {
      if (!profile) {
        throw new Error("Profile is not defined");
      }

      const newContract = {
        ...custom_contract,
        id: uuidv4(),
        creator: Principal.fromText(profile.id),
        date_created: Date.now() * 1e6,
      };

      dispatch(handleRedux("ADD_CONTRACT", { contract: newContract }));
    } catch (error) {
      console.error("Error creating new contract:", error);
      //we can display error for user with snack bar here
    }
  };

  return (
    <Box sx={{ padding: 3, margin: 2 }}>
      <Button
        onClick={handleClick}
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
      >
        Create New Contract
      </Button>
      <Divider sx={{ mb: 2 }} />
      <List dense>
        {Object.values(contracts).map((contract: CustomContract | any) => {
          if (contract) {
            return (
              <ListItem key={contract.id} sx={{ padding: 0, marginBottom: 2 }}>
                <Paper
                  elevation={3}
                  sx={{
                    width: "70%",
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                >
                  <CustomContractComponent contract={contract} />
                </Paper>
              </ListItem>
            );
          }
        })}
      </List>
    </Box>
  );
}

export default ContractsHistory;
