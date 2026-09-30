import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';

const CATEGORIES = [
  'Tanpa Kategori',
  'Makanan',
  'Transportasi',
  'Hiburan',
  'Belanja',
];

export default function Kategori({ onSelectCategory, onBack, currentCategory }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Pilih Kategori</Text>
          <Text style={styles.subtitle}>Kategorikan pengeluaran Anda</Text>
        </View>
      </View>

      {/* List Kategori */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {CATEGORIES.map((item) => {
          const isSelected = currentCategory === item || (item === 'Tanpa Kategori' && !currentCategory);
          return (
            <TouchableOpacity
              key={item}
              style={[styles.categoryCard, isSelected && styles.selectedCard]}
              activeOpacity={0.7}
              onPress={() => onSelectCategory(item === 'Tanpa Kategori' ? '' : item)}
            >
              <Text style={[styles.categoryText, isSelected && styles.selectedText]}>
                {item}
              </Text>
              <Text style={[styles.arrowIcon, isSelected && styles.selectedIcon]}>
                {isSelected ? '✓' : '›'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedCard: {
    borderColor: '#0D7C66',
    borderWidth: 1.5,
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  selectedText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  arrowIcon: {
    fontSize: 18,
    color: '#64748B',
  },
  selectedIcon: {
    color: '#0D7C66',
    fontWeight: 'bold',
  },
});