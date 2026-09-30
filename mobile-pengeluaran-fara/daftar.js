import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';

// Sub-component: Expense Item Card
const ExpenseCard = ({ item, onSelectDetail }) => {
  const isNew = Boolean(item.isNew);

  return (
    <View style={[styles.card, isNew && styles.newCard]}>
      <View style={styles.cardLeft}>
        <View style={styles.titleContainer}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>BARU</Text>
            </View>
          )}
        </View>

        <View style={styles.metaContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.category}</Text>
          </View>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>

      <View style={styles.cardRight}>
        <Text style={styles.amountText}>{item.amount}</Text>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => onSelectDetail && onSelectDetail(item)}
        >
          <Text style={[styles.detailLinkText, isNew && styles.newDetailLinkText]}>
            Lihat Detail →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Sub-component: Header
const Header = () => (
  <View style={styles.header}>
    <Text style={styles.title}>Pengeluaran</Text>
    <Text style={styles.subtitle}>Catatan keuangan harian Anda</Text>
  </View>
);

// Sub-component: Delete Banner
const DeleteNotificationBanner = () => (
  <View style={styles.deleteBanner}>
    <Text style={styles.deleteBannerIcon}>🗑</Text>
    <Text style={styles.deleteBannerText}>Pengeluaran berhasil dihapus</Text>
  </View>
);

// 1. View: Empty State (Belum Ada Catatan)
const EmptyStateView = ({ onNavigateToTambah, onReload }) => (
  <View style={styles.fullStateContainer}>
    <View style={styles.centerContent}>
      <View style={styles.iconCircleGray}>
        <Text style={styles.iconEmoji}>📄</Text>
      </View>
      <Text style={styles.stateTitle}>Belum Ada Catatan</Text>
      <Text style={styles.stateSubtitle}>
        Mulai kelola keuangan harian Anda dengan mencatat pengeluaran pertama hari ini.
      </Text>
    </View>

    <View style={styles.bottomSection}>
      <TouchableOpacity
        style={styles.primaryButton}
        activeOpacity={0.8}
        onPress={onNavigateToTambah}
      >
        <Text style={styles.primaryButtonText}>+ Tambah Pengeluaran</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        activeOpacity={0.7}
        onPress={onReload}
      >
        <Text style={styles.secondaryButtonText}>Segarkan Layar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// 2. View: Error State (Gagal Memuat Data)
const ErrorStateView = ({ onReload }) => (
  <View style={styles.fullStateContainer}>
    <View style={styles.centerContent}>
      <View style={styles.iconCircleRed}>
        <Text style={styles.iconEmoji}>⚠️</Text>
      </View>
      <Text style={styles.errorTitle}>Gagal Memuat Data</Text>
      <Text style={styles.stateSubtitle}>
        Terjadi kesalahan koneksi atau server sedang sibuk. Silakan coba kembali beberapa saat lagi.
      </Text>
    </View>

    <View style={styles.bottomSection}>
      <TouchableOpacity
        style={styles.primaryButton}
        activeOpacity={0.8}
        onPress={onReload}
      >
        <Text style={styles.primaryButtonText}>Coba Lagi</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// Main Component
export default function Daftar({
  onNavigateToTambah,
  expensesData = [],
  onReloadData,
  onSelectDetail,
  showDeleteSuccess = false,
  isError = false, // Status Error dari Parent
}) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header Section */}
      <Header />

      {/* Tampilan Jika Terjadi Error Koneksi */}
      {isError ? (
        <ErrorStateView onReload={onReloadData} />
      ) : expensesData.length === 0 ? (
        /* Tampilan Jika Data Kosong */
        <EmptyStateView
          onNavigateToTambah={onNavigateToTambah}
          onReload={onReloadData}
        />
      ) : (
        /* Tampilan Utama List Pengeluaran */
        <>
          {showDeleteSuccess && <DeleteNotificationBanner />}

          <FlatList
            data={expensesData}
            keyExtractor={(item) => item.id.toString()}
            extraData={[expensesData, showDeleteSuccess]}
            renderItem={({ item }) => (
              <ExpenseCard item={item} onSelectDetail={onSelectDetail} />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <Text style={styles.footerInfoText}>
                Menampilkan {expensesData.length} pengeluaran terbaru
              </Text>
            }
          />

          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={onNavigateToTambah}
            >
              <Text style={styles.primaryButtonText}>+ Tambah Pengeluaran</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.7}
              onPress={onReloadData}
            >
              <Text style={styles.secondaryButtonText}>Muat Ulang Data</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    paddingBottom: 8,
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
  deleteBanner: {
    backgroundColor: '#FEF2F2',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#FCA5A5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  deleteBannerIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  deleteBannerText: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  newCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  cardLeft: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 8,
  },
  newBadge: {
    backgroundColor: '#15803D',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  detailLinkText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  newDetailLinkText: {
    color: '#15803D',
  },
  footerInfoText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 16,
    marginBottom: 20,
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
  iconCircleRed: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FDF2F2',
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
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#B91C1C',
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
  primaryButton: {
    backgroundColor: '#0F766E',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
});