import React from 'react';
import { Link as MuiLink, Breadcrumbs, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Use the MUI Link component with RouterLink behavior
const LinkBehavior = React.forwardRef<any, Omit<RouterLink, 'to'> & { href: RouterLink['to'] }>(
  (props, ref) => <RouterLink ref={ref} to={props.href} {...props} />,
);

const BreadPage: React.FC = () => {
  const { files } = useSelector((state: any) => state.filesReducer);
  const location = useLocation();
  const pathNames = location.pathname.split('/').filter(Boolean).map(id => files[id]?.name);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <MuiLink component={LinkBehavior} underline="hover" color="inherit" href="/">
        Home
      </MuiLink>
      {pathNames.map((name, index) => {
        const to = `/${pathNames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathNames.length - 1;
        const displayName = name ? name.replaceAll("_", " ") : ''; // Add null check
        return isLast ? (
          <Typography key={to}>{displayName}</Typography>
        ) : (
          <MuiLink component={LinkBehavior} underline="hover" color="inherit" href={to} key={to}>
            {displayName}
          </MuiLink>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadPage;
