import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      className="footer"
      sx={{
        textAlign: 'center',
        padding: '10px',
        color: 'text.secondary',
        fontSize: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)'
      }}
    >
      <Typography variant="caption" color="inherit">
        内容由 AI 生成，请谨慎甄别
      </Typography>
    </Box>
  );
};

export default Footer; 