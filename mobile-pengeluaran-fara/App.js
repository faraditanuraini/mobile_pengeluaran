import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Daftar from './daftar';
import Tambah from './tambah';
import Kategori from './kategori';
import Detail from './detail';
import Ubah from './ubah';

// Import service API dan helper sesuai Modul 2C
import { api } from './src/api';
import { rupiah, tanggalLokal } from './src/helpers';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('daftar');
  
  // State Data dari Backend API MySQL
  const [expenses, setExpenses] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // State Status Loading & Error
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showDeleteBanner, setShowDeleteBanner] = useState(false);

  // State Form Input Temporary
  const [formJudul, setFormJudul] = useState('');
  const [formNominal, setFormNominal] = useState('');
  const [formKategoriId, setFormKategoriId] = useState(null);
  const [formKategoriNama, setFormKategoriNama] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Reset Input Form
  const resetForm = () => {
    setFormJudul('');
    setFormNominal('');
    setFormKategoriId(null);
    setFormKategoriNama('');
  };

  // ----------------------------------------------------
  // 1. FETCH DAFTAR PENGELUARAN DARI MYSQL (GET /pengeluaran)
  // ----------------------------------------------------
  const fetchExpenses = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await api.list(); // Mengambil data array dari API Express
      if (Array.isArray(data)) {
        // Mapping kolom database (judul, nominal, tanggal, kategori) ke format UI
        const formattedData = data.map((item) => ({
          id: item.id,
          title: item.judul,
          amount: rupiah(item.nominal),
          amountRaw: item.nominal,
          category: item.kategori || 'Tanpa kategori',
          date: tanggalLokal(item.tanggal),
          isNew: false,
        }));
        setExpenses(formattedData);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error('Gagal memuat data dari API:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data pertama kali saat aplikasi dibuka
  useEffect(() => {
    fetchExpenses();
  }, []);

  // ----------------------------------------------------
  // 2. FETCH DETAIL PENGELUARAN (GET /pengeluaran/:id)
  // ----------------------------------------------------
  const handleOpenDetail = async (item) => {
    setShowDeleteBanner(false);
    setIsLoading(true);
    try {
      const detailData = await api.detail(item.id);
      setSelectedItem({
        id: detailData.id,
        title: detailData.judul,
        amount: rupiah(detailData.nominal),
        amountRaw: detailData.nominal,
        date: tanggalLokal(detailData.tanggal),
        category: item.category || 'Tanpa kategori',
        categoryId: detailData.id_kategori ? `CAT-0${detailData.id_kategori}` : 'Tanpa Kategori',
        note: detailData.catatan || 'Belum ada catatan.',
      });
      setCurrentScreen('detail');
    } catch (error) {
      console.error('Gagal memuat detail:', error);
      setSelectedItem(null);
      setCurrentScreen('detail');
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // 3. TAMBAH PENGELUARAN BARU (POST /pengeluaran)
  // ----------------------------------------------------
  const handleSaveExpense = async (newExpenseData) => {
    setIsSaving(true);
    setShowDeleteBanner(false);
    try {
      await api.create({
        judul: newExpenseData.title,
        nominal: Number(newExpenseData.amount),
        id_kategori: formKategoriId,
      });

      // Muat ulang daftar dari server
      await fetchExpenses();
      resetForm();
      setCurrentScreen('daftar');
    } catch (error) {
      alert(`Gagal menyimpan: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // ----------------------------------------------------
  // 4. UBAH PENGELUARAN (PUT /pengeluaran/:id)
  // ----------------------------------------------------
  const handleSaveUpdate = async (updatedItem) => {
    setShowDeleteBanner(false);
    setIsLoading(true);
    try {
      await api.update(updatedItem.id, {
        judul: updatedItem.title,
        nominal: Number(updatedItem.amountRaw),
      });

      await fetchExpenses();
      resetForm();
      setSelectedItem(null);
      setCurrentScreen('daftar');
    } catch (error) {
      alert(`Gagal mengubah data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // 5. HAPUS PENGELUARAN (DELETE /pengeluaran/:id)
  // ----------------------------------------------------
  const handleDeleteExpense = async (id) => {
    setIsLoading(true);
    try {
      await api.remove(id);
      setShowDeleteBanner(true); // Tampilkan banner "Pengeluaran berhasil dihapus"
      await fetchExpenses();
      setSelectedItem(null);
      setCurrentScreen('daftar');
    } catch (error) {
      alert(`Gagal menghapus data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigasi & Category Selection
  const handleSelectCategory = (categoryObj) => {
    if (typeof categoryObj === 'object' && categoryObj !== null) {
      setFormKategoriId(categoryObj.id);
      setFormKategoriNama(categoryObj.nama);
    } else {
      setFormKategoriNama(categoryObj);
    }
    setCurrentScreen('tambah');
  };

  const handleReloadData = () => {
    setShowDeleteBanner(false);
    fetchExpenses();
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'daftar' && (
        <Daftar
          expensesData={expenses}
          onNavigateToTambah={() => {
            setShowDeleteBanner(false);
            setCurrentScreen('tambah');
          }}
          onReloadData={handleReloadData}
          onSelectDetail={handleOpenDetail}
          showDeleteSuccess={showDeleteBanner}
          isError={isError}
        />
      )}

      {currentScreen === 'tambah' && (
        <Tambah
          onBack={() => {
            resetForm();
            setCurrentScreen('daftar');
          }}
          onSave={handleSaveExpense}
          onNavigateToKategori={() => setCurrentScreen('kategori')}
          judul={formJudul}
          setJudul={setFormJudul}
          nominal={formNominal}
          setNominal={setFormNominal}
          kategori={formKategoriNama}
          isLoading={isSaving}
          todayDate={tanggalLokal(new Date().toISOString().split('T')[0])}
        />
      )}

      {currentScreen === 'kategori' && (
        <Kategori
          currentCategory={formKategoriNama}
          onSelectCategory={handleSelectCategory}
          onBack={() => setCurrentScreen('tambah')}
        />
      )}

      {currentScreen === 'detail' && (
        <Detail
          item={selectedItem}
          onBack={() => {
            setSelectedItem(null);
            setCurrentScreen('daftar');
          }}
          onDelete={handleDeleteExpense}
          onNavigateToEdit={() => setCurrentScreen('ubah')}
        />
      )}

      {currentScreen === 'ubah' && (
        <Ubah
          item={selectedItem}
          onBack={() => setCurrentScreen('detail')}
          onSaveUpdate={handleSaveUpdate}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});