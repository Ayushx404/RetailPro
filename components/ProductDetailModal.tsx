import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, StyleSheet, Pressable, Platform,
    TextInput, Modal, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/theme-context';
import { apiRequest, queryClient } from '@/lib/query-client';
import type { Product } from '@/lib/types';
import { DatePickerField } from './DatePickerField';

interface ProductDetailModalProps {
    visible: boolean;
    onClose: () => void;
    product: Product | null;
}

export function ProductDetailModal({ visible, onClose, product }: ProductDetailModalProps) {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState<Partial<Product>>({});
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(product);

    useEffect(() => {
        if (product) {
            setSelectedProduct(product);
            setEditData(product);
        }
        if (!visible) {
            setEditMode(false);
        }
    }, [product, visible]);

    const restockMutation = useMutation({
        mutationFn: async ({ id, qty }: { id: string; qty: number }) => {
            const res = await apiRequest('POST', `/api/products/${id}/restock`, { qty });
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['/api/products'] });
            queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
            setSelectedProduct(data);
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async () => {
            if (!selectedProduct) return;
            const res = await apiRequest('PUT', `/api/products/${selectedProduct.id}`, editData);
            return res.json();
        },
        onSuccess: (data) => {
            setSelectedProduct(data);
            setEditMode(false);
            queryClient.invalidateQueries({ queryKey: ['/api/products'] });
            queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
        },
        onError: (e: any) => Alert.alert('Error', e.message || 'Failed to update'),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiRequest('DELETE', `/api/products/${id}`);
        },
        onSuccess: () => {
            onClose();
            queryClient.invalidateQueries({ queryKey: ['/api/products'] });
            queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
        },
    });

    const getStockColor = (p: Product) => {
        if (p.stock === 0) return colors.danger;
        if (p.stock <= p.minStock) return colors.warning;
        return colors.success;
    };

    if (!selectedProduct) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
                <View
                    style={[styles.formSheet, { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 }]}
                >
                    <View style={[styles.formHeader, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.formTitle, { color: colors.text, fontFamily: 'Inter_700Bold' }]}>Product Details</Text>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <Pressable onPress={() => { if (editMode) updateMutation.mutate(); else setEditMode(true); }}>
                                <Ionicons name={editMode ? "checkmark" : "create-outline"} size={22} color={colors.tint} />
                            </Pressable>
                            <Pressable onPress={() => {
                                Alert.alert('Delete', 'Are you sure?', [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Delete', style: 'destructive', onPress: () => selectedProduct && deleteMutation.mutate(selectedProduct.id) },
                                ]);
                            }}>
                                <Ionicons name="trash-outline" size={22} color={colors.danger} />
                            </Pressable>
                            <Pressable onPress={onClose}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </Pressable>
                        </View>
                    </View>

                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                        {selectedProduct.stock <= selectedProduct.minStock && (
                            <View style={[styles.warningBanner, { backgroundColor: colors.danger + '10', borderColor: colors.danger + '30' }]}>
                                <Ionicons name="alert-circle" size={18} color={colors.danger} />
                                <Text style={[styles.warningText, { color: colors.danger, fontFamily: 'Inter_500Medium' }]}>Low stock! Below minimum ({selectedProduct.minStock})</Text>
                            </View>
                        )}
                        <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.detailName, { color: colors.text, fontFamily: 'Inter_700Bold' }]}>{selectedProduct.name}</Text>
                            <Text style={[styles.detailSku, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>{selectedProduct.sku} | {selectedProduct.category}</Text>
                            <View style={styles.detailStatsRow}>
                                <View style={[styles.detailStatBox, { backgroundColor: colors.background }]}>
                                    <Text style={[styles.detailStatValue, { color: colors.tint, fontFamily: 'Inter_700Bold' }]}>Rs.{selectedProduct.sellingPrice}</Text>
                                    <Text style={[styles.detailStatLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Price</Text>
                                </View>
                                <View style={[styles.detailStatBox, { backgroundColor: getStockColor(selectedProduct) + '10' }]}>
                                    <Text style={[styles.detailStatValue, { color: getStockColor(selectedProduct), fontFamily: 'Inter_700Bold' }]}>{selectedProduct.stock}</Text>
                                    <Text style={[styles.detailStatLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Stock</Text>
                                </View>
                                <View style={[styles.detailStatBox, { backgroundColor: colors.background }]}>
                                    <Text style={[styles.detailStatValue, { color: colors.text, fontFamily: 'Inter_700Bold' }]}>{selectedProduct.gstRate}%</Text>
                                    <Text style={[styles.detailStatLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>GST</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.detailSectionTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>Quick Restock</Text>
                            <View style={styles.restockRow}>
                                {[10, 25, 50, 100].map(qty => (
                                    <Pressable key={qty} onPress={() => restockMutation.mutate({ id: selectedProduct.id, qty })}
                                        style={[styles.restockBtn, { borderColor: colors.tint + '40' }]}>
                                        <Text style={[styles.restockBtnText, { color: colors.tint, fontFamily: 'Inter_600SemiBold' }]}>+{qty}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {editMode ? (
                            <View style={[styles.editFormContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                <Text style={[styles.detailSectionTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold', marginBottom: 16 }]}>Edit Product</Text>

                                <View style={styles.formField}>
                                    <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Product Name</Text>
                                    <TextInput
                                        style={[styles.editBoxInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg }]}
                                        value={String(editData.name || '')}
                                        onChangeText={v => setEditData(p => ({ ...p, name: v }))}
                                    />
                                </View>

                                <View style={styles.formRow}>
                                    <View style={[styles.formField, { flex: 1 }]}>
                                        <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Barcode</Text>
                                        <TextInput
                                            style={[styles.editBoxInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg }]}
                                            value={String(editData.barcode || '')}
                                            onChangeText={v => setEditData(p => ({ ...p, barcode: v }))}
                                        />
                                    </View>
                                    <View style={[styles.formField, { flex: 1 }]}>
                                        <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Category</Text>
                                        <TextInput
                                            style={[styles.editBoxInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg }]}
                                            value={String(editData.category || '')}
                                            onChangeText={v => setEditData(p => ({ ...p, category: v }))}
                                        />
                                    </View>
                                </View>

                                <View style={styles.formRow}>
                                    <View style={[styles.formField, { flex: 1 }]}>
                                        <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Selling Price (₹)</Text>
                                        <TextInput
                                            style={[styles.editBoxInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg }]}
                                            value={String(editData.sellingPrice ?? '')}
                                            onChangeText={v => setEditData(p => ({ ...p, sellingPrice: Number(v) }))}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                    <View style={[styles.formField, { flex: 1 }]}>
                                        <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Cost Price (₹)</Text>
                                        <TextInput
                                            style={[styles.editBoxInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg }]}
                                            value={String(editData.costPrice ?? '')}
                                            onChangeText={v => setEditData(p => ({ ...p, costPrice: Number(v) }))}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>

                                <View style={styles.formRow}>
                                    <View style={[styles.formField, { flex: 1 }]}>
                                        <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Stock Quantity</Text>
                                        <TextInput
                                            style={[styles.editBoxInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg }]}
                                            value={String(editData.stock ?? '')}
                                            onChangeText={v => setEditData(p => ({ ...p, stock: Number(v) }))}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                    <View style={[styles.formField, { flex: 1 }]}>
                                        <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Min Stock (Alert)</Text>
                                        <TextInput
                                            style={[styles.editBoxInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg }]}
                                            value={String(editData.minStock ?? '')}
                                            onChangeText={v => setEditData(p => ({ ...p, minStock: Number(v) }))}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>

                                <View style={styles.formRow}>
                                    <View style={[styles.formField, { flex: 1 }]}>
                                        <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Unit</Text>
                                        <TextInput
                                            style={[styles.editBoxInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg }]}
                                            value={String(editData.unit || '')}
                                            onChangeText={v => setEditData(p => ({ ...p, unit: v }))}
                                        />
                                    </View>
                                    <View style={[styles.formField, { flex: 1 }]}>
                                        <Text style={[styles.editLabel, { color: colors.textSecondary }]}>GST Rate (%)</Text>
                                        <TextInput
                                            style={[styles.editBoxInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg }]}
                                            value={String(editData.gstRate ?? '')}
                                            onChangeText={v => setEditData(p => ({ ...p, gstRate: Number(v) }))}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>

                                <View style={styles.formRow}>
                                    <View style={[styles.formField, { flex: 1 }]}>
                                        <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Manufacturing Date</Text>
                                        <DatePickerField
                                            label="Manufacturing Date"
                                            value={String(editData.manufacturingDate || '')}
                                            onChange={v => setEditData(p => ({ ...p, manufacturingDate: v }))}
                                            colors={colors}
                                        />
                                    </View>
                                    <View style={[styles.formField, { flex: 1 }]}>
                                        <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Expiry Date</Text>
                                        <DatePickerField
                                            label="Expiry Date"
                                            value={String(editData.expiryDate || '')}
                                            onChange={v => setEditData(p => ({ ...p, expiryDate: v }))}
                                            colors={colors}
                                        />
                                    </View>
                                </View>

                                <View style={styles.formRow}>
                                    <View style={[styles.formField, { flex: 1 }]}>
                                        <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Supplier</Text>
                                        <TextInput
                                            style={[styles.editBoxInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg }]}
                                            value={String(editData.supplier || '')}
                                            onChangeText={v => setEditData(p => ({ ...p, supplier: v }))}
                                        />
                                    </View>
                                    <View style={[styles.formField, { flex: 1 }]}>
                                        <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Batch No.</Text>
                                        <TextInput
                                            style={[styles.editBoxInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg }]}
                                            value={String(editData.batchNo || '')}
                                            onChangeText={v => setEditData(p => ({ ...p, batchNo: v }))}
                                        />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                                    <Pressable onPress={() => setEditMode(false)} style={[styles.actionBtn, { borderColor: colors.border, flex: 1 }]}>
                                        <Text style={[styles.actionBtnText, { color: colors.text }]}>Cancel</Text>
                                    </Pressable>
                                    <Pressable onPress={() => updateMutation.mutate()} style={[styles.actionBtn, { backgroundColor: '#2563eb', flex: 1, borderColor: '#2563eb' }]}>
                                        <Ionicons name="save-outline" size={18} color="#fff" />
                                        <Text style={[styles.actionBtnText, { color: '#fff', fontWeight: '600' }]}>Update Product</Text>
                                    </Pressable>
                                </View>
                            </View>
                        ) : (
                            <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                <Text style={[styles.detailSectionTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>Details</Text>
                                {[
                                    { label: 'Cost Price', value: `Rs.${selectedProduct.costPrice}` },
                                    { label: 'Min Stock Level', value: String(selectedProduct.minStock) },
                                    { label: 'GST Rate', value: `${selectedProduct.gstRate}%` },
                                    { label: 'Section', value: selectedProduct.section || '-' },
                                    { label: 'Expiry Date', value: selectedProduct.expiryDate ? new Date(selectedProduct.expiryDate).toLocaleDateString('en-IN') : '-' },
                                    { label: 'Last Updated', value: selectedProduct.lastUpdated },
                                ].map(d => (
                                    <View key={d.label} style={styles.detailRow}>
                                        <Text style={[styles.detailRowLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>{d.label}</Text>
                                        <Text style={[styles.detailRowValue, { color: colors.text, fontFamily: 'Inter_500Medium' }]}>{d.value}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, justifyContent: 'flex-end' },
    formSheet: { height: '90%', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
    formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
    formTitle: { fontSize: 18 },
    formField: { marginBottom: 14 },
    formRow: { flexDirection: 'row', gap: 12 },
    warningBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
    warningText: { fontSize: 13, flex: 1 },
    detailCard: { borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 12 },
    detailName: { fontSize: 18 },
    detailSku: { fontSize: 12, marginTop: 2, marginBottom: 12 },
    detailStatsRow: { flexDirection: 'row', gap: 10 },
    detailStatBox: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
    detailStatValue: { fontSize: 18 },
    detailStatLabel: { fontSize: 11, marginTop: 2 },
    detailSectionTitle: { fontSize: 15, marginBottom: 12 },
    restockRow: { flexDirection: 'row', gap: 10 },
    restockBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
    restockBtnText: { fontSize: 15 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#33415530' },
    detailRowLabel: { fontSize: 13 },
    detailRowValue: { fontSize: 13 },
    editLabel: { fontSize: 11, marginBottom: 4 },
    editFormContainer: { borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1 },
    editBoxInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, height: 40, fontSize: 13 },
    actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 44, borderRadius: 10, borderWidth: 1, gap: 8 },
    actionBtnText: { fontSize: 14 },
});
