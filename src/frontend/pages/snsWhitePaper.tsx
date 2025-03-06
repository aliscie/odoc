import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Typography,
  Link,
  Box,
  useTheme,
  Paper,
  List,
  ListItem,
  Divider,
  Tabs,
  Tab,
  AppBar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import whitepaperText from "./whitepaper.md";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`markdown-tabpanel-${index}`}
      aria-labelledby={`markdown-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MarkdownRenderer = () => {
  const theme = useTheme();
  const [markdownContent, setMarkdownContent] = React.useState("");
  const [currentTab, setCurrentTab] = React.useState(0);

  React.useEffect(() => {
    fetch(whitepaperText)
      .then((response) => response.text())
      .then((text) => {
        setMarkdownContent(text);
      });
  }, []);

  const sections = React.useMemo(() => {
    return markdownContent
      .split(/(?=^# )/gm)
      .filter((section) => section.trim());
  }, [markdownContent]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const components = {
    h1: ({ children }) => (
      <Typography variant="h1" gutterBottom>
        {children}
      </Typography>
    ),
    h2: ({ children }) => (
      <Typography variant="h2" gutterBottom>
        {children}
      </Typography>
    ),
    h3: ({ children }) => (
      <Typography variant="h3" gutterBottom>
        {children}
      </Typography>
    ),
    h4: ({ children }) => (
      <Typography variant="h4" gutterBottom>
        {children}
      </Typography>
    ),
    h5: ({ children }) => (
      <Typography variant="h5" gutterBottom>
        {children}
      </Typography>
    ),
    h6: ({ children }) => (
      <Typography variant="h6" gutterBottom>
        {children}
      </Typography>
    ),
    p: ({ children }) => (
      <Typography variant="body1" paragraph>
        {children}
      </Typography>
    ),
    a: ({ href, children }) => (
      <Link
        href={href}
        color="primary"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </Link>
    ),
    ul: ({ children }) => <List>{children}</List>,
    ol: ({ children }) => <List>{children}</List>,
    li: ({ children }) => (
      <ListItem>
        <Typography variant="body1">{children}</Typography>
      </ListItem>
    ),
    blockquote: ({ children }) => (
      <Box
        sx={{
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          pl: 2,
          my: 2,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="body1" sx={{ fontStyle: "italic" }}>
          {children}
        </Typography>
      </Box>
    ),
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <Paper elevation={2} sx={{ my: 2 }}>
          <SyntaxHighlighter
            style={tomorrow}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </Paper>
      ) : (
        <Typography
          component="code"
          sx={{
            backgroundColor: theme.palette.grey[100],
            padding: "2px 4px",
            borderRadius: 1,
            fontFamily: "monospace",
          }}
          {...props}
        >
          {children}
        </Typography>
      );
    },
    hr: () => <Divider sx={{ my: 2 }} />,

    // Table components - these were missing in your original code
    table: ({ children }) => (
      <TableContainer component={Paper} sx={{ my: 3, overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>{children}</Table>
      </TableContainer>
    ),
    thead: ({ children }) => <TableHead>{children}</TableHead>,
    tbody: ({ children }) => <TableBody>{children}</TableBody>,
    tr: ({ children }) => <TableRow>{children}</TableRow>,
    th: ({ children }) => (
      <TableCell
        sx={{
          fontWeight: 'bold',
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.contrastText
        }}
      >
        {children}
      </TableCell>
    ),
    td: ({ children }) => <TableCell>{children}</TableCell>,
  };

  const getSectionTitle = (section) => {
    const match = section.match(/^#\s+(.+)$/m);
    return match ? match[1] : "Untitled Section";
  };

  return (
    <Box
      sx={{
        width: "90wh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <AppBar
        position="static"
        color="default"
        sx={{ width: "100%", maxWidth: "900px" }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="markdown sections"
        >
          {sections.map((section, index) => (
            <Tab
              key={index}
              label={getSectionTitle(section)}
              id={`markdown-tab-${index}`}
              aria-controls={`markdown-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </AppBar>

      {sections.map((section, index) => (
        <TabPanel key={index} value={currentTab} index={index}>
          <Box
            sx={{
              maxWidth: "800px",
              margin: "0 auto",
              padding: theme.spacing(3),
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
              {section}
            </ReactMarkdown>
          </Box>
        </TabPanel>
      ))}
    </Box>
  );
};

export default MarkdownRenderer;
