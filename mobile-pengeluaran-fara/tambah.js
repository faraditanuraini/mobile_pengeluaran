import React, { useState } from 'react';
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
  ActivityIndicator,
} from 'react-native';

// Sub-component: Header Navigation
const Header = ({ onBack, isLoading }) => (
  <View style={styles.header}>
    <TouchableOpacity
      style={styles.backButton}
      onPress={onBack}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      <Text style={styles.backIcon}>←</Text>
    </TouchableOpacity>
    <View>
      <Text style={styles.title}>Tambah Baru</Text>
      <Text style={styles.subtitle}>Input data pengeluaran baru</Text>
    </View>
  </View>
);

// Sub-component: Form Input Field dengan State Error
const FormInput = ({
  label,
  required,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  errorMessage,
  editable = true,
}) => {
  const isError = Boolean(errorMessage);

  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, isError && styles.labelError]}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[styles.input, isError && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={isError ? '#B91C1C' : '#94A3B8'}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        editable={editable}
      />
      {isError && <Text style={styles.errorMessageText}>{errorMessage}</Text>}
    </View>
  );
};

// Sub-component: Category Dropdown Picker
const CategoryDropdown = ({ selectedCategory, onPress, disabled }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>Kategori (Opsional)</Text>
    <TouchableOpacity
      style={styles.dropdown}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={selectedCategory ? styles.dropdownSelectedText : styles.dropdownPlaceholder}>
        {selectedCategory || 'Pilih Kategori'}
      </Text>
      <Text style={styles.dropdownArrow}>▼</Text>
    </TouchableOpacity>
  </View>
);

// Sub-component: Automatic Date Information Box
const DateInfoBox = ({ dateText }) => (
  <View style={styles.infoBox}>
    <Text style={styles.infoIcon}>🕒</Text>
    <Text style={styles.infoText}>
      Tanggal otomatis diatur ke hari ini: {dateText}
    </Text>
  </View>
);

// Main Component
export default function Tambah({
  onBack,
  onSave,
  onNavigateToKategori,
  judul,
  setJudul,
  nominal,
  setNominal,
  kategori,
  isLoading,
  todayDate = '29 Sep 2026',
}) {
  const [judulError, setJudulError] = useState('');
  const [nominalError, setNominalError] = useState('');

  const validateAndSave = () => {
    let isValid = true;
    let errJudul = '';
    let errNominal = '';

    // Validasi Judul
    if (!judul || judul.trim() === '') {
      errJudul = 'Judul pengeluaran wajib diisi';
      isValid = false;
    }

    // Validasi Nominal
    const numericNominal = parseFloat(nominal);
    if (!nominal || isNaN(numericNominal) || numericNominal <= 0) {
      errNominal = 'Nominal harus bernilai positif';
      isValid = false;
    }

    setJudulError(errJudul);
    setNominalError(errNominal);

    if (isValid && onSave) {
      onSave({ title: judul, amount: nominal, category: kategori });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <Header onBack={onBack} isLoading={isLoading} />

      {/* Form Input Area */}
      <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
        <FormInput
          label="Judul Pengeluaran"
          required
          placeholder="Contoh: Makan Siang Bebek"
          value={judul}
          onChangeText={(text) => {
            setJudul(text);
            if (judulError) setJudulError('');
          }}
          errorMessage={judulError}
          editable={!isLoading}
        />

        <FormInput
          label="Nominal (Rp)"
          required
          placeholder="0"
          value={nominal}
          onChangeText={(text) => {
            setNominal(text);
            if (nominalError) setNominalError('');
          }}
          keyboardType="numeric"
          errorMessage={nominalError}
          editable={!isLoading}
        />

        <CategoryDropdown
          selectedCategory={kategori}
          onPress={onNavigateToKategori}
          disabled={isLoading}
        />

        {!judulError && !nominalError && (
          <DateInfoBox dateText={todayDate} />
        )}
      </ScrollView>

      {/* Bottom Button Action */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.primaryButton, isLoading && styles.buttonLoading]}
          activeOpacity={0.8}
          onPress={validateAndSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.primaryButtonText}>Menyimpan...</Text>
            </View>
          ) : (
            <Text style={styles.primaryButtonText}>Simpan Pengeluaran</Text>
          )}
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
  labelError: {
    color: '#991B1B',
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  inputError: {
    borderColor: '#B91C1C',
    backgroundColor: '#FEF2F2',
    color: '#991B1B',
  },
  errorMessageText: {
    fontSize: 12,
    color: '#B91C1C',
    marginTop: 6,
    fontWeight: '500',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: '#94A3B8',
  },
  dropdownSelectedText: {
    fontSize: 14,
    color: '#0F172A',
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#64748B',
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
    color: '#64748B',
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
  buttonLoading: {
    backgroundColor: '#72B5A5',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});