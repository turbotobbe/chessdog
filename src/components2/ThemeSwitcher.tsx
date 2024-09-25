import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useColorScheme } from '@mui/material/styles';

function ThemeSwitcher() {
  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }
  return (
      <Select
        value={mode}
        onChange={(event) =>
          setMode(event.target.value as 'system' | 'light' | 'dark')
        }
      >
        <MenuItem value="system">System</MenuItem>
        <MenuItem value="light">Light</MenuItem>
        <MenuItem value="dark">Dark</MenuItem>
      </Select>
  );
}

export default ThemeSwitcher;