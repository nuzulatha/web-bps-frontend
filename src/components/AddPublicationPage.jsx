// src/components/AddPublicationPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePublications } from '../hooks/usePublications';
// Anda tidak perlu mengimpor uploadImageToCloudinary di sini lagi
import PublicationForm from './PublicationForm';

export default function AddPublicationPage() {
    const navigate = useNavigate();
    const { addPublication } = usePublications();
    // Ganti state isUploading menjadi isSubmitting agar lebih umum
    const [isSubmitting, setIsSubmitting] = useState(false);

    // handleAdd sekarang menjadi jauh lebih sederhana
    const handleAdd = async (formDataFromForm) => {
        // formDataFromForm adalah objek berisi:
        // { title, description, releaseDate, coverFile }

        if (!formDataFromForm.title || !formDataFromForm.releaseDate) {
            alert('Judul dan Tanggal Rilis harus diisi!');
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Langsung kirim semua data dari form ke service.
            // Biarkan service yang mengurus upload dan pembuatan payload.
            await addPublication(formDataFromForm);
            
            alert('Publikasi berhasil ditambahkan.');
            navigate('/publications');
        } catch (err) {
            // Service akan melempar error jika ada masalah (upload atau API)
            alert('Gagal menambah publikasi: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Publikasi Baru</h1>
            <PublicationForm
                onSubmit={handleAdd}
                buttonText={isSubmitting ? 'Menyimpan...' : 'Tambah Publikasi'}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}



// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { usePublications } from '../hooks/usePublications';
// import PublicationForm from './PublicationForm'; // Menggunakan komponen form yang bisa dipakai ulang

// function AddPublicationPage() {
//     const navigate = useNavigate();
//     const { addPublication } = usePublications();

//     const handleAdd = async (formData) => {
//         try {
//             // Logika submit sekarang hanya memanggil fungsi dari context
//             // Semua proses upload dan lainnya sebaiknya ditangani di dalam context atau service
//             await addPublication(formData); 
//             alert('Publikasi berhasil ditambahkan!');
//             navigate('/publications');
//         } catch (err) {
//             alert('Gagal menambahkan publikasi: ' + err.message);
//         }
//     };

//     return (
//         <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Publikasi Baru</h1>
//             <PublicationForm
//                 onSubmit={handleAdd}
//                 buttonText="Tambah Publikasi"
//             />
//         </div>
//     );
// }

// export default AddPublicationPage;

// // src/components/AddPublicationPage.jsx 

// import React, { useState } from 'react';
// import { usePublications } from '../hooks/usePublications';
// import { useNavigate } from 'react-router-dom';
// import { uploadImageToCloudinary } from '../services/publicationService';

// export default function AddPublicationPage() {
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [releaseDate, setReleaseDate] = useState('');
//     const [coverFile, setCoverFile] = useState(null);
//     const { addPublication } = usePublications();
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!title || !releaseDate) {
//             alert('Judul dan Tanggal Rilis harus diisi!');
//             return;
//         }
//         let coverUrl = '';
//         if (coverFile) {
//             try {
//                 coverUrl = await uploadImageToCloudinary(coverFile);
//             } catch (err) {
//                 alert('Gagal upload gambar: ' + err.message);
//                 return;
//             }
//         } else {
//             coverUrl = `https://placehold.co/200x280/7f8c8d/ffffff?text=${encodeURIComponent(title)}`
//                 ;
//         }
//         const newPublication = {
//             title,
//             releaseDate,
//             description,
//             coverUrl,
//         };
//         try {
//             await addPublication(newPublication);
//             navigate('/publications');
//             setTitle('');
//             setReleaseDate('');
//             setDescription('');
//             setCoverFile(null);
//         } catch (err) {
//             alert('Gagal menambah publikasi: ' + err.message);
//         }
//     };

//     return (
//         <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">Form Tambah Publikasi Baru</h1>
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                     <label htmlFor="title" className="block text-sm font-medium text gray-700 mb-1">Judul</label>
//                     <input
//                         type="text"
//                         id="title"
//                         value={title}
//                         onChange={e => setTitle(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
//                         placeholder="Contoh: Indikator Ekonomi Bengkulu 2025"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
//                     <textarea
//                         id="description"
//                         value={description}
//                         onChange={e => setDescription(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
//                         placeholder="Contoh: Publikasi ini membahas Indikator Ekonomi Bengkulu 2025 secara mendalam."
//                         rows={4}
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Rilis</label>
//                     <input
//                         type="date"
//                         id="releaseDate"
//                         value={releaseDate}
//                         onChange={e => setReleaseDate(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="cover" className="block text-sm font-medium text gray-700 mb-1">Sampul (Gambar)</label>
//                     <input
//                         type="file"
//                         id="cover"
//                         accept="image/*"
//                         onChange={e => setCoverFile(e.target.files[0])}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
//                     />
//                 </div>
//                 <div className="flex justify-end">
//                     <button
//                         type="submit"
//                         className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
//                     >
//                         Tambah
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// } 