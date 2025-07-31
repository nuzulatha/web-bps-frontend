// src/context/PublicationContext.jsx

import React, { createContext, useState, useEffect, useCallback } from 'react'; // Tambahkan useCallback
import { publicationService } from "../services/publicationService";
import { useAuth } from "../hooks/useAuth";

const PublicationContext = createContext(null);

export const PublicationProvider = ({ children }) => {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    // 1. Bungkus logika fetch data ke dalam useCallback
    // Ini agar kita bisa memanggilnya dari fungsi lain tanpa menyebabkan loop tak terbatas
    const fetchAllPublications = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const data = await publicationService.getPublications();
            setPublications(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]); // Dependensi tetap token

    // 2. Panggil fetchAllPublications saat komponen pertama kali dimuat
    useEffect(() => {
        fetchAllPublications();
    }, [fetchAllPublications]);


    const addPublication = async (publicationData) => {
        try {
            await publicationService.addPublication(publicationData);
            // 3. Panggil lagi untuk refresh data setelah berhasil menambah
            await fetchAllPublications(); 
        } catch (err) {
            throw err;
        }
    };

    const updatePublication = async (id, publicationData) => {
        try {
            await publicationService.updatePublication(id, publicationData);
            // 4. Panggil lagi untuk refresh data setelah berhasil meng-update
            await fetchAllPublications();
        } catch (err) {
            throw err;
        }
    };

    const deletePublication = async (id) => {
        try {
            await publicationService.deletePublication(id);
            // Untuk delete, lebih cepat memfilter langsung daripada refresh
            setPublications(prev => prev.filter(pub => pub.id !== id));
        } catch (err) {
            throw err;
        }
    };

    // Fungsi getPublicationById tidak perlu diubah
    const getPublicationById = async (id) => {
        try {
            return await publicationService.getPublicationById(id);
        } catch (err) {
            throw err;
        }
    };

    return (
        <PublicationContext.Provider
            value={{
                publications,
                loading,
                error,
                addPublication,
                getPublicationById,
                updatePublication,
                deletePublication,
            }}
        >
            {children}
        </PublicationContext.Provider>
    );
};

export { PublicationContext, PublicationProvider };


// // src/context/PublicationContext.jsx 

// import React, { createContext, useState, useEffect } from 'react';
// import { publicationService } from "../services/publicationService";
// import { useAuth } from "../hooks/useAuth";

// const PublicationContext = createContext(null);

// const PublicationProvider = ({ children }) => {
//     const [publications, setPublications] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { token } = useAuth();

//     useEffect(() => {
//         const fetchData = async () => {
//             if (!token) return;
//             setLoading(true);
//             try {
//                 const data = await publicationService.getPublications();
//                 setPublications(data);
//                 setError(null);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, [token]);

//     const addPublication = async (newPub) => {
//         try {
//             const added = await publicationService.addPublication(newPub);
//             setPublications((prev) => [added, ...prev]);
//             return added; // Kembalikan data yang ditambahkan
//         } catch (err) {
//             setError(err.message);
//             throw err;
//         }
//     };

//     // 👇 FUNGSI BARU YANG KRUSIAL
//     const getPublicationById = async (id) => {
//         try {
//             // Tidak perlu set loading global, biarkan komponen yang memanggil menanganinya
//             const data = await publicationService.getPublicationById(id);
//             return data;
//         } catch (err) {
//             setError(err.message);
//             throw err;
//         }
//     };

//     // 👇 FUNGSI EDIT DIPERBAIKI (sekarang async)
//     const updatePublication = async (id, updatedData) => {
//         try {
//             const updated = await publicationService.updatePublication(id, updatedData);
//             setPublications(prev => prev.map(pub => (pub.id === updated.id ? updated : pub)));
//             return updated;
//         } catch (err) {
//             setError(err.message);
//             throw err;
//         }
//     };

//     // 👇 FUNGSI DELETE DIPERBAIKI (sekarang async)
//     const deletePublication = async (id) => {
//         try {
//             await publicationService.deletePublication(id);
//             setPublications(prev => prev.filter(pub => pub.id !== id));
//         } catch (err) {
//             setError(err.message);
//             throw err;
//         }
//     };

//     return (
//         <PublicationContext.Provider
//             value={{
//                 publications,
//                 loading,
//                 error,
//                 addPublication,
//                 getPublicationById,  // <-- Ditambahkan
//                 updatePublication, // <-- Nama diubah agar lebih jelas
//                 deletePublication,
//             }}
//         >
//             {children}
//         </PublicationContext.Provider>
//     );

// };

// export { PublicationContext, PublicationProvider };