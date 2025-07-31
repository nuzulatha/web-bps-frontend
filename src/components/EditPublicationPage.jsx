import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePublications } from '../hooks/usePublications'; // Sesuaikan path jika perlu
import PublicationForm from './PublicationForm'; // Sesuaikan path jika perlu

function EditPublicationPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    // Ambil fungsi asinkron dari context
    const { getPublicationById, updatePublication } = usePublications();

    const [publication, setPublication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect untuk mengambil data saat komponen pertama kali dimuat
    useEffect(() => {
        const fetchPublicationData = async () => {
            setLoading(true); // Mulai loading
            try {
                const data = await getPublicationById(id);
                setPublication(data);
            } catch (err) {
                setError("Gagal memuat data. " + err.message);
            } finally {
                setLoading(false); // Selesai loading
            }
        };

        fetchPublicationData();
    }, [id, getPublicationById]); // Jalankan ulang jika id berubah

    // Handler untuk mengirim form update
    const handleUpdate = async (formData) => {
        try {
            await updatePublication(id, formData);
            alert('Publikasi berhasil diperbarui!');
            navigate('/publications');
        } catch (err) {
            alert('Gagal memperbarui publikasi: ' + err.message);
        }
    };

    // Tampilkan status loading
    if (loading) {
        return <div className="text-center py-10 font-semibold">Memuat data publikasi...</div>;
    }

    // Tampilkan pesan error jika terjadi kesalahan
    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    // Tampilkan pesan jika data tidak ditemukan setelah selesai loading
    if (!publication) {
        return (
            <div className="text-center py-10">
                <p>Publikasi tidak ditemukan.</p>
                <Link to="/publications" className="text-sky-600 hover:underline">Kembali ke daftar</Link>
            </div>
        );
    }

    // Jika semua baik-baik saja, tampilkan form dengan data yang sudah siap
    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Publikasi</h1>
            <PublicationForm
                onSubmit={handleUpdate}
                publication={publication}
                buttonText="Simpan Perubahan"
            />
        </div>
    );
}

export default EditPublicationPage;

// import React, { useState, useEffect, useContext, createContext } from 'react';
// import { MemoryRouter, Routes, Route, useLocation, useNavigate, useParams, Link } from 'react-router-dom';

// // --- Mock Data and Context ---
// // In a real app, this would be in its own file (e.g., src/context/PublicationsContext.js)
// const PublicationsContext = createContext();

// const initialPublications = [
//     { 
//         id: '1', 
//         title: 'Indikator Ekonomi Sumatera Selatan 2025', 
//         releaseDate: '2025-01-15', 
//         description: 'Publikasi ini menyajikan analisis mendalam mengenai indikator-indikator ekonomi utama di Provinsi Sumatera Selatan untuk tahun 2025.',
//         coverUrl: 'https://placehold.co/200x280/3498db/ffffff?text=Ekonomi+2025' 
//     },
//     { 
//         id: '2', 
//         title: 'Statistik Kesejahteraan Rakyat 2025', 
//         releaseDate: '2025-02-20', 
//         description: 'Data dan analisis mengenai tingkat kesejahteraan penduduk, mencakup pendidikan, kesehatan, dan pengeluaran.',
//         coverUrl: 'https://placehold.co/200x280/2ecc71/ffffff?text=Kesejahteraan' 
//     }
// ];

// const PublicationsProvider = ({ children }) => {
//     const [publications, setPublications] = useState(initialPublications);

//     const getPublicationById = (id) => {
//         // Ensure consistent type comparison (string vs number)
//         return publications.find(p => String(p.id) === String(id));
//     };

//     const updatePublication = (updatedPub) => {
//         setPublications(pubs => pubs.map(p => (p.id === updatedPub.id ? updatedPub : p)));
//     };

//     const value = { publications, getPublicationById, updatePublication };

//     return (
//         <PublicationsContext.Provider value={value}>
//             {children}
//         </PublicationsContext.Provider>
//     );
// };

// // --- Custom Hook ---
// // In a real app, this would be in its own file (e.g., src/hooks/usePublications.js)
// const usePublications = () => {
//     return useContext(PublicationsContext);
// };


