// src/services/publicationService.js 
import apiClient from '../api/axios';

export const publicationService = {
    // Fungsi untuk mengambil SEMUA publikasi
    async getPublications() {
        try {
            const response = await apiClient.get('/publikasi');
            return response.data;
        } catch (error) {
            throw new Error('Gagal mengambil data: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
        }
    },

    // 👇 FUNGSI HILANG 1: Mengambil SATU publikasi berdasarkan ID
    async getPublicationById(id) {
        try {
            const response = await apiClient.get(`/publikasi/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Gagal mengambil detail data: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
        }
    },

    // Fungsi untuk MENAMBAH publikasi
    async addPublication(formData) {
        try {
            // Mengirim sebagai multipart/form-data
            const response = await apiClient.post('/publikasi', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error('Gagal menambahkan data: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
        }
    },

    // 👇 FUNGSI HILANG 2: Meng-UPDATE publikasi berdasarkan ID
    async updatePublication(id, formData) {
        // Catatan: Lihat penjelasan penting di bawah tentang method POST
        formData.append('_method', 'PUT'); // Trik untuk Laravel agar bisa handle FormData
        try {
            const response = await apiClient.post(`/publikasi/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error('Gagal memperbarui data: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
        }
    },

    // 👇 FUNGSI HILANG 3: Meng-HAPUS publikasi berdasarkan ID
    async deletePublication(id) {
        try {
            await apiClient.delete(`/publikasi/${id}`);
        } catch (error) {
            throw new Error('Gagal menghapus data: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
        }
    },
}

export async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    if (!uploadPreset || !cloudName) {
        throw new Error('Cloudinary config missing: cek VITE_CLOUDINARY_UPLOAD_PRESET dan VITE_CLOUDINARY_CLOUD_NAME di .env');
    }
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) throw new Error('Upload gagal');
        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        throw new Error('Gagal upload ke Cloudinary: ' + error.message);
    }
} 