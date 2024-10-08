/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import DevelopmentTable from "views/admin/team/components/DevelopmentTable";
import TeamTable from "views/admin/team/components/TeamTable";
import ColumnsTable from "views/admin/team/components/ColumnsTable";
import AppraiserTable from "views/admin/team/components/AppraiserTable";
import PhotographerTable from "views/admin/team/components/PhotographerTable";
import {
  columnsDataDevelopment,
  columnsDataColumns,
  columnsDataComplex,
} from "views/admin/team/variables/columnsData";
import tableDataDevelopment from "views/admin/team/variables/tableDataDevelopment.json";
import tableDataCheck from "views/admin/team/variables/tableDataCheck.json";
import photographerData from "views/admin/team/variables/photographerData.json";
import tableDataComplex from "views/admin/team/variables/tableDataComplex.json";
import React from "react";

export default function Settings() {
  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <TeamTable tableData={tableDataCheck} />
        </SimpleGrid>
        <SimpleGrid
          mb='20px'
          columns={{ sm: 1, md: 2 }}
          spacing={{ base: "20px", xl: "20px" }}>
          <AppraiserTable
            tableData={tableDataComplex}
          />
          <PhotographerTable
            tableData={photographerData}
          />
          {/* <ColumnsTable
            columnsData={columnsDataColumns}
            tableData={tableDataColumns} */}
          
        </SimpleGrid>
      
    </Box>
  );
}
