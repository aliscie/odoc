import React, { useState, useRef, ChangeEvent } from "react";
import { Input, Rating as RatingComponent } from "@mui/material";
import { Principal } from "@dfinity/principal";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";
import { useBackendContext } from "../../contexts/BackendContext";
import DialogOver from "../MuiComponents/DialogOver";
import { randomString } from "../../DataProcessing/dataSamples";
import { Rating } from "../../../declarations/backend/backend.did";

interface RateUserProps {
    id: string;
    rate: number;
}

const RateUser: React.FC<RateUserProps> = ({ id, rate: initialRate }) => {
    const { backendActor } = useBackendContext();
    const { profile } = useSelector((state: any) => state.filesState);
    const { enqueueSnackbar } = useSnackbar();

    const commentRef = useRef<string>("");
    const [rate, setRate] = useState<number | null>(initialRate);
    const [loading, setLoading] = useState<boolean>(false);

    const handleRating = (_event: React.ChangeEvent<{}>, newValue: number | null) => {
        if (newValue !== null && newValue > 0) {
            setRate(newValue);
        }
    };

    const handleSubmit = async () => {
        const rating: Rating = {
            id: randomString(),
            date: Date.now() * 1e6,
            user_id: Principal.fromText(profile.id),
            comment: commentRef.current,
            rating: rate || 0,
        };

        setLoading(true);

        try {
            const res = await backendActor?.rate_user(Principal.fromText(id), rating);

            if (res?.Ok !== undefined) {
                enqueueSnackbar("Thank you for your feedback", { variant: "success" });
                setRate(initialRate);  // Reset to initial rate after submission
            } else if (res?.Err) {
                enqueueSnackbar(res.Err, { variant: "error" });
            } else {
                enqueueSnackbar("Something went wrong", { variant: "error" });
            }
        } catch (error) {
            enqueueSnackbar("An error occurred while submitting your rating", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        commentRef.current = event.target.value;
    };

    return (
        <DialogOver
            size="small"
            disabled={loading}
            variant="text"
            DialogContent={(dia: any) => (
                <>
                    Comment: <Input disabled={loading} onChange={handleInput} />
                    <LoadingButton
                        loading={loading}
                        disabled={loading}
                        onClick={async () => {
                            await handleSubmit();
                            dia.handleCancel();
                        }}
                    >
                        Submit
                    </LoadingButton>
                </>
            )}
        >
            <RatingComponent
                onChange={handleRating}
                name="half-rating"
                defaultValue={rate || 0}
                precision={0.5}
            />
        </DialogOver>
    );
};

export default RateUser;
