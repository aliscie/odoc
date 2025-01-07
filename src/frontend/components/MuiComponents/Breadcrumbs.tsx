import React, { useMemo } from 'react';
import { Breadcrumbs, Typography } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import {FileNode} from "../../../declarations/backend/backend.did";

// Strong typing for file structure

interface FilesState {
  files: FileNode[];
  current_file: FileNode | null;
}

// Styled components
const StyledLink = styled(RouterLink)`
  color: inherit;
  text-decoration: none;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Constants
const MAX_TEXT_LENGTH = 15;
const MAX_BREADCRUMBS = 8;
const ITEMS_AFTER_COLLAPSE = 3;

const BreadcrumbNavigation: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { files, current_file } = useSelector<any, FilesState>((state) => state.filesState);

  // Extract current ID from path
  const currentId = useMemo(() =>
    location.pathname.split('/').filter(Boolean).pop() || '',
    [location.pathname]
  );

  // Build breadcrumb path
  const buildPath = (id: string): FileNode[] => {
    const path: FileNode[] = [];
    let currentFileId = id;

    while (currentFileId) {
      const file = files?.find(f => f.id === currentFileId);
      if (!file) break;

      path.unshift(file);
      currentFileId = file.parent?.[0] ?? '';
    }

    return path;
  };

  // Memoized breadcrumb items
  const breadcrumbItems = useMemo(() =>
    currentId && files?.length ? buildPath(currentId) : [],
    [currentId, files]
  );

  // Event handlers
  const handleFileClick = (file: FileNode) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(file.id);
    dispatch({ type: 'CURRENT_FILE', payload: { file } });
  };

  const handleHomeClick = () => {
    dispatch({ type: 'CURRENT_FILE', payload: { file: null } });
  };

  // Render breadcrumb items
  const renderBreadcrumbItem = (item: FileNode, index: number) => {
    const isLast = index === breadcrumbItems.length - 1;
    const displayName = item.name.length > MAX_TEXT_LENGTH
      ? `${item.name.slice(0, MAX_TEXT_LENGTH)}...`
      : item.name;

    return isLast ? (
      <Typography
        key={item.id}
        noWrap
        sx={{ maxWidth: 200, color: 'text.primary' }}
      >
        {displayName}
      </Typography>
    ) : (
      <StyledLink
        key={item.id}
        to={`/${item.id}`}
        onClick={handleFileClick(item)}
      >
        {displayName}
      </StyledLink>
    );
  };

  return (
    <Breadcrumbs
      aria-label="navigation"
      maxItems={MAX_BREADCRUMBS}
      itemsAfterCollapse={ITEMS_AFTER_COLLAPSE}
    >
      <StyledLink to="/" onClick={handleHomeClick}>
        Home
      </StyledLink>
      {breadcrumbItems.map(renderBreadcrumbItem)}
    </Breadcrumbs>
  );
};

export default BreadcrumbNavigation;
