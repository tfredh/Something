import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface AutocompleteInputOption {
    label: string;
    id: any;
}

interface AutocompleteInputProps {
    extraProps?: Record<string, any>;
    placeholder?: string;
    options: AutocompleteInputOption[];

    /**
     * Used to see the default parameters sent by the
     * MUI Autocomplete component.
     */
    seeDefaultParams?: boolean | undefined;
}

function AutocompleteInput({
    options,
    placeholder,
    extraProps,
    seeDefaultParams,
}: AutocompleteInputProps): JSX.Element {
    return (
        <Autocomplete
            className="autocomplete-input-container"
            renderInput={(params) => {
                if (seeDefaultParams) console.log(params);

                return (
                    <TextField
                        variant="outlined" // optional
                        className="autocomplete-input-textfield"
                        {...{ ...params, fullWidth: false }}
                        /**
                         * After the 'params' are set to allow overriding from outside
                         * this abstraction.
                         */
                        label={placeholder}
                        {...extraProps}
                    />
                );
            }}
            options={options}
        />
    );
}

export default AutocompleteInput;
