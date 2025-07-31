// src/context/PublicationContext.jsx 

import React, { createContext, useState, useEffect } from 'react';
import { publicationService } from "../services/publicationService";
import { useAuth } from "../hooks/useAuth";

const PublicationContext = createContext(null);

const PublicationProvider = ({ children }) => {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
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
        };
        fetchData();
    }, [token]);

    const addPublication = async (formData) => {
        // formData dari komponen berisi: { title, description, releaseDate, coverFile }
        try {
            let coverUrl = null; // Siapkan variabel untuk menampung URL sampul

            // 1. Cek jika pengguna menyertakan file sampul untuk di-upload
            if (formData.coverFile) {
                // Jika ada, panggil service untuk meng-upload ke Cloudinary dan tunggu hasilnya
                coverUrl = await publicationService.uploadImageToCloudinary(formData.coverFile);
            }

            // 2. Siapkan payload (data final) yang akan dikirim ke API backend Anda
            const payload = {
                title: formData.title,
                description: formData.description,
                releaseDate: formData.releaseDate,
                coverUrl: coverUrl, // Masukkan URL yang didapat dari Cloudinary
            };
            
            // 3. Panggil service untuk menyimpan data ke backend dengan payload yang sudah benar
            // Asumsi nama fungsi di service adalah `createPublication`
            const newPublicationFromDB = await publicationService.createPublication(payload);

            // 4. Update state lokal dengan data baru yang valid dari database
            setPublications((prev) => [newPublicationFromDB, ...prev]);

            return newPublicationFromDB; // Kembalikan data yang baru saja dibuat

        } catch (err) {
            // Tangkap error dari proses upload ataupun proses simpan ke DB
            setError(err.message);
            throw err; // Lempar kembali error agar bisa ditangani di komponen
        }
    };
    
    // const addPublication = async (newPub) => {
    //     try {
    //         const added = await publicationService.addPublication(newPub);
    //         setPublications((prev) => [added, ...prev]);
    //         return added; // Kembalikan data yang ditambahkan
    //     } catch (err) {
    //         setError(err.message);
    //         throw err;
    //     }
    // };

    // 👇 FUNGSI BARU YANG KRUSIAL
    const getPublicationById = async (id) => {
        try {
            // Tidak perlu set loading global, biarkan komponen yang memanggil menanganinya
            const data = await publicationService.getPublicationById(id);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // 👇 FUNGSI EDIT DIPERBAIKI (sekarang async)
    const updatePublication = async (id, updatedData) => {
        try {
            const updated = await publicationService.updatePublication(id, updatedData);
            setPublications(prev => prev.map(pub => (pub.id === updated.id ? updated : pub)));
            return updated;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // 👇 FUNGSI DELETE DIPERBAIKI (sekarang async)
    const deletePublication = async (id) => {
        try {
            await publicationService.deletePublication(id);
            setPublications(prev => prev.filter(pub => pub.id !== id));
        } catch (err) {
            setError(err.message);
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
                getPublicationById,  // <-- Ditambahkan
                updatePublication, // <-- Nama diubah agar lebih jelas
                deletePublication,
            }}
        >
            {children}
        </PublicationContext.Provider>
    );

};

export { PublicationContext, PublicationProvider };