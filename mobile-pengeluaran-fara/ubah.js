import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';

// Sub-component: Header Navigation
const Header = ({ onBack }) => (
  <View style={styles.header}>
    <TouchableOpacity
      style={styles.backButton}
      onPress={onBack}
      activeOpacity={0.7}
    >
      <Text style={styles.backIcon}>←</Text>
    </TouchableOpacity>
    <View>
      <Text style={styles.title}>Ubah Data</Text>
      <Text style={styles.subtitle}>Edit catatan pengeluaran terpilih</Text>
    </View>
  </View>
);

// Sub-component: Form Input Field Aktif
const ActiveInput = ({ label, required, value, onChangeText, keyboardType = 'default', placeholder }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>
      {label} {required && <Text style={styles.required}>*</Text>}
    </Text>
    <TextInput
      style={styles.inputActive}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      placeholder={placeholder}
      placeholderTextColor="#94A3B8"
    />
  </View>
);

// Sub-component: Readonly / Field Terkunci
const LockedInput = ({ label, value, isTextArea }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.labelLocked}>{label}</Text>
    <View style={[styles.inputLockedContainer, isTextArea && styles.textAreaLocked]}>
      <Text style={styles.inputLockedText}>{value}</Text>
    </View>
  </View>
);

// Sub-component: Info Tanggal Terkunci
const DateInfoBox = ({ dateText }) => (
  <View style={styles.infoBox}>
    <Text style={styles.infoIcon}>🕒</Text>
    <Text style={styles.infoText}>
      Tanggal terkunci otomatis: {dateText}
    </Text>
  </View>
);

// Main Component
export default function Ubah({ item, onBack, onSaveUpdate }) {
  const [judul, setJudul] = useState('');
  const [nominal, setNominal] = useState('');

  useEffect(() => {
    if (item) {
      setJudul(item.title || '');
      // Mengambil angka saja dari nominal string (misal "Rp 50.000" -> "50000")
      const numericOnly = item.amount ? item.amount.replace(/[^0-9]/g, '') : '';
      setNominal(numericOnly);
    }
  }, [item]);

  const handleSave = () => {
    if (!judul || !nominal) {
      alert('Judul dan nominal tidak boleh kosong!');
      return;
    }

    if (onSaveUpdate) {
      onSaveUpdate({
        ...item,
        title: judul,
        amountRaw: nominal,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <Header onBack={onBack} />

      {/* Form Area */}
      <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
        <ActiveInput
          label="Judul Pengeluaran"
          required
          value={judul}
          onChangeText={setJudul}
          placeholder="Judul pengeluaran"
        />

        <ActiveInput
          label="Nominal (Rp)"
          required
          value={nominal}
          onChangeText={setNominal}
          keyboardType="numeric"
          placeholder="0"
        />

        <LockedInput
          label="Kategori (Terkunci)"
          value={item?.category || 'Makanan'}
        />

        <LockedInput
          label="Catatan (Terkunci)"
          value={item?.note || 'Makan siang bebek goreng sambal korek yang cukup pedas.'}
          isTextArea
        />

        <DateInfoBox dateText={item?.date || '29 Sep 2026'} />
      </ScrollView>

      {/* Bottom Button Action */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.8}
          onPress={handleSave}
        >
          <Text style={styles.primaryButtonText}>Simpan Perubahan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 12 : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    marginBottom: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  labelLocked: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  inputActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0D7C66',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  inputLockedContainer: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  textAreaLocked: {
    minHeight: 80,
  },
  inputLockedText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  infoBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#94A3B8',
    flex: 1,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  primaryButton: {
    backgroundColor: '#0D7C66',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});