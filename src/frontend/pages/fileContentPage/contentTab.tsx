import { useEffect, useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Paper,
  styled,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ContentData {
  data: unknown[];
}

interface ContentNode {
  id: string;
  type: string;
  value: string;
  data: ContentData[];
  text: string;
  children: ContentNode[];
  language: string;
  indent: number;
  listStart: number;
  parent: string[];
  listStyleType: string;
}

interface NavigationProps {
  content: ContentNode[];
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

interface HierarchyItem {
  text: string;
  children: { [key: string]: HierarchyItem };
  level: number;
  nodeId: string;
}

type Hierarchy = { [key: string]: HierarchyItem };

const NavigationWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  left: theme.spacing(2.5),
  top: theme.spacing(10),
  zIndex: theme.zIndex.drawer,
  transition: theme.transitions.create(['transform', 'opacity'], {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeInOut,
  }),
  width: 280,
}));

const FloatingCard = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  backdropFilter: 'blur(8px)',
  backgroundColor: alpha(
    theme.palette.background.paper,
    theme.palette.mode === 'dark' ? 0.85 : 0.95
  ),
  '& ::-webkit-scrollbar': { display: 'none' },
  '-ms-overflow-style': 'none',
  'scrollbarWidth': 'none',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 'unset',
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(0.25),
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 32,
  padding: theme.spacing(0.5, 1),
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
  alignItems: 'flex-start',
  textAlign: 'left',
  width: '100%',
  maxWidth: 'none',
  justifyContent: 'flex-start',
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(['background-color', 'color'], {
    duration: theme.transitions.duration.shortest,
  }),
  '&.Mui-selected': {
    color: theme.palette.mode === 'dark'
      ? theme.palette.grey[100]
      : theme.palette.grey[900],
    backgroundColor: alpha(theme.palette.action.selected, 0.08),
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&:hover:not(.Mui-selected)': {
    backgroundColor: alpha(theme.palette.action.hover, 0.04),
    color: theme.palette.text.primary,
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
  padding: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  backgroundColor: 'transparent',
  transition: theme.transitions.create(['background-color', 'color'], {
    duration: theme.transitions.duration.shortest,
  }),
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.1),
    color: theme.palette.text.primary,
  },
  zIndex: 1,
}));

const MainContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen?: boolean }>(({ theme, isOpen }) => ({
  transition: theme.transitions.create('margin', {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeInOut,
  }),
  marginLeft: isOpen ? '320px' : 0,
  width: isOpen ? 'calc(100% - 320px)' : '100%',
}));

const getHeaderLevel = (type: string): number => {
  const match = type.match(/h(\d)/i);
  return match ? parseInt(match[1]) : 0;
};

const getTabStyle = (level: number, theme: any) => ({
  paddingLeft: theme.spacing(1.5 + level * 1.5),
  fontSize: {
    1: '0.95rem',
    2: '0.9rem',
    3: '0.85rem',
    4: '0.8rem'
  }[level] || '0.9rem',
  fontWeight: {
    1: 500,
    2: 450,
    3: 400,
    4: 400
  }[level] || 400,
  color: level === 1
    ? theme.palette.text.primary
    : theme.palette.text.secondary,
  opacity: {
    1: 1,
    2: 0.95,
    3: 0.9,
    4: 0.85
  }[level] || 1,
  marginTop: level === 1 ? theme.spacing(1) : 0,
});

const createHierarchy = (content: ContentNode[]): Hierarchy => {
  const hierarchy: Hierarchy = {};
  let currentLevels: { [key: number]: string } = {};
  content?.forEach((node) => {
    if (node.type?.toLowerCase().startsWith('h')) {
      const level = getHeaderLevel(node.type);
      if (level < 1 || level > 4) return;

      const text = node.children?.[0]?.text || '';
      const item = {
        text,
        children: {},
        level,
        nodeId: node.id
      };

      if (level === 1) {
        hierarchy[node.id] = item;
        currentLevels = { 1: node.id };
        return;
      }

      let parentLevel = level - 1;
      while (parentLevel > 0 && !currentLevels[parentLevel]) {
        parentLevel--;
      }

      if (parentLevel === 0) {
        hierarchy[node.id] = item;
      } else {
        let current = hierarchy;
        for (let i = 1; i <= parentLevel; i++) {
          if (currentLevels[i]) {
            if (i === parentLevel) {
              current[currentLevels[i]].children[node.id] = item;
            } else {
              current = current[currentLevels[i]].children;
            }
          }
        }
      }

      currentLevels[level] = node.id;
      for (let i = level + 1; i <= 4; i++) {
        delete currentLevels[i];
      }
    }
  });

  return hierarchy;
};

const NavigationMenu = ({
  content,
  open,
  onClose,
  children,
}: NavigationProps) => {
  const theme = useTheme();
  const [value, setValue] = useState<string>('');
  const [hierarchy, setHierarchy] = useState<Hierarchy>({});

  useEffect(() => {
    const organized = createHierarchy(content);
    setHierarchy(organized);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const id = element.getAttribute('data-key');
            if (id) setValue(id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px',
        threshold: 0,
      }
    );

    const headers = document.querySelectorAll(
      '#editor-playground h1, #editor-playground h2, #editor-playground h3, #editor-playground h4'
    );
    headers.forEach(header => observer.observe(header));

    return () => observer.disconnect();
  }, [content]);

  const scrollToSection = (nodeId: string) => {
    const targetElement = document.querySelector(`[data-key="${nodeId}"]`);
    if (!targetElement) return;

    const headerElement = targetElement.closest('h1, h2, h3, h4');
    if (!headerElement) return;

    const elementPosition = headerElement.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: elementPosition - 100,
      behavior: 'smooth',
    });

    setValue(nodeId);

    headerElement.style.transition = theme.transitions.create('background-color');
    headerElement.style.backgroundColor = alpha(theme.palette.primary.main, 0.08);
    setTimeout(() => {
      headerElement.style.backgroundColor = 'transparent';
    }, theme.transitions.duration.standard);
  };

  const renderTabsRecursively = (items: Hierarchy) => {
    return Object.entries(items).map(([id, item]) => (
      <>
        <StyledTab
          key={id}
          value={item.nodeId}
          label={item.text}
          sx={getTabStyle(item.level, theme)}
        />
        {Object.keys(item.children).length > 0 &&
          renderTabsRecursively(item.children)}
      </>
    ));
  };

  return (
    <>
      <NavigationWrapper
        sx={{
          transform: open ? 'translateX(0)' : 'translateX(-300px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <FloatingCard>
          <CloseButton
            onClick={onClose}
            size="small"
            aria-label="close navigation"
          >
            <CloseIcon fontSize="small" />
          </CloseButton>
          <Box
            sx={{
              height: 'calc(100vh - 100px)',
              overflow: 'auto',
              padding: theme.spacing(1),
              paddingTop: theme.spacing(6),
            }}
          >
            <StyledTabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={(_, newValue) => scrollToSection(newValue)}
              scrollButtons={false}
            >
              {renderTabsRecursively(hierarchy)}
            </StyledTabs>
          </Box>
        </FloatingCard>
      </NavigationWrapper>
      <MainContent isOpen={open}>
        {children}
      </MainContent>
    </>
  );
};

export default NavigationMenu;
