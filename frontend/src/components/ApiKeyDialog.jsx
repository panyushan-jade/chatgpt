import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Typography,
  Box,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useChat } from '../context/ChatContext';

const ApiKeyDialog = () => {
  const { apiKey, isApiKeyDialogOpen, updateApiKey, toggleApiKeyDialog } = useChat();
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  
  // 当对话框打开或apiKey变化时更新输入值
  useEffect(() => {
    if (isApiKeyDialogOpen) {
      setInputKey(apiKey);
    }
  }, [isApiKeyDialogOpen, apiKey]);
  
  const handleClose = () => {
    toggleApiKeyDialog(false);
  };
  
  const handleSave = () => {
    updateApiKey(inputKey.trim());
  };

  const handleToggleKeyVisibility = () => {
    setShowKey(!showKey);
  };
  
  return (
    <Dialog open={isApiKeyDialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>设置 API Key</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            请输入您的 OpenAI API Key 或 OpenRouter API Key，用于调用聊天服务。
          </Typography>
          <TextField
            label="API Key"
            fullWidth
            variant="outlined"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            type={showKey ? 'text' : 'password'}
            placeholder="输入您的 API Key"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleToggleKeyVisibility}
                    edge="end"
                  >
                    {showKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            您的 API Key 将只保存在您的浏览器本地，不会发送到我们的服务器。
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">取消</Button>
        <Button 
          onClick={handleSave} 
          color="primary" 
          variant="contained"
          disabled={!inputKey.trim()}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApiKeyDialog; 