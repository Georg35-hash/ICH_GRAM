import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function ThemeSwitcher({ toggleTheme, mode }: undefined) {
  return (
    <div style={{ padding: '0 20px 3px 0' }}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          transition: 'transform 0.6s ease, background-color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '50%',
          backgroundColor: mode === 'dark' ? '#444' : '#f9f9f9',
          '&:hover': {
            backgroundColor: mode === 'dark' ? '#555' : '#e0e0e0',
          },
          transform: mode === 'dark' ? 'rotate(0deg)' : 'rotate(180deg)',
        }}
      >
        {mode === 'dark' ? (
          <Brightness4Icon sx={{ color: '#fbc02d', fontSize: 36 }} />
        ) : (
          <Brightness7Icon sx={{ color: '#ff9800', fontSize: 36 }} />
        )}
      </IconButton>
    </div>
  );
}
