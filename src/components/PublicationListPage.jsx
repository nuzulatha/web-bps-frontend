import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Hook untuk otentikasi
import { publicationService } from '../services/publicationService'; // Service untuk API

export default function PublicationListPage() {
    // State untuk data, loading, dan error
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mengambil data user dan fungsi logout dari AuthContext
    const { user, logoutAction } = useAuth();
    const navigate = useNavigate();

    // Mengambil data publikasi dari API saat komponen dimuat
    useEffect(() => {
        const fetchPublications = async () => {
            try {
                setLoading(true);
                const data = await publicationService.getAll();
                setPublications(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPublications();
    }, []);

    // Fungsi untuk menangani penghapusan data
    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus publikasi ini?')) {
            try {
                await publicationService.delete(id);
                // Memperbarui UI dengan menghapus item dari state
                setPublications(publications.filter(p => p.id !== id));
                alert('Publikasi berhasil dihapus!');
            } catch (err) {
                alert(err.message); // Menampilkan pesan error jika gagal
            }
        }
    };

    // Fungsi untuk menangani logout
    const handleLogout = () => {
        if (window.confirm('Apakah Anda yakin ingin logout?')) {
            logoutAction(); // Menghapus token dari localStorage dan memanggil API logout
            navigate('/login'); // Mengarahkan kembali ke halaman login
        }
    };

    // Tampilan saat loading
    if (loading) return <div className="text-center p-10">Memuat data publikasi...</div>;
    
    // Tampilan jika terjadi error
    if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <header className="mb-8 flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                        Daftar Publikasi
                    </h1>
                    {/* Menampilkan nama user yang sedang login */}
                    <p className="text-gray-500 mt-1">Selamat datang, {user?.name || 'Pengguna'}!</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/publications/add')}
                        className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                        Tambah Publikasi
                    </button>
                    {/* Tombol Logout */}
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Tabel untuk menampilkan data */}
            <div className="relative overflow-x-auto shadow-xl rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-white uppercase bg-slate-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-center w-16">No</th>
                            <th scope="col" className="px-6 py-3">Judul</th>
                            <th scope="col" className="px-6 py-3">Tanggal Rilis</th>
                            <th scope="col" className="px-6 py-3 text-center">Sampul</th>
                            <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {publications.length > 0 ? (
                            publications.map((pub, idx) => (
                                <tr key={pub.id} className="bg-white border-b hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 font-medium text-gray-900 text-center">{idx + 1}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">{pub.title}</td>
                                    <td className="px-6 py-4 text-gray-600">{new Date(pub.releaseDate).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4 flex justify-center items-center">
                                        <img
                                            src={pub.coverUrl}
                                            alt={`Sampul ${pub.title}`}
                                            className="h-24 w-auto object-cover rounded shadow-md"
                                            onError={e => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://placehold.co/100x140/cccccc/ffffff?text=Error';
                                            }}
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center items-center space-x-4">
                                            <button
                                                onClick={() => navigate(`/publications/edit/${pub.id}`)}
                                                className="text-yellow-500 hover:text-yellow-700"
                                                title="Edit Publikasi"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(pub.id)}
                                                className="text-red-500 hover:text-red-700"
                                                title="Hapus Publikasi"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-gray-500 py-8">Belum ada publikasi yang ditambahkan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
