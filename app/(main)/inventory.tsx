import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Platform,
  TextInput, FlatList, Modal, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/theme-context';
import { apiRequest, queryClient } from '@/lib/query-client';
import type { Product } from '@/lib/types';

import { DatePickerField } from '@/components/DatePickerField';
import { ProductDetailModal } from '@/components/ProductDetailModal';

export default function InventoryScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All Stock');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: '', barcode: '', category: 'Groceries', sellingPrice: '', costPrice: '',
    stock: '', minStock: '', unit: 'pcs', gstRate: '5', manufacturingDate: '', expiryDate: '',
    supplier: '', batchNo: '', section: '',
  });

  const CATEGORIES = ['All', 'Groceries', 'Dairy', 'Household', 'Personal Care', 'Beverages', 'Snacks', 'Frozen Foods'];
  const STOCK_FILTERS = ['All Stock', 'Low Stock', 'Out of Stock', 'In Stock'];

  const productsQuery = useQuery<Product[]>({ queryKey: ['/api/products'] });
  const products = productsQuery.data || [];

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== 'All') list = list.filter(p => p.category === selectedCategory);
    if (stockFilter === 'Low Stock') list = list.filter(p => p.stock > 0 && p.stock <= p.minStock);
    else if (stockFilter === 'Out of Stock') list = list.filter(p => p.stock === 0);
    else if (stockFilter === 'In Stock') list = list.filter(p => p.stock > p.minStock);
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search));
    return list;
  }, [products, selectedCategory, stockFilter, search]);

  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const inventoryValue = products.reduce((s, p) => s + p.costPrice * p.stock, 0);

  const addMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/products', {
        ...newProduct, sellingPrice: Number(newProduct.sellingPrice), costPrice: Number(newProduct.costPrice),
        stock: Number(newProduct.stock), minStock: Number(newProduct.minStock), gstRate: Number(newProduct.gstRate),
      });
      return res.json();
    },
    onSuccess: () => {
      setShowAddModal(false);
      setNewProduct({ name: '', barcode: '', category: 'Groceries', sellingPrice: '', costPrice: '', stock: '', minStock: '', unit: 'pcs', gstRate: '5', manufacturingDate: '', expiryDate: '', supplier: '', batchNo: '', section: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    onError: (e: any) => Alert.alert('Error', e.message || 'Failed to add product'),
  });

  const getExpiryColor = (date: string) => {
    if (!date) return colors.textMuted;
    const days = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days <= 7) return colors.danger;
    if (days <= 30) return colors.warning;
    return colors.success;
  };

  const getStockColor = (p: Product) => {
    if (p.stock === 0) return colors.danger;
    if (p.stock <= p.minStock) return colors.warning;
    return colors.success;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 8) }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'Inter_700Bold' }]}>Inventory</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>Manage products & stock levels</Text>
        </View>
        <Pressable onPress={() => setShowAddModal(true)} style={[styles.addBtn, { backgroundColor: colors.tint }]}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={[styles.addBtnText, { fontFamily: 'Inter_600SemiBold' }]}>Add</Text>
        </Pressable>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.miniStat, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="package-variant" size={20} color={colors.tint} />
          <Text style={[styles.miniStatValue, { color: colors.text, fontFamily: 'Inter_700Bold' }]}>{totalProducts}</Text>
          <Text style={[styles.miniStatLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Total</Text>
        </View>
        <View style={[styles.miniStat, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="warning" size={20} color={colors.warning} />
          <Text style={[styles.miniStatValue, { color: colors.warning, fontFamily: 'Inter_700Bold' }]}>{lowStockCount}</Text>
          <Text style={[styles.miniStatLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Low Stock</Text>
        </View>
        <View style={[styles.miniStat, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="close-circle" size={20} color={colors.danger} />
          <Text style={[styles.miniStatValue, { color: colors.danger, fontFamily: 'Inter_700Bold' }]}>{outOfStock}</Text>
          <Text style={[styles.miniStatLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Out</Text>
        </View>
        <View style={[styles.miniStat, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="currency-inr" size={20} color={colors.success} />
          <Text style={[styles.miniStatValue, { color: colors.success, fontFamily: 'Inter_700Bold' }]}>{inventoryValue >= 100000 ? (inventoryValue / 100000).toFixed(1) + 'L' : (inventoryValue / 1000).toFixed(0) + 'K'}</Text>
          <Text style={[styles.miniStatLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Value</Text>
        </View>
      </View>

      <View style={[styles.searchRow, { backgroundColor: colors.inputBg, marginHorizontal: 16, borderColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text, fontFamily: 'Inter_400Regular' }]}
          placeholder="Search by name or barcode..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {CATEGORIES.map(cat => (
            <Pressable key={cat} onPress={() => setSelectedCategory(cat)}
              style={[styles.filterPill, { backgroundColor: selectedCategory === cat ? colors.tint : colors.card, borderColor: colors.border }]}>
              <Text style={[styles.filterPillText, { color: selectedCategory === cat ? '#fff' : colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {STOCK_FILTERS.map(f => (
            <Pressable key={f} onPress={() => setStockFilter(f)}
              style={[styles.filterPill, { backgroundColor: stockFilter === f ? colors.accent : colors.card, borderColor: colors.border }]}>
              <Text style={[styles.filterPillText, { color: stockFilter === f ? '#fff' : colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={p => p.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={filtered.length > 0}
        renderItem={({ item: p }) => (
          <Pressable
            onPress={() => { setSelectedProduct(p); setShowDetailModal(true); }}
            style={[styles.productRow, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.productName, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]} numberOfLines={1}>{p.name}</Text>
              <Text style={[styles.productMeta, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>{p.category} | {p.sku}</Text>
            </View>
            <View style={styles.productStats}>
              <Text style={[styles.productPrice, { color: colors.tint, fontFamily: 'Inter_700Bold' }]}>Rs.{p.sellingPrice}</Text>
              <View style={[styles.stockPill, { backgroundColor: getStockColor(p) + '15' }]}>
                <Text style={[styles.stockPillText, { color: getStockColor(p), fontFamily: 'Inter_600SemiBold' }]}>{p.stock}</Text>
              </View>
            </View>
            <View style={[styles.expiryDot, { backgroundColor: getExpiryColor(p.expiryDate) }]} />
          </Pressable>
        )}
      />

      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View
            style={[styles.formSheet, { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 }]}
          >
            <View style={[styles.formHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.formTitle, { color: colors.text, fontFamily: 'Inter_700Bold' }]}>Add New Product</Text>
              <Pressable onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
              {[
                { label: 'Product Name', key: 'name', placeholder: 'Product Name' },
                { label: 'Barcode', key: 'barcode', placeholder: 'Barcode' },
              ].map(f => (
                <View key={f.key} style={styles.formField}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>{f.label}</Text>
                  <TextInput
                    style={[styles.formInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border, fontFamily: 'Inter_400Regular' }]}
                    placeholder={f.placeholder}
                    placeholderTextColor={colors.textMuted}
                    value={(newProduct as any)[f.key]}
                    onChangeText={v => setNewProduct(prev => ({ ...prev, [f.key]: v }))}
                  />
                </View>
              ))}
              <View style={styles.formRow}>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>Selling Price</Text>
                  <TextInput style={[styles.formInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border, fontFamily: 'Inter_400Regular' }]} placeholder="0" placeholderTextColor={colors.textMuted} value={newProduct.sellingPrice} onChangeText={v => setNewProduct(p => ({ ...p, sellingPrice: v }))} keyboardType="numeric" />
                </View>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>Cost Price</Text>
                  <TextInput style={[styles.formInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border, fontFamily: 'Inter_400Regular' }]} placeholder="0" placeholderTextColor={colors.textMuted} value={newProduct.costPrice} onChangeText={v => setNewProduct(p => ({ ...p, costPrice: v }))} keyboardType="numeric" />
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>Stock</Text>
                  <TextInput style={[styles.formInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border, fontFamily: 'Inter_400Regular' }]} placeholder="0" placeholderTextColor={colors.textMuted} value={newProduct.stock} onChangeText={v => setNewProduct(p => ({ ...p, stock: v }))} keyboardType="numeric" />
                </View>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>Min Stock</Text>
                  <TextInput style={[styles.formInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border, fontFamily: 'Inter_400Regular' }]} placeholder="0" placeholderTextColor={colors.textMuted} value={newProduct.minStock} onChangeText={v => setNewProduct(p => ({ ...p, minStock: v }))} keyboardType="numeric" />
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>Unit</Text>
                  <TextInput style={[styles.formInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border, fontFamily: 'Inter_400Regular' }]} value={newProduct.unit} onChangeText={v => setNewProduct(p => ({ ...p, unit: v }))} />
                </View>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>GST %</Text>
                  <TextInput style={[styles.formInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border, fontFamily: 'Inter_400Regular' }]} value={newProduct.gstRate} onChangeText={v => setNewProduct(p => ({ ...p, gstRate: v }))} keyboardType="numeric" />
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>Mfg. Date</Text>
                  <DatePickerField
                    label="Manufacturing Date"
                    value={newProduct.manufacturingDate}
                    onChange={v => setNewProduct(p => ({ ...p, manufacturingDate: v }))}
                    colors={colors}
                  />
                </View>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>Expiry Date</Text>
                  <DatePickerField
                    label="Expiry Date"
                    value={newProduct.expiryDate}
                    onChange={v => setNewProduct(p => ({ ...p, expiryDate: v }))}
                    colors={colors}
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.catSelectRow}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <Pressable key={c} onPress={() => setNewProduct(p => ({ ...p, category: c }))}
                        style={[styles.catSelectPill, { backgroundColor: newProduct.category === c ? colors.tint : colors.inputBg, borderColor: colors.border }]}>
                        <Text style={[styles.catSelectText, { color: newProduct.category === c ? '#fff' : colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>{c}</Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>
              <Pressable onPress={() => addMutation.mutate()} disabled={addMutation.isPending || !newProduct.name}
                style={[styles.submitBtn, { backgroundColor: colors.success, opacity: addMutation.isPending || !newProduct.name ? 0.5 : 1 }]}>
                <Ionicons name="add-circle" size={20} color="#fff" />
                <Text style={[styles.submitBtnText, { fontFamily: 'Inter_600SemiBold' }]}>{addMutation.isPending ? 'Adding...' : 'Add Product'}</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ProductDetailModal
        visible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        product={selectedProduct}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 22 },
  headerSub: { fontSize: 13, marginTop: 2 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  addBtnText: { fontSize: 14, color: '#fff' },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 12 },
  miniStat: { flex: 1, paddingVertical: 12, borderRadius: 14, borderWidth: 1, alignItems: 'center', gap: 4 },
  miniStatValue: { fontSize: 18 },
  miniStatLabel: { fontSize: 11 },
  searchRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 14, height: 44, gap: 8, borderWidth: 1, marginBottom: 10 },
  searchInput: { flex: 1, fontSize: 14, height: '100%' },
  filterRow: { marginBottom: 6 },
  filterScroll: { paddingHorizontal: 16, gap: 8 },
  filterPill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18, borderWidth: 1, minWidth: 70, alignItems: 'center', justifyContent: 'center' },
  filterPillText: { fontSize: 12, textAlign: 'center' },
  productRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8, gap: 8 },
  productName: { fontSize: 14 },
  productMeta: { fontSize: 11, marginTop: 2 },
  productStats: { alignItems: 'flex-end', gap: 4 },
  productPrice: { fontSize: 14 },
  stockPill: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 8 },
  stockPillText: { fontSize: 12 },
  expiryDot: { width: 8, height: 8, borderRadius: 4 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  formSheet: { height: '90%', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  formTitle: { fontSize: 18 },
  formField: { marginBottom: 14 },
  formLabel: { fontSize: 12, marginBottom: 6 },
  formInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, height: 44, fontSize: 14 },
  formRow: { flexDirection: 'row', gap: 12 },
  catSelectRow: { flexDirection: 'row', gap: 8 },
  catSelectPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  catSelectText: { fontSize: 12 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48, borderRadius: 12, gap: 8, marginTop: 16 },
  submitBtnText: { fontSize: 15, color: '#fff' },
});
