// // src/App.jsx 
// import React from "react"; 
// import { 
//   Routes, 
//   Route, 
//   Navigate, 
// } from "react-router-dom"; 
// import Navbar from "./components/Navbar"; 
// import PublicationListPage from "./components/PublicationListPage"; 
// import AddPublicationPage from "./components/AddPublicationPage"; 
// import Footer from "./components/Footer"; 
// import LoginPage from "./components/LoginPage"; 
// import EditPublicationPage from "./components/EditPublicationPage"; 
// import ProtectedRoute from "./components/ProtectedRoute";

// export default function App() { 
//   return ( 
//     <div className="bg-gray-100 min-h-screen font-sans"> 
//       <Navbar /> 
//       <main className="p-4 sm:p-6 lg:p-8"> 
//         <Routes> 
//           {/* Public Routes */}
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/publications" element={<PublicationListPage />} />

//           {/* Protected Routes */}
//           <Route
//             path="/publications/add"
//             element={
//               <ProtectedRoute>
//                 <AddPublicationPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/publications/edit/:id"
//             element={
//               <ProtectedRoute>
//                 <EditPublicationPage />
//               </ProtectedRoute>
//             }
//           />

//           {/* Redirect Routes */}
//           <Route path="/" element={<Navigate to="/publications" replace />} />
//           <Route path="*" element={<Navigate to="/publications" replace />} />
//         </Routes> 
//       </main> 
//       <Footer /> 
//     </div> 
//   ); 
// } 

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import semua komponen Anda
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from './pages/LoginPage'; // Asumsi di folder pages
import PublicationListPage from './pages/PublicationListPage';
import AddPublicationPage from './components/AddPublicationPage';
import EditPublicationPage from './pages/EditPublicationPage';

/**
 * Komponen ProtectedRoute.
 * Fungsinya untuk melindungi sebuah halaman agar hanya bisa diakses
 * oleh pengguna yang sudah login (memiliki token).
 */
const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    if (!token) {
        // Jika tidak ada token, "lempar" pengguna kembali ke halaman login.
        return <Navigate to="/login" replace />;
    }
    // Jika ada token, tampilkan halaman yang diminta.
    return children;
};

/**
 * Komponen utama aplikasi yang mengatur semua rute.
 */
function App() {
    return (
        // 1. BrowserRouter harus membungkus semuanya
        <BrowserRouter>
            {/* 2. AuthProvider harus membungkus semua yang butuh data login */}
            <AuthProvider>
                <div className="bg-gray-100 min-h-screen font-sans flex flex-col">
                    <Navbar />
                    <main className="flex-grow p-4 sm:p-6 lg:p-8">
                        <Routes>
                            {/* Rute Publik: /login bisa diakses siapa saja */}
                            <Route path="/login" element={<LoginPage />} />

                            {/* Rute yang Dilindungi: Dibungkus dengan <ProtectedRoute> */}
                            <Route 
                                path="/publications" 
                                element={
                                    <ProtectedRoute>
                                        <PublicationListPage />
                                    </ProtectedRoute>
                                } 
                            />
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

                            {/* Rute Default: Jika pengguna membuka alamat utama ('/'),
                                arahkan ke daftar publikasi. */}
                            <Route 
                                path="/" 
                                element={
                                    <ProtectedRoute>
                                        <Navigate to="/publications" replace />
                                    </ProtectedRoute>
                                } 
                            />
                             {/* Rute Catch-all untuk halaman yang tidak ditemukan */}
                            <Route path="*" element={<Navigate to="/publications" replace />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
