import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";

export type StateElProps = {
    onChange: (alignment: 'explore' | 'practice') => void;
}

export default function StateEl({ onChange }: StateElProps) {
    const [alignment, setAlignment] = useState<'explore' | 'practice'>('explore');

    const handleOnChange = (
        _event: React.MouseEvent<HTMLElement>,
        newAlignment: 'explore' | 'practice') => {

        if (newAlignment !== null && newAlignment !== alignment) {
            setAlignment(newAlignment);
            onChange(newAlignment);
        }
    }

    return (
        <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleOnChange}
            aria-label="Platform"
        >
            <ToggleButton value="explore">Explore</ToggleButton>
            <ToggleButton value="practice">Practice</ToggleButton>
        </ToggleButtonGroup>
    )
}