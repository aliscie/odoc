import * as React from "react";
import {Button} from "@mui/material";

export function LoadingButton(props: any) {
    let [loading, setLoading] = React.useState(false);
    return <>
        {
            loading ? <span className="loader"/> : <Button
                disabled={loading}
                onClick={async () => {
                    setLoading(true)
                    props.onClick && await props.onClick()
                    setLoading(false)
                }}
            >{props.name}</Button>
        }</>
}

