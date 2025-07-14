// src/App.jsx 
import React from "react"; 
import { 
  Routes, 
  Route, 
  Navigate, 
} from "react-router-dom"; 
import Navbar from "./components/Navbar"; 
import PublicationListPage from "./components/PublicationListPage"; 
import AddPublicationPage from "./components/AddPublicationPage"; 
import Footer from "./components/Footer"; 
import LoginPage from "./components/LoginPage"; 
import EditPublicationPage from "./components/EditPublicationPage"; 
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() { 
  return ( 
    <div className="bg-gray-100 min-h-screen font-sans"> 
      <Navbar /> 
      <main className="p-4 sm:p-6 lg:p-8"> 
        <Routes> 
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/publications" element={<PublicationListPage />} />

          {/* Protected Routes */}
          <Route
            path="/publications/add"
            element={
              <ProtectedRoute>
                <AddPublicationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/publications/edit/:id"
            element={
              <ProtectedRoute>
                <EditPublicationPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect Routes */}
          <Route path="/" element={<Navigate to="/publications" replace />} />
          <Route path="*" element={<Navigate to="/publications" replace />} />
        </Routes> 
      </main> 
      <Footer /> 
    </div> 
  ); 
} 