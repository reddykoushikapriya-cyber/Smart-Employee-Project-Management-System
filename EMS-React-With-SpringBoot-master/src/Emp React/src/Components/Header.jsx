import React from 'react'
import { IconButton, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../ThemeContext';

const Header = () => {
  const { mode, toggleColorMode } = useThemeContext();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
      <IconButton onClick={toggleColorMode} color="inherit">
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  )
}

export default Header
