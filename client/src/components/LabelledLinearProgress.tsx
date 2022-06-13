import React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

interface LabelledLinearProgressProps {
    value: number;
    NaNError?: string;
    [rest: string]: any;
}

export default function LabelledLinearProgress(
    props: LabelledLinearProgressProps
): JSX.Element {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box>
                <Typography>
                    {isNaN(props.value) ? "N/A" : `${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}
