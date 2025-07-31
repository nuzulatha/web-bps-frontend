import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PublicationForm({ onSubmit, publication, buttonText }) {
    const [title, setTitle] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [cover, setCover] = useState(null);
    // Tambahan state untuk deskripsi
    const [description, setDescription] = useState('');

    const navigate = useNavigate();

    // useEffect untuk mengisi form dengan data saat mengedit
    useEffect(() => {
        if (publication) {
            setTitle(publication.title || '');
            // Format tanggal agar sesuai dengan input type="date" (YYYY-MM-DD)
            setReleaseDate(publication.releaseDate ? publication.releaseDate.split('T')[0] : '');
            setDescription(publication.description || '');
        }
    }, [publication]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('releaseDate', releaseDate);
        formData.append('description', description);
        if (cover) {
            formData.append('cover', cover);
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    rows={4}
                />
            </div>

            <div>
                <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Rilis</label>
                <input
                    type="date"
                    id="releaseDate"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    required
                />
            </div>

            <div>
                <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-1">
                    Sampul (Gambar) {publication ? '(Biarkan kosong jika tidak ingin ganti)' : ''}
                </label>
                <input
                    type="file"
                    id="cover"
                    accept="image/*"
                    onChange={(e) => setCover(e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button
                    type="button"
                    onClick={() => navigate('/publications')}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-lg"
                >
                    {buttonText || 'Simpan'}
                </button>
            </div>
        </form>
    );
}

export default PublicationForm;