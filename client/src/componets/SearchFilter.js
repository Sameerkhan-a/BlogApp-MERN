import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Chip,
  Typography,
  Autocomplete,
  Paper,
  InputAdornment,
  IconButton,
  Collapse,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { blogAPI } from '../utils/api';

const SearchFilter = ({ onSearch, onFilter, initialFilters = {} }) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  const [selectedTags, setSelectedTags] = useState(initialFilters.tags || []);
  const [availableTags, setAvailableTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await blogAPI.getAllTags();
        const tagData = response.data.tagCounts || [];
        setAvailableTags(tagData.map(item => ({ 
          name: item._id, 
          count: item.count 
        })));
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleSearch = () => {
    const filters = {
      search: searchTerm.trim(),
      tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined
    };
    
    onSearch(filters);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTagChange = (event, newTags) => {
    setSelectedTags(newTags);
    
    // Auto-apply filter when tags change
    const filters = {
      search: searchTerm.trim(),
      tags: newTags.length > 0 ? newTags.join(',') : undefined
    };
    onFilter(filters);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    onSearch({ search: '', tags: undefined });
  };

  const hasActiveFilters = searchTerm.trim() || selectedTags.length > 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        mb: 4,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        backgroundImage: (theme) =>
          theme.palette.mode === 'light'
            ? 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
            : 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)',
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: 'primary.main',
          mb: 3,
          fontSize: { xs: '1.1rem', md: '1.25rem' }
        }}
      >
        🔍 Find Your Perfect Read
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search blogs by title, content, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchTerm('')}
                  edge="end"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
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
          }}
        />
        
        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
          sx={{ minWidth: 'auto', px: 3 }}
        >
          Search
        </Button>
        
        <Button
          variant="outlined"
          onClick={() => setShowFilters(!showFilters)}
          startIcon={<FilterIcon />}
          endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ minWidth: 'auto' }}
        >
          Filters
        </Button>
      </Box>

      <Collapse in={showFilters}>
        <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
            Filter by Tags
          </Typography>
          
          <Autocomplete
            multiple
            options={availableTags.map(tag => tag.name)}
            value={selectedTags}
            onChange={handleTagChange}
            loading={loading}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  variant="filled"
                  label={option}
                  size="small"
                  color="primary"
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderOption={(props, option) => {
              const tagData = availableTags.find(tag => tag.name === option);
              return (
                <li {...props}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>{option}</span>
                    <Chip 
                      label={tagData?.count || 0} 
                      size="small" 
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select tags to filter..."
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
                }}
              />
            )}
            PaperComponent={({ children, ...props }) => (
              <Paper
                {...props}
                sx={{
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {children}
              </Paper>
            )}
            sx={{ mb: 2 }}
          />
          
          {hasActiveFilters && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="text"
                onClick={clearFilters}
                startIcon={<ClearIcon />}
                size="small"
              >
                Clear All Filters
              </Button>
            </Box>
          )}
        </Box>
      </Collapse>
      
      {hasActiveFilters && (
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            Active filters:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            {searchTerm.trim() && (
              <Chip
                label={`Search: "${searchTerm}"`}
                size="small"
                variant="outlined"
                onDelete={() => setSearchTerm('')}
              />
            )}
            {selectedTags.map((tag) => (
              <Chip
                key={tag}
                label={`Tag: ${tag}`}
                size="small"
                variant="outlined"
                onDelete={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default SearchFilter;
