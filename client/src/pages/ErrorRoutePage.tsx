import Button from "@mui/material/Button";

import { useNavigate } from "react-router-dom";

export default function ErrorRoutePage(): JSX.Element {
    const navigate = useNavigate();

    return (
        <div className="error-page-container">
            <div>Where are you going, go back to base</div>
            <Button variant="contained" onClick={() => navigate("/")}>
                Go Back
            </Button>
        </div>
    );
}
