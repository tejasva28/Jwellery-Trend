// File: src/components/DisbursedTable.js

/* eslint-disable */

import React from 'react';
import {
  Box,
  Flex,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
  Badge,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';

const columnHelper = createColumnHelper();

export default function DisbursedTable({ tableData, desiredAttributes }) {
  const navigate = useNavigate();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const primaryColor = useColorModeValue('blue', 'blue'); // Adjust based on your theme

  // Define columns based on desiredAttributes
  const columns = React.useMemo(() => {
    const cols = [];

    if (desiredAttributes.includes('customerName')) {
      cols.push(
        columnHelper.accessor('customerName', {
          id: 'customerName',
          header: () => (
            <Text
              justifyContent="space-between"
              align="center"
              fontSize={{ sm: '10px', lg: '12px' }}
              color="gray.400"
            >
              Customer Name
            </Text>
          ),
          cell: (info) => (
            <Flex align="center">
              <Text color={textColor} fontSize="sm" fontWeight="700">
                {info.getValue()}
              </Text>
            </Flex>
          ),
        })
      );
    }

    if (desiredAttributes.includes('id')) {
      cols.push(
        columnHelper.accessor('id', {
          id: 'id',
          header: () => (
            <Text
              justifyContent="space-between"
              align="center"
              fontSize={{ sm: '10px', lg: '12px' }}
              color="gray.400"
            >
              ID
            </Text>
          ),
          cell: (info) => (
            <Flex align="center">
              <Text color={textColor} fontSize="sm" fontWeight="700">
                {info.getValue()}
              </Text>
            </Flex>
          ),
        })
      );
    }

    if (desiredAttributes.includes('phoneNumber')) {
      cols.push(
        columnHelper.accessor('phoneNumber', {
          id: 'phoneNumber',
          header: () => (
            <Text
              justifyContent="space-between"
              align="center"
              fontSize={{ sm: '10px', lg: '12px' }}
              color="gray.400"
            >
              Phone Number
            </Text>
          ),
          cell: (info) => (
            <Text color={textColor} fontSize="sm" fontWeight="700">
              {info.getValue()}
            </Text>
          ),
        })
      );
    }

    if (desiredAttributes.includes('purchasedProduct')) {
      cols.push(
        columnHelper.accessor('purchasedProduct', {
          id: 'purchasedProduct',
          header: () => (
            <Text
              justifyContent="space-between"
              align="center"
              fontSize={{ sm: '10px', lg: '12px' }}
              color="gray.400"
            >
              Purchased Product
            </Text>
          ),
          cell: (info) => (
            <Text color={textColor} fontSize="sm" fontWeight="700">
              {info.getValue()}
            </Text>
          ),
        })
      );
    }

    // Actions Column
    cols.push(
      columnHelper.display({
        id: 'viewDetails',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
          >
            Actions
          </Text>
        ),
        cell: ({ row }) => (
          <Button
            leftIcon={<MdVisibility />}
            colorScheme={primaryColor}
            variant="outline"
            size="sm"
            onClick={() => navigate(`/disbursed-details/${row.original.id}`)}
          >
            View Details
          </Button>
        ),
      })
    );

    return cols;
  }, [desiredAttributes, navigate, textColor, primaryColor]);

  const data = React.useMemo(() => [...tableData], [tableData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Disbursed Insurance
        </Text>
        <Menu />
      </Flex>
      <Box>
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      pe="10px"
                      borderColor={borderColor}
                      cursor="pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Flex
                        justifyContent="space-between"
                        align="center"
                        fontSize={{ sm: '10px', lg: '12px' }}
                        color="gray.400"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: '↑',
                          desc: '↓',
                        }[header.column.getIsSorted()] ?? null}
                      </Flex>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td
                        key={cell.id}
                        fontSize={{ sm: '14px' }}
                        minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                        borderColor="transparent"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}
