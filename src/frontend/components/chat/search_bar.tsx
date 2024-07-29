import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar: React.FC = () => {
  return (
	<TextField
	  placeholder="Search"
	  variant="outlined"
	  size="small"
	  InputProps={{
		startAdornment: (
		  <InputAdornment position="start">
			<SearchIcon />
		  </InputAdornment>
		),
	  }}
	  style={{ margin: '0 10px' }}
	/>
  );
};

export default SearchBar;