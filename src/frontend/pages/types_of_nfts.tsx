import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme } from '@mui/material';

const MyTable = ({ data }) => {
  const theme = useTheme();
  const isDarkMode = document.querySelector('body').classList.contains('dark');

  const tableStyle = {
    backgroundColor: isDarkMode ? theme.palette.background.default : theme.palette.background.paper,
    color: isDarkMode ? theme.palette.text.primary : theme.palette.text.secondary,
  };

  const headerCellStyle = {
    backgroundColor: isDarkMode ? theme.palette.background.paper : theme.palette.background.default,
    color: isDarkMode ? theme.palette.text.secondary : theme.palette.text.primary,
    fontWeight: 'bold', // Added to make the heading more distinguished
  };

  return (
    <TableContainer component={Paper} style={tableStyle}>
      <Table>
        <TableHead>
          <TableRow>
            {data.columns.map((column, index) => (
              <TableCell key={index} style={headerCellStyle}>
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell style={tableStyle}>{row.category}</TableCell>
              <TableCell style={tableStyle}>{row.definition}</TableCell>
              <TableCell style={tableStyle}>{row.purpose}</TableCell>
              <TableCell style={tableStyle}>{row.architecture}</TableCell>
              <TableCell style={tableStyle}>{row.features}</TableCell>
              <TableCell style={tableStyle}>{row.examples}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const NFTComparisonTable = () => {
  const data = {
    columns: ['Category', 'Definition', 'Purpose', 'Architecture', 'Features', 'Examples'],
    rows: [
      {
        category: 'ERC (Ethereum Request for Comments)',
        definition: 'Technical specifications for Ethereum-related standards and protocols',
        purpose: 'Establish guidelines and standards for various Ethereum-related aspects',
        architecture: 'ERC-20: Token contract interface for fungible tokens',
        features: 'Defines standard methods and events for interacting with tokens',
        examples: 'ERC-20: DAI, USDC, UNI',
      },
      {
        category: 'EIP (Ethereum Improvement Proposal)',
        definition: 'Proposals to improve the Ethereum platform',
        purpose: 'Propose and discuss improvements and changes to the Ethereum platform and ecosystem',
        architecture: 'EIP: General Ethereum improvement proposals',
        features: 'Proposals for technical changes and improvements to the Ethereum protocol',
        examples: 'EIP: EIP-1559, EIP-721',
      },
      {
        category: 'ERC-721 (Non-Fungible Token)',
        definition: 'A standard for non-fungible tokens (unique digital assets)',
        purpose: 'Define a standard for representing and managing non-fungible tokens',
        architecture: 'ERC-721: Token contract interface for non-fungible tokens',
        features: 'Supports ownership, transferability, and metadata of unique digital assets',
        examples: 'ERC-721: CryptoKitties, Decentraland',
      },
    ],
  };

  return (
    <div>
      <MyTable data={data} />
    </div>
  );
};

export default NFTComparisonTable;
