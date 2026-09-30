import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';

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
      <Text style={styles.title}>Detail Pengeluaran</Text>
    </View>
  </View>
);

// 3. View: Data Tidak Ditemukan (Detail Error State)
const NotFoundStateView = ({ onBack }) => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
    <Header onBack={onBack} />

    <View style={styles.fullStateContainer}>
      <View style={styles.centerContent}>
        <View style={styles.iconCircleGray}>
          <Text style={styles.iconEmoji}>🔍</Text>
        </View>
        <Text style={styles.stateTitle}>Data Tidak Ditemukan</Text>
        <Text style={styles.stateSubtitle}>
          Catatan pengeluaran dengan ID tersebut sudah dihapus atau tidak pernah terdaftar pada akun Anda.
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.secondaryButtonFull}
          activeOpacity={0.8}
          onPress={onBack}
        >
          <Text style={styles.secondaryButtonText}>Kembali ke Daftar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
);

const DetailCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.section}>
      <Text style={styles.label}>JUDUL</Text>
      <Text style={styles.valueTitle}>{item.title}</Text>
    </View>

    <View style={styles.divider} />

    <View style={styles.section}>
      <Text style={styles.label}>NOMINAL</Text>
      <Text style={styles.valueAmount}>{item.amount}</Text>
    </View>

    <View style={styles.divider} />

    <View style={styles.rowSection}>
      <View style={styles.halfColumn}>
        <Text style={styles.label}>TANGGAL</Text>
        <Text style={styles.valueText}>{item.date}</Text>
      </View>
      <View style={styles.halfColumn}>
        <Text style={styles.label}>KATEGORI ID</Text>
        <Text style={styles.valueText}>
          {item.categoryId || 'CAT-01'} ({item.category})
        </Text>
      </View>
    </View>

    <View style={styles.divider} />

    <View style={styles.section}>
      <Text style={styles.label}>CATATAN</Text>
      <Text style={styles.valueNote}>
        {item.note || 'Makan siang bebek goreng sambal korek yang cukup pedas.'}
      </Text>
    </View>
  </View>
);

const ActionButtons = ({ onNavigateToEdit, onRequestDelete, onBack }) => (
  <View style={styles.actionContainer}>
    <TouchableOpacity
      style={styles.editButton}
      activeOpacity={0.8}
      onPress={onNavigateToEdit}
    >
      <Text style={styles.editButtonText}>Ubah Pengeluaran</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.deleteButton}
      activeOpacity={0.8}
      onPress={onRequestDelete}
    >
      <Text style={styles.deleteButtonText}>Hapus Pengeluaran</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.backToListButton}
      activeOpacity={0.8}
      onPress={onBack}
    >
      <Text style={styles.backToListButtonText}>Kembali ke Daftar</Text>
    </TouchableOpacity>
  </View>
);

const DeleteConfirmationModal = ({ visible, itemTitle, onConfirm, onCancel }) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="fade"
    onRequestClose={onCancel}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.warningIconBadge}>
          <Text style={styles.warningIconText}>⚠️</Text>
        </View>

        <Text style={styles.modalTitle}>Hapus Pengeluaran?</Text>
        <Text style={styles.modalMessage}>
          Apakah Anda yakin ingin menghapus catatan{' '}
          <Text style={styles.boldText}>"{itemTitle}"</Text>? Tindakan ini tidak dapat dibatalkan.
        </Text>

        <TouchableOpacity
          style={styles.confirmDeleteButton}
          activeOpacity={0.8}
          onPress={onConfirm}
        >
          <Text style={styles.confirmDeleteText}>Ya, Hapus Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          activeOpacity={0.7}
          onPress={onCancel}
        >
          <Text style={styles.cancelText}>Batal</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default function Detail({ item, onBack, onDelete, onNavigateToEdit }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Jika Data Tidak Ditemukan
  if (!item) {
    return <NotFoundStateView onBack={onBack} />;
  }

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    if (onDelete) {
      onDelete(item.id);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <Header onBack={onBack} />

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <DetailCard item={item} />

        <ActionButtons
          onNavigateToEdit={onNavigateToEdit}
          onRequestDelete={() => setShowDeleteModal(true)}
          onBack={onBack}
        />
      </ScrollView>

      <DeleteConfirmationModal
        visible={showDeleteModal}
        itemTitle={item.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
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
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    marginBottom: 20,
  },
  section: {
    marginVertical: 4,
  },
  rowSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  halfColumn: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  valueTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  valueAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0D7C66',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  valueNote: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  actionContainer: {
    gap: 10,
  },
  editButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0D7C66',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#0D7C66',
    fontSize: 15,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '700',
  },
  backToListButton: {
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backToListButtonText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },
  fullStateContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconCircleGray: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconEmoji: {
    fontSize: 32,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  stateSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
  },
  secondaryButtonFull: {
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  warningIconBadge: {
    backgroundColor: '#FEE2E2',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  warningIconText: {
    fontSize: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 20,
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  confirmDeleteButton: {
    backgroundColor: '#C52222',
    borderRadius: 10,
    paddingVertical: 13,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmDeleteText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 13,
    width: '100%',
    alignItems: 'center',
  },
  cancelText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },
});