import {
    List,
    ListItem,
    IconButton,
    ListItemButton,
    Checkbox,
    ListItemText,
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import { useState } from "react";
import { IndexOfReturns } from "../utils/enums";

interface CheckboxListProps<T> {
    checklistItems: T[];
    checkedByDefault?: T[];

    className?: string;
}

export default function CheckboxList<T extends number | string>({
    checklistItems,
    checkedByDefault,
    className,
}: CheckboxListProps<T>) {
    const [checked, setChecked] = useState<T[]>(checkedByDefault || []);

    const handleToggle = (value: T) => {
        return () => {
            const currentIndex = checked.indexOf(value);
            const newChecked = [...checked];

            if (currentIndex === IndexOfReturns.NO_VALUE_FOUND) {
                newChecked.push(value);
            } else {
                newChecked.splice(currentIndex, 1);
            }

            setChecked(newChecked);
        };
    };

    return (
        <List className={className}>
            {checklistItems.map((value: any) => {
                return (
                    <ListItem
                        key={value}
                        secondaryAction={
                            <IconButton edge="end">
                                <MessageIcon />
                            </IconButton>
                        }
                        disablePadding
                    >
                        <ListItemButton onClick={handleToggle(value)} dense>
                            <Checkbox
                                edge="start"
                                checked={
                                    checked.indexOf(value) !==
                                    IndexOfReturns.NO_VALUE_FOUND
                                }
                                tabIndex={-1}
                            />
                            <ListItemText primary={value} />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}
