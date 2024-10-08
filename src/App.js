import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import {} from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import RTLLayout from './layouts/rtl';
import {
  ChakraProvider,
  // extendTheme
} from '@chakra-ui/react';
import initialTheme from './theme/theme'; //  { themeGreen }
import { useState } from 'react';
import AppraisedDetails from './views/admin/products/AppraisedDetails';
import SellerDetails from 'views/admin/marketplace/sellerDetails';
import AppraiserDetails from './views/admin/team/AppraiserDetails';
import PhotographerDetails from './views/admin/team/PhotographerDetails';

// Chakra imports

export default function Main() {
  // eslint-disable-next-line
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="admin/*"
          element={
            <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />
       {/* Products route */}
       <Route
          path="products/*"
          element={
            <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />
        <Route
          path="rtl/*"
          element={
            <RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />
        <Route path="/appraised/:id" element={<AppraisedDetails />} />
        <Route path="/seller/:id"  element={<SellerDetails theme={currentTheme} setTheme={setCurrentTheme}/>} />
        <Route path="/appraiser/:id" element={<AppraiserDetails />} />
        <Route path="/photographer/:id" element={<PhotographerDetails />} />
        <Route path="/team*"
        element={<AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />} />

        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </ChakraProvider>
  );
}