import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  TextField,
  Typography,
  Autocomplete,
  Paper
} from '@mui/material';
import { blogAPI } from '../utils/api';

const TagInput = ({ tags = [], onChange, label = "Tags", maxTags = 10 }) => {
  const [inputValue, setInputValue] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available tags from API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await blogAPI.getAllTags();
        const tagData = response.data.tagCounts || [];
        setAvailableTags(tagData.map(item => item._id));
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleTagChange = (event, newTags) => {
    // Limit number of tags
    const limitedTags = newTags.slice(0, maxTags);
    onChange(limitedTags);
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault();
      const newTag = inputValue.trim().toLowerCase();
      
      // Check if tag already exists
      if (!tags.includes(newTag) && tags.length < maxTags) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
        {label}
      </Typography>
      
      <Autocomplete
        multiple
        freeSolo
        options={availableTags}
        value={tags}
        inputValue={inputValue}
        onChange={handleTagChange}
        onInputChange={handleInputChange}
        loading={loading}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              variant="outlined"
              label={option}
              size="small"
              color="primary"
              {...getTagProps({ index })}
              key={option}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={tags.length === 0 ? "Add tags (press Enter)" : ""}
            onKeyDown={handleKeyDown}
            helperText={`${tags.length}/${maxTags} tags. Press Enter to add custom tags.`}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.default',
                '& fieldset': {
                  borderColor: 'divider',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: 2,
                },
              },
              '& .MuiInputBase-input': {
                color: 'text.primary',
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'text.secondary',
                opacity: 0.7,
              },
              '& .MuiFormHelperText-root': {
                color: 'text.secondary',
              },
            }}
          />
        )}
        PaperComponent={({ children, ...props }) => (
          <Paper
            {...props}
            sx={{
              mt: 1,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {children}
          </Paper>
        )}
        sx={{
          '& .MuiOutlinedInput-root': {
            minHeight: '56px',
            alignItems: 'flex-start',
            paddingTop: '8px',
            paddingBottom: '8px'
          },
          '& .MuiChip-root': {
            backgroundColor: 'primary.light',
            color: 'primary.contrastText',
            '& .MuiChip-deleteIcon': {
              color: 'primary.contrastText',
              '&:hover': {
                color: 'error.main',
              },
            },
          },
        }}
      />
      
      {tags.length >= maxTags && (
        <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
          Maximum {maxTags} tags allowed
        </Typography>
      )}
    </Box>
  );
};

export default TagInput;
