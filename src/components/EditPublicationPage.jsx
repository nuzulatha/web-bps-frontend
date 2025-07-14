// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// // Kita tidak lagi menggunakan usePublications karena halaman ini akan mengelola state-nya sendiri
// // import { usePublications } from '../hooks/usePublications'; 
// import { publicationService, uploadImageToCloudinary } from '../services/publicationService'; // Service untuk API

// // Komponen Form yang bisa digunakan kembali (tidak perlu diubah)
// function PublicationForm({ initialData, onSubmit, loading, buttonText }) {
//     const [formData, setFormData] = useState({
//         title: '',
//         releaseDate: '',
//         description: '',
//         coverUrl: '',
//     });
//     const [coverFile, setCoverFile] = useState(null);

//     useEffect(() => {
//         if (initialData) {
//             setFormData({
//                 title: initialData.title || '',
//                 releaseDate: initialData.releaseDate ? new Date(initialData.releaseDate).toISOString().split('T')[0] : '',
//                 description: initialData.description || '',
//                 coverUrl: initialData.coverUrl || '',
//             });
//         }
//     }, [initialData]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleFileChange = (e) => {
//         setCoverFile(e.target.files[0]);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSubmit({ ...formData, coverFile });
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//                 <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
//                 <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
//             </div>
//             <div>
//                 <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Rilis</label>
//                 <input id="releaseDate" name="releaseDate" type="date" value={formData.releaseDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
//             </div>
//             <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Sampul Saat Ini</label>
//                 {formData.coverUrl && <img src={formData.coverUrl} alt="Sampul saat ini" className="h-32 w-auto object-cover rounded shadow-md mb-2" />}
//                 <label htmlFor="coverFile" className="block text-sm font-medium text-gray-700 mt-2 mb-1">Ganti Sampul (Gambar)</label>
//                 <input id="coverFile" name="coverFile" type="file" accept="image/*" onChange={handleFileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
//             </div>
//             <div>
//                 <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
//                 <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
//             </div>
//             <div className="flex justify-end">
//                 <button type="submit" disabled={loading} className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 disabled:bg-sky-400">
//                     {loading ? 'Menyimpan...' : (buttonText || 'Simpan')}
//                 </button>
//             </div>
//         </form>
//     );
// }


// // Komponen Halaman Edit yang sudah terhubung dengan API
// export default function EditPublicationPage() {
//     const [publication, setPublication] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
    
//     const navigate = useNavigate();
//     const { id } = useParams();

//     // Mengambil data dari API saat halaman dimuat
//     useEffect(() => {
//         const fetchPublication = async () => {
//             try {
//                 setLoading(true);
//                 const data = await publicationService.getById(id);
//                 setPublication(data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchPublication();
//     }, [id]);

//     // Fungsi untuk menangani update, termasuk upload gambar
//     const handleUpdate = async (formData) => {
//         setLoading(true);
//         setError(null);
//         try {
//             let coverUrl = publication.coverUrl; // Defaultnya adalah URL yang sudah ada

//             // Jika ada file baru yang dipilih, upload dan ganti URL-nya
//             if (formData.coverFile) {
//                 coverUrl = await uploadImageToCloudinary(formData.coverFile);
//             }
            
//             const dataToUpdate = {
//                 title: formData.title,
//                 releaseDate: formData.releaseDate,
//                 description: formData.description,
//                 coverUrl: coverUrl, // Gunakan URL yang baru atau yang lama
//             };

//             await publicationService.update(id, dataToUpdate);
//             alert('Publikasi berhasil diperbarui!');
//             navigate('/publications');

//         } catch (err) {
//             setError(err.message);
//             alert('Gagal memperbarui: ' + err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) return <div className="text-center p-10">Memuat data...</div>;
//     if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;
//     if (!publication) return <div className="text-center p-10">Publikasi tidak ditemukan.</div>;

//     return (
//         <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Publikasi</h1>
//             <PublicationForm
//                 initialData={publication}
//                 onSubmit={handleUpdate}
//                 loading={loading}
//                 buttonText="Simpan Perubahan"
//             />
//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { publicationService } from '../services/publicationService'; // Pastikan service ini ada

export default function EditPublicationPage() {
    // State untuk form
    const [formData, setFormData] = useState({
        title: '',
        releaseDate: '',
        description: '',
        coverUrl: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();
    const { id } = useParams();

    // Mengambil data dari API saat halaman dimuat
    useEffect(() => {
        const fetchPublication = async () => {
            try {
                setLoading(true);
                const data = await publicationService.getById(id);
                // Format tanggal agar sesuai dengan input type="date"
                const formattedData = {
                    ...data,
                    releaseDate: data.releaseDate ? new Date(data.releaseDate).toISOString().split('T')[0] : ''
                };
                setFormData(formattedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPublication();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await publicationService.update(id, formData);
            alert('Publikasi berhasil diperbarui!');
            navigate('/publications');
        } catch (err) {
            setError(err.message);
            alert('Gagal memperbarui: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-10">Memuat data...</div>;
    if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Form Edit Publikasi</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                    <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Rilis</label>
                    <input id="releaseDate" name="releaseDate" type="date" value={formData.releaseDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="coverUrl" className="block text-sm font-medium text-gray-700 mb-1">URL Cover</label>
                    <input id="coverUrl" name="coverUrl" type="url" value={formData.coverUrl} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                </div>
                <div className="flex justify-end">
                    <button type="submit" disabled={loading} className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 disabled:bg-sky-400">
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </div>
    );
}
