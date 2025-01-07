import React, { useState } from 'react';
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Timer as TimerIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Interfaces
interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected' | 'expired';
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  timeRemaining: string;
  type: 'feature' | 'governance' | 'treasury' | 'parameter';
  dateCreated: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Mock data
const mockProposals: Proposal[] = [
  {
    id: 'PROP-001',
    title: 'Implement Real-time Collaboration Features',
    description: 'Add real-time document editing and collaboration tools to enhance platform functionality.',
    proposer: '0x1234...5678',
    status: 'active',
    votesFor: 750000,
    votesAgainst: 250000,
    totalVotes: 1000000,
    timeRemaining: '2d 14h',
    type: 'feature',
    dateCreated: '2025-01-03'
  },
  {
    id: 'PROP-002',
    title: 'Adjust Minimum Proposal Threshold',
    description: 'Reduce minimum token requirement for creating proposals from 10,000 to 5,000 ODOC.',
    proposer: '0x8765...4321',
    status: 'passed',
    votesFor: 800000,
    votesAgainst: 100000,
    totalVotes: 900000,
    timeRemaining: '0d 0h',
    type: 'governance',
    dateCreated: '2025-01-01'
  },
  {
    id: 'PROP-003',
    title: 'Allocate Treasury Funds for Marketing',
    description: 'Allocate 100,000 ODOC for Q1 2025 marketing initiatives.',
    proposer: '0x2468...1357',
    status: 'active',
    votesFor: 400000,
    votesAgainst: 300000,
    totalVotes: 700000,
    timeRemaining: '3d 8h',
    type: 'treasury',
    dateCreated: '2025-01-04'
  }
];

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const SNSVoting: React.FC = () => {
  // Ensure the component is rendered relative to its container
  React.useEffect(() => {
    document.body.style.position = 'relative';
    return () => {
      document.body.style.position = '';
    };
  }, []);
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [openNewProposal, setOpenNewProposal] = useState(false);
  const [proposalType, setProposalType] = useState('feature');
  const [proposals] = useState<Proposal[]>(mockProposals);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'passed':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const calculateProgress = (votesFor: number, totalVotes: number) => {
    return (votesFor / totalVotes) * 100;
  };

  const ProposalCard: React.FC<{ proposal: Proposal }> = ({ proposal }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{proposal.title}</Typography>
              <Chip
                label={proposal.status.toUpperCase()}
                color={getStatusColor(proposal.status)}
                size="small"
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              {proposal.description}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">
                  For: {proposal.votesFor.toLocaleString()} ODOC
                </Typography>
                <Typography variant="body2">
                  Against: {proposal.votesAgainst.toLocaleString()} ODOC
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={calculateProgress(proposal.votesFor, proposal.totalVotes)}
                sx={{ height: 8, }}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={proposal.type}
                  size="small"
                  variant="outlined"
                />
                <Typography variant="body2" color="text.secondary">
                  ID: {proposal.id}
                </Typography>
              </Box>
              {proposal.status === 'active' && (
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    startIcon={<ThumbUpIcon />}
                  >
                    Vote For
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<ThumbDownIcon />}
                  >
                    Vote Against
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Proposer: {proposal.proposer}
              </Typography>
              {proposal.status === 'active' && (
                <Box display="flex" alignItems="center" gap={1}>
                  <TimerIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {proposal.timeRemaining} remaining
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Blurred Overlay */}
      <Paper
        elevation={3}
        sx={(theme) => ({
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: theme.zIndex.modal,
          backdropFilter: 'blur(8px)',
          backgroundColor: alpha(theme.palette.background.paper, 0.9),
          padding: theme.spacing(4),
          textAlign: 'center',
          // borderRadius: theme.shape.borderRadius,
          maxWidth: '90%',
          width: '400px',
          border: `1px solid ${theme.palette.divider}`
        })}
      >
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={(theme) => ({
            color: theme.palette.text.primary,
            fontWeight: theme.typography.fontWeightMedium
          })}
        >
          Feature Not Available
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={(theme) => ({
            color: theme.palette.text.secondary,
            maxWidth: '80%',
            margin: '0 auto'
          })}
        >
          SNS voting functionality will be available few months later.
        </Typography>
        {/*<Button*/}
        {/*  variant="outlined"*/}
        {/*  sx={(theme) => ({*/}
        {/*    marginTop: theme.spacing(2),*/}
        {/*    color: theme.palette.primary.main,*/}
        {/*    borderColor: theme.palette.primary.main,*/}
        {/*    '&:hover': {*/}
        {/*      backgroundColor: alpha(theme.palette.primary.main, 0.04)*/}
        {/*    }*/}
        {/*  })}*/}
        {/*>*/}
        {/*  Learn More*/}
        {/*</Button>*/}
      </Paper>

      <Paper sx={(theme) => ({
        p: theme.spacing(3),
        position: 'relative',
        filter: 'blur(4px)',
        pointerEvents: 'none',  // Disable interactions with the blurred content
        backgroundColor: theme.palette.background.paper,
        // borderRadius: theme.shape.borderRadius
      })}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">SNS Voting</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenNewProposal(true)}
          >
            New Proposal
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Active Proposals" />
            <Tab label="Passed" />
            <Tab label="Rejected" />
            <Tab label="My Votes" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {proposals
            .filter(p => p.status === 'active')
            .map(proposal => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {proposals
            .filter(p => p.status === 'passed')
            .map(proposal => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {proposals
            .filter(p => p.status === 'rejected')
            .map(proposal => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="body1" color="text.secondary">
            Your voting history will appear here
          </Typography>
        </TabPanel>
      </Paper>

      {/* New Proposal Dialog */}
      <Dialog
        open={openNewProposal}
        onClose={() => setOpenNewProposal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Proposal</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Proposal Type</InputLabel>
                  <Select
                    value={proposalType}
                    label="Proposal Type"
                    onChange={(e) => setProposalType(e.target.value)}
                  >
                    <MenuItem value="feature">Feature Request</MenuItem>
                    <MenuItem value="governance">Governance Change</MenuItem>
                    <MenuItem value="treasury">Treasury Allocation</MenuItem>
                    <MenuItem value="parameter">Parameter Change</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Cost to submit proposal: 10,000 ODOC
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewProposal(false)}>Cancel</Button>
          <Button variant="contained">Submit Proposal</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SNSVoting;