// // --- Reusable Form Component ---
// // In a real app, this would be in its own file (e.g., src/components/PublicationForm.jsx)
// function PublicationForm({ publication, onSubmit, buttonText }) {
//     const [title, setTitle] = useState(publication?.title || '');
//     const [description, setDescription] = useState(publication?.description || '');
//     const [releaseDate, setReleaseDate] = useState(publication?.releaseDate || '');
//     const [coverFile, setCoverFile] = useState(null);
//     const navigate = useNavigate();

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!title || !releaseDate) {
//             alert('Judul dan Tanggal Rilis harus diisi!');
//             return;
//         }
//         onSubmit({ title, description, releaseDate, coverFile });
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//                 <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
//                 <input
//                     type="text"
//                     id="title"
//                     value={title}
//                     onChange={e => setTitle(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
//                     placeholder="Contoh: Indikator Ekonomi Bengkulu 2025"
//                     required
//                 />
//             </div>
//             <div>
//                 <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
//                 <textarea
//                     id="description"
//                     value={description}
//                     onChange={e => setDescription(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
//                     placeholder="Contoh: Publikasi ini membahas Indikator Ekonomi Sumatera Selatan 2025 secara mendalam."
//                     rows={4}
//                 />
//             </div>
//             <div>
//                 <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Rilis</label>
//                 <input
//                     type="date"
//                     id="releaseDate"
//                     value={releaseDate}
//                     onChange={e => setReleaseDate(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
//                     required
//                 />
//             </div>
//             <div>
//                 <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-1">Ganti Sampul (Gambar)</label>
//                 <input
//                     type="file"
//                     id="cover"
//                     accept="image/*"
//                     onChange={e => setCoverFile(e.target.files[0])}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
//                 />
//             </div>
//             <div className="flex justify-end space-x-4">
//                 <button
//                     type="button"
//                     onClick={() => navigate('/publications')}
//                     className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors duration-300"
//                 >
//                     Batal
//                 </button>
//                 <button
//                     type="submit"
//                     className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
//                 >
//                     {buttonText || 'Simpan'}
//                 </button>
//             </div>
//         </form>
//     );
// }


// // --- Edit Page Component ---
// // This is the component you were working on.
// function EditPublicationPage() {
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const { state } = useLocation();
//     const { getPublicationById, updatePublication } = usePublications();

//     const publicationToEdit = state?.publication || getPublicationById(id);

//     const handleUpdatePublication = (formData) => {
//         const { title, description, releaseDate, coverFile } = formData;

//         let coverUrl = publicationToEdit.coverUrl;
//         if (coverFile) {
//             coverUrl = URL.createObjectURL(coverFile);
//         }

//         const updatedPublication = {
//             ...publicationToEdit,
//             title,
//             description,
//             releaseDate,
//             coverUrl,
//         };

//         updatePublication(updatedPublication);
//         navigate('/publications');
//     };

//     if (!publicationToEdit) {
//         return (
//             <div className="text-center py-10">
//                 <p className="text-red-500">Publikasi tidak ditemukan.</p>
//                 <Link to="/publications" className="text-sky-600 hover:underline">Kembali ke daftar</Link>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Publikasi</h1>
//             <PublicationForm
//                 onSubmit={handleUpdatePublication}
//                 publication={publicationToEdit}
//                 buttonText="Simpan Perubahan"
//             />
//         </div>
//     );
// }

// // --- List Page Component (for navigation context) ---
// function PublicationListPage() {
//     const { publications } = usePublications();
//     return (
//         <div className="p-4 md:p-8">
//             <h1 className="text-3xl font-bold text-gray-800 mb-6">Daftar Publikasi</h1>
//             <ul className="space-y-4">
//                 {publications.map(pub => (
//                     <li key={pub.id} className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
//                         <div>
//                             <p className="font-bold text-lg text-gray-800">{pub.title}</p>
//                             <p className="text-sm text-gray-500">Rilis: {pub.releaseDate}</p>
//                         </div>
//                         <Link 
//                             to={`/publications/edit/${pub.id}`}
//                             state={{ publication: pub }} // Pass data to avoid re-fetch
//                             className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
//                         >
//                             Edit
//                         </Link>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     )
// }


// // --- Main App Component ---
// // This component sets up the context and routing for the entire application.
// export default function App() {
//     return (
//         <PublicationsProvider>
//             <MemoryRouter initialEntries={['/publications/edit/1']}>
//                 <div className="bg-gray-100 min-h-screen font-sans">
//                     <Routes>
//                         <Route path="/publications" element={<PublicationListPage />} />
//                         <Route path="/publications/edit/:id" element={<EditPublicationPage />} />
//                     </Routes>
//                 </div>
//             </MemoryRouter>
//         </PublicationsProvider>
//     );
// }
