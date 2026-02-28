This file is a merged representation of a subset of the codebase, containing specifically included files and files not matching ignore patterns, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of a subset   of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
- Pay special attention to the Repository Description. These contain important context and guidelines specific to this project.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: app/**/*, components/**/*, constants/**/*, lib/**/*, server/**/*, shared/**/*, scripts/**/*, *.json, *.js, *.ts, *.tsx
- Files matching these patterns are excluded: **/node_modules/**, **/.git/**, **/.expo/**, **/.local/**, **/.config/**, **/assets/**, **/attached_assets/**, **/server_dist/**, server/serviceAccountKey.json, package-lock.json, .env, .env.*, repomix-output.md
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# User Provided Header
Repomix aggregated codebase for Retail-Pro

# Directory Structure
```
app.json
app/_layout.tsx
app/(main)/_layout.tsx
app/(main)/dashboard.tsx
app/(main)/employees.tsx
app/(main)/inventory.tsx
app/(main)/pos.tsx
app/(main)/profile.tsx
app/(main)/reports.tsx
app/(main)/transactions.tsx
app/index.tsx
babel.config.js
components/DatePickerField.tsx
components/ErrorBoundary.tsx
components/ErrorFallback.tsx
components/KeyboardAwareScrollViewCompat.tsx
components/ProductDetailModal.tsx
constants/colors.ts
drizzle.config.ts
eas.json
eslint.config.js
lib/auth-context.tsx
lib/query-client.ts
lib/theme-context.tsx
lib/types.ts
metro.config.js
package.json
repomix.config.json
scripts/build.js
server/index.ts
server/routes.ts
server/storage.ts
server/templates/landing-page.html
shared/schema.ts
tsconfig.json
```

# Files

## File: components/DatePickerField.tsx
```typescript
import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Parses 'YYYY-MM-DD' safely
function parseLocalDate(str: string): Date | null {
    if (!str || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function formatDateStr(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

interface DatePickerFieldProps {
    label: string;
    value: string; // 'YYYY-MM-DD' or ''
    onChange: (val: string) => void;
    colors: any;
}

export function DatePickerField({ label, value, onChange, colors }: DatePickerFieldProps) {
    const [open, setOpen] = useState(false);
    const parsed = parseLocalDate(value);
    const today = new Date();

    const [viewYear, setViewYear] = useState(parsed ? parsed.getFullYear() : today.getFullYear());
    const [viewMonth, setViewMonth] = useState(parsed ? parsed.getMonth() : today.getMonth());

    const openCalendar = useCallback(() => {
        const d = parseLocalDate(value);
        if (d) { setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }
        else { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); }
        setOpen(true);
    }, [value]);

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const cells: (number | null)[] = [
        ...Array(firstWeekday).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const selectDay = (day: number) => {
        const selected = new Date(viewYear, viewMonth, day);
        onChange(formatDateStr(selected));
        setOpen(false);
    };

    const isSelected = (day: number) => {
        if (!parsed) return false;
        return parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth && parsed.getDate() === day;
    };

    const isToday = (day: number) =>
        today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;

    const displayValue = parsed
        ? `${String(parsed.getDate()).padStart(2, '0')} ${MONTH_NAMES[parsed.getMonth()].slice(0, 3)} ${parsed.getFullYear()}`
        : 'Select date';

    return (
        <View style={{ marginBottom: 0 }}>
            <Pressable
                onPress={openCalendar}
                style={[calStyles.dateBtn, { borderColor: colors.border, backgroundColor: colors.inputBg }]}
            >
                <Ionicons name="calendar-outline" size={16} color={parsed ? colors.tint : colors.textMuted} />
                <Text style={[calStyles.dateBtnText, { color: parsed ? colors.text : colors.textMuted }]}>
                    {displayValue}
                </Text>
                {parsed && (
                    <Pressable onPress={() => { onChange(''); }} hitSlop={8}>
                        <Ionicons name="close-circle" size={15} color={colors.textMuted} />
                    </Pressable>
                )}
            </Pressable>

            <Modal visible={open} transparent animationType="fade">
                <Pressable style={calStyles.calOverlay} onPress={() => setOpen(false)}>
                    <Pressable
                        onPress={e => e.stopPropagation()}
                        style={[calStyles.calCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                    >
                        <View style={calStyles.calHeader}>
                            <Pressable onPress={prevMonth} style={calStyles.calNavBtn}>
                                <Ionicons name="chevron-back" size={20} color={colors.text} />
                            </Pressable>
                            <Text style={[calStyles.calMonthLabel, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>
                                {MONTH_NAMES[viewMonth]} {viewYear}
                            </Text>
                            <Pressable onPress={nextMonth} style={calStyles.calNavBtn}>
                                <Ionicons name="chevron-forward" size={20} color={colors.text} />
                            </Pressable>
                        </View>

                        <View style={calStyles.calDayRow}>
                            {DAY_LABELS.map(d => (
                                <Text key={d} style={[calStyles.calDayLabel, { color: colors.textMuted, fontFamily: 'Inter_500Medium' }]}>{d}</Text>
                            ))}
                        </View>

                        <View style={calStyles.calGrid}>
                            {cells.map((day, idx) => (
                                <View key={idx} style={calStyles.calCell}>
                                    {day !== null && (
                                        <Pressable
                                            onPress={() => selectDay(day)}
                                            style={[
                                                calStyles.calDayBtn,
                                                isSelected(day) && { backgroundColor: colors.tint },
                                                !isSelected(day) && isToday(day) && { borderWidth: 1.5, borderColor: colors.tint },
                                            ]}
                                        >
                                            <Text style={[
                                                calStyles.calDayText,
                                                { color: isSelected(day) ? '#fff' : isToday(day) ? colors.tint : colors.text },
                                                { fontFamily: isSelected(day) ? 'Inter_700Bold' : 'Inter_400Regular' },
                                            ]}>
                                                {day}
                                            </Text>
                                        </Pressable>
                                    )}
                                </View>
                            ))}
                        </View>

                        <Pressable
                            onPress={() => setOpen(false)}
                            style={[calStyles.calCloseBtn, { borderTopColor: colors.border }]}
                        >
                            <Text style={[calStyles.calCloseBtnText, { color: colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>Close</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

const calStyles = StyleSheet.create({
    dateBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, height: 40,
    },
    dateBtnText: { flex: 1, fontSize: 13 },
    calOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center', alignItems: 'center', padding: 20,
    },
    calCard: {
        width: '100%', maxWidth: 340,
        borderRadius: 20, borderWidth: 1,
        overflow: 'hidden',
    },
    calHeader: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16,
    },
    calNavBtn: {
        width: 34, height: 34, borderRadius: 10,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(128,128,128,0.12)',
    },
    calMonthLabel: { fontSize: 16 },
    calDayRow: {
        flexDirection: 'row', paddingHorizontal: 12, marginBottom: 4,
    },
    calDayLabel: { flex: 1, textAlign: 'center', fontSize: 12 },
    calGrid: {
        flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 12,
    },
    calCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', padding: 2 },
    calDayBtn: { width: '100%', height: '100%', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    calDayText: { fontSize: 13 },
    calCloseBtn: { height: 50, alignItems: 'center', justifyContent: 'center', borderTopWidth: 1 },
    calCloseBtnText: { fontSize: 15 },
});
```

## File: components/ProductDetailModal.tsx
```typescript
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
```

## File: repomix.config.json
```json
{
    "output": {
        "filePath": "repomix-output.md",
        "style": "markdown",
        "removeComments": false,
        "removeEmptyLines": false,
        "topFilesLength": 5,
        "showLineNumbers": false,
        "copyToClipboard": false,
        "headerText": "Repomix aggregated codebase for Retail-Pro"
    },
    "include": [
        "app/**/*",
        "components/**/*",
        "constants/**/*",
        "lib/**/*",
        "server/**/*",
        "shared/**/*",
        "scripts/**/*",
        "*.json",
        "*.js",
        "*.ts",
        "*.tsx"
    ],
    "ignore": {
        "customPatterns": [
            "**/node_modules/**",
            "**/.git/**",
            "**/.expo/**",
            "**/.local/**",
            "**/.config/**",
            "**/assets/**",
            "**/attached_assets/**",
            "**/server_dist/**",
            "server/serviceAccountKey.json",
            "package-lock.json",
            ".env",
            ".env.*",
            "repomix-output.md"
        ],
        "useGitignore": true,
        "useDefaultPatterns": true
    },
    "security": {
        "enableSecurityCheck": true
    }
}
```

## File: app/(main)/profile.tsx
```typescript
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const { colors, isDark, toggleTheme } = useTheme();
    const insets = useSafeAreaInsets();

    if (!user) return null;

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 20 }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>My Profile</Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.avatar}>
                    <Text style={[styles.avatarText, { color: colors.tint }]}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                </View>
                <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
                <Text style={[styles.role, { color: colors.textMuted }]}>{user.role}</Text>

                <View style={[styles.infoRow, { borderTopColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
                    <Text style={[styles.value, { color: colors.text }]}>{user.email}</Text>
                </View>
                <View style={[styles.infoRow, { borderTopColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Phone</Text>
                    <Text style={[styles.value, { color: colors.text }]}>{user.phone}</Text>
                </View>
                <View style={[styles.infoRow, { borderTopColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Joined</Text>
                    <Text style={[styles.value, { color: colors.text }]}>
                        {new Date(user.joinedDate).toLocaleDateString()}
                    </Text>
                </View>
            </View>

            <View style={styles.actions}>
                <Pressable
                    onPress={toggleTheme}
                    style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                    <Ionicons name={isDark ? "sunny" : "moon"} size={20} color={colors.text} />
                    <Text style={[styles.actionText, { color: colors.text }]}>
                        {isDark ? "Light Mode" : "Dark Mode"}
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => { logout(); router.replace('/'); }}
                    style={[styles.actionBtn, { backgroundColor: colors.danger + '10', borderColor: colors.danger + '30' }]}
                >
                    <Ionicons name="log-out-outline" size={20} color={colors.danger} />
                    <Text style={[styles.actionText, { color: colors.danger }]}>Logout</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { marginBottom: 20 },
    title: { fontSize: 24, fontFamily: 'Inter_700Bold' },
    card: { borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, marginBottom: 20 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    avatarText: { fontSize: 32, fontFamily: 'Inter_700Bold' },
    name: { fontSize: 20, fontFamily: 'Inter_600SemiBold', marginBottom: 4 },
    role: { fontSize: 14, fontFamily: 'Inter_400Regular', marginBottom: 20 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 12, borderTopWidth: 1 },
    label: { fontSize: 14, fontFamily: 'Inter_400Regular' },
    value: { fontSize: 14, fontFamily: 'Inter_500Medium' },
    actions: { gap: 12 },
    actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 12, borderWidth: 1 },
    actionText: { fontSize: 16, fontFamily: 'Inter_500Medium' },
});
```

## File: app/(main)/transactions.tsx
```typescript
import React, { useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, SectionList, TextInput, RefreshControl,
    Platform, Pressable, Modal, ScrollView, TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/theme-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import type { Transaction } from '@/lib/types';

export default function TransactionsScreen() {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const [search, setSearch] = useState('');
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
    const [filter, setFilter] = useState<'today' | '7days' | '30days' | 'all'>('all');

    const { data: transactions, refetch, isRefetching } = useQuery<Transaction[]>({
        queryKey: [`/api/transactions${filter !== 'all' ? `?filter=${filter}` : ''}`]
    });

    const filtered = useMemo(() => {
        if (!transactions) return [];

        // 1. Sort by date descending (Newest first)
        let sortedItems = [...transactions].sort((a, b) => {
            const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return db - da;
        });

        // 2. Apply Search
        if (search) {
            const q = search.toLowerCase();
            sortedItems = sortedItems.filter(t =>
                t.invoiceNo.toLowerCase().includes(q) ||
                (t.customerPhone && t.customerPhone.toLowerCase().includes(q)) ||
                (t.cashierName && t.cashierName.toLowerCase().includes(q))
            );
        }

        // 3. Group by Date for SectionList
        const sections: { title: string, data: Transaction[] }[] = [];
        sortedItems.forEach(t => {
            let dateStr = "Unknown Date";
            if (t.createdAt) {
                const d = new Date(t.createdAt);
                if (!isNaN(d.getTime())) {
                    // Manual formatting for cross-platform consistency
                    const day = d.getDate();
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const month = months[d.getMonth()];
                    const year = d.getFullYear();
                    dateStr = `${day} ${month} ${year}`;
                }
            }

            const existing = sections.find(s => s.title === dateStr);
            if (existing) {
                existing.data.push(t);
            } else {
                sections.push({ title: dateStr, data: [t] });
            }
        });

        return sections;
    }, [transactions, search, filter]);

    const getPaymentIcon = (method: string) => {
        switch (method) {
            case 'Cash': return 'cash-outline';
            case 'Card': return 'card-outline';
            case 'UPI': return 'phone-portrait-outline';
            default: return 'wallet-outline';
        }
    };

    const renderItem = ({ item }: { item: Transaction }) => {
        // Show first 3 items, and a "+N more" label if needed
        const displayItems = item.items.slice(0, 3);
        const extraCount = item.items.length - displayItems.length;

        return (
            <Pressable
                onPress={() => setSelectedTx(item)}
                style={({ pressed }) => [
                    styles.card,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    pressed && { opacity: 0.85 }
                ]}
            >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <View style={styles.invoiceRow}>
                            <View style={[styles.payBadge, { backgroundColor: colors.tint + '20' }]}>
                                <Ionicons name={getPaymentIcon(item.paymentMethod) as any} size={12} color={colors.tint} />
                                <Text style={[styles.payBadgeText, { color: colors.tint }]}>{item.paymentMethod}</Text>
                            </View>
                            <Text style={[styles.invoice, { color: colors.text }]} numberOfLines={1}>
                                {item.invoiceNo}
                            </Text>
                        </View>
                        <Text style={[styles.date, { color: colors.textMuted }]}>
                            {new Date(item.createdAt).toLocaleString()}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[styles.amount, { color: colors.text }]}>Rs.{item.total.toFixed(2)}</Text>
                        <View style={[styles.successBadge, { backgroundColor: colors.success + '20' }]}>
                            <Text style={[styles.successText, { color: colors.success }]}>Success</Text>
                        </View>
                    </View>
                </View>

                {/* Item Preview List */}
                <View style={[styles.itemPreviewList, { borderTopColor: colors.border }]}>
                    {displayItems.map((prod, idx) => (
                        <View key={idx} style={styles.previewRow}>
                            <Text style={[styles.previewName, { color: colors.textSecondary }]} numberOfLines={1}>
                                {prod.productName}
                            </Text>
                            <Text style={[styles.previewQty, { color: colors.textMuted }]}>x{prod.qty}</Text>
                            <Text style={[styles.previewPrice, { color: colors.text }]}>Rs.{prod.total.toFixed(0)}</Text>
                        </View>
                    ))}
                    {extraCount > 0 && (
                        <Text style={[styles.moreItems, { color: colors.tint }]}>+{extraCount} more item{extraCount > 1 ? 's' : ''}</Text>
                    )}
                </View>

                {/* Card Footer */}
                <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                    <View style={styles.footerItem}>
                        <Ionicons name="person-outline" size={11} color={colors.textMuted} />
                        <Text style={[styles.footerText, { color: colors.textMuted }]}>{item.cashierName || 'Unknown'}</Text>
                    </View>
                    <View style={styles.footerItem}>
                        <Ionicons name="cube-outline" size={11} color={colors.textMuted} />
                        <Text style={[styles.footerText, { color: colors.textMuted }]}>{item.items?.length || 0} items</Text>
                    </View>
                    <View style={styles.footerItem}>
                        <Ionicons name="chevron-forward" size={14} color={colors.tint} />
                        <Text style={[styles.footerTextBlue, { color: colors.tint }]}>View Details</Text>
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Transactions</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>History of all sales</Text>
            </View>

            <View style={[styles.searchContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Ionicons name="search" size={20} color={colors.textMuted} />
                <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Search invoice, cashier..."
                    placeholderTextColor={colors.textMuted}
                    value={search}
                    onChangeText={setSearch}
                />
                {search.length > 0 && (
                    <Pressable onPress={() => setSearch('')}>
                        <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                    </Pressable>
                )}
            </View>

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
                    {(['today', '7days', '30days', 'all'] as const).map(f => {
                        const isSelected = filter === f;
                        return (
                            <Pressable
                                key={f}
                                onPress={() => setFilter(f)}
                                style={[
                                    styles.filterChip,
                                    { backgroundColor: isSelected ? colors.tint : colors.card, borderColor: isSelected ? colors.tint : colors.border }
                                ]}
                            >
                                <Text style={[
                                    styles.filterChipText,
                                    { color: isSelected ? '#fff' : colors.textSecondary }
                                ]}>
                                    {f === 'today' ? 'Today' : f === '7days' ? '7 Days' : f === '30days' ? '30 Days' : 'All Time'}
                                </Text>
                            </Pressable>
                        )
                    })}
                </ScrollView>
            </View>

            <SectionList
                sections={filtered}
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
                        <Text style={[styles.sectionHeaderText, { color: colors.text }]}>{title}</Text>
                    </View>
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.tint} />
                }
                stickySectionHeadersEnabled={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="receipt-outline" size={48} color={colors.textMuted} />
                        <Text style={[styles.emptyText, { color: colors.textMuted }]}>No transactions found</Text>
                    </View>
                }
            />

            {/* Transaction Detail Modal */}
            <Modal visible={!!selectedTx} transparent animationType="slide" onRequestClose={() => setSelectedTx(null)}>
                <View style={styles.modalOverlay}>
                    <Pressable style={styles.modalBackdrop} onPress={() => setSelectedTx(null)} />
                    <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
                        {selectedTx && (
                            <>
                                {/* Modal Handle */}
                                <View style={[styles.handle, { backgroundColor: colors.border }]} />

                                {/* Modal Header */}
                                <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedTx.invoiceNo}</Text>
                                        <Text style={[styles.modalDate, { color: colors.textMuted }]}>
                                            {new Date(selectedTx.createdAt).toLocaleString()}
                                        </Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end', gap: 6 }}>
                                        <View style={[styles.payBadge, { backgroundColor: colors.tint + '20' }]}>
                                            <Ionicons name={getPaymentIcon(selectedTx.paymentMethod) as any} size={12} color={colors.tint} />
                                            <Text style={[styles.payBadgeText, { color: colors.tint }]}>{selectedTx.paymentMethod}</Text>
                                        </View>
                                        <View style={[styles.successBadge, { backgroundColor: colors.success + '20' }]}>
                                            <Text style={[styles.successText, { color: colors.success }]}>✓ Success</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => setSelectedTx(null)} style={styles.closeBtn}>
                                        <Ionicons name="close" size={22} color={colors.text} />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
                                    {/* Cashier Info */}
                                    <View style={[styles.infoRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                        <View style={styles.infoItem}>
                                            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Cashier</Text>
                                            <Text style={[styles.infoValue, { color: colors.text }]}>{selectedTx.cashierName || 'Unknown'}</Text>
                                        </View>
                                        <View style={[styles.infoSep, { backgroundColor: colors.border }]} />
                                        <View style={styles.infoItem}>
                                            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Items</Text>
                                            <Text style={[styles.infoValue, { color: colors.text }]}>{selectedTx.items.length}</Text>
                                        </View>
                                        {selectedTx.customerPhone ? (
                                            <>
                                                <View style={[styles.infoSep, { backgroundColor: colors.border }]} />
                                                <View style={styles.infoItem}>
                                                    <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Customer</Text>
                                                    <Text style={[styles.infoValue, { color: colors.text }]}>{selectedTx.customerPhone}</Text>
                                                </View>
                                            </>
                                        ) : null}
                                    </View>

                                    {/* Items List */}
                                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Purchased Items</Text>
                                    <View style={[styles.itemsCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                        {selectedTx.items.map((prod, idx) => (
                                            <View
                                                key={idx}
                                                style={[
                                                    styles.itemRow,
                                                    idx < selectedTx.items.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 0.5 }
                                                ]}
                                            >
                                                <View style={[styles.itemIndexBadge, { backgroundColor: colors.tint + '15' }]}>
                                                    <Text style={[styles.itemIndexText, { color: colors.tint }]}>{idx + 1}</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={[styles.itemName, { color: colors.text }]}>{prod.productName}</Text>
                                                    <Text style={[styles.itemMeta, { color: colors.textMuted }]}>
                                                        Rs.{prod.price.toFixed(2)} × {prod.qty}  •  GST {prod.gstRate}%
                                                    </Text>
                                                </View>
                                                <Text style={[styles.itemAmt, { color: colors.text }]}>Rs.{prod.total.toFixed(2)}</Text>
                                            </View>
                                        ))}
                                    </View>

                                    {/* Price Breakdown */}
                                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Price Breakdown</Text>
                                    <View style={[styles.breakdownCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                        {/* Subtotal */}
                                        <View style={styles.breakdownRow}>
                                            <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>Subtotal</Text>
                                            <Text style={[styles.breakdownValue, { color: colors.text }]}>Rs.{selectedTx.subtotal.toFixed(2)}</Text>
                                        </View>

                                        {/* Discount */}
                                        <View style={styles.breakdownRow}>
                                            <View style={styles.breakdownLabelRow}>
                                                <Ionicons name="pricetag-outline" size={13} color={colors.danger} />
                                                <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>Discount</Text>
                                            </View>
                                            <Text style={[styles.breakdownValue, { color: selectedTx.discount > 0 ? colors.danger : colors.textSecondary }]}>
                                                {selectedTx.discount > 0 ? `- Rs.${selectedTx.discount.toFixed(2)}` : 'Rs.0.00'}
                                            </Text>
                                        </View>

                                        {/* GST */}
                                        <View style={styles.breakdownRow}>
                                            <View style={styles.breakdownLabelRow}>
                                                <Ionicons name="receipt-outline" size={13} color={colors.tint} />
                                                <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>GST / Tax</Text>
                                            </View>
                                            <Text style={[styles.breakdownValue, { color: colors.tint }]}>+ Rs.{selectedTx.gstAmount.toFixed(2)}</Text>
                                        </View>

                                        {/* Divider */}
                                        <View style={[styles.totalDivider, { backgroundColor: colors.border }]} />

                                        {/* Total */}
                                        <View style={styles.totalRow}>
                                            <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount</Text>
                                            <Text style={[styles.totalAmount, { color: colors.tint }]}>Rs.{selectedTx.total.toFixed(2)}</Text>
                                        </View>
                                    </View>
                                </ScrollView>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingBottom: 16, paddingTop: 10 },
    title: { fontSize: 24, fontWeight: '700', fontFamily: 'Inter_700Bold' },
    subtitle: { fontSize: 14, marginTop: 4, fontFamily: 'Inter_400Regular' },

    searchContainer: {
        flexDirection: 'row', alignItems: 'center',
        marginHorizontal: 20, marginBottom: 16,
        paddingHorizontal: 12, height: 44,
        borderRadius: 12, borderWidth: 1, gap: 8
    },
    input: { flex: 1, height: '100%', fontFamily: 'Inter_400Regular', fontSize: 14 },
    filterContainer: { marginBottom: 16 },
    filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    filterChipText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
    list: { padding: 20, paddingTop: 0, paddingBottom: 100 },
    sectionHeader: { paddingVertical: 8, marginBottom: 8 },
    sectionHeaderText: { fontSize: 15, fontFamily: 'Inter_700Bold' },

    // Card
    card: { borderRadius: 16, marginBottom: 12, borderWidth: 1, overflow: 'hidden' },
    cardHeader: { flexDirection: 'row', alignItems: 'flex-start', padding: 14 },
    invoiceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
    invoice: { fontFamily: 'Inter_600SemiBold', fontSize: 13, flex: 1 },
    date: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 2 },
    amount: { fontFamily: 'Inter_700Bold', fontSize: 16 },

    payBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
    payBadgeText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
    successBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4 },
    successText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },

    itemPreviewList: { paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: 0.5 },
    previewRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 3 },
    previewName: { flex: 1, fontSize: 12, fontFamily: 'Inter_400Regular' },
    previewQty: { fontSize: 12, fontFamily: 'Inter_500Medium', marginHorizontal: 8 },
    previewPrice: { fontSize: 12, fontFamily: 'Inter_600SemiBold', minWidth: 50, textAlign: 'right' },
    moreItems: { fontSize: 11, fontFamily: 'Inter_600SemiBold', marginTop: 4 },

    cardFooter: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 0.5
    },
    footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    footerText: { fontSize: 11, fontFamily: 'Inter_400Regular' },
    footerTextBlue: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },

    empty: { alignItems: 'center', marginTop: 60, gap: 12 },
    emptyText: { fontFamily: 'Inter_500Medium' },

    // Modal
    modalOverlay: { flex: 1, justifyContent: 'flex-end' },
    modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
    modalSheet: {
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        paddingBottom: 34, maxHeight: '90%'
    },
    handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },

    modalHeader: {
        flexDirection: 'row', alignItems: 'flex-start',
        paddingHorizontal: 20, paddingVertical: 14,
        borderBottomWidth: 1, gap: 12
    },
    modalTitle: { fontSize: 15, fontFamily: 'Inter_700Bold' },
    modalDate: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
    closeBtn: { padding: 4, marginLeft: 8 },

    modalBody: { padding: 20, gap: 12 },

    // Info Row
    infoRow: {
        flexDirection: 'row', borderRadius: 12, borderWidth: 1, overflow: 'hidden'
    },
    infoItem: { flex: 1, padding: 12, alignItems: 'center' },
    infoLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', marginBottom: 4 },
    infoValue: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
    infoSep: { width: 1 },

    sectionTitle: { fontSize: 13, fontFamily: 'Inter_700Bold', marginTop: 4 },

    // Items Card
    itemsCard: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
    itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 14 },
    itemIndexBadge: { width: 24, height: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    itemIndexText: { fontSize: 11, fontFamily: 'Inter_700Bold' },
    itemName: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
    itemMeta: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
    itemAmt: { fontSize: 14, fontFamily: 'Inter_700Bold' },

    // Breakdown Card
    breakdownCard: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 10 },
    breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    breakdownLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    breakdownLabel: { fontSize: 13, fontFamily: 'Inter_400Regular' },
    breakdownValue: { fontSize: 13, fontFamily: 'Inter_500Medium' },
    totalDivider: { height: 1, marginVertical: 4 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: 15, fontFamily: 'Inter_700Bold' },
    totalAmount: { fontSize: 20, fontFamily: 'Inter_700Bold' },
});
```

## File: babel.config.js
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]],
  };
};
```

## File: components/ErrorBoundary.tsx
```typescript
import React, { Component, ComponentType, PropsWithChildren } from "react";
import { ErrorFallback, ErrorFallbackProps } from "@/components/ErrorFallback";

export type ErrorBoundaryProps = PropsWithChildren<{
  FallbackComponent?: ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, stackTrace: string) => void;
}>;

type ErrorBoundaryState = { error: Error | null };

/**
 * This is a special case for for using the class components. Error boundaries must be class components because React only provides error boundary functionality through lifecycle methods (componentDidCatch and getDerivedStateFromError) which are not available in functional components.
 * https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static defaultProps: {
    FallbackComponent: ComponentType<ErrorFallbackProps>;
  } = {
    FallbackComponent: ErrorFallback,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }): void {
    if (typeof this.props.onError === "function") {
      this.props.onError(error, info.componentStack);
    }
  }

  resetError = (): void => {
    this.setState({ error: null });
  };

  render() {
    const { FallbackComponent } = this.props;

    return this.state.error && FallbackComponent ? (
      <FallbackComponent
        error={this.state.error}
        resetError={this.resetError}
      />
    ) : (
      this.props.children
    );
  }
}
```

## File: components/ErrorFallback.tsx
```typescript
import React, { useState } from "react";
import { reloadAppAsync } from "expo";
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  Text,
  Modal,
  useColorScheme,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export type ErrorFallbackProps = {
  error: Error;
  resetError: () => void;
};

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const theme = {
    background: isDark ? "#000000" : "#FFFFFF",
    backgroundSecondary: isDark ? "#1C1C1E" : "#F2F2F7",
    text: isDark ? "#FFFFFF" : "#000000",
    textSecondary: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
    link: "#007AFF",
    buttonText: "#FFFFFF",
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleRestart = async () => {
    try {
      await reloadAppAsync();
    } catch (restartError) {
      console.error("Failed to restart app:", restartError);
      resetError();
    }
  };

  const formatErrorDetails = (): string => {
    let details = `Error: ${error.message}\n\n`;
    if (error.stack) {
      details += `Stack Trace:\n${error.stack}`;
    }
    return details;
  };

  const monoFont = Platform.select({
    ios: "Menlo",
    android: "monospace",
    default: "monospace",
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {__DEV__ ? (
        <Pressable
          onPress={() => setIsModalVisible(true)}
          accessibilityLabel="View error details"
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.topButton,
            {
              top: insets.top + 16,
              backgroundColor: theme.backgroundSecondary,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Feather name="alert-circle" size={20} color={theme.text} />
        </Pressable>
      ) : null}

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>
          Something went wrong
        </Text>

        <Text style={[styles.message, { color: theme.textSecondary }]}>
          Please reload the app to continue.
        </Text>

        <Pressable
          onPress={handleRestart}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: theme.link,
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>
            Try Again
          </Text>
        </Pressable>
      </View>

      {__DEV__ ? (
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: theme.background },
              ]}
            >
              <View
                style={[
                  styles.modalHeader,
                  {
                    borderBottomColor: isDark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)",
                  },
                ]}
              >
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  Error Details
                </Text>
                <Pressable
                  onPress={() => setIsModalVisible(false)}
                  accessibilityLabel="Close error details"
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.closeButton,
                    { opacity: pressed ? 0.6 : 1 },
                  ]}
                >
                  <Feather name="x" size={24} color={theme.text} />
                </Pressable>
              </View>

              <ScrollView
                style={styles.modalScrollView}
                contentContainerStyle={[
                  styles.modalScrollContent,
                  { paddingBottom: insets.bottom + 16 },
                ]}
                showsVerticalScrollIndicator
              >
                <View
                  style={[
                    styles.errorContainer,
                    { backgroundColor: theme.backgroundSecondary },
                  ]}
                >
                  <Text
                    style={[
                      styles.errorText,
                      {
                        color: theme.text,
                        fontFamily: monoFont,
                      },
                    ]}
                    selectable
                  >
                    {formatErrorDetails()}
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    width: "100%",
    maxWidth: 600,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 40,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  topButton: {
    position: "absolute",
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    paddingHorizontal: 24,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
    height: "90%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 16,
  },
  errorContainer: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    padding: 16,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
    width: "100%",
  },
});
```

## File: components/KeyboardAwareScrollViewCompat.tsx
```typescript
// template
import { Platform, ScrollView, ScrollViewProps } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from "react-native-keyboard-controller";

type Props = KeyboardAwareScrollViewProps & ScrollViewProps;

export function KeyboardAwareScrollViewCompat({
  children,
  keyboardShouldPersistTaps = "handled",
  ...props
}: Props) {
  if (Platform.OS === "web") {
    return (
      <ScrollView keyboardShouldPersistTaps={keyboardShouldPersistTaps} {...props}>
        {children}
      </ScrollView>
    );
  }
  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      {...props}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}
```

## File: drizzle.config.ts
```typescript
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
```

## File: eas.json
```json
{
  "cli": {
    "version": ">= 18.0.3",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_API_URL": "https://retailpro-efd8.onrender.com"
      }
    },
    "apk": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_API_URL": "https://retailpro-efd8.onrender.com"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

## File: eslint.config.js
```javascript
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  }
]);
```

## File: lib/auth-context.tsx
```typescript
import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  pin: string;
  role: 'ADMIN' | 'CASHIER' | 'STOCK_CLERK';
  status: string;
  joinedDate: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  isAdmin: boolean;
  logout: () => void;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('retailpro_user').then(stored => {
      if (stored) {
        try {
          setUserState(JSON.parse(stored));
        } catch (e) { }
      }
      setIsLoaded(true);
    });
  }, []);

  const setUser = (newUser: AuthUser | null) => {
    setUserState(newUser);
    if (newUser) {
      AsyncStorage.setItem('retailpro_user', JSON.stringify(newUser));
    } else {
      AsyncStorage.removeItem('retailpro_user');
    }
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({
    user,
    setUser,
    isAdmin: user?.role === 'ADMIN',
    logout,
    isLoaded,
  }), [user, isLoaded]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

## File: lib/theme-context.tsx
```typescript
import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/colors';

type ThemeMode = 'dark' | 'light';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: typeof Colors.dark;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    AsyncStorage.getItem('theme_mode').then(v => {
      if (v === 'light' || v === 'dark') setMode(v);
    });
  }, []);

  const toggleTheme = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    AsyncStorage.setItem('theme_mode', next);
  };

  const value = useMemo(() => ({
    mode,
    colors: Colors[mode],
    toggleTheme,
    isDark: mode === 'dark',
  }), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
```

## File: lib/types.ts
```typescript
export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  sellingPrice: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: string;
  gstRate: number;
  manufacturingDate: string;
  expiryDate: string;
  supplier: string;
  batchNo: string;
  section: string;
  lastUpdated: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface TransactionItem {
  productId: string;
  productName: string;
  qty: number;
  price: number;
  gstRate: number;
  total: number;
}

export interface Transaction {
  id: string;
  invoiceNo: string;
  items: TransactionItem[];
  subtotal: number;
  discount: number;
  gstAmount: number;
  total: number;
  paymentMethod: 'Cash' | 'Card' | 'UPI';
  customerPhone: string;
  cashierId: string;
  cashierName: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  netProfit: number;
  totalTransactions: number;
  todayTransactions: number;
  totalProducts: number;
  lowStockCount: number;
  expiringCount: number;
  activeEmployees: number;
  inventoryValue: number;
  totalGst: number;
  categoryRevenue: Record<string, number>;
  paymentMethods: Record<string, { count: number; total: number }>;
  last7Days: { date: string; revenue: number; profit: number }[];
  lowStockProducts: { id: string; name: string; stock: number; minStock: number }[];
  expiringProducts: { id: string; name: string; expiryDate: string; daysLeft: number; stock: number; costPrice: number; potentialLoss: number }[];
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  pin: string;
  role: 'ADMIN' | 'CASHIER' | 'STOCK_CLERK';
  status: string;
  joinedDate: string;
}

export interface ReportData {
  totalRevenue: number;
  netProfit: number;
  totalTransactions: number;
  avgTransaction: number;
  totalDiscount: number;
  totalGst: number;
  itemsSold: number;
  topProducts: { name: string; qty: number; revenue: number }[];
  cashierPerformance: { name: string; transactions: number; revenue: number }[];
  paymentBreakdown: Record<string, { count: number; total: number }>;
  reorderSuggestions: { id: string; name: string; stock: number; minStock: number; suggestedOrder: number; estimatedCost: number }[];
}
```

## File: metro.config.js
```javascript
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

module.exports = config;
```

## File: scripts/build.js
```javascript
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");

let metroProcess = null;

function exitWithError(message) {
  console.error(message);
  if (metroProcess) {
    metroProcess.kill();
  }
  process.exit(1);
}

function setupSignalHandlers() {
  const cleanup = () => {
    if (metroProcess) {
      console.log("Cleaning up Metro process...");
      metroProcess.kill();
    }
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("SIGHUP", cleanup);
}

function stripProtocol(domain) {
  let urlString = domain.trim();

  if (!/^https?:\/\//i.test(urlString)) {
    urlString = `https://${urlString}`;
  }

  return new URL(urlString).host;
}

function getDeploymentDomain() {
  // Check Replit deployment environment variables first
  if (process.env.REPLIT_INTERNAL_APP_DOMAIN) {
    return stripProtocol(process.env.REPLIT_INTERNAL_APP_DOMAIN);
  }

  if (process.env.REPLIT_DEV_DOMAIN) {
    return stripProtocol(process.env.REPLIT_DEV_DOMAIN);
  }

  if (process.env.EXPO_PUBLIC_DOMAIN) {
    return stripProtocol(process.env.EXPO_PUBLIC_DOMAIN);
  }

  console.error(
    "ERROR: No deployment domain found. Set REPLIT_INTERNAL_APP_DOMAIN, REPLIT_DEV_DOMAIN, or EXPO_PUBLIC_DOMAIN",
  );
  process.exit(1);
}

function prepareDirectories(timestamp) {
  console.log("Preparing build directories...");

  if (fs.existsSync("static-build")) {
    fs.rmSync("static-build", { recursive: true });
  }

  const dirs = [
    path.join("static-build", timestamp, "_expo", "static", "js", "ios"),
    path.join("static-build", timestamp, "_expo", "static", "js", "android"),
    path.join("static-build", "ios"),
    path.join("static-build", "android"),
  ];

  for (const dir of dirs) {
    fs.mkdirSync(dir, { recursive: true });
  }

  console.log("Build:", timestamp);
}

function clearMetroCache() {
  console.log("Clearing Metro cache...");

  const cacheDirs = [
    ...fs.globSync(".metro-cache"),
    ...fs.globSync("node_modules/.cache/metro"),
  ];

  for (const dir of cacheDirs) {
    fs.rmSync(dir, { recursive: true, force: true });
  }

  console.log("Cache cleared");
}

async function checkMetroHealth() {
  try {
    const response = await fetch("http://localhost:8081/status", {
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function startMetro(expoPublicDomain) {
  const isRunning = await checkMetroHealth();
  if (isRunning) {
    console.log("Metro already running");
    return;
  }

  console.log("Starting Metro...");
  console.log(`Setting EXPO_PUBLIC_DOMAIN=${expoPublicDomain}`);
  const env = {
    ...process.env,
    EXPO_PUBLIC_DOMAIN: expoPublicDomain,
  };
  metroProcess = spawn("npm", ["run", "expo:start:static:build"], {
    stdio: ["ignore", "pipe", "pipe"],
    detached: false,
    env,
  });

  if (metroProcess.stdout) {
    metroProcess.stdout.on("data", (data) => {
      const output = data.toString().trim();
      if (output) console.log(`[Metro] ${output}`);
    });
  }
  if (metroProcess.stderr) {
    metroProcess.stderr.on("data", (data) => {
      const output = data.toString().trim();
      if (output) console.error(`[Metro Error] ${output}`);
    });
  }

  for (let i = 0; i < 60; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const healthy = await checkMetroHealth();
    if (healthy) {
      console.log("Metro ready");
      return;
    }
  }

  console.error("Metro timeout");
  process.exit(1);
}

async function downloadFile(url, outputPath) {
  const controller = new AbortController();
  const fiveMinMS = 5 * 60 * 1_000;
  const timeoutId = setTimeout(() => controller.abort(), fiveMinMS);

  try {
    console.log(`Downloading: ${url}`);
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const file = fs.createWriteStream(outputPath);
    await pipeline(Readable.fromWeb(response.body), file);

    const fileSize = fs.statSync(outputPath).size;

    if (fileSize === 0) {
      fs.unlinkSync(outputPath);
      throw new Error("Downloaded file is empty");
    }
  } catch (error) {
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    if (error.name === "AbortError") {
      throw new Error(`Download timeout after 5m: ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function downloadBundle(platform, timestamp) {
  // For expo-router apps, the entry is node_modules/expo-router/entry
  const url = new URL("http://localhost:8081/node_modules/expo-router/entry.bundle");
  url.searchParams.set("platform", platform);
  url.searchParams.set("dev", "false");
  url.searchParams.set("hot", "false");
  url.searchParams.set("lazy", "false");
  url.searchParams.set("minify", "true");

  const output = path.join(
    "static-build",
    timestamp,
    "_expo",
    "static",
    "js",
    platform,
    "bundle.js",
  );

  console.log(`Fetching ${platform} bundle...`);
  await downloadFile(url.toString(), output);
  console.log(`${platform} bundle ready`);
}

async function downloadManifest(platform) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300_000);

  try {
    console.log(`Fetching ${platform} manifest...`);
    const response = await fetch("http://localhost:8081/manifest", {
      headers: { "expo-platform": platform },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const manifest = await response.json();
    console.log(`${platform} manifest ready`);
    return manifest;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        `Manifest download timeout after 5m for platform: ${platform}`,
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function downloadBundlesAndManifests(timestamp) {
  console.log("Downloading bundles and manifests...");
  console.log("This may take several minutes for production builds...");

  try {
    const results = await Promise.allSettled([
      downloadBundle("ios", timestamp),
      downloadBundle("android", timestamp),
      downloadManifest("ios"),
      downloadManifest("android"),
    ]);

    const failures = results
      .map((result, index) => ({ result, index }))
      .filter(({ result }) => result.status === "rejected");

    if (failures.length > 0) {
      const errorMessages = failures.map(({ result, index }) => {
        const names = [
          "iOS bundle",
          "Android bundle",
          "iOS manifest",
          "Android manifest",
        ];
        return `  - ${names[index]}: ${result.reason?.message || result.reason}`;
      });

      exitWithError(`Download failed:\n${errorMessages.join("\n")}`);
    }

    const iosManifest =
      results[2].status === "fulfilled" ? results[2].value : null;
    const androidManifest =
      results[3].status === "fulfilled" ? results[3].value : null;

    console.log("All downloads completed successfully");
    return { ios: iosManifest, android: androidManifest };
  } catch (error) {
    exitWithError(`Unexpected download error: ${error.message}`);
  }
}

function extractAssets(timestamp) {
  const bundles = {
    ios: fs.readFileSync(
      path.join(
        "static-build",
        timestamp,
        "_expo",
        "static",
        "js",
        "ios",
        "bundle.js",
      ),
      "utf-8",
    ),
    android: fs.readFileSync(
      path.join(
        "static-build",
        timestamp,
        "_expo",
        "static",
        "js",
        "android",
        "bundle.js",
      ),
      "utf-8",
    ),
  };

  const assetsMap = new Map();
  const assetPattern =
    /httpServerLocation:"([^"]+)"[^}]*hash:"([^"]+)"[^}]*name:"([^"]+)"[^}]*type:"([^"]+)"/g;

  const extractFromBundle = (bundle, platform) => {
    for (const match of bundle.matchAll(assetPattern)) {
      const originalPath = match[1];
      const filename = match[3] + "." + match[4];

      const tempUrl = new URL(`http://localhost:8081${originalPath}`);
      const unstablePath = tempUrl.searchParams.get("unstable_path");

      if (!unstablePath) {
        throw new Error(`Asset missing unstable_path: ${originalPath}`);
      }

      const decodedPath = decodeURIComponent(unstablePath);
      const key = path.posix.join(decodedPath, filename);

      if (!assetsMap.has(key)) {
        const asset = {
          url: path.posix.join("/", decodedPath, filename),
          originalPath: originalPath,
          filename: filename,
          relativePath: decodedPath,
          hash: match[2],
          platforms: new Set(),
        };

        assetsMap.set(key, asset);
      }
      assetsMap.get(key).platforms.add(platform);
    }
  };

  extractFromBundle(bundles.ios, "ios");
  extractFromBundle(bundles.android, "android");

  return Array.from(assetsMap.values());
}

async function downloadAssets(assets, timestamp) {
  if (assets.length === 0) {
    return 0;
  }

  console.log("Downloading assets...");
  let successCount = 0;
  const failures = [];

  const downloadPromises = assets.map(async (asset) => {
    const platform = Array.from(asset.platforms)[0];

    const tempUrl = new URL(`http://localhost:8081${asset.originalPath}`);
    const unstablePath = tempUrl.searchParams.get("unstable_path");

    if (!unstablePath) {
      throw new Error(`Asset missing unstable_path: ${asset.originalPath}`);
    }

    const decodedPath = decodeURIComponent(unstablePath);
    const metroUrl = new URL(
      `http://localhost:8081${path.posix.join("/assets", decodedPath, asset.filename)}`,
    );
    metroUrl.searchParams.set("platform", platform);
    metroUrl.searchParams.set("hash", asset.hash);

    const outputDir = path.join(
      "static-build",
      timestamp,
      "_expo",
      "static",
      "js",
      asset.relativePath,
    );
    fs.mkdirSync(outputDir, { recursive: true });
    const output = path.join(outputDir, asset.filename);

    try {
      await downloadFile(metroUrl.toString(), output);
      successCount++;
    } catch (error) {
      failures.push({
        filename: asset.filename,
        error: error.message,
        url: metroUrl.toString(),
      });
    }
  });

  await Promise.all(downloadPromises);

  if (failures.length > 0) {
    const errorMsg =
      `Failed to download ${failures.length} asset(s):\n` +
      failures
        .map((f) => `  - ${f.filename}: ${f.error} (${f.url})`)
        .join("\n");
    exitWithError(errorMsg);
  }

  console.log(`Downloaded ${successCount} assets`);
  return successCount;
}

function updateBundleUrls(timestamp, baseUrl) {
  const updateForPlatform = (platform) => {
    const bundlePath = path.join(
      "static-build",
      timestamp,
      "_expo",
      "static",
      "js",
      platform,
      "bundle.js",
    );
    let bundle = fs.readFileSync(bundlePath, "utf-8");

    bundle = bundle.replace(
      /httpServerLocation:"(\/[^"]+)"/g,
      (_match, capturedPath) => {
        const tempUrl = new URL(`http://localhost:8081${capturedPath}`);
        const unstablePath = tempUrl.searchParams.get("unstable_path");

        if (!unstablePath) {
          throw new Error(
            `Asset missing unstable_path in bundle: ${capturedPath}`,
          );
        }

        const decodedPath = decodeURIComponent(unstablePath);
        return `httpServerLocation:"${baseUrl}/${timestamp}/_expo/static/js/${decodedPath}"`;
      },
    );

    fs.writeFileSync(bundlePath, bundle);
  };

  updateForPlatform("ios");
  updateForPlatform("android");
  console.log("Updated bundle URLs");
}

function updateManifests(manifests, timestamp, baseUrl, assetsByHash) {
  const updateForPlatform = (platform, manifest) => {
    if (!manifest.launchAsset || !manifest.extra) {
      exitWithError(`Malformed manifest for ${platform}`);
    }

    manifest.launchAsset.url = `${baseUrl}/${timestamp}/_expo/static/js/${platform}/bundle.js`;
    manifest.launchAsset.key = `bundle-${timestamp}`;
    manifest.createdAt = new Date(
      Number(timestamp.split("-")[0]),
    ).toISOString();
    manifest.extra.expoClient.hostUri =
      baseUrl.replace("https://", "") + "/" + platform;
    manifest.extra.expoGo.debuggerHost =
      baseUrl.replace("https://", "") + "/" + platform;
    manifest.extra.expoGo.packagerOpts.dev = false;

    if (manifest.assets && manifest.assets.length > 0) {
      manifest.assets.forEach((asset) => {
        if (!asset.url) return;

        const hash = asset.hash;
        if (!hash) return;

        const assetInfo = assetsByHash.get(hash);
        if (!assetInfo) return;

        asset.url = `${baseUrl}/${timestamp}/_expo/static/js/${assetInfo.relativePath}/${assetInfo.filename}`;
      });
    }

    fs.writeFileSync(
      path.join("static-build", platform, "manifest.json"),
      JSON.stringify(manifest, null, 2),
    );
  };

  updateForPlatform("ios", manifests.ios);
  updateForPlatform("android", manifests.android);
  console.log("Manifests updated");
}

async function main() {
  console.log("Building static Expo Go deployment...");

  setupSignalHandlers();

  const domain = getDeploymentDomain();
  const baseUrl = `https://${domain}`;
  const timestamp = `${Date.now()}-${process.pid}`;

  prepareDirectories(timestamp);
  clearMetroCache();

  await startMetro(domain);

  const downloadTimeout = 300000;
  const downloadPromise = downloadBundlesAndManifests(timestamp);
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(
          `Overall download timeout after ${downloadTimeout / 1000} seconds. ` +
            "Metro may be struggling to generate bundles. Check Metro logs above.",
        ),
      );
    }, downloadTimeout);
  });

  const manifests = await Promise.race([downloadPromise, timeoutPromise]);

  console.log("Processing assets...");
  const assets = extractAssets(timestamp);
  console.log("Found", assets.length, "unique asset(s)");

  const assetsByHash = new Map();
  for (const asset of assets) {
    assetsByHash.set(asset.hash, {
      relativePath: asset.relativePath,
      filename: asset.filename,
    });
  }

  const assetCount = await downloadAssets(assets, timestamp);

  if (assetCount > 0) {
    updateBundleUrls(timestamp, baseUrl);
  }

  console.log("Updating manifests and creating landing page...");
  updateManifests(manifests, timestamp, baseUrl, assetsByHash);

  console.log("Build complete! Deploy to:", baseUrl);

  if (metroProcess) {
    metroProcess.kill();
  }
  process.exit(0);
}

main().catch((error) => {
  console.error("Build failed:", error.message);
  if (metroProcess) {
    metroProcess.kill();
  }
  process.exit(1);
});
```

## File: server/templates/landing-page.html
```html
<!doctype html>
<html>
  <head>
    <title>APP_NAME_PLACEHOLDER</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        margin: 0;
        padding: 32px 20px;
        text-align: center;
        background: #fff;
        color: #222;
        line-height: 1.5;
        min-height: 100vh;
      }
      .wrapper {
        max-width: 480px;
        margin: 0 auto;
      }
      h1 {
        font-size: 26px;
        font-weight: 600;
        margin: 0;
        color: #111;
      }
      .subtitle {
        font-size: 15px;
        color: #666;
        margin-top: 8px;
        margin-bottom: 32px;
      }
      .loading {
        display: none;
        margin: 60px 0;
      }
      .spinner {
        border: 2px solid #ddd;
        border-top-color: #333;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        animation: spin 0.8s linear infinite;
        margin: 20px auto;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .loading-text {
        font-size: 16px;
        color: #444;
      }
      .content {
        display: block;
      }

      .steps-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .step {
        padding: 24px;
        border: 1px solid #ddd;
        border-radius: 12px;
        text-align: center;
        background: #fafafa;
      }
      .step-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 12px;
      }
      .step-number {
        width: 28px;
        height: 28px;
        border: 1px solid #999;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 14px;
        flex-shrink: 0;
        color: #555;
      }
      .step-title {
        font-size: 18px;
        font-weight: 600;
        margin: 0;
        color: #222;
      }
      .step-description {
        font-size: 14px;
        margin-bottom: 16px;
        color: #666;
      }

      .store-buttons {
        display: flex;
        flex-direction: column;
        gap: 6px;
        justify-content: center;
        flex-wrap: wrap;
      }
      .store-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 500;
        border: 1px solid #ccc;
        border-radius: 8px;
        text-decoration: none;
        color: #333;
        background: #fff;
        transition: all 0.15s;
      }
      .store-button:hover {
        background: #f5f5f5;
        border-color: #999;
      }
      .store-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 8px 0;
        font-size: 13px;
        font-weight: 400;
        text-decoration: underline;
        text-underline-offset: 2px;
        color: #666;
        background: none;
        border: none;
        transition: color 0.15s;
      }
      .store-link:hover {
        color: #333;
      }
      .store-link .store-icon {
        width: 14px;
        height: 14px;
      }
      .store-icon {
        width: 18px;
        height: 18px;
      }

      .qr-section {
        background: #333;
        color: #fff;
        border-color: #333;
      }
      .qr-section .step-number {
        border-color: rgba(255, 255, 255, 0.5);
        color: #fff;
      }
      .qr-section .step-title {
        color: #fff;
      }
      .qr-section .step-description {
        color: rgba(255, 255, 255, 0.7);
      }
      .qr-code {
        width: 180px;
        height: 180px;
        margin: 0 auto 16px;
        background: #fff;
        border-radius: 8px;
        padding: 12px;
      }
      .qr-code canvas {
        width: 100%;
        height: 100%;
      }
      .open-button {
        display: inline-block;
        padding: 12px 24px;
        font-size: 14px;
        font-weight: 500;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        text-decoration: none;
        color: #333;
        background: #fff;
        transition: opacity 0.15s;
      }
      .open-button:hover {
        opacity: 0.9;
      }

      /* Desktop styles */
      @media (min-width: 768px) {
        body {
          padding: 48px 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wrapper {
          max-width: 720px;
        }
        h1 {
          font-size: 32px;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 16px;
          margin-bottom: 40px;
        }
        .steps-container {
          flex-direction: row;
          gap: 20px;
          align-items: stretch;
        }
        .step {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 28px;
        }
        .step-description {
          flex-grow: 1;
        }
        .store-buttons {
          flex-direction: column;
          gap: 10px;
        }
        .qr-code {
          width: 200px;
          height: 200px;
        }
      }

      /* Large desktop */
      @media (min-width: 1024px) {
        .wrapper {
          max-width: 800px;
        }
        h1 {
          font-size: 36px;
        }
        .steps-container {
          gap: 28px;
        }
        .step {
          padding: 32px;
        }
      }

      /* Dark mode */
      @media (prefers-color-scheme: dark) {
        body {
          background: #0d0d0d;
          color: #e0e0e0;
        }
        h1 {
          color: #f5f5f5;
        }
        .subtitle {
          color: #999;
        }
        .spinner {
          border-color: #444;
          border-top-color: #ccc;
        }
        .loading-text {
          color: #aaa;
        }
        .step {
          border-color: #333;
          background: #1a1a1a;
        }
        .step-number {
          border-color: #666;
          color: #bbb;
        }
        .step-title {
          color: #f0f0f0;
        }
        .step-description {
          color: #888;
        }
        .store-button {
          border-color: #444;
          color: #e0e0e0;
          background: #222;
        }
        .store-button:hover {
          background: #2a2a2a;
          border-color: #666;
        }
        .store-link {
          color: #888;
        }
        .store-link:hover {
          color: #ccc;
        }
        .qr-section {
          background: #111;
          border-color: #333;
        }
        .qr-section .step-number {
          border-color: rgba(255, 255, 255, 0.4);
        }
        .qr-section .step-description {
          color: rgba(255, 255, 255, 0.6);
        }
        .open-button {
          background: #f0f0f0;
          color: #111;
        }
        .open-button:hover {
          background: #e0e0e0;
        }
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="loading" id="loading">
        <div class="spinner"></div>
        <div class="loading-text">Opening in Expo Go...</div>
      </div>

      <div class="content" id="content">
        <h1>APP_NAME_PLACEHOLDER</h1>
        <p class="subtitle">Preview this app on your phone</p>

        <div class="steps-container">
          <div class="step">
            <div class="step-header">
              <div class="step-number">1</div>
              <h2 class="step-title">Download Expo Go</h2>
            </div>
            <p class="step-description">
              Expo Go is a free app to test mobile apps
            </p>
            <div class="store-buttons" id="store-buttons">
              <a
                id="app-store-btn"
                href="https://apps.apple.com/app/id982107779"
                class="store-button"
                target="_blank"
              >
                <svg class="store-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                  />
                </svg>
                App Store
              </a>
              <a
                id="play-store-btn"
                href="https://play.google.com/store/apps/details?id=host.exp.exponent"
                class="store-button"
                target="_blank"
              >
                <svg class="store-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"
                  />
                </svg>
                Google Play
              </a>
            </div>
          </div>

          <div class="step qr-section">
            <div class="step-header">
              <div class="step-number">2</div>
              <h2 class="step-title">Scan QR Code</h2>
            </div>
            <p class="step-description">Use your phone's camera or Expo Go</p>
            <div class="qr-code" id="qr-code"></div>
            <a href="exps://EXPS_URL_PLACEHOLDER" class="open-button"
              >Open in Expo Go</a
            >
          </div>
        </div>
      </div>
    </div>

    <script src="https://unpkg.com/qr-code-styling@1.6.0/lib/qr-code-styling.js"></script>
    <script>
      (function () {
        const ua = navigator.userAgent;
        const loadingEl = document.getElementById("loading");
        const contentEl = document.getElementById("content");

        const isAndroid = /Android/i.test(ua);
        const isIOS =
          /iPhone|iPad|iPod/i.test(ua) ||
          (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

        const deepLink = "exps://EXPS_URL_PLACEHOLDER";

        // Adjust store buttons based on platform
        const appStoreBtn = document.getElementById("app-store-btn");
        const playStoreBtn = document.getElementById("play-store-btn");
        const storeButtonsContainer = document.getElementById("store-buttons");

        if (isIOS) {
          playStoreBtn.className = "store-link";
          storeButtonsContainer.appendChild(playStoreBtn);
        } else if (isAndroid) {
          appStoreBtn.className = "store-link";
          storeButtonsContainer.insertBefore(playStoreBtn, appStoreBtn);
        }

        const qrCode = new QRCodeStyling({
          width: 400,
          height: 400,
          data: deepLink,
          dotsOptions: {
            color: "#333333",
            type: "rounded",
          },
          backgroundOptions: {
            color: "#ffffff",
          },
          cornersSquareOptions: {
            type: "extra-rounded",
          },
          cornersDotOptions: {
            type: "dot",
          },
          qrOptions: {
            errorCorrectionLevel: "H",
          },
        });

        qrCode.append(document.getElementById("qr-code"));

        if (isAndroid || isIOS) {
          loadingEl.style.display = "block";
          contentEl.style.display = "none";
          window.location.href = deepLink;
          setTimeout(function () {
            loadingEl.style.display = "none";
            contentEl.style.display = "block";
          }, 500);
        }
      })();
    </script>
  </body>
</html>
```

## File: shared/schema.ts
```typescript
import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
```

## File: tsconfig.json
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "baseUrl": ".",
    "strict": true,
    "paths": {
      "@/*": [
        "./*"
      ],
      "@shared/*": [
        "./shared/*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

## File: app/_layout.tsx
```typescript
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import { ThemeProvider } from "@/lib/theme-context";
import { AuthProvider } from "@/lib/auth-context";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <ThemeProvider>
              <AuthProvider>
                <StatusBar style="light" />
                <RootLayoutNav />
              </AuthProvider>
            </ThemeProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
```

## File: app/(main)/_layout.tsx
```typescript
import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';

export default function MainLayout() {
  const { colors, isDark } = useTheme();
  const { user, isLoaded } = useAuth();
  const isWeb = Platform.OS === 'web';
  const isIOS = Platform.OS === 'ios';

  if (!isLoaded) return null;
  if (!user) return <Redirect href="/" />;

  const isAdmin = user?.role === 'ADMIN';
  const isCashier = user?.role === 'CASHIER';
  const isStockClerk = user?.role === 'STOCK_CLERK';

  // Helper: returns the href for a tab based on who should see it
  // showFor is an array of roles that CAN see this tab
  const showFor = (roles: string[], path: string): any =>
    user?.role && roles.includes(user.role) ? path : null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarLabelStyle: { fontFamily: 'Inter_500Medium', fontSize: 11 },
        tabBarStyle: {
          position: 'absolute' as const,
          backgroundColor: isIOS ? 'transparent' : colors.tabBar,
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: colors.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={100} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.tabBar }]} />
          ) : null,
      }}
    >
      {/* ── Dashboard: Admin only ───────────────────────────── */}
      <Tabs.Screen
        name="dashboard"
        options={{
          href: showFor(['ADMIN'], '/dashboard'),
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} />,
        }}
      />

      {/* ── Inventory: Admin + Stock Clerk ──────────────────── */}
      <Tabs.Screen
        name="inventory"
        options={{
          href: showFor(['ADMIN', 'STOCK_CLERK'], '/inventory'),
          title: 'Inventory',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="package-variant-closed" size={size} color={color} />,
        }}
      />

      {/* ── POS: Admin + Cashier + Stock Clerk ─────────────── */}
      <Tabs.Screen
        name="pos"
        options={{
          href: showFor(['ADMIN', 'CASHIER', 'STOCK_CLERK'], '/pos'),
          title: 'POS',
          tabBarIcon: ({ color, size }) => <Ionicons name="cart" size={size} color={color} />,
        }}
      />

      {/* ── Transactions: Admin + Cashier + Stock Clerk ──────── */}
      <Tabs.Screen
        name="transactions"
        options={{
          href: showFor(['ADMIN', 'CASHIER', 'STOCK_CLERK'], '/transactions'),
          title: 'Transactions',
          tabBarIcon: ({ color, size }) => <Ionicons name="receipt" size={size} color={color} />,
        }}
      />

      {/* ── Staff / Employees: Admin only ───────────────────── */}
      <Tabs.Screen
        name="employees"
        options={{
          href: showFor(['ADMIN'], '/employees'),
          title: 'Staff',
          tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />,
        }}
      />

      {/* ── Reports: Admin only ─────────────────────────────── */}
      <Tabs.Screen
        name="reports"
        options={{
          href: showFor(['ADMIN'], '/reports'),
          title: 'Reports',
          tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" size={size} color={color} />,
        }}
      />

      {/* ── Profile: All roles ──────────────────────────────── */}
      <Tabs.Screen
        name="profile"
        options={{
          href: showFor(['CASHIER', 'STOCK_CLERK'], '/profile'),
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

## File: app/(main)/dashboard.tsx
```typescript
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Platform,
  Animated, RefreshControl, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { router } from 'expo-router';
import type { DashboardStats, ActivityLog, Product } from '@/lib/types';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { apiRequest } from '@/lib/query-client';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function NumberTicker({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const animRef = useRef<any>(null);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [value]);

  const formatted = display >= 1000 ? (display / 1000).toFixed(1) + 'K' : String(display);
  return <Text>{prefix}{formatted}{suffix}</Text>;
}

function LiveDot({ color }: { color: string }) {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[styles.liveDot, { backgroundColor: color, opacity: anim }]} />;
}

export default function DashboardScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const statsQuery = useQuery<DashboardStats>({ queryKey: ['/api/dashboard/stats'] });
  const logsQuery = useQuery<ActivityLog[]>({ queryKey: ['/api/activity-logs'] });

  const stats = statsQuery.data;
  const logs = logsQuery.data;

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const onProductClick = async (id: string) => {
    try {
      const res = await apiRequest('GET', `/api/products/${id}`);
      const product = await res.json();
      setSelectedProduct(product);
      setShowDetailModal(true);
    } catch (e) {
      console.error('Failed to fetch product', e);
    }
  };

  const onRefresh = () => {
    statsQuery.refetch();
    logsQuery.refetch();
  };

  const getExpiryColor = (days: number) => {
    if (days <= 7) return colors.danger;
    if (days <= 30) return colors.warning;
    return colors.success;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return colors.admin;
      case 'CASHIER': return colors.cashier;
      case 'STOCK_CLERK': return colors.stockClerk;
      default: return colors.textMuted;
    }
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 8), paddingBottom: 100 + (Platform.OS === 'web' ? 34 : 0) }}
        refreshControl={<RefreshControl refreshing={!!statsQuery.isRefetching} onRefresh={onRefresh} tintColor={colors.tint} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.greeting, { color: colors.text, fontFamily: 'Inter_700Bold' }]}>Admin Dashboard</Text>
            <Text style={[styles.welcomeText, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>Welcome back, {user?.name || 'Admin'}</Text>
          </View>
          <View style={styles.topActions}>
            <Pressable onPress={toggleTheme} style={[styles.iconBtn, { backgroundColor: colors.card }]}>
              <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={20} color={colors.text} />
            </Pressable>
            <Pressable onPress={() => { logout(); router.replace('/'); }} style={[styles.iconBtn, { backgroundColor: colors.danger + '20' }]}>
              <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            </Pressable>
          </View>
        </View>

        {stats && (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: '#2563eb' }]}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <MaterialCommunityIcons name="currency-inr" size={20} color="#fff" />
                </View>
                <Text style={[styles.statValue, { color: '#fff', fontFamily: 'Inter_700Bold' }]}>
                  <NumberTicker value={Math.round(stats.totalRevenue)} prefix="Rs. " />
                </Text>
                <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_400Regular' }]}>Total Revenue</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#16a34a' }]}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Ionicons name="trending-up" size={20} color="#fff" />
                </View>
                <Text style={[styles.statValue, { color: '#fff', fontFamily: 'Inter_700Bold' }]}>
                  <NumberTicker value={Math.round(stats.netProfit)} prefix="Rs. " />
                </Text>
                <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_400Regular' }]}>Net Profit</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#f59e0b' }]}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Ionicons name="receipt-outline" size={20} color="#fff" />
                </View>
                <Text style={[styles.statValue, { color: '#fff', fontFamily: 'Inter_700Bold' }]}>
                  <NumberTicker value={stats.totalTransactions} />
                </Text>
                <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_400Regular' }]}>Transactions</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#8b5cf6' }]}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Ionicons name="people-outline" size={20} color="#fff" />
                </View>
                <Text style={[styles.statValue, { color: '#fff', fontFamily: 'Inter_700Bold' }]}>
                  <NumberTicker value={stats.activeEmployees} />
                </Text>
                <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_400Regular' }]}>Active Staff</Text>
              </View>
            </ScrollView>

            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>Revenue Trend (7 Days)</Text>
              </View>
              <View style={styles.chartContainer}>
                {stats.last7Days.map((d, i) => {
                  const maxRev = Math.max(...stats.last7Days.map(x => x.revenue), 1);
                  const h = (d.revenue / maxRev) * 100;
                  const day = new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short' });
                  return (
                    <View key={i} style={styles.barCol}>
                      <Text style={[styles.barValue, { color: colors.textMuted, fontFamily: 'Inter_500Medium' }]}>
                        {d.revenue >= 1000 ? (d.revenue / 1000).toFixed(1) + 'K' : d.revenue}
                      </Text>
                      <View style={[styles.bar, { height: Math.max(h, 4), backgroundColor: colors.tint }]} />
                      <Text style={[styles.barLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>{day}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>Sales by Category</Text>
              </View>
              <View style={styles.categoryGrid}>
                {Object.entries(stats.categoryRevenue).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([cat, rev], i) => {
                  const catColors = ['#2563eb', '#16a34a', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
                  const total = Object.values(stats.categoryRevenue).reduce((s, v) => s + v, 0);
                  const pct = total > 0 ? ((rev / total) * 100).toFixed(0) : '0';
                  return (
                    <View key={cat} style={styles.categoryRow}>
                      <View style={[styles.categoryDot, { backgroundColor: catColors[i % catColors.length] }]} />
                      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={[styles.categoryName, { color: colors.text, fontFamily: 'Inter_500Medium', flex: 1 }]}>{cat}</Text>
                        <Text style={[styles.categoryValue, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Rs.{Math.round(rev)} ({pct}%)</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>Payment Methods</Text>
              </View>
              <View style={styles.paymentRow}>
                {Object.entries(stats.paymentMethods).map(([method, data]) => {
                  const pmColors: Record<string, string> = { Cash: '#16a34a', Card: '#2563eb', UPI: '#8b5cf6' };
                  const barHeight = Math.min(Math.max(data.count * 6, 16), 70);
                  return (
                    <View key={method} style={styles.paymentItem}>
                      <Text style={[styles.paymentCount, { color: pmColors[method] || colors.tint, fontFamily: 'Inter_700Bold' }]}>{data.count}</Text>
                      <View style={[styles.paymentBar, { backgroundColor: pmColors[method] || colors.tint, height: barHeight }]} />
                      <Text style={[styles.paymentLabel, { color: colors.textMuted, fontFamily: 'Inter_500Medium' }]}>{method}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {stats.lowStockProducts.length > 0 && (
              <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="warning" size={18} color={colors.warning} />
                  <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>Low Stock Alerts</Text>
                  <View style={[styles.countBadge, { backgroundColor: colors.danger + '20' }]}>
                    <Text style={[styles.countBadgeText, { color: colors.danger, fontFamily: 'Inter_600SemiBold' }]}>{stats.lowStockCount}</Text>
                  </View>
                </View>
                {stats.lowStockProducts.map(p => (
                  <Pressable
                    key={p.id}
                    onPress={() => onProductClick(p.id)}
                    style={({ pressed }) => [
                      styles.alertRow,
                      { borderColor: colors.border, borderBottomWidth: 0.5, opacity: pressed ? 0.7 : 1 }
                    ]}
                  >
                    <View style={[styles.alertIcon, { backgroundColor: colors.danger + '15' }]}>
                      <MaterialCommunityIcons name="package-variant" size={18} color={colors.danger} />
                    </View>
                    <Text style={[styles.alertName, { color: colors.text, fontFamily: 'Inter_500Medium' }]} numberOfLines={1}>{p.name}</Text>
                    <View style={[styles.stockBadge, { backgroundColor: colors.danger + '15' }]}>
                      <Text style={[styles.stockBadgeText, { color: colors.danger, fontFamily: 'Inter_600SemiBold' }]}>{p.stock}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}

            {stats.expiringProducts.length > 0 && (
              <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="time-outline" size={18} color={colors.warning} />
                  <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>Expiring Soon</Text>
                  <View style={[styles.countBadge, { backgroundColor: colors.warning + '20' }]}>
                    <Text style={[styles.countBadgeText, { color: colors.warning, fontFamily: 'Inter_600SemiBold' }]}>{stats.expiringCount}</Text>
                  </View>
                </View>
                {stats.expiringProducts.map(p => (
                  <Pressable
                    key={p.id}
                    onPress={() => onProductClick(p.id)}
                    style={({ pressed }) => [
                      styles.alertRow,
                      { borderColor: colors.border, borderBottomWidth: 0.5, opacity: pressed ? 0.7 : 1 }
                    ]}
                  >
                    <View style={[styles.alertIcon, { backgroundColor: getExpiryColor(p.daysLeft) + '15' }]}>
                      <Ionicons name="time" size={18} color={getExpiryColor(p.daysLeft)} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.alertName, { color: colors.text, fontFamily: 'Inter_500Medium' }]} numberOfLines={1}>{p.name}</Text>
                      <Text style={[styles.alertSub, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Expires: {new Date(p.expiryDate).toLocaleDateString('en-IN')}</Text>
                    </View>
                    <Text style={[styles.daysLeft, { color: getExpiryColor(p.daysLeft), fontFamily: 'Inter_600SemiBold' }]}>{p.daysLeft}d</Text>
                  </Pressable>
                ))}
                <View style={[styles.potentialLossCard, { backgroundColor: colors.danger + '10', borderColor: colors.danger + '30' }]}>
                  <Ionicons name="alert-circle" size={16} color={colors.danger} />
                  <Text style={[styles.potentialLossText, { color: colors.danger, fontFamily: 'Inter_500Medium' }]}>
                    Potential Loss: Rs.{stats.expiringProducts.reduce((s, p) => s + p.potentialLoss, 0).toLocaleString()}
                  </Text>
                </View>
              </View>
            )}
          </>
        )}

        {logs && logs.length > 0 && (
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <LiveDot color={colors.success} />
              <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>Activity Feed</Text>
            </View>
            {logs.slice(0, 8).map((log, i) => (
              <View key={log.id} style={[styles.logRow, i < logs.slice(0, 8).length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border + '50' }]}>
                <Text style={[styles.logTime, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>{formatTime(log.timestamp)}</Text>
                <View style={[styles.rolePill, { backgroundColor: getRoleBadgeColor(log.userRole) + '20' }]}>
                  <Text style={[styles.rolePillText, { color: getRoleBadgeColor(log.userRole), fontFamily: 'Inter_600SemiBold' }]}>{log.userRole.replace('_', ' ')}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.logUser, { color: colors.text, fontFamily: 'Inter_500Medium' }]}>{log.userName}</Text>
                  <Text style={[styles.logAction, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]} numberOfLines={1}>{log.action}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

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
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16, paddingTop: 8 },
  greeting: { fontSize: 22 },
  welcomeText: { fontSize: 13, marginTop: 2 },
  topActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statsRow: { paddingHorizontal: 20, gap: 12, marginBottom: 16 },
  statCard: { width: Math.min(150, SCREEN_WIDTH * 0.38), borderRadius: 16, padding: 14 },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { fontSize: 18 },
  statLabel: { fontSize: 11, marginTop: 4 },
  sectionCard: { marginHorizontal: 16, borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1, overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 15, flex: 1 },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 130, paddingTop: 16 },
  barCol: { alignItems: 'center', flex: 1 },
  barValue: { fontSize: 9, marginBottom: 4 },
  bar: { width: Math.min(28, SCREEN_WIDTH * 0.06), borderRadius: 6, minHeight: 4 },
  barLabel: { fontSize: 10, marginTop: 6 },
  categoryGrid: { gap: 10 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  categoryDot: { width: 10, height: 10, borderRadius: 5 },
  categoryName: { fontSize: 13, flex: 1 },
  categoryValue: { fontSize: 12, flexShrink: 1 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', minHeight: 120, paddingVertical: 8 },
  paymentItem: { alignItems: 'center', gap: 6, flex: 1 },
  paymentCount: { fontSize: 15 },
  paymentBar: { width: Math.min(44, SCREEN_WIDTH * 0.1), borderRadius: 8 },
  paymentLabel: { fontSize: 12 },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  alertIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  alertName: { fontSize: 14, flex: 1 },
  alertSub: { fontSize: 11, marginTop: 2 },
  stockBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  stockBadgeText: { fontSize: 13 },
  daysLeft: { fontSize: 14 },
  countBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  countBadgeText: { fontSize: 12 },
  potentialLossCard: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10, marginTop: 8, borderWidth: 1 },
  potentialLossText: { fontSize: 13 },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  logTime: { fontSize: 11, width: 60 },
  rolePill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  rolePillText: { fontSize: 8 },
  logUser: { fontSize: 13 },
  logAction: { fontSize: 11, marginTop: 1 },
});
```

## File: app/(main)/employees.tsx
```typescript
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Platform,
  TextInput, Modal, Alert, FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/theme-context';
import { apiRequest, queryClient } from '@/lib/query-client';
import type { Employee } from '@/lib/types';

type Tab = 'employees' | 'attendance' | 'sessions' | 'performance';

export default function EmployeesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('employees');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [dataToEdit, setDateToEdit] = useState<Partial<Employee> & { password?: string }>({});
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', phone: '', password: '', pin: '', role: 'CASHIER' as 'CASHIER' | 'STOCK_CLERK' | 'ADMIN', status: 'Active' });

  const usersQuery = useQuery<Employee[]>({ queryKey: ['/api/users'] });
  const attendanceQuery = useQuery<any[]>({ queryKey: ['/api/attendance'] });
  const sessionsQuery = useQuery<any[]>({ queryKey: ['/api/session-logs'] });
  const reportsQuery = useQuery<any>({ queryKey: ['/api/reports'] });

  const users = usersQuery.data || [];
  const attendance = attendanceQuery.data || [];
  const sessions = sessionsQuery.data || [];
  const cashierPerformance: { name: string; transactions: number; revenue: number }[] =
    reportsQuery.data?.cashierPerformance || [];

  const totalStaff = users.length;
  const activeStaff = users.filter(u => u.status === 'Active').length;
  const inactiveStaff = users.filter(u => u.status === 'Inactive').length;
  const onlineNow = sessions.filter(s => s.status === 'Active').length;

  const addMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/users', newEmployee);
      return res.json();
    },
    onSuccess: () => {
      setShowAddModal(false);
      setNewEmployee({ name: '', email: '', phone: '', password: '', pin: '', role: 'CASHIER', status: 'Active' });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    onError: (e: any) => Alert.alert('Error', e.message || 'Failed to add employee'),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!selectedEmployee) return;
      const res = await apiRequest('PUT', `/api/users/${selectedEmployee.id}`, dataToEdit);
      return res.json();
    },
    onSuccess: () => {
      setShowEditModal(false);
      setSelectedEmployee(null);
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    onError: (e: any) => Alert.alert('Error', e.message || 'Failed to update employee'),
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return colors.admin;
      case 'CASHIER': return colors.cashier;
      case 'STOCK_CLERK': return colors.stockClerk;
      default: return colors.textMuted;
    }
  };

  const getStatusColor = (status: string) => status === 'Active' ? colors.success : colors.danger;
  const getAttendanceColor = (status: string) => {
    if (status === 'Present') return colors.success;
    if (status === 'Late') return colors.warning;
    return colors.danger;
  };

  // Convert "HH:MM" 24-hr string → "h:MM AM/PM"
  const to12hr = (t: string) => {
    if (!t || t === '-' || t === '') return t || '-';
    const [hStr, mStr] = t.split(':');
    const h = parseInt(hStr, 10);
    if (isNaN(h)) return t;
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${mStr} ${suffix}`;
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'employees', label: 'Employees' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'sessions', label: 'Sessions' },
    { key: 'performance', label: 'Performance' },
  ];

  const cashiers = users
    .filter(u => u.role === 'CASHIER' && u.status === 'Active')
    .sort((a, b) => {
      const aPerf = cashierPerformance.find(p => p.name === a.name);
      const bPerf = cashierPerformance.find(p => p.name === b.name);
      return (bPerf?.revenue || 0) - (aPerf?.revenue || 0);
    });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 8) }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'Inter_700Bold' }]}>Employee Management</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>Staff, attendance & performance</Text>
        </View>
        <Pressable onPress={() => setShowAddModal(true)} style={[styles.addBtn, { backgroundColor: colors.tint }]}>
          <Ionicons name="person-add" size={18} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.miniStat, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="people" size={20} color={colors.tint} />
          <Text style={[styles.miniStatValue, { color: colors.text, fontFamily: 'Inter_700Bold' }]}>{totalStaff}</Text>
          <Text style={[styles.miniStatLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Total Staff</Text>
        </View>
        <View style={[styles.miniStat, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={[styles.miniStatValue, { color: colors.success, fontFamily: 'Inter_700Bold' }]}>{activeStaff}</Text>
          <Text style={[styles.miniStatLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Active</Text>
        </View>
        <View style={[styles.miniStat, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="close-circle" size={20} color={colors.danger} />
          <Text style={[styles.miniStatValue, { color: colors.danger, fontFamily: 'Inter_700Bold' }]}>{inactiveStaff}</Text>
          <Text style={[styles.miniStatLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Inactive</Text>
        </View>
        <View style={[styles.miniStat, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="wifi" size={20} color={colors.success} />
          <Text style={[styles.miniStatValue, { color: colors.success, fontFamily: 'Inter_700Bold' }]}>{onlineNow}</Text>
          <Text style={[styles.miniStatLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Online</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow}>
          {tabs.map(t => (
            <Pressable key={t.key} onPress={() => setTab(t.key)}
              style={[styles.tabPill, { backgroundColor: tab === t.key ? colors.tint : 'transparent', borderColor: tab === t.key ? colors.tint : colors.border }]}>
              <Text style={[styles.tabPillText, { color: tab === t.key ? '#fff' : colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>{t.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {tab === 'employees' && users.map(u => (
          <Pressable key={u.id} onPress={() => { setSelectedEmployee(u); setDateToEdit(u); setShowEditModal(true); }}
            style={[styles.empRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: getRoleBadgeColor(u.role) + '20' }]}>
              <Text style={[styles.avatarText, { color: getRoleBadgeColor(u.role), fontFamily: 'Inter_700Bold' }]}>{u.name.split(' ').map(n => n[0]).join('')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.empName, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>{u.name}</Text>
              <Text style={[styles.empEmail, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>{u.email}</Text>
            </View>
            <View style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor(u.role) + '20' }]}>
              <Text style={[styles.roleBadgeText, { color: getRoleBadgeColor(u.role), fontFamily: 'Inter_600SemiBold' }]}>{u.role.replace('_', ' ')}</Text>
            </View>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(u.status) }]} />
          </Pressable>
        ))}

        {tab === 'attendance' && attendance.map(a => (
          <View key={a.id} style={[styles.empRow, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: 'column', alignItems: 'stretch', gap: 8 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[styles.empName, { color: colors.text, fontFamily: 'Inter_600SemiBold', flex: 1 }]} numberOfLines={1}>{a.userName}</Text>
              <Text style={[styles.empEmail, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>{a.date}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Text style={[styles.attChip, { color: colors.textSecondary, backgroundColor: colors.background, fontFamily: 'Inter_400Regular' }]}>In: {to12hr(a.checkIn)}</Text>
              <Text style={[styles.attChip, { color: colors.textSecondary, backgroundColor: colors.background, fontFamily: 'Inter_400Regular' }]}>Out: {to12hr(a.checkOut)}</Text>
              <View style={[styles.shiftBadge, { backgroundColor: a.shift === 'Morning' ? colors.tint + '20' : colors.accent + '20' }]}>
                <Text style={[styles.shiftBadgeText, { color: a.shift === 'Morning' ? colors.tint : colors.accent, fontFamily: 'Inter_500Medium' }]}>{a.shift}</Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: getAttendanceColor(a.status) + '15' }]}>
                <Text style={[styles.statusPillText, { color: getAttendanceColor(a.status), fontFamily: 'Inter_600SemiBold' }]}>{a.status}</Text>
              </View>
            </View>
          </View>
        ))}

        {tab === 'sessions' && sessions.map(s => (
          <View key={s.id} style={[styles.empRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.empName, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>{s.userName}</Text>
              <View style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor(s.userRole) + '20', alignSelf: 'flex-start', marginTop: 4 }]}>
                <Text style={[styles.roleBadgeText, { color: getRoleBadgeColor(s.userRole), fontFamily: 'Inter_600SemiBold' }]}>{s.userRole}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.sessionTime, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>{new Date(s.loginTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</Text>
              {s.duration ? <Text style={[styles.sessionDuration, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>{s.duration}</Text> : null}
            </View>
            <View style={[styles.statusPill, { backgroundColor: (s.status === 'Active' ? colors.success : colors.textMuted) + '15' }]}>
              <Text style={[styles.statusPillText, { color: s.status === 'Active' ? colors.success : colors.textMuted, fontFamily: 'Inter_600SemiBold' }]}>{s.status}</Text>
            </View>
          </View>
        ))}

        {tab === 'performance' && cashiers.map(u => {
          const perf = cashierPerformance.find(p => p.name === u.name);
          const txns = perf?.transactions ?? 0;
          const revenue = perf?.revenue ?? 0;
          const avg = txns > 0 ? Math.round(revenue / txns) : 0;
          return (
            <View key={u.id} style={[styles.perfCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.perfHeader}>
                <View style={[styles.avatar, { backgroundColor: getRoleBadgeColor(u.role) + '20' }]}>
                  <Text style={[styles.avatarText, { color: getRoleBadgeColor(u.role), fontFamily: 'Inter_700Bold' }]}>{u.name.split(' ').map(n => n[0]).join('')}</Text>
                </View>
                <View>
                  <Text style={[styles.empName, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>{u.name}</Text>
                  <Text style={[styles.empEmail, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>{u.role} • Joined {u.joinedDate}</Text>
                </View>
              </View>
              <View style={styles.perfStats}>
                <View style={styles.perfStatItem}>
                  <Text style={[styles.perfStatValue, { color: colors.tint, fontFamily: 'Inter_700Bold' }]}>{txns}</Text>
                  <Text style={[styles.perfStatLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Sales</Text>
                </View>
                <View style={styles.perfStatItem}>
                  <Text style={[styles.perfStatValue, { color: colors.success, fontFamily: 'Inter_700Bold' }]}>₹{revenue.toLocaleString('en-IN')}</Text>
                  <Text style={[styles.perfStatLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Revenue</Text>
                </View>
                <View style={styles.perfStatItem}>
                  <Text style={[styles.perfStatValue, { color: colors.accent, fontFamily: 'Inter_700Bold' }]}>₹{avg.toLocaleString('en-IN')}</Text>
                  <Text style={[styles.perfStatLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Avg/Txn</Text>
                </View>
              </View>
              {/* Progress bar based on share of total revenue */}
              {revenue > 0 && (
                <View style={{ marginTop: 10, gap: 4 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[{ fontSize: 11, color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Revenue share</Text>
                    <Text style={[{ fontSize: 11, color: colors.tint, fontFamily: 'Inter_500Medium' }]}>
                      {cashierPerformance.length > 0
                        ? Math.round((revenue / cashierPerformance.reduce((s, p) => s + p.revenue, 0)) * 100)
                        : 0}%
                    </Text>
                  </View>
                  <View style={{ height: 5, borderRadius: 3, backgroundColor: colors.border }}>
                    <View style={{
                      height: 5, borderRadius: 3, backgroundColor: colors.tint,
                      width: `${cashierPerformance.length > 0
                        ? Math.round((revenue / cashierPerformance.reduce((s, p) => s + p.revenue, 0)) * 100)
                        : 0}%`
                    }} />
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.formSheet, { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 }]}>
            <View style={[styles.formHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.formTitle, { color: colors.text, fontFamily: 'Inter_700Bold' }]}>Add Employee</Text>
              <Pressable onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
              {[
                { label: 'Full Name', key: 'name', placeholder: 'Full Name' },
                { label: 'Email', key: 'email', placeholder: 'Email', keyboard: 'email-address' as const },
                { label: 'Phone', key: 'phone', placeholder: 'Phone', keyboard: 'phone-pad' as const },
                { label: 'Password', key: 'password', placeholder: 'Password', secure: true },
                { label: 'Quick PIN (4 digits)', key: 'pin', placeholder: '0000', keyboard: 'numeric' as const },
              ].map(f => (
                <View key={f.key} style={styles.formField}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>{f.label}</Text>
                  <TextInput
                    style={[styles.formInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border, fontFamily: 'Inter_400Regular' }]}
                    placeholder={f.placeholder}
                    placeholderTextColor={colors.textMuted}
                    value={(newEmployee as any)[f.key]}
                    onChangeText={v => setNewEmployee(prev => ({ ...prev, [f.key]: v }))}
                    keyboardType={f.keyboard}
                    secureTextEntry={f.secure}
                    autoCapitalize="none"
                  />
                </View>
              ))}
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>Role</Text>
                <View style={styles.roleSelectRow}>
                  {(['CASHIER', 'STOCK_CLERK', 'ADMIN'] as const).map(r => (
                    <Pressable key={r} onPress={() => setNewEmployee(p => ({ ...p, role: r }))}
                      style={[styles.roleSelectPill, { backgroundColor: newEmployee.role === r ? getRoleBadgeColor(r) : colors.inputBg, borderColor: colors.border }]}>
                      <Text style={[styles.roleSelectText, { color: newEmployee.role === r ? '#fff' : colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>{r.replace('_', ' ')}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <Pressable onPress={() => addMutation.mutate()} disabled={addMutation.isPending || !newEmployee.name || !newEmployee.email}
                style={[styles.submitBtn, { backgroundColor: colors.tint, opacity: addMutation.isPending || !newEmployee.name ? 0.5 : 1 }]}>
                <Ionicons name="person-add" size={18} color="#fff" />
                <Text style={[styles.submitBtnText, { fontFamily: 'Inter_600SemiBold' }]}>{addMutation.isPending ? 'Adding...' : 'Add Employee'}</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.formSheet, { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 }]}>
            <View style={[styles.formHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.formTitle, { color: colors.text, fontFamily: 'Inter_700Bold' }]}>Edit Employee</Text>
              <Pressable onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Full Name</Text>
                <TextInput
                  style={[styles.formInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                  value={dataToEdit.name}
                  onChangeText={v => setDateToEdit(p => ({ ...p, name: v }))}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Email</Text>
                  <TextInput
                    style={[styles.formInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                    value={dataToEdit.email}
                    onChangeText={v => setDateToEdit(p => ({ ...p, email: v }))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Phone</Text>
                  <TextInput
                    style={[styles.formInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                    value={dataToEdit.phone}
                    onChangeText={v => setDateToEdit(p => ({ ...p, phone: v }))}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Password</Text>
                  <TextInput
                    style={[styles.formInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                    value={dataToEdit.password}
                    onChangeText={v => setDateToEdit(p => ({ ...p, password: v }))}
                    secureTextEntry
                  />
                </View>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Quick PIN (4 digits)</Text>
                  <TextInput
                    style={[styles.formInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                    value={dataToEdit.pin}
                    onChangeText={v => setDateToEdit(p => ({ ...p, pin: v }))}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Role</Text>
                  <View style={{ gap: 8 }}>
                    {(['CASHIER', 'STOCK_CLERK', 'ADMIN'] as const).map(r => (
                      <Pressable key={r} onPress={() => setDateToEdit(p => ({ ...p, role: r }))}
                        style={[styles.roleSelectPill, { paddingVertical: 8, backgroundColor: dataToEdit.role === r ? getRoleBadgeColor(r) : colors.inputBg, borderColor: colors.border }]}>
                        <Text style={[styles.roleSelectText, { fontSize: 11, color: dataToEdit.role === r ? '#fff' : colors.textSecondary }]}>{r.replace('_', ' ')}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Status</Text>
                  <View style={{ gap: 8 }}>
                    {['Active', 'Inactive'].map(s => (
                      <Pressable key={s} onPress={() => setDateToEdit(p => ({ ...p, status: s as any }))}
                        style={[styles.roleSelectPill, { paddingVertical: 8, backgroundColor: dataToEdit.status === s ? (s === 'Active' ? colors.success : colors.danger) : colors.inputBg, borderColor: colors.border }]}>
                        <Text style={[styles.roleSelectText, { fontSize: 11, color: dataToEdit.status === s ? '#fff' : colors.textSecondary }]}>{s}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
                <Pressable onPress={() => setShowEditModal(false)} style={[styles.submitBtn, { backgroundColor: 'transparent', borderColor: colors.border, borderWidth: 1, flex: 1, marginTop: 0 }]}>
                  <Text style={[styles.submitBtnText, { color: colors.text }]}>Cancel</Text>
                </Pressable>
                <Pressable onPress={() => updateMutation.mutate()} style={[styles.submitBtn, { backgroundColor: '#2563eb', flex: 1, marginTop: 0 }]}>
                  <Ionicons name="save-outline" size={18} color="#fff" />
                  <Text style={[styles.submitBtnText, { fontFamily: 'Inter_600SemiBold' }]}>Update Employee</Text>
                </Pressable>
              </View>

            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 22 },
  headerSub: { fontSize: 13, marginTop: 2 },
  addBtn: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 12 },
  miniStat: { flex: 1, paddingVertical: 12, borderRadius: 14, borderWidth: 1, alignItems: 'center', gap: 4 },
  miniStatValue: { fontSize: 18 },
  miniStatLabel: { fontSize: 10 },
  tabContainer: { marginBottom: 12 },
  tabRow: { paddingHorizontal: 16, gap: 6 },
  tabPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, minWidth: 90, alignItems: 'center', justifyContent: 'center' },
  tabPillText: { fontSize: 13, textAlign: 'center' },
  empRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8, gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14 },
  empName: { fontSize: 14 },
  empEmail: { fontSize: 11, marginTop: 1 },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  roleBadgeText: { fontSize: 9 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  attTime: { fontSize: 12, minWidth: 40, textAlign: 'center' },
  attChip: { fontSize: 12, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  shiftBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  shiftBadgeText: { fontSize: 10 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusPillText: { fontSize: 10 },
  sessionTime: { fontSize: 11 },
  sessionDuration: { fontSize: 10, marginTop: 2 },
  perfCard: { borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 10 },
  perfHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  perfStats: { flexDirection: 'row', gap: 12 },
  perfStatItem: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 10 },
  perfStatValue: { fontSize: 16 },
  perfStatLabel: { fontSize: 10, marginTop: 2 },
  formRow: { flexDirection: 'row', gap: 12 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  formSheet: { height: '85%', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  formTitle: { fontSize: 18 },
  formField: { marginBottom: 14 },
  formLabel: { fontSize: 12, marginBottom: 6 },
  formInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, height: 44, fontSize: 14 },
  roleSelectRow: { flexDirection: 'row', gap: 8 },
  roleSelectPill: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  roleSelectText: { fontSize: 12 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48, borderRadius: 12, gap: 8, marginTop: 16 },
  submitBtnText: { fontSize: 15, color: '#fff' },
});
```

## File: app/(main)/inventory.tsx
```typescript
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
```

## File: app/(main)/pos.tsx
```typescript
import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Platform,
  TextInput, FlatList, Modal, Alert, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { apiRequest, queryClient } from '@/lib/query-client';
import type { Product, CartItem } from '@/lib/types';

const CATEGORIES = ['All', 'Groceries', 'Dairy', 'Household', 'Personal Care', 'Beverages', 'Snacks', 'Frozen Foods'];

export default function POSScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI'>('Cash');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discount, setDiscount] = useState('');

  const productsQuery = useQuery<Product[]>({ queryKey: ['/api/products'] });
  const products = productsQuery.data || [];

  const filtered = useMemo(() => {
    let list = products.filter(p => p.stock > 0);
    if (selectedCategory !== 'All') list = list.filter(p => p.category === selectedCategory);
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search));
    return list;
  }, [products, selectedCategory, search]);

  const addToCart = useCallback((product: Product) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCart(prev => {
      const existing = prev.find(c => c.product.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) return prev;
        return prev.map(c => c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { product, qty: 1 }];
    });
  }, []);

  const updateQty = useCallback((productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(c => {
        if (c.product.id !== productId) return c;
        const newQty = c.qty + delta;
        if (newQty <= 0) return null as any;
        if (newQty > c.product.stock) return c;
        return { ...c, qty: newQty };
      }).filter(Boolean);
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(c => c.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const subtotal = cart.reduce((s, c) => s + c.product.sellingPrice * c.qty, 0);
  const gstAmount = cart.reduce((s, c) => s + (c.product.sellingPrice * c.qty * c.product.gstRate / 100), 0);

  const maxDiscount = subtotal * 0.03;
  const rawDiscount = Number(discount) || 0;
  const discountAmount = Math.min(rawDiscount, maxDiscount);

  const total = Math.max(0, subtotal - discountAmount + gstAmount);

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/transactions', {
        items: cart.map(c => ({ productId: c.product.id, qty: c.qty })),
        paymentMethod, customerPhone, discount: discountAmount,
        // Only send ID if the user is actually a CASHIER. 
        // Otherwise send empty string so the server randomizes between Priya/Sneha.
        cashierId: user?.role === 'CASHIER' ? user.id : '',
        cashierName: user?.role === 'CASHIER' ? user.name : '',
      });
      return res.json();
    },
    onSuccess: (data) => {
      setLastReceipt(data);
      setShowCart(false);
      setShowReceipt(true);
      setCart([]);
      setDiscount('');
      setCustomerPhone('');
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    onError: (e: any) => {
      Alert.alert('Error', e.message || 'Checkout failed');
    },
  });

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const renderProductCard = ({ item: p }: { item: Product }) => {
    const inCart = cart.find(c => c.product.id === p.id);
    return (
      <Pressable onPress={() => addToCart(p)} style={[styles.productCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.productTop}>
          <View style={[styles.stockTag, { backgroundColor: p.stock <= p.minStock ? colors.danger + '15' : colors.success + '15' }]}>
            <Text style={[styles.stockTagText, { color: p.stock <= p.minStock ? colors.danger : colors.success, fontFamily: 'Inter_600SemiBold' }]}>{p.stock} left</Text>
          </View>
          {!!inCart && (
            <View style={[styles.cartQtyBadge, { backgroundColor: colors.tint }]}>
              <Text style={[styles.cartQtyBadgeText, { fontFamily: 'Inter_700Bold' }]}>{inCart.qty}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.productName, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]} numberOfLines={2}>{p.name}</Text>
        <Text style={[styles.productCategory, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>{p.category}</Text>
        <View style={styles.productBottom}>
          <Text style={[styles.productPrice, { color: colors.tint, fontFamily: 'Inter_700Bold' }]}>Rs.{p.sellingPrice}</Text>
          <Text style={[styles.productGst, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>GST {p.gstRate}%</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 8) }]}>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'Inter_700Bold' }]}>Point of Sale</Text>
        <View style={styles.headerActions}>
          {cart.length > 0 && (
            <Pressable onPress={clearCart} style={[styles.clearBtn, { borderColor: colors.danger + '40' }]}>
              <Text style={[styles.clearBtnText, { color: colors.danger, fontFamily: 'Inter_500Medium' }]}>Clear</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={[styles.searchRow, { backgroundColor: colors.inputBg, marginHorizontal: 16, borderColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text, fontFamily: 'Inter_400Regular' }]}
          placeholder="Search product or barcode..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.catContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {CATEGORIES.map(cat => (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.catPill, { backgroundColor: selectedCategory === cat ? colors.tint : colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.catPillText, { color: selectedCategory === cat ? '#fff' : colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        renderItem={renderProductCard}
        keyExtractor={p => p.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={filtered.length > 0}
      />

      {cartCount > 0 && (
        <Pressable
          onPress={() => setShowCart(true)}
          style={[styles.fab, { backgroundColor: colors.tint, bottom: insets.bottom + (Platform.OS === 'web' ? 84 : 80) }]}
        >
          <Ionicons name="cart" size={22} color="#fff" />
          <Text style={[styles.fabText, { fontFamily: 'Inter_600SemiBold' }]}>Cart ({cartCount}) - Rs.{Math.round(total)}</Text>
        </Pressable>
      )}

      <Modal visible={showCart} animationType="slide" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.cartSheet, { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 }]}>
            <View style={[styles.cartHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.cartTitle, { color: colors.text, fontFamily: 'Inter_700Bold' }]}>Cart ({cartCount})</Text>
              <Pressable onPress={() => setShowCart(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
              {cart.map(c => (
                <View key={c.product.id} style={[styles.cartItem, { borderColor: colors.border }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cartItemName, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]} numberOfLines={1}>{c.product.name}</Text>
                    <Text style={[styles.cartItemPrice, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Rs.{c.product.sellingPrice} x {c.qty}</Text>
                  </View>
                  <View style={styles.qtyControls}>
                    <Pressable onPress={() => updateQty(c.product.id, -1)} style={[styles.qtyBtn, { borderColor: colors.border }]}>
                      <Ionicons name="remove" size={16} color={colors.text} />
                    </Pressable>
                    <Text style={[styles.qtyText, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>{c.qty}</Text>
                    <Pressable onPress={() => updateQty(c.product.id, 1)} style={[styles.qtyBtn, { borderColor: colors.border }]}>
                      <Ionicons name="add" size={16} color={colors.text} />
                    </Pressable>
                  </View>
                  <Text style={[styles.cartItemTotal, { color: colors.tint, fontFamily: 'Inter_700Bold' }]}>Rs.{c.product.sellingPrice * c.qty}</Text>
                  <Pressable onPress={() => removeFromCart(c.product.id)}>
                    <Ionicons name="trash-outline" size={18} color={colors.danger} />
                  </Pressable>
                </View>
              ))}

              <View style={[styles.summarySection, { borderTopColor: colors.border }]}>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>Subtotal</Text>
                  <Text style={[styles.summaryValue, { color: colors.text, fontFamily: 'Inter_500Medium' }]}>Rs.{subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.warning, fontFamily: 'Inter_500Medium' }]}>Discount</Text>
                  <TextInput
                    style={[styles.discountInput, {
                      color: rawDiscount > maxDiscount ? colors.danger : colors.warning,
                      borderColor: rawDiscount > maxDiscount ? colors.danger : colors.border,
                      fontFamily: 'Inter_500Medium'
                    }]}
                    placeholder="0"
                    placeholderTextColor={colors.textMuted}
                    value={discount}
                    onChangeText={v => {
                      if (/^\d*\.?\d*$/.test(v)) {
                        setDiscount(v);
                      }
                    }}
                    keyboardType="numeric"
                  />
                </View>
                {rawDiscount > maxDiscount && (
                  <Text style={{ color: colors.danger, fontSize: 10, textAlign: 'right', marginTop: -4, marginBottom: 4 }}>
                    Max allowed discount (3%): Rs.{maxDiscount.toFixed(2)}
                  </Text>
                )}
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>GST/Tax</Text>
                  <Text style={[styles.summaryValue, { color: colors.success, fontFamily: 'Inter_500Medium' }]}>+Rs.{gstAmount.toFixed(2)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={[styles.totalLabel, { color: colors.text, fontFamily: 'Inter_700Bold' }]}>Total</Text>
                  <Text style={[styles.totalValue, { color: colors.text, fontFamily: 'Inter_700Bold' }]}>Rs.{total.toFixed(2)}</Text>
                </View>
              </View>

              <TextInput
                style={[styles.phoneInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg, fontFamily: 'Inter_400Regular' }]}
                placeholder="Customer phone (optional)"
                placeholderTextColor={colors.textMuted}
                value={customerPhone}
                onChangeText={setCustomerPhone}
                keyboardType="phone-pad"
              />

              <View style={styles.paymentMethods}>
                {(['Cash', 'Card', 'UPI'] as const).map(m => (
                  <Pressable
                    key={m}
                    onPress={() => setPaymentMethod(m)}
                    style={[styles.pmBtn, { backgroundColor: paymentMethod === m ? colors.tint : colors.card, borderColor: paymentMethod === m ? colors.tint : colors.border }]}
                  >
                    <Ionicons name={m === 'Cash' ? 'cash-outline' : m === 'Card' ? 'card-outline' : 'phone-portrait-outline'} size={16} color={paymentMethod === m ? '#fff' : colors.textSecondary} />
                    <Text style={[styles.pmBtnText, { color: paymentMethod === m ? '#fff' : colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>{m}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <Pressable
              onPress={() => checkoutMutation.mutate()}
              disabled={checkoutMutation.isPending}
              style={[styles.checkoutBtn, { backgroundColor: colors.success, opacity: checkoutMutation.isPending ? 0.6 : 1, marginHorizontal: 16 }]}
            >
              <Ionicons name="checkmark-circle" size={22} color="#fff" />
              <Text style={[styles.checkoutBtnText, { fontFamily: 'Inter_600SemiBold' }]}>
                {checkoutMutation.isPending ? 'Processing...' : `Checkout - Rs.${total.toFixed(2)}`}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={showReceipt} animationType="fade" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.receiptCard, { backgroundColor: '#fff' }]}>
            <View style={styles.receiptHeader}>
              <Ionicons name="checkmark-circle" size={28} color="#16a34a" />
              <Text style={[styles.receiptTitle, { fontFamily: 'Inter_700Bold' }]}>Payment Successful</Text>
            </View>
            <View style={styles.receiptDivider} />
            <Text style={[styles.receiptStore, { fontFamily: 'Inter_700Bold' }]}>RetailPro Hypermarket</Text>
            <Text style={[styles.receiptAddr, { fontFamily: 'Inter_400Regular' }]}>123 Market Street, Mumbai - 400001</Text>
            {lastReceipt && (
              <>
                <View style={styles.receiptMeta}>
                  <Text style={[styles.receiptMetaText, { fontFamily: 'Inter_400Regular' }]}>Invoice: {lastReceipt.invoiceNo}</Text>
                  <Text style={[styles.receiptMetaText, { fontFamily: 'Inter_400Regular' }]}>{new Date(lastReceipt.createdAt).toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.receiptDivider} />
                {lastReceipt.items.map((item: any, i: number) => (
                  <View key={i} style={styles.receiptItem}>
                    <Text style={[styles.receiptItemName, { fontFamily: 'Inter_400Regular' }]} numberOfLines={1}>{item.productName}</Text>
                    <Text style={[styles.receiptItemQty, { fontFamily: 'Inter_400Regular' }]}>{item.qty}</Text>
                    <Text style={[styles.receiptItemTotal, { fontFamily: 'Inter_500Medium' }]}>Rs.{item.total}</Text>
                  </View>
                ))}
                <View style={styles.receiptDivider} />
                <View style={styles.receiptSummRow}>
                  <Text style={[styles.receiptSummLabel, { fontFamily: 'Inter_400Regular' }]}>Subtotal</Text>
                  <Text style={[styles.receiptSummVal, { fontFamily: 'Inter_500Medium' }]}>Rs.{lastReceipt.subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.receiptSummRow}>
                  <Text style={[styles.receiptSummLabel, { fontFamily: 'Inter_400Regular' }]}>GST</Text>
                  <Text style={[styles.receiptSummVal, { fontFamily: 'Inter_500Medium' }]}>+Rs.{lastReceipt.gstAmount.toFixed(2)}</Text>
                </View>
                <View style={[styles.receiptSummRow, { marginTop: 4 }]}>
                  <Text style={[styles.receiptTotal, { fontFamily: 'Inter_700Bold' }]}>Total</Text>
                  <Text style={[styles.receiptTotal, { fontFamily: 'Inter_700Bold' }]}>Rs.{lastReceipt.total.toFixed(2)}</Text>
                </View>
                <Text style={[styles.receiptPayment, { fontFamily: 'Inter_500Medium' }]}>Payment: {lastReceipt.paymentMethod}</Text>
              </>
            )}
            <Pressable onPress={() => setShowReceipt(false)} style={styles.receiptCloseBtn}>
              <Ionicons name="close" size={22} color="#666" />
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 22 },
  headerActions: { flexDirection: 'row', gap: 8 },
  clearBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  clearBtnText: { fontSize: 13 },
  searchRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 14, height: 44, gap: 8, borderWidth: 1, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14, height: '100%' },
  catContainer: { marginBottom: 16, zIndex: 10, position: 'relative' },
  catRow: { paddingHorizontal: 16, gap: 8 },
  catPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, minWidth: 70, alignItems: 'center', justifyContent: 'center' },
  catPillText: { fontSize: 13, textAlign: 'center' },
  productRow: { gap: 10, marginBottom: 10 },
  productCard: { flex: 1, borderRadius: 14, padding: 12, borderWidth: 1 },
  productTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  stockTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  stockTagText: { fontSize: 10 },
  cartQtyBadge: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  cartQtyBadgeText: { fontSize: 11, color: '#fff' },
  productName: { fontSize: 13, marginBottom: 2, minHeight: 34 },
  productCategory: { fontSize: 11, marginBottom: 6 },
  productBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 16 },
  productGst: { fontSize: 10 },
  fab: { position: 'absolute', left: 16, right: 16, height: 52, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  fabText: { fontSize: 15, color: '#fff' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  cartSheet: { height: '85%', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  cartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  cartTitle: { fontSize: 18 },
  cartItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 0.5 },
  cartItemName: { fontSize: 14 },
  cartItemPrice: { fontSize: 12, marginTop: 2 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  qtyText: { fontSize: 15, minWidth: 20, textAlign: 'center' },
  cartItemTotal: { fontSize: 14, minWidth: 60, textAlign: 'right' },
  summarySection: { marginTop: 16, paddingTop: 16, borderTopWidth: 1 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14 },
  discountInput: { fontSize: 14, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4, width: 80, textAlign: 'right' },
  totalRow: { marginTop: 8, paddingTop: 12, borderTopWidth: 1 },
  totalLabel: { fontSize: 18 },
  totalValue: { fontSize: 18 },
  phoneInput: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, height: 44, marginTop: 16, fontSize: 14 },
  paymentMethods: { flexDirection: 'row', gap: 10, marginTop: 16, marginBottom: 16 },
  pmBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  pmBtnText: { fontSize: 13 },
  checkoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: 14, gap: 8 },
  checkoutBtnText: { fontSize: 16, color: '#fff' },
  receiptCard: { margin: 20, borderRadius: 16, padding: 24, maxHeight: '80%' },
  receiptHeader: { alignItems: 'center', gap: 8, marginBottom: 12 },
  receiptTitle: { fontSize: 18, color: '#16a34a' },
  receiptDivider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 12 },
  receiptStore: { fontSize: 16, color: '#111', textAlign: 'center' },
  receiptAddr: { fontSize: 11, color: '#666', textAlign: 'center', marginTop: 2 },
  receiptMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  receiptMetaText: { fontSize: 11, color: '#666' },
  receiptItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  receiptItemName: { flex: 1, fontSize: 13, color: '#333' },
  receiptItemQty: { width: 30, fontSize: 13, color: '#666', textAlign: 'center' },
  receiptItemTotal: { width: 70, fontSize: 13, color: '#111', textAlign: 'right' },
  receiptSummRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  receiptSummLabel: { fontSize: 13, color: '#666' },
  receiptSummVal: { fontSize: 13, color: '#333' },
  receiptTotal: { fontSize: 18, color: '#111' },
  receiptPayment: { textAlign: 'center', color: '#2563eb', marginTop: 12, fontSize: 13 },
  receiptCloseBtn: { position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 16, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
});
```

## File: app/(main)/reports.tsx
```typescript
import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Platform, RefreshControl,
  Pressable, Modal, TouchableOpacity, FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/lib/theme-context';
import { apiRequest } from '@/lib/query-client';
import type { ReportData, Transaction } from '@/lib/types';

// ─── helpers ────────────────────────────────────────────────────────────────
const paymentColor = (m: string, colors: any) =>
  m === 'Cash' ? colors.success : m === 'UPI' ? colors.accent : colors.tint;

const paymentIcon = (m: string) =>
  m === 'Cash' ? 'cash-outline' : m === 'UPI' ? 'phone-portrait-outline' : 'card-outline';

// ─── Transaction Detail bottom-sheet ────────────────────────────────────────
function TxDetailSheet({
  tx, visible, colors, onClose,
}: { tx: Transaction | null; visible: boolean; colors: any; onClose: () => void }) {
  if (!tx) return null;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={ds.overlay}>
        <Pressable style={ds.backdrop} onPress={onClose} />
        <View style={[ds.sheet, { backgroundColor: colors.card }]}>
          {/* handle */}
          <View style={[ds.handle, { backgroundColor: colors.border }]} />

          {/* header */}
          <View style={[ds.sheetHeader, { borderBottomColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[ds.sheetTitle, { color: colors.text }]}>{tx.invoiceNo}</Text>
              <Text style={[ds.sheetDate, { color: colors.textMuted }]}>
                {new Date(tx.createdAt).toLocaleString()}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              <View style={[ds.pill, { backgroundColor: paymentColor(tx.paymentMethod, colors) + '20' }]}>
                <Ionicons name={paymentIcon(tx.paymentMethod) as any} size={11} color={paymentColor(tx.paymentMethod, colors)} />
                <Text style={[ds.pillText, { color: paymentColor(tx.paymentMethod, colors) }]}>{tx.paymentMethod}</Text>
              </View>
              <View style={[ds.pill, { backgroundColor: colors.success + '20' }]}>
                <Text style={[ds.pillText, { color: colors.success }]}>✓ Success</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={{ padding: 4, marginLeft: 8 }}>
              <Ionicons name="close" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={ds.sheetBody} showsVerticalScrollIndicator={false}>
            {/* info row */}
            <View style={[ds.infoRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={ds.infoCell}>
                <Text style={[ds.infoLabel, { color: colors.textMuted }]}>Cashier</Text>
                <Text style={[ds.infoVal, { color: colors.text }]}>{tx.cashierName || 'Unknown'}</Text>
              </View>
              <View style={[ds.infoSep, { backgroundColor: colors.border }]} />
              <View style={ds.infoCell}>
                <Text style={[ds.infoLabel, { color: colors.textMuted }]}>Items</Text>
                <Text style={[ds.infoVal, { color: colors.text }]}>{tx.items.length}</Text>
              </View>
              {tx.customerPhone ? (
                <>
                  <View style={[ds.infoSep, { backgroundColor: colors.border }]} />
                  <View style={ds.infoCell}>
                    <Text style={[ds.infoLabel, { color: colors.textMuted }]}>Customer</Text>
                    <Text style={[ds.infoVal, { color: colors.text }]}>{tx.customerPhone}</Text>
                  </View>
                </>
              ) : null}
            </View>

            {/* Purchased Items */}
            <Text style={[ds.secTitle, { color: colors.text }]}>Purchased Items</Text>
            <View style={[ds.itemsCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              {tx.items.map((prod, idx) => (
                <View
                  key={idx}
                  style={[
                    ds.itemRow,
                    idx < tx.items.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 0.5 },
                  ]}
                >
                  <View style={[ds.indexBadge, { backgroundColor: colors.tint + '15' }]}>
                    <Text style={[ds.indexText, { color: colors.tint }]}>{idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[ds.itemName, { color: colors.text }]}>{prod.productName}</Text>
                    <Text style={[ds.itemMeta, { color: colors.textMuted }]}>
                      Rs.{prod.price.toFixed(2)} × {prod.qty}{'  •  '}GST {prod.gstRate}%
                    </Text>
                  </View>
                  <Text style={[ds.itemAmt, { color: colors.text }]}>Rs.{prod.total.toFixed(2)}</Text>
                </View>
              ))}
            </View>

            {/* Price Breakdown */}
            <Text style={[ds.secTitle, { color: colors.text }]}>Price Breakdown</Text>
            <View style={[ds.breakCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={ds.breakRow}>
                <Text style={[ds.breakLabel, { color: colors.textSecondary }]}>Subtotal</Text>
                <Text style={[ds.breakVal, { color: colors.text }]}>Rs.{tx.subtotal.toFixed(2)}</Text>
              </View>
              <View style={ds.breakRow}>
                <View style={ds.breakLabelRow}>
                  <Ionicons name="pricetag-outline" size={13} color={colors.danger} />
                  <Text style={[ds.breakLabel, { color: colors.textSecondary }]}>Discount</Text>
                </View>
                <Text style={[ds.breakVal, { color: tx.discount > 0 ? colors.danger : colors.textSecondary }]}>
                  {tx.discount > 0 ? `- Rs.${tx.discount.toFixed(2)}` : 'Rs.0.00'}
                </Text>
              </View>
              <View style={ds.breakRow}>
                <View style={ds.breakLabelRow}>
                  <Ionicons name="receipt-outline" size={13} color={colors.tint} />
                  <Text style={[ds.breakLabel, { color: colors.textSecondary }]}>GST / Tax</Text>
                </View>
                <Text style={[ds.breakVal, { color: colors.tint }]}>+ Rs.{tx.gstAmount.toFixed(2)}</Text>
              </View>
              <View style={[ds.totalDivider, { backgroundColor: colors.border }]} />
              <View style={ds.breakRow}>
                <Text style={[ds.totalLabel, { color: colors.text }]}>Total Amount</Text>
                <Text style={[ds.totalAmt, { color: colors.tint }]}>Rs.{tx.total.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── All Transactions full-screen modal ─────────────────────────────────────
function AllTransactionsModal({
  visible, transactions, colors, insets, onClose,
}: {
  visible: boolean;
  transactions: Transaction[];
  colors: any;
  insets: any;
  onClose: () => void;
}) {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalRevenue = transactions.reduce((s, t) => s + t.total, 0);

  const renderTx = ({ item }: { item: Transaction }) => {
    const displayItems = item.items.slice(0, 3);
    const extra = item.items.length - displayItems.length;
    const pc = paymentColor(item.paymentMethod, colors);
    return (
      <Pressable
        onPress={() => setSelectedTx(item)}
        style={({ pressed }) => [
          atm.card,
          { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        {/* card header */}
        <View style={atm.cardHeader}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <View style={[atm.pill, { backgroundColor: pc + '20' }]}>
                <Ionicons name={paymentIcon(item.paymentMethod) as any} size={11} color={pc} />
                <Text style={[atm.pillTxt, { color: pc }]}>{item.paymentMethod}</Text>
              </View>
              <Text style={[atm.invoice, { color: colors.text }]} numberOfLines={1}>{item.invoiceNo}</Text>
            </View>
            <Text style={[atm.date, { color: colors.textMuted }]}>{new Date(item.createdAt).toLocaleString()}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[atm.amount, { color: colors.text }]}>Rs.{item.total.toFixed(2)}</Text>
            <View style={[atm.pill, { backgroundColor: colors.success + '20', marginTop: 4 }]}>
              <Text style={[atm.pillTxt, { color: colors.success }]}>✓ Success</Text>
            </View>
          </View>
        </View>

        {/* item preview */}
        <View style={[atm.previewList, { borderTopColor: colors.border }]}>
          {displayItems.map((p, i) => (
            <View key={i} style={atm.previewRow}>
              <Text style={[atm.previewName, { color: colors.textSecondary }]} numberOfLines={1}>{p.productName}</Text>
              <Text style={[atm.previewQty, { color: colors.textMuted }]}>x{p.qty}</Text>
              <Text style={[atm.previewAmt, { color: colors.text }]}>Rs.{p.total.toFixed(0)}</Text>
            </View>
          ))}
          {extra > 0 && (
            <Text style={[atm.moreItems, { color: colors.tint }]}>+{extra} more item{extra > 1 ? 's' : ''}</Text>
          )}
        </View>

        {/* footer */}
        <View style={[atm.cardFooter, { borderTopColor: colors.border }]}>
          <View style={atm.footerItem}>
            <Ionicons name="person-outline" size={11} color={colors.textMuted} />
            <Text style={[atm.footerTxt, { color: colors.textMuted }]}>{item.cashierName || 'Unknown'}</Text>
          </View>
          <View style={atm.footerItem}>
            <Ionicons name="cube-outline" size={11} color={colors.textMuted} />
            <Text style={[atm.footerTxt, { color: colors.textMuted }]}>{item.items.length} items</Text>
          </View>
          <View style={atm.footerItem}>
            <Ionicons name="chevron-forward" size={13} color={colors.tint} />
            <Text style={[atm.footerBlue, { color: colors.tint }]}>View Details</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[atm.container, { backgroundColor: colors.background, paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
        {/* header */}
        <View style={[atm.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={atm.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[atm.headerTitle, { color: colors.text }]}>All Transactions</Text>
            <Text style={[atm.headerSub, { color: colors.textMuted }]}>{transactions.length} records found</Text>
          </View>
        </View>

        {/* summary bar */}
        <View style={[atm.summaryBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={atm.summaryItem}>
            <Text style={[atm.summaryVal, { color: colors.text }]}>{transactions.length}</Text>
            <Text style={[atm.summaryLabel, { color: colors.textMuted }]}>Total Transactions</Text>
          </View>
          <View style={[atm.summarySep, { backgroundColor: colors.border }]} />
          <View style={atm.summaryItem}>
            <Text style={[atm.summaryVal, { color: colors.tint }]}>Rs.{totalRevenue.toFixed(2)}</Text>
            <Text style={[atm.summaryLabel, { color: colors.textMuted }]}>Lifetime Revenue</Text>
          </View>
        </View>

        <FlatList
          data={sorted}
          renderItem={renderTx}
          keyExtractor={item => item.id}
          contentContainerStyle={atm.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 60, gap: 12 }}>
              <Ionicons name="receipt-outline" size={48} color={colors.textMuted} />
              <Text style={{ color: colors.textMuted, fontFamily: 'Inter_500Medium' }}>No transactions yet</Text>
            </View>
          }
        />
      </View>

      {/* nested detail sheet */}
      <TxDetailSheet
        tx={selectedTx}
        visible={!!selectedTx}
        colors={colors}
        onClose={() => setSelectedTx(null)}
      />
    </Modal>
  );
}

// ─── Main Reports Screen ─────────────────────────────────────────────────────
export default function ReportsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [showAllTx, setShowAllTx] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'today' | '7days' | '30days' | 'all'>('all');
  const reportsQuery = useQuery<ReportData>({
    queryKey: [`/api/reports?filter=${selectedFilter}`],
  });

  const txQuery = useQuery<Transaction[]>({
    queryKey: [`/api/transactions${selectedFilter !== 'all' ? `?filter=${selectedFilter}` : ''}`]
  });
  const report = reportsQuery.data;
  const transactions = txQuery.data || [];

  const recentTx = useMemo(() => {
    return [...transactions]
      .sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      })
      .slice(0, 5);
  }, [transactions]);

  const onRefresh = () => { reportsQuery.refetch(); txQuery.refetch(); };

  if (!report) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.loadingContainer, { paddingTop: insets.top + 80 }]}>
          <Text style={[styles.loadingText, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Loading reports...</Text>
        </View>
      </View>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: `Rs.${report.totalRevenue.toLocaleString()}`, color: '#2563eb', icon: 'currency-inr', lib: 'mci' },
    { label: 'Net Profit', value: `Rs.${report.netProfit.toLocaleString()}`, color: '#16a34a', icon: 'trending-up', lib: 'ion' },
    { label: 'Transactions', value: String(report.totalTransactions), color: '#f59e0b', icon: 'receipt-outline', lib: 'ion' },
    { label: 'Avg Transaction', value: `Rs.${report.avgTransaction}`, color: '#8b5cf6', icon: 'analytics-outline', lib: 'ion' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 8), paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={!!reportsQuery.isRefetching} onRefresh={onRefresh} tintColor={colors.tint} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'Inter_700Bold' }]}>Reports & Analytics</Text>
            <Text style={[styles.headerSub, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>Business intelligence overview</Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {[
              { label: 'All Time', value: 'all' },
              { label: 'Today', value: 'today' },
              { label: 'Last 7 Days', value: '7days' },
              { label: 'Last 30 Days', value: '30days' },
            ].map((f) => (
              <Pressable
                key={f.value}
                onPress={() => setSelectedFilter(f.value as any)}
                style={[
                  styles.filterTab,
                  {
                    backgroundColor: selectedFilter === f.value ? colors.tint : colors.card,
                    borderColor: selectedFilter === f.value ? colors.tint : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: selectedFilter === f.value ? '#fff' : colors.text,
                      fontFamily: selectedFilter === f.value ? 'Inter_600SemiBold' : 'Inter_400Regular',
                    },
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>


        {/* Stat Cards */}
        <View style={styles.statGrid}>
          {statCards.map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: s.color }]}>
              <View style={[styles.statIconBox, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                {s.lib === 'mci'
                  ? <MaterialCommunityIcons name={s.icon as any} size={20} color="#fff" />
                  : <Ionicons name={s.icon as any} size={20} color="#fff" />}
              </View>
              <Text style={[styles.statValue, { fontFamily: 'Inter_700Bold' }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { fontFamily: 'Inter_400Regular' }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Top Products */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>Top Selling Products</Text>
          {report.topProducts.map((p, i) => {
            const maxRev = report.topProducts[0]?.revenue || 1;
            const pct = Math.max((p.revenue / maxRev) * 100, 2);
            return (
              <View key={i} style={[styles.topProductRow, i < report.topProducts.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 0.5 }]}>
                {/* Rank badge */}
                <View style={[styles.rankBadge, { backgroundColor: colors.tint + '18' }]}>
                  <Text style={[styles.rankText, { color: colors.tint }]}>#{i + 1}</Text>
                </View>
                {/* Name + bar + value */}
                <View style={{ flex: 1 }}>
                  <View style={styles.topProductHeaderRow}>
                    <Text
                      style={[styles.topProductName, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {p.name}
                    </Text>
                    <Text style={[styles.topProductValue, { color: colors.tint, fontFamily: 'Inter_700Bold' }]}>
                      Rs.{Math.round(p.revenue)}
                    </Text>
                  </View>
                  {/* Full-width bar below — no competition with text */}
                  <View style={[styles.barContainer, { backgroundColor: colors.tint + '15' }]}>
                    <View style={[styles.progressBar, { width: `${pct}%`, backgroundColor: colors.tint }]} />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Payment Breakdown */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>Payment Breakdown</Text>
          <View style={styles.paymentGrid}>
            {Object.entries(report.paymentBreakdown).map(([method, data]) => {
              const pmColors: Record<string, string> = { Cash: '#16a34a', Card: '#2563eb', UPI: '#8b5cf6' };
              const pmIcons: Record<string, string> = { Cash: 'cash-outline', Card: 'card-outline', UPI: 'phone-portrait-outline' };
              return (
                <View key={method} style={[styles.paymentCard, { backgroundColor: (pmColors[method] || colors.tint) + '10', borderColor: (pmColors[method] || colors.tint) + '30' }]}>
                  <Ionicons name={pmIcons[method] as any || 'wallet-outline'} size={24} color={pmColors[method] || colors.tint} />
                  <Text style={[styles.paymentMethodName, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>{method}</Text>
                  <Text style={[styles.paymentMethodCount, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>{data.count} txns</Text>
                  <Text style={[styles.paymentMethodTotal, { color: pmColors[method] || colors.tint, fontFamily: 'Inter_700Bold' }]}>Rs.{Math.round(data.total)}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Cashier Performance */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>Cashier Performance</Text>
          {report.cashierPerformance.map((c, i) => (
            <View key={i} style={[styles.cashierRow, i < report.cashierPerformance.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: colors.border }]}>
              <View style={[styles.cashierAvatar, { backgroundColor: colors.cashier + '20' }]}>
                <Text style={[styles.cashierAvatarText, { color: colors.cashier, fontFamily: 'Inter_700Bold' }]}>{c.name.split(' ').map(n => n[0]).join('')}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cashierName, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>{c.name}</Text>
                <Text style={[styles.cashierMeta, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>{c.transactions} transactions</Text>
              </View>
              <Text style={[styles.cashierRevenue, { color: colors.success, fontFamily: 'Inter_700Bold' }]}>Rs.{Math.round(c.revenue)}</Text>
            </View>
          ))}
        </View>

        {/* Reorder Suggestions */}
        {report.reorderSuggestions.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="refresh" size={18} color={colors.warning} />
              <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>Reorder Suggestions</Text>
              <View style={[styles.badge, { backgroundColor: colors.warning + '20' }]}>
                <Text style={[styles.badgeText, { color: colors.warning, fontFamily: 'Inter_600SemiBold' }]}>{report.reorderSuggestions.length} items</Text>
              </View>
            </View>
            {report.reorderSuggestions.map(r => (
              <View key={r.id} style={[styles.reorderRow, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.reorderName, { color: colors.text, fontFamily: 'Inter_500Medium' }]}>{r.name}</Text>
                  <Text style={[styles.reorderMeta, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Current: {r.stock} pcs</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.reorderSuggest, { color: colors.tint, fontFamily: 'Inter_600SemiBold' }]}>Order {r.suggestedOrder}</Text>
                  <Text style={[styles.reorderCost, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>~Rs.{r.estimatedCost.toLocaleString()}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Tax Summary */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>Tax Summary (GST)</Text>
          <View style={styles.taxGrid}>
            <View style={[styles.taxCard, { backgroundColor: colors.success + '10' }]}>
              <Text style={[styles.taxCardValue, { color: colors.success, fontFamily: 'Inter_700Bold' }]}>Rs.{report.totalRevenue.toFixed(2)}</Text>
              <Text style={[styles.taxCardLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Gross Sales</Text>
            </View>
            <View style={[styles.taxCard, { backgroundColor: colors.danger + '10' }]}>
              <Text style={[styles.taxCardValue, { color: colors.danger, fontFamily: 'Inter_700Bold' }]}>Rs.{report.totalGst.toFixed(2)}</Text>
              <Text style={[styles.taxCardLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>GST Collected</Text>
            </View>
            <View style={[styles.taxCard, { backgroundColor: colors.warning + '10' }]}>
              <Text style={[styles.taxCardValue, { color: colors.warning, fontFamily: 'Inter_700Bold' }]}>Rs.{report.totalDiscount.toFixed(2)}</Text>
              <Text style={[styles.taxCardLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Discounts</Text>
            </View>
            <View style={[styles.taxCard, { backgroundColor: colors.tint + '10' }]}>
              <Text style={[styles.taxCardValue, { color: colors.tint, fontFamily: 'Inter_700Bold' }]}>{report.itemsSold}</Text>
              <Text style={[styles.taxCardLabel, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>Items Sold</Text>
            </View>
          </View>
        </View>

        {/* ── Recent Transactions (with View All button) ── */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.recentHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>Recent Transactions</Text>
            <Pressable
              onPress={() => setShowAllTx(true)}
              style={({ pressed }) => [
                styles.viewAllBtn,
                { backgroundColor: colors.tint + '18', opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.viewAllText, { color: colors.tint, fontFamily: 'Inter_600SemiBold' }]}>View All</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.tint} />
            </Pressable>
          </View>

          {recentTx.map((tx: Transaction) => (
            <Pressable
              key={tx.id}
              onPress={() => setSelectedTx(tx)}
              style={({ pressed }) => [
                styles.txRow,
                { borderBottomColor: colors.border, opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <View style={[styles.txIcon, {
                backgroundColor:
                  tx.paymentMethod === 'Cash' ? colors.success + '15' :
                    tx.paymentMethod === 'UPI' ? colors.accent + '15' :
                      colors.tint + '15',
              }]}>
                <Ionicons
                  name={paymentIcon(tx.paymentMethod) as any}
                  size={18}
                  color={paymentColor(tx.paymentMethod, colors)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.txInvoice, { color: colors.text, fontFamily: 'Inter_500Medium' }]}>{tx.invoiceNo}</Text>
                <Text style={[styles.txTime, { color: colors.textMuted, fontFamily: 'Inter_400Regular' }]}>
                  {new Date(tx.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={[styles.txTotal, { color: colors.text, fontFamily: 'Inter_700Bold' }]}>Rs.{tx.total.toFixed(2)}</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* All Transactions modal */}
      <AllTransactionsModal
        visible={showAllTx}
        transactions={transactions}
        colors={colors}
        insets={insets}
        onClose={() => setShowAllTx(false)}
      />

      {/* Single Transaction detail (from recent list) */}
      <TxDetailSheet
        tx={selectedTx}
        visible={!!selectedTx}
        colors={colors}
        onClose={() => setSelectedTx(null)}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 14 },
  headerRow: { paddingHorizontal: 20, paddingTop: 8, marginBottom: 16 },
  headerTitle: { fontSize: 22 },
  headerSub: { fontSize: 13, marginTop: 2 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, marginBottom: 16 },
  statCard: { width: '47%', borderRadius: 16, padding: 16 },
  statIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: 18, color: '#fff' },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  section: { marginHorizontal: 16, borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 16 },
  sectionTitle: { fontSize: 16, flex: 1 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  topProductRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  rankBadge: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  rankText: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  topProductHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  topProductName: {
    fontSize: 13,
    flex: 1,              // takes all space except the value label
    marginRight: 8,
  },
  barContainer: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: { height: '100%', borderRadius: 3 },
  topProductValue: { fontSize: 13 },
  paymentGrid: { flexDirection: 'row', gap: 10 },
  paymentCard: { flex: 1, borderRadius: 14, padding: 14, borderWidth: 1, alignItems: 'center', gap: 6 },
  paymentMethodName: { fontSize: 14 },
  paymentMethodCount: { fontSize: 11 },
  paymentMethodTotal: { fontSize: 15 },
  cashierRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  cashierAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  cashierAvatarText: { fontSize: 14 },
  cashierName: { fontSize: 14 },
  cashierMeta: { fontSize: 11, marginTop: 1 },
  cashierRevenue: { fontSize: 16 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: 11 },
  reorderRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5 },
  reorderName: { fontSize: 14 },
  reorderMeta: { fontSize: 11, marginTop: 2 },
  reorderSuggest: { fontSize: 13 },
  reorderCost: { fontSize: 11, marginTop: 2 },
  taxGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  taxCard: { width: '47%', borderRadius: 12, padding: 14, alignItems: 'center' },
  taxCardValue: { fontSize: 16 },
  taxCardLabel: { fontSize: 11, marginTop: 4 },

  // Recent Transactions section
  recentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  viewAllText: { fontSize: 12 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 0.5 },
  txIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  txInvoice: { fontSize: 13 },
  txTime: { fontSize: 11, marginTop: 2 },
  txTotal: { fontSize: 14 },
  filterContainer: { marginBottom: 16 },
  filterScroll: { paddingHorizontal: 20, gap: 8 },
  filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 12 },
});

// ─── Detail Sheet Styles ─────────────────────────────────────────────────────
const ds = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 34, maxHeight: '90%' },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, gap: 10 },
  sheetTitle: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  sheetDate: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  pillText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  sheetBody: { padding: 20, gap: 12 },
  infoRow: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  infoCell: { flex: 1, padding: 12, alignItems: 'center' },
  infoLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', marginBottom: 4 },
  infoVal: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  infoSep: { width: 1 },
  secTitle: { fontSize: 13, fontFamily: 'Inter_700Bold', marginTop: 4 },
  itemsCard: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 14 },
  indexBadge: { width: 24, height: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  indexText: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  itemName: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  itemMeta: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  itemAmt: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  breakCard: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 10 },
  breakRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  breakLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  breakLabel: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  breakVal: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  totalDivider: { height: 1, marginVertical: 4 },
  totalLabel: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  totalAmt: { fontSize: 20, fontFamily: 'Inter_700Bold' },
});

// ─── All Transactions Modal Styles ───────────────────────────────────────────
const atm = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, gap: 12 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  summaryBar: { flexDirection: 'row', marginHorizontal: 16, marginVertical: 12, borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  summaryItem: { flex: 1, padding: 14, alignItems: 'center' },
  summaryVal: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  summaryLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 4 },
  summarySep: { width: 1 },
  list: { padding: 16, paddingTop: 4, paddingBottom: 100 },
  card: { borderRadius: 16, marginBottom: 12, borderWidth: 1, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', padding: 14 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  pillTxt: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  invoice: { fontFamily: 'Inter_600SemiBold', fontSize: 13, flex: 1 },
  date: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 2 },
  amount: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  previewList: { paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: 0.5 },
  previewRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 3 },
  previewName: { flex: 1, fontSize: 12, fontFamily: 'Inter_400Regular' },
  previewQty: { fontSize: 12, fontFamily: 'Inter_500Medium', marginHorizontal: 8 },
  previewAmt: { fontSize: 12, fontFamily: 'Inter_600SemiBold', minWidth: 50, textAlign: 'right' },
  moreItems: { fontSize: 11, fontFamily: 'Inter_600SemiBold', marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 0.5 },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerTxt: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  footerBlue: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
});
```

## File: app/index.tsx
```typescript
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, Platform,
  ScrollView, Animated, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { apiRequest } from '@/lib/query-client';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const { colors, isDark } = useTheme();
  const { user, setUser, isLoaded } = useAuth();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'email' | 'pin'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Route each role to their correct home screen
  const getHomeRoute = (role: string) => {
    if (role === 'CASHIER') return '/(main)/pos';
    if (role === 'STOCK_CLERK') return '/(main)/pos';
    return '/(main)/dashboard'; // ADMIN
  };

  useEffect(() => {
    if (isLoaded && user) {
      router.replace(getHomeRoute(user.role) as any);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleEmailLogin = async () => {
    if (!email || !password) { setError('Please fill all fields'); return; }
    setLoading(true); setError('');
    try {
      const res = await apiRequest('POST', '/api/auth/login', { email, password });
      const data = await res.json();
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setUser(data.user);
      router.replace(getHomeRoute(data.user.role) as any);
    } catch (e: any) {
      setError(e.message?.includes('401') ? 'Invalid email or password' : 'Login failed');
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally { setLoading(false); }
  };

  const handlePinLogin = async () => {
    if (pin.length !== 4) { setError('Enter 4-digit PIN'); return; }
    setLoading(true); setError('');
    try {
      const res = await apiRequest('POST', '/api/auth/pin-login', { pin });
      const data = await res.json();
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setUser(data.user);
      router.replace(getHomeRoute(data.user.role) as any);
    } catch (e: any) {
      setError(e.message?.includes('401') ? 'Invalid PIN' : 'Login failed');
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally { setLoading(false); }
  };

  const pinDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 20), paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 20) }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={[styles.logoContainer, { backgroundColor: colors.tint + '20' }]}>
            <MaterialCommunityIcons name="store" size={48} color={colors.tint} />
          </View>
          <Text style={[styles.appName, { color: colors.text, fontFamily: 'Inter_700Bold' }]}>RetailPro</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>Inventory & Billing System</Text>
        </Animated.View>

        <View style={[styles.tabRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Pressable
            onPress={() => { setTab('email'); setError(''); }}
            style={[styles.tabBtn, tab === 'email' && { backgroundColor: colors.tint }]}
          >
            <Ionicons name="mail-outline" size={16} color={tab === 'email' ? '#fff' : colors.textSecondary} />
            <Text style={[styles.tabText, { color: tab === 'email' ? '#fff' : colors.textSecondary, fontFamily: 'Inter_600SemiBold' }]}>Admin / Email</Text>
          </Pressable>
          <Pressable
            onPress={() => { setTab('pin'); setError(''); }}
            style={[styles.tabBtn, tab === 'pin' && { backgroundColor: colors.tint }]}
          >
            <Ionicons name="keypad-outline" size={16} color={tab === 'pin' ? '#fff' : colors.textSecondary} />
            <Text style={[styles.tabText, { color: tab === 'pin' ? '#fff' : colors.textSecondary, fontFamily: 'Inter_600SemiBold' }]}>Quick PIN</Text>
          </Pressable>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {tab === 'email' ? (
            <>
              <Text style={[styles.label, { color: colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>Email Address</Text>
              <View style={[styles.inputRow, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: colors.text, fontFamily: 'Inter_400Regular' }]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Text style={[styles.label, { color: colors.textSecondary, fontFamily: 'Inter_500Medium', marginTop: 16 }]}>Password</Text>
              <View style={[styles.inputRow, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: colors.text, fontFamily: 'Inter_400Regular' }]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={colors.textMuted} />
                </Pressable>
              </View>

              <Pressable
                onPress={handleEmailLogin}
                disabled={loading}
                style={({ pressed }) => [styles.loginBtn, { backgroundColor: colors.tint, opacity: pressed || loading ? 0.7 : 1 }]}
              >
                <Ionicons name="log-in-outline" size={22} color="#fff" />
                <Text style={[styles.loginBtnText, { fontFamily: 'Inter_600SemiBold' }]}>{loading ? 'Logging in...' : 'Login'}</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={[styles.pinTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>Enter 4-Digit PIN</Text>
              <View style={styles.pinDotsRow}>
                {[0, 1, 2, 3].map(i => (
                  <View key={i} style={[styles.pinDot, { borderColor: colors.border, backgroundColor: pin.length > i ? colors.tint : 'transparent' }]} />
                ))}
              </View>
              <View style={styles.pinPad}>
                {pinDigits.map((d, i) => (
                  <Pressable
                    key={i}
                    onPress={() => {
                      if (d === 'del') { setPin(prev => prev.slice(0, -1)); }
                      else if (d && pin.length < 4) { setPin(prev => prev + d); if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }
                    }}
                    style={({ pressed }) => [styles.pinKey, { backgroundColor: d ? (pressed ? colors.tint + '30' : colors.inputBg) : 'transparent', borderColor: d ? colors.border : 'transparent' }]}
                    disabled={!d}
                  >
                    {d === 'del' ? (
                      <Ionicons name="backspace-outline" size={24} color={colors.text} />
                    ) : (
                      <Text style={[styles.pinKeyText, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>{d}</Text>
                    )}
                  </Pressable>
                ))}
              </View>
              <Pressable
                onPress={handlePinLogin}
                disabled={loading || pin.length !== 4}
                style={({ pressed }) => [styles.loginBtn, { backgroundColor: colors.tint, opacity: pressed || loading || pin.length !== 4 ? 0.5 : 1 }]}
              >
                <Ionicons name="log-in-outline" size={22} color="#fff" />
                <Text style={[styles.loginBtnText, { fontFamily: 'Inter_600SemiBold' }]}>{loading ? 'Logging in...' : 'Login'}</Text>
              </Pressable>
            </>
          )}

          {!!error && (
            <View style={[styles.errorBox, { backgroundColor: colors.danger + '15' }]}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={[styles.errorText, { color: colors.danger, fontFamily: 'Inter_500Medium' }]}>{error}</Text>
            </View>
          )}
        </View>

        <View style={[styles.demoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.demoHeader}>
            <Ionicons name="information-circle-outline" size={18} color={colors.tint} />
            <Text style={[styles.demoTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>Demo Credentials</Text>
          </View>
          <View style={styles.demoRow}>
            <View style={[styles.demoBadge, { backgroundColor: colors.admin + '20' }]}>
              <Text style={[styles.demoBadgeText, { color: colors.admin, fontFamily: 'Inter_600SemiBold' }]}>ADMIN</Text>
            </View>
          </View>
          <View style={styles.demoRow}>
            <View style={[styles.demoBadge, { backgroundColor: colors.cashier + '20' }]}>
              <Text style={[styles.demoBadgeText, { color: colors.cashier, fontFamily: 'Inter_600SemiBold' }]}>CASHIER</Text>
            </View>
          </View>
          <View style={styles.demoRow}>
            <View style={[styles.demoBadge, { backgroundColor: colors.stockClerk + '20' }]}>
              <Text style={[styles.demoBadgeText, { color: colors.stockClerk, fontFamily: 'Inter_600SemiBold' }]}>STOCK_CLERK</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: 'center', paddingHorizontal: 24 },
  header: { alignItems: 'center', marginBottom: 32, marginTop: 20 },
  logoContainer: { width: 88, height: 88, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  appName: { fontSize: 32, marginBottom: 4 },
  subtitle: { fontSize: 15 },
  tabRow: { flexDirection: 'row', borderRadius: 12, padding: 4, width: '100%', maxWidth: 400, marginBottom: 20, borderWidth: 1 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10, gap: 6 },
  tabText: { fontSize: 13 },
  formCard: { width: '100%', maxWidth: 400, borderRadius: 16, padding: 24, borderWidth: 1, marginBottom: 16 },
  label: { fontSize: 13, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 14, height: 50, gap: 10, borderWidth: 1 },
  input: { flex: 1, fontSize: 15, height: '100%' },
  loginBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: 14, gap: 8, marginTop: 24 },
  loginBtnText: { fontSize: 17, color: '#fff' },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, padding: 12, borderRadius: 10 },
  errorText: { fontSize: 13, flex: 1 },
  pinTitle: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  pinDotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 24 },
  pinDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  pinPad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  pinKey: { width: 72, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  pinKeyText: { fontSize: 22 },
  demoCard: { width: '100%', maxWidth: 400, borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 40 },
  demoHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  demoTitle: { fontSize: 14 },
  demoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  demoBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  demoBadgeText: { fontSize: 10 },
  demoText: { fontSize: 13 },
});
```

## File: constants/colors.ts
```typescript
const Colors = {
  dark: {
    background: '#0f172a',
    card: '#1e293b',
    cardElevated: '#273548',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    tint: '#38bdf8',
    accent: '#818cf8',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    border: '#334155',
    inputBg: '#1e293b',
    tabBar: '#0f172a',
    tabIconDefault: '#64748b',
    tabIconSelected: '#38bdf8',
    overlay: 'rgba(0, 0, 0, 0.6)',
    gradient: ['#0f172a', '#1e293b'] as const,
    statusActive: '#22c55e',
    statusInactive: '#ef4444',
    cashier: '#f472b6',
    stockClerk: '#38bdf8',
    admin: '#818cf8',
  },
  light: {
    background: '#f8fafc',
    card: '#ffffff',
    cardElevated: '#f1f5f9',
    text: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    tint: '#2563eb',
    accent: '#6366f1',
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626',
    border: '#e2e8f0',
    inputBg: '#f1f5f9',
    tabBar: '#ffffff',
    tabIconDefault: '#94a3b8',
    tabIconSelected: '#2563eb',
    overlay: 'rgba(0, 0, 0, 0.4)',
    gradient: ['#f8fafc', '#e2e8f0'] as const,
    statusActive: '#16a34a',
    statusInactive: '#dc2626',
    cashier: '#ec4899',
    stockClerk: '#0ea5e9',
    admin: '#6366f1',
  },
};

export default Colors;
```

## File: server/index.ts
```typescript
import express from "express";
import type { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import * as fs from "fs";
import * as path from "path";

const app = express();
const log = console.log;

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

function setupCors(app: express.Application) {
  app.use((req, res, next) => {
    const origins = new Set<string>();

    if (process.env.REPLIT_DEV_DOMAIN) {
      origins.add(`https://${process.env.REPLIT_DEV_DOMAIN}`);
    }

    if (process.env.REPLIT_DOMAINS) {
      process.env.REPLIT_DOMAINS.split(",").forEach((d) => {
        origins.add(`https://${d.trim()}`);
      });
    }

    const origin = req.header("origin");

    // Allow localhost origins for Expo web development (any port)
    const isLocalhost =
      origin?.startsWith("http://localhost:") ||
      origin?.startsWith("http://127.0.0.1:");

    if (origin && (origins.has(origin) || isLocalhost)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS",
      );
      res.header("Access-Control-Allow-Headers", "Content-Type");
      res.header("Access-Control-Allow-Credentials", "true");
    }

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    next();
  });
}

function setupBodyParsing(app: express.Application) {
  app.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false }));
}

function setupRequestLogging(app: express.Application) {
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, unknown> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      if (!path.startsWith("/api")) return;

      const duration = Date.now() - start;

      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    });

    next();
  });
}

function getAppName(): string {
  try {
    const appJsonPath = path.resolve(process.cwd(), "app.json");
    const appJsonContent = fs.readFileSync(appJsonPath, "utf-8");
    const appJson = JSON.parse(appJsonContent);
    return appJson.expo?.name || "App Landing Page";
  } catch {
    return "App Landing Page";
  }
}

function serveExpoManifest(platform: string, res: Response) {
  const manifestPath = path.resolve(
    process.cwd(),
    "static-build",
    platform,
    "manifest.json",
  );

  if (!fs.existsSync(manifestPath)) {
    return res
      .status(404)
      .json({ error: `Manifest not found for platform: ${platform}` });
  }

  res.setHeader("expo-protocol-version", "1");
  res.setHeader("expo-sfv-version", "0");
  res.setHeader("content-type", "application/json");

  const manifest = fs.readFileSync(manifestPath, "utf-8");
  res.send(manifest);
}

function serveLandingPage({
  req,
  res,
  landingPageTemplate,
  appName,
}: {
  req: Request;
  res: Response;
  landingPageTemplate: string;
  appName: string;
}) {
  const forwardedProto = req.header("x-forwarded-proto");
  const protocol = forwardedProto || req.protocol || "https";
  const forwardedHost = req.header("x-forwarded-host");
  const host = forwardedHost || req.get("host");
  const baseUrl = `${protocol}://${host}`;
  const expsUrl = `${host}`;

  log(`baseUrl`, baseUrl);
  log(`expsUrl`, expsUrl);

  const html = landingPageTemplate
    .replace(/BASE_URL_PLACEHOLDER/g, baseUrl)
    .replace(/EXPS_URL_PLACEHOLDER/g, expsUrl)
    .replace(/APP_NAME_PLACEHOLDER/g, appName);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}

function configureExpoAndLanding(app: express.Application) {
  const templatePath = path.resolve(
    process.cwd(),
    "server",
    "templates",
    "landing-page.html",
  );
  const landingPageTemplate = fs.readFileSync(templatePath, "utf-8");
  const appName = getAppName();

  log("Serving static Expo files with dynamic manifest routing");

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    if (req.path !== "/" && req.path !== "/manifest") {
      return next();
    }

    const platform = req.header("expo-platform");
    if (platform && (platform === "ios" || platform === "android")) {
      return serveExpoManifest(platform, res);
    }

    if (req.path === "/") {
      return serveLandingPage({
        req,
        res,
        landingPageTemplate,
        appName,
      });
    }

    next();
  });

  app.use("/assets", express.static(path.resolve(process.cwd(), "assets")));
  app.use(express.static(path.resolve(process.cwd(), "static-build")));

  log("Expo routing: Checking expo-platform header on / and /manifest");
}

function setupErrorHandler(app: express.Application) {
  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    const error = err as {
      status?: number;
      statusCode?: number;
      message?: string;
    };

    const status = error.status || error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });
}

(async () => {
  setupCors(app);
  setupBodyParsing(app);
  setupRequestLogging(app);

  configureExpoAndLanding(app);

  const server = await registerRoutes(app);

  setupErrorHandler(app);

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => {
    log(`express server serving on port ${port}`);
  });
})();
```

## File: lib/query-client.ts
```typescript
import { fetch } from "expo/fetch";
import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * Gets the base URL for the Express API server (e.g., "http://localhost:3000")
 * @returns {string} The API base URL
 */
export function getApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  let host = process.env.EXPO_PUBLIC_DOMAIN;

  if (!host) {
    // Default to localhost:5000 for local development
    return "http://localhost:5000";
  }

  // Use http for localhost/local IPs, https otherwise
  const protocol =
    host.includes("localhost") ||
      host.includes("127.0.0.1") ||
      host.startsWith("192.168.") ||
      host.startsWith("10.")
      ? "http"
      : "https";

  try {
    let url = new URL(`${protocol}://${host}`);
    return url.href;
  } catch (e) {
    // Fallback if URL construction fails
    return `http://localhost:5000`;
  }
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  route: string,
  data?: unknown | undefined,
): Promise<Response> {
  const baseUrl = getApiUrl();
  const url = new URL(route, baseUrl);

  const res = await fetch(url.toString(), {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      const baseUrl = getApiUrl();
      const url = new URL(queryKey.join("/") as string, baseUrl);

      const res = await fetch(url.toString(), {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 30000,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
```

## File: package.json
```json
{
  "name": "expo-app",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "postinstall": "patch-package",
    "expo:dev": "EXPO_PACKAGER_PROXY_URL=https://$REPLIT_DEV_DOMAIN REACT_NATIVE_PACKAGER_HOSTNAME=$REPLIT_DEV_DOMAIN EXPO_PUBLIC_DOMAIN=$REPLIT_DEV_DOMAIN:5000 npx expo start --localhost",
    "server:dev": "npx cross-env NODE_ENV=development tsx server/index.ts",
    "expo:start:static:build": "npx expo start --no-dev --minify --localhost",
    "expo:static:build": "node scripts/build.js",
    "server:build": "esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=server_dist",
    "server:prod": "npx cross-env NODE_ENV=production node server_dist/index.js",
    "db:push": "drizzle-kit push",
    "start": "npx expo start",
    "lint": "npx expo lint",
    "lint:fix": "npx expo lint --fix"
  },
  "dependencies": {
    "@expo-google-fonts/inter": "^0.4.2",
    "@expo/vector-icons": "^15.0.3",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@stardazed/streams-text-encoding": "^1.0.2",
    "@tanstack/react-query": "^5.83.0",
    "@ungap/structured-clone": "^1.3.0",
    "drizzle-orm": "^0.39.3",
    "drizzle-zod": "^0.7.0",
    "expo": "~54.0.27",
    "expo-blur": "~15.0.8",
    "expo-constants": "~18.0.11",
    "expo-crypto": "^15.0.8",
    "expo-font": "~14.0.10",
    "expo-glass-effect": "~0.1.4",
    "expo-haptics": "~15.0.8",
    "expo-image": "~3.0.11",
    "expo-image-picker": "~17.0.9",
    "expo-linear-gradient": "~15.0.8",
    "expo-linking": "~8.0.10",
    "expo-location": "~19.0.8",
    "expo-router": "~6.0.17",
    "expo-splash-screen": "~31.0.12",
    "expo-status-bar": "~3.0.9",
    "expo-symbols": "~1.0.8",
    "expo-system-ui": "~6.0.9",
    "expo-web-browser": "~15.0.10",
    "express": "^5.0.1",
    "firebase-admin": "^13.6.1",
    "http-proxy-middleware": "^3.0.5",
    "pg": "^8.16.3",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-keyboard-controller": "^1.20.6",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-svg": "15.12.1",
    "react-native-web": "^0.21.0",
    "react-native-worklets": "0.5.1",
    "tsx": "^4.20.6",
    "ws": "^8.18.0",
    "zod": "^3.24.2",
    "zod-validation-error": "^3.4.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@expo/ngrok": "^4.1.0",
    "@types/express": "^5.0.0",
    "@types/react": "~19.1.10",
    "babel-plugin-react-compiler": "^19.0.0-beta-e993439-20250117",
    "drizzle-kit": "^0.31.4",
    "eslint": "^9.31.0",
    "eslint-config-expo": "~10.0.0",
    "patch-package": "^8.0.0",
    "typescript": "~5.9.2"
  },
  "private": true
}
```

## File: server/routes.ts
```typescript
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "node:http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    const user = await storage.getUserByEmail(email);
    if (!user || user.password !== password) return res.status(401).json({ error: "Invalid credentials" });
    if (user.status === "Inactive") return res.status(403).json({ error: "Account is inactive" });
    const { password: _, ...safe } = user;
    await storage.addActivityLog({ userId: user.id, userName: user.name, userRole: user.role, action: "Logged in", details: `${user.name} logged in via email`, timestamp: new Date().toISOString() });
    res.json({ user: safe });
  });

  app.post("/api/auth/pin-login", async (req: Request, res: Response) => {
    const { pin } = req.body;
    if (!pin) return res.status(400).json({ error: "PIN required" });
    const user = await storage.getUserByPin(pin);
    if (!user) return res.status(401).json({ error: "Invalid PIN" });
    if (user.status === "Inactive") return res.status(403).json({ error: "Account is inactive" });
    const { password: _, ...safe } = user;
    await storage.addActivityLog({ userId: user.id, userName: user.name, userRole: user.role, action: "Logged in via PIN", details: `${user.name} logged in via Quick PIN`, timestamp: new Date().toISOString() });
    res.json({ user: safe });
  });

  app.get("/api/users", async (_req: Request, res: Response) => {
    const users = await storage.getUsers();
    res.json(users.map(({ password, ...u }) => u));
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const user = await storage.getUser(req.params.id as string);
    if (!user) return res.status(404).json({ error: "User not found" });
    const { password, ...safe } = user;
    res.json(safe);
  });

  app.post("/api/users", async (req: Request, res: Response) => {
    const { name, email, phone, password, pin, role, status } = req.body;
    if (!name || !email || !password || !pin || !role) return res.status(400).json({ error: "Missing required fields" });
    const existing = await storage.getUserByEmail(email);
    if (existing) return res.status(409).json({ error: "Email already exists" });
    const user = await storage.createUser({ name, email, phone: phone || "", password, pin, role, status: status || "Active", joinedDate: new Date().toISOString().split("T")[0] });
    await storage.addActivityLog({ userId: user.id, userName: user.name, userRole: user.role, action: `Added employee: ${user.name}`, details: `New ${user.role} added`, timestamp: new Date().toISOString() });
    const { password: _, ...safe } = user;
    res.status(201).json(safe);
  });

  app.put("/api/users/:id", async (req: Request, res: Response) => {
    const updated = await storage.updateUser(req.params.id as string, req.body);
    if (!updated) return res.status(404).json({ error: "User not found" });
    const { password, ...safe } = updated;
    res.json(safe);
  });

  app.delete("/api/users/:id", async (req: Request, res: Response) => {
    const ok = await storage.deleteUser(req.params.id as string);
    if (!ok) return res.status(404).json({ error: "User not found" });
    res.json({ success: true });
  });

  app.get("/api/products", async (_req: Request, res: Response) => {
    res.json(await storage.getProducts());
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    const p = await storage.getProduct(req.params.id as string);
    if (!p) return res.status(404).json({ error: "Product not found" });
    res.json(p);
  });

  app.post("/api/products", async (req: Request, res: Response) => {
    const { name, sku, barcode, category, sellingPrice, costPrice, stock, minStock, unit, gstRate, manufacturingDate, expiryDate, supplier, batchNo, section } = req.body;
    if (!name || sellingPrice === undefined || costPrice === undefined) return res.status(400).json({ error: "Missing required fields" });
    if (sellingPrice < 0 || costPrice < 0) return res.status(400).json({ error: "Prices must be positive" });
    if (manufacturingDate && expiryDate && new Date(manufacturingDate) > new Date(expiryDate)) return res.status(400).json({ error: "Manufacturing date cannot be after expiry date" });
    const product = await storage.createProduct({
      name, sku: sku || "", barcode: barcode || "", category: category || "Groceries",
      sellingPrice: Number(sellingPrice), costPrice: Number(costPrice),
      stock: Number(stock) || 0, minStock: Number(minStock) || 0,
      unit: unit || "pcs", gstRate: Number(gstRate) || 5,
      manufacturingDate: manufacturingDate || "", expiryDate: expiryDate || "",
      supplier: supplier || "", batchNo: batchNo || "", section: section || "",
      lastUpdated: new Date().toISOString().split("T")[0],
    });
    await storage.addActivityLog({ userId: "SYSTEM", userName: "System", userRole: "SYSTEM", action: `Added new product: ${product.name}`, details: `Product ${product.name} added to inventory`, timestamp: new Date().toISOString() });
    res.status(201).json(product);
  });

  app.put("/api/products/:id", async (req: Request, res: Response) => {
    const existing = await storage.getProduct(req.params.id as string);
    if (!existing) return res.status(404).json({ error: "Product not found" });
    if (req.body.sellingPrice !== undefined && req.body.costPrice !== undefined) {
      if (Number(req.body.sellingPrice) < Number(req.body.costPrice)) {
        if (!req.body.confirmLoss) return res.status(422).json({ error: "Selling price is less than cost price", requireConfirmation: true });
      }
    }
    const updated = await storage.updateProduct(req.params.id as string, req.body);
    res.json(updated);
  });

  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    const ok = await storage.deleteProduct(req.params.id as string);
    if (!ok) return res.status(404).json({ error: "Product not found" });
    res.json({ success: true });
  });

  app.post("/api/products/:id/restock", async (req: Request, res: Response) => {
    const { qty } = req.body;
    if (!qty || qty <= 0) return res.status(400).json({ error: "Quantity must be positive" });
    const product = await storage.updateStock(req.params.id as string, Number(qty));
    if (!product) return res.status(404).json({ error: "Product not found" });
    await storage.addActivityLog({ userId: "SYSTEM", userName: "System", userRole: "SYSTEM", action: `Updated Stock: ${product.name} (+${qty})`, details: `Stock updated to ${product.stock}`, timestamp: new Date().toISOString() });
    res.json(product);
  });

  app.post("/api/transactions", async (req: Request, res: Response) => {
    const { items, paymentMethod, customerPhone, cashierId, cashierName, discount } = req.body;
    if (!items || !items.length) return res.status(400).json({ error: "No items in cart" });

    // Strict Cashier Assignment Logic
    let finalCashierId = cashierId;
    let finalCashierName = cashierName;

    let currentUser = undefined;
    if (cashierId) {
      try {
        currentUser = await storage.getUser(cashierId);
      } catch (e) {
        console.error("Error fetching user:", e);
      }
    }

    if (currentUser && currentUser.role === "CASHIER") {
      // If the logged-in user is a verified Cashier, force use their real name from DB
      finalCashierId = currentUser.id;
      finalCashierName = currentUser.name;
    } else {
      // If user is Admin, Stock Clerk, or unknown -> Assign roughly equally to Priya or Sneha
      const users = await storage.getUsers();

      // Filter for active cashiers, prioritizing our main ones
      const availableCashiers = users.filter(u =>
        u.role === "CASHIER" &&
        u.status === "Active" &&
        (u.name.toLowerCase().includes("priya") || u.name.toLowerCase().includes("sneha"))
      );

      // If no Priya/Sneha, fall back to ANY active cashier
      const candidates = availableCashiers.length > 0
        ? availableCashiers
        : users.filter(u => u.role === "CASHIER" && u.status === "Active");

      if (candidates.length > 0) {
        // Randomly pick one
        const randomCashier = candidates[Math.floor(Math.random() * candidates.length)];

        console.log("Randomly assigned cashier:", randomCashier.name);
        finalCashierId = randomCashier.id;
        finalCashierName = randomCashier.name;
      } else {
        // Fallback to a default system user if NO cashier exists
        finalCashierId = "SYSTEM";
        finalCashierName = "Store Admin";
      }
    }

    for (const item of items) {
      const product = await storage.getProduct(item.productId);
      if (!product) return res.status(400).json({ error: `Product ${item.productId} not found` });
      if (item.qty > product.stock) return res.status(400).json({ error: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
    }

    let subtotal = 0;
    let gstAmount = 0;
    const txItems: any[] = [];

    for (const item of items) {
      const product = (await storage.getProduct(item.productId))!;
      const total = product.sellingPrice * item.qty;
      const gst = total * (product.gstRate / 100);
      subtotal += total;
      gstAmount += gst;
      txItems.push({
        productId: product.id, productName: product.name,
        qty: item.qty, price: product.sellingPrice, gstRate: product.gstRate, total,
      });
      await storage.updateStock(product.id, -item.qty);
    }

    const maxAllowedDiscount = subtotal * 0.03;
    const discountAmount = Math.min(Number(discount) || 0, maxAllowedDiscount);
    const totalAmount = Math.max(0, subtotal - discountAmount + gstAmount);
    const invoiceNo = `INV-${new Date().getFullYear()}-${String((await storage.getTransactions()).length + 1).padStart(4, "0")}`;

    const tx = await storage.createTransaction({
      invoiceNo, items: txItems, subtotal, discount: discountAmount,
      gstAmount: Math.round(gstAmount * 100) / 100, total: Math.round(totalAmount * 100) / 100,
      paymentMethod: paymentMethod || "Cash", customerPhone: customerPhone || "",
      cashierId: finalCashierId, cashierName: finalCashierName, createdAt: new Date().toISOString(),
    });

    const itemSummary = txItems.map(i => `${i.qty}x ${i.productName}`).join(", ");
    await storage.addActivityLog({
      userId: finalCashierId, userName: finalCashierName, userRole: "CASHIER",
      action: `Sold ${itemSummary}`, details: `Invoice ${invoiceNo} - Total: Rs.${tx.total}`,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json(tx);
  });

  app.get("/api/transactions", async (req: Request, res: Response) => {
    let transactions = await storage.getTransactions();
    const filter = req.query.filter as string;
    if (filter && filter !== 'all') {
      const now = new Date();
      if (filter === 'today') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        transactions = transactions.filter(t => t.createdAt && new Date(t.createdAt).getTime() >= startOfDay);
      } else if (filter === '7days') {
        const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).getTime();
        transactions = transactions.filter(t => t.createdAt && new Date(t.createdAt).getTime() >= sevenDaysAgo);
      } else if (filter === '30days') {
        const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30).getTime();
        transactions = transactions.filter(t => t.createdAt && new Date(t.createdAt).getTime() >= thirtyDaysAgo);
      }
    }
    res.json(transactions);
  });

  app.get("/api/transactions/:id", async (req: Request, res: Response) => {
    const tx = await storage.getTransaction(req.params.id as string);
    if (!tx) return res.status(404).json({ error: "Transaction not found" });
    res.json(tx);
  });

  app.get("/api/activity-logs", async (_req: Request, res: Response) => {
    res.json(await storage.getActivityLogs());
  });

  app.get("/api/attendance", async (_req: Request, res: Response) => {
    res.json(await storage.getAttendance());
  });

  app.get("/api/session-logs", async (_req: Request, res: Response) => {
    res.json(await storage.getSessionLogs());
  });

  app.get("/api/dashboard/stats", async (_req: Request, res: Response) => {
    const transactions = await storage.getTransactions();
    const products = await storage.getProducts();
    const users = await storage.getUsers();
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const todayTx = transactions.filter(t => t.createdAt.startsWith(today));
    const totalRevenue = transactions.reduce((s, t) => s + t.total, 0);
    const todayRevenue = todayTx.reduce((s, t) => s + t.total, 0);

    // Have to fetch products for cost calculation but careful about N+1.
    // Since we have all products in memory (or fetched list), we can map.
    // For large datastores, this logic should move to database aggregation queries.
    // For now, we will use the fetched products list.
    const productMap = new Map(products.map(p => [p.id, p]));

    const totalCost = transactions.reduce((s, t) => s + t.items.reduce((c, i) => {
      const p = productMap.get(i.productId);
      return c + (p ? p.costPrice * i.qty : 0);
    }, 0), 0);
    const netProfit = totalRevenue - totalCost;

    const lowStockProducts = products.filter(p => p.stock <= p.minStock);
    const expiringProducts = products.filter(p => {
      if (!p.expiryDate) return false;
      const diff = (new Date(p.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 30 && diff > 0;
    });

    const categoryRevenue: Record<string, number> = {};
    transactions.forEach(t => t.items.forEach(i => {
      const p = productMap.get(i.productId);
      if (p) categoryRevenue[p.category] = (categoryRevenue[p.category] || 0) + i.total;
    }));

    const paymentMethods: Record<string, { count: number; total: number }> = {};
    transactions.forEach(t => {
      if (!paymentMethods[t.paymentMethod]) paymentMethods[t.paymentMethod] = { count: 0, total: 0 };
      paymentMethods[t.paymentMethod].count++;
      paymentMethods[t.paymentMethod].total += t.total;
    });

    const last7Days: { date: string; revenue: number; profit: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      const dayTx = transactions.filter(t => t.createdAt.startsWith(ds));
      const rev = dayTx.reduce((s, t) => s + t.total, 0);
      const cost = dayTx.reduce((s, t) => s + t.items.reduce((c, it) => {
        const p = productMap.get(it.productId);
        return c + (p ? p.costPrice * it.qty : 0);
      }, 0), 0);
      last7Days.push({ date: ds, revenue: Math.round(rev * 100) / 100, profit: Math.round((rev - cost) * 100) / 100 });
    }

    const inventoryValue = products.reduce((s, p) => s + p.costPrice * p.stock, 0);
    const activeEmployees = users.filter(u => u.status === "Active").length;
    const totalGst = transactions.reduce((s, t) => s + t.gstAmount, 0);

    res.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      todayRevenue: Math.round(todayRevenue * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      totalTransactions: transactions.length,
      todayTransactions: todayTx.length,
      totalProducts: products.length,
      lowStockCount: lowStockProducts.length,
      expiringCount: expiringProducts.length,
      activeEmployees,
      inventoryValue: Math.round(inventoryValue),
      totalGst: Math.round(totalGst * 100) / 100,
      categoryRevenue,
      paymentMethods,
      last7Days,
      lowStockProducts: lowStockProducts.map(p => ({ id: p.id, name: p.name, stock: p.stock, minStock: p.minStock })),
      expiringProducts: expiringProducts.map(p => {
        const daysLeft = Math.ceil((new Date(p.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return { id: p.id, name: p.name, expiryDate: p.expiryDate, daysLeft, stock: p.stock, costPrice: p.costPrice, potentialLoss: p.costPrice * p.stock };
      }),
    });
  });

  app.get("/api/reports", async (req: Request, res: Response) => {
    let transactions = await storage.getTransactions();
    const products = await storage.getProducts();
    // const users = await storage.getUsers();

    const filter = req.query.filter as string;
    if (filter && filter !== 'all') {
      const now = new Date();
      if (filter === 'today') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        transactions = transactions.filter(t => t.createdAt && new Date(t.createdAt).getTime() >= startOfDay);
      } else if (filter === '7days') {
        const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).getTime();
        transactions = transactions.filter(t => t.createdAt && new Date(t.createdAt).getTime() >= sevenDaysAgo);
      } else if (filter === '30days') {
        const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30).getTime();
        transactions = transactions.filter(t => t.createdAt && new Date(t.createdAt).getTime() >= thirtyDaysAgo);
      }
    }

    const totalRevenue = transactions.reduce((s, t) => s + t.total, 0);
    const productMap = new Map(products.map(p => [p.id, p]));
    const totalCost = transactions.reduce((s, t) => s + t.items.reduce((c, i) => {
      const p = productMap.get(i.productId);
      return c + (p ? p.costPrice * i.qty : 0);
    }, 0), 0);
    const totalDiscount = transactions.reduce((s, t) => s + t.discount, 0);
    const totalGst = transactions.reduce((s, t) => s + t.gstAmount, 0);

    const productSales: Record<string, { name: string; qty: number; revenue: number }> = {};
    transactions.forEach(t => t.items.forEach(i => {
      if (!productSales[i.productId]) productSales[i.productId] = { name: i.productName, qty: 0, revenue: 0 };
      productSales[i.productId].qty += i.qty;
      productSales[i.productId].revenue += i.total;
    }));
    const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

    const cashierPerf: Record<string, { name: string; transactions: number; revenue: number }> = {};
    transactions.forEach(t => {
      if (!cashierPerf[t.cashierId]) cashierPerf[t.cashierId] = { name: t.cashierName, transactions: 0, revenue: 0 };
      cashierPerf[t.cashierId].transactions++;
      cashierPerf[t.cashierId].revenue += t.total;
    });

    const paymentBreakdown: Record<string, { count: number; total: number }> = {};
    transactions.forEach(t => {
      if (!paymentBreakdown[t.paymentMethod]) paymentBreakdown[t.paymentMethod] = { count: 0, total: 0 };
      paymentBreakdown[t.paymentMethod].count++;
      paymentBreakdown[t.paymentMethod].total += t.total;
    });

    const reorderSuggestions = products.filter(p => p.stock <= p.minStock).map(p => ({
      id: p.id, name: p.name, stock: p.stock, minStock: p.minStock,
      suggestedOrder: p.minStock * 3, estimatedCost: p.costPrice * p.minStock * 3,
    }));

    res.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      netProfit: Math.round((totalRevenue - totalCost) * 100) / 100,
      totalTransactions: transactions.length,
      avgTransaction: transactions.length ? Math.round((totalRevenue / transactions.length) * 100) / 100 : 0,
      totalDiscount: Math.round(totalDiscount * 100) / 100,
      totalGst: Math.round(totalGst * 100) / 100,
      itemsSold: transactions.reduce((s, t) => s + t.items.reduce((c, i) => c + i.qty, 0), 0),
      topProducts,
      cashierPerformance: Object.values(cashierPerf),
      paymentBreakdown,
      reorderSuggestions,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
```

## File: server/storage.ts
```typescript
import { randomUUID } from "crypto";
import admin from 'firebase-admin';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  pin: string;
  role: "ADMIN" | "CASHIER" | "STOCK_CLERK";
  status: "Active" | "Inactive";
  joinedDate: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  sellingPrice: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: string;
  gstRate: number;
  manufacturingDate: string;
  expiryDate: string;
  supplier: string;
  batchNo: string;
  section: string;
  lastUpdated: string;
}

export interface TransactionItem {
  productId: string;
  productName: string;
  qty: number;
  price: number;
  gstRate: number;
  total: number;
}

export interface Transaction {
  id: string;
  invoiceNo: string;
  items: TransactionItem[];
  subtotal: number;
  discount: number;
  gstAmount: number;
  total: number;
  paymentMethod: "Cash" | "Card" | "UPI";
  customerPhone: string;
  cashierId: string;
  cashierName: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface Attendance {
  id: string;
  userId: string;
  userName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  shift: "Morning" | "Afternoon" | "Night";
  status: "Present" | "Absent" | "Late";
}

export interface SessionLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  loginTime: string;
  logoutTime: string;
  duration: string;
  status: "Active" | "Ended";
}

export interface IStorage {
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPin(pin: string): Promise<User | undefined>;
  createUser(user: Omit<User, "id">): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: Omit<Product, "id">): Promise<Product>;
  updateProduct(id: string, data: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  updateStock(id: string, qty: number): Promise<Product | undefined>;

  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(tx: Omit<Transaction, "id">): Promise<Transaction>;

  getActivityLogs(): Promise<ActivityLog[]>;
  addActivityLog(log: Omit<ActivityLog, "id">): Promise<ActivityLog>;

  getAttendance(): Promise<Attendance[]>;
  getSessionLogs(): Promise<SessionLog[]>;
}

class MemStorage implements IStorage {
  users: Map<string, User> = new Map();
  products: Map<string, Product> = new Map();
  transactions: Map<string, Transaction> = new Map();
  activityLogs: ActivityLog[] = [];
  attendance: Attendance[] = [];
  sessionLogs: SessionLog[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    // Basic seed if memory is empty (always true on restart for MemStorage)
    const users: User[] = [
      { id: "U001", name: "Rajesh Kumar", email: "admin@retailpro.com", password: "admin123", phone: "9876543210", pin: "1234", role: "ADMIN", status: "Active", joinedDate: "2024-01-15" },
      { id: "U002", name: "Priya Sharma", email: "priya@retailpro.com", password: "priya123", phone: "9876543211", pin: "2345", role: "CASHIER", status: "Active", joinedDate: "2024-03-20" },
      { id: "U003", name: "Amit Patel", email: "amit@retailpro.com", password: "amit123", phone: "9876543212", pin: "3456", role: "STOCK_CLERK", status: "Active", joinedDate: "2024-06-10" },
      { id: "U004", name: "Sneha Reddy", email: "sneha@retailpro.com", password: "sneha123", phone: "9876543213", pin: "4567", role: "CASHIER", status: "Active", joinedDate: "2024-08-05" },
      { id: "U005", name: "Vikram Singh", email: "vikram@retailpro.com", password: "vikram123", phone: "9876543214", pin: "5678", role: "STOCK_CLERK", status: "Inactive", joinedDate: "2024-12-01" },
    ];
    users.forEach(u => this.users.set(u.id, u));

    const now = new Date();
    const fmt = (d: Date) => d.toISOString().split("T")[0];
    const futureDate = (days: number) => { const d = new Date(now); d.setDate(d.getDate() + days); return fmt(d); };

    // Add same products from original seed
    const products: Product[] = [
      { id: "P001", name: "Tata Salt (1kg)", sku: "TS001", barcode: "8901234567890", category: "Groceries", sellingPrice: 28, costPrice: 22, stock: 450, minStock: 50, unit: "kg", gstRate: 5, manufacturingDate: "2025-06-01", expiryDate: futureDate(180), supplier: "Tata Consumer", batchNo: "B2024-001", section: "Aisle 1", lastUpdated: fmt(now) },
      // ... keep it concise for now, just a few examples or full list if needed
      { id: "P002", name: "Fortune Sunflower Oil (1L)", sku: "FS001", barcode: "8901234567891", category: "Groceries", sellingPrice: 155, costPrice: 130, stock: 200, minStock: 30, unit: "L", gstRate: 5, manufacturingDate: "2025-05-15", expiryDate: futureDate(25), supplier: "Adani Wilmar", batchNo: "B2024-002", section: "Aisle 1", lastUpdated: fmt(now) },
      { id: "P003", name: "Surf Excel Matic (2kg)", sku: "SE001", barcode: "8901234567892", category: "Household", sellingPrice: 480, costPrice: 380, stock: 120, minStock: 20, unit: "kg", gstRate: 18, manufacturingDate: "2025-04-01", expiryDate: futureDate(365), supplier: "Hindustan Unilever", batchNo: "B2024-003", section: "Aisle 3", lastUpdated: fmt(now) },
    ];
    products.forEach(p => this.products.set(p.id, p));

    // Seed Attendance (last 7 days for each user)
    const attendanceData: Attendance[] = [];
    const staffMembers = [
      { id: 'U001', name: 'Rajesh Kumar' },
      { id: 'U002', name: 'Priya Sharma' },
      { id: 'U003', name: 'Amit Patel' },
      { id: 'U004', name: 'Sneha Reddy' },
      { id: 'U005', name: 'Vikram Singh' },
    ];
    const shiftsPattern: ('Morning' | 'Afternoon' | 'Night')[] = ['Morning', 'Morning', 'Afternoon', 'Morning', 'Morning'];
    const statusMatrix: ('Present' | 'Late' | 'Absent')[][] = [
      // Day 0 (today)
      ['Present', 'Present', 'Late', 'Present', 'Absent'],
      // Day 1
      ['Present', 'Present', 'Present', 'Late', 'Absent'],
      // Day 2
      ['Present', 'Late', 'Present', 'Present', 'Present'],
      // Day 3
      ['Present', 'Present', 'Absent', 'Present', 'Late'],
      // Day 4
      ['Present', 'Present', 'Present', 'Present', 'Present'],
      // Day 5
      ['Present', 'Absent', 'Present', 'Present', 'Late'],
      // Day 6
      ['Present', 'Present', 'Present', 'Late', 'Absent'],
    ];
    const checkInTimes = [
      ['09:00', '08:55', '09:15', '13:00', ''],
      ['09:01', '09:00', '09:05', '13:20', ''],
      ['09:02', '09:35', '09:00', '13:00', '09:00'],
      ['09:00', '09:00', '', '13:10', '09:40'],
      ['09:00', '09:00', '09:00', '13:00', '09:00'],
      ['09:00', '', '09:00', '13:00', '09:30'],
      ['09:00', '09:00', '09:00', '13:25', ''],
    ];
    const checkOutTimes = [
      ['18:00', '17:05', '', '-', ''],
      ['18:00', '18:00', '18:00', '-', ''],
      ['18:00', '17:55', '18:00', '21:05', '18:00'],
      ['18:00', '18:00', '', '21:00', '18:00'],
      ['18:00', '18:00', '18:00', '21:00', '18:00'],
      ['18:00', '', '18:00', '21:00', '18:00'],
      ['18:00', '18:00', '18:00', '-', ''],
    ];
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const d = new Date(now);
      d.setDate(d.getDate() - dayOffset);
      const dateStr = fmt(d);
      staffMembers.forEach((staff, si) => {
        const status = statusMatrix[dayOffset][si];
        attendanceData.push({
          id: `ATT-${dateStr}-${staff.id}`,
          userId: staff.id,
          userName: staff.name,
          date: dateStr,
          checkIn: status === 'Absent' ? '-' : checkInTimes[dayOffset][si],
          checkOut: status === 'Absent' ? '-' : checkOutTimes[dayOffset][si],
          shift: shiftsPattern[si],
          status,
        });
      });
    }
    this.attendance = attendanceData;

    // Seed Session Logs
    const sessionData: SessionLog[] = [
      { id: 'SL001', userId: 'U001', userName: 'Rajesh Kumar', userRole: 'ADMIN', loginTime: new Date(now.getTime() - 2 * 3600000).toISOString(), logoutTime: '', duration: '', status: 'Active' },
      { id: 'SL002', userId: 'U002', userName: 'Priya Sharma', userRole: 'CASHIER', loginTime: new Date(now.getTime() - 8 * 3600000).toISOString(), logoutTime: new Date(now.getTime() - 1 * 3600000).toISOString(), duration: '7h 0m', status: 'Ended' },
      { id: 'SL003', userId: 'U003', userName: 'Amit Patel', userRole: 'STOCK_CLERK', loginTime: new Date(now.getTime() - 24 * 3600000).toISOString(), logoutTime: new Date(now.getTime() - 16 * 3600000).toISOString(), duration: '8h 0m', status: 'Ended' },
      { id: 'SL004', userId: 'U004', userName: 'Sneha Reddy', userRole: 'CASHIER', loginTime: new Date(now.getTime() - 5 * 3600000).toISOString(), logoutTime: '', duration: '', status: 'Active' },
      { id: 'SL005', userId: 'U005', userName: 'Vikram Singh', userRole: 'STOCK_CLERK', loginTime: new Date(now.getTime() - 48 * 3600000).toISOString(), logoutTime: new Date(now.getTime() - 40 * 3600000).toISOString(), duration: '8h 0m', status: 'Ended' },
    ];
    this.sessionLogs = sessionData;
  }

  async getUsers(): Promise<User[]> { return Array.from(this.users.values()); }
  async getUser(id: string): Promise<User | undefined> { return this.users.get(id); }
  async getUserByEmail(email: string): Promise<User | undefined> { return Array.from(this.users.values()).find(u => u.email === email); }
  async getUserByPin(pin: string): Promise<User | undefined> { return Array.from(this.users.values()).find(u => u.pin === pin); }
  async createUser(user: Omit<User, "id">): Promise<User> { const id = "U" + String(this.users.size + 1).padStart(3, "0"); const u = { ...user, id }; this.users.set(id, u); return u; }
  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> { const u = this.users.get(id); if (!u) return undefined; const updated = { ...u, ...data }; this.users.set(id, updated); return updated; }
  async deleteUser(id: string): Promise<boolean> { return this.users.delete(id); }

  async getProducts(): Promise<Product[]> { return Array.from(this.products.values()); }
  async getProduct(id: string): Promise<Product | undefined> { return this.products.get(id); }
  async createProduct(product: Omit<Product, "id">): Promise<Product> { const id = "P" + String(this.products.size + 1).padStart(3, "0"); const p = { ...product, id }; this.products.set(id, p); return p; }
  async updateProduct(id: string, data: Partial<Product>): Promise<Product | undefined> { const p = this.products.get(id); if (!p) return undefined; const updated = { ...p, ...data, lastUpdated: new Date().toISOString().split("T")[0] }; this.products.set(id, updated); return updated; }
  async deleteProduct(id: string): Promise<boolean> { return this.products.delete(id); }
  async updateStock(id: string, qty: number): Promise<Product | undefined> { const p = this.products.get(id); if (!p) return undefined; p.stock += qty; p.lastUpdated = new Date().toISOString().split("T")[0]; return p; }

  async getTransactions(): Promise<Transaction[]> { return Array.from(this.transactions.values()); }
  async getTransaction(id: string): Promise<Transaction | undefined> { return this.transactions.get(id); }
  async createTransaction(tx: Omit<Transaction, "id">): Promise<Transaction> { const id = "T" + String(this.transactions.size + 1).padStart(3, "0"); const t = { ...tx, id }; this.transactions.set(id, t); return t; }

  async getActivityLogs(): Promise<ActivityLog[]> { return this.activityLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); }
  async addActivityLog(log: Omit<ActivityLog, "id">): Promise<ActivityLog> { const l = { ...log, id: randomUUID() }; this.activityLogs.unshift(l); return l; }

  async getAttendance(): Promise<Attendance[]> { return this.attendance; }
  async getSessionLogs(): Promise<SessionLog[]> { return this.sessionLogs; }
}

class FirebaseStorage implements IStorage {
  db: FirebaseFirestore.Firestore;

  constructor(serviceAccountPath: string) {
    if (!admin.apps.length) {
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      } else {
        // Fallback for cloud run or if user sets GOOGLE_APPLICATION_CREDENTIALS
        admin.initializeApp();
      }
    }
    this.db = getFirestore();
    this.seed();
  }

  private async seed() {
    try {
      const usersSnap = await this.db.collection('users').limit(1).get();
      if (usersSnap.empty) {
        console.log("Seeding default users to Firestore...");
        const users: User[] = [
          { id: "U001", name: "Rajesh Kumar", email: "admin@retailpro.com", password: "admin123", phone: "9876543210", pin: "1234", role: "ADMIN", status: "Active", joinedDate: "2024-01-15" },
          { id: "U002", name: "Priya Sharma", email: "priya@retailpro.com", password: "priya123", phone: "9876543211", pin: "2345", role: "CASHIER", status: "Active", joinedDate: "2024-03-20" },
          { id: "U003", name: "Amit Patel", email: "amit@retailpro.com", password: "amit123", phone: "9876543212", pin: "3456", role: "STOCK_CLERK", status: "Active", joinedDate: "2024-06-10" },
          { id: "U004", name: "Sneha Reddy", email: "sneha@retailpro.com", password: "sneha123", phone: "9876543213", pin: "4567", role: "CASHIER", status: "Active", joinedDate: "2024-08-05" },
          { id: "U005", name: "Vikram Singh", email: "vikram@retailpro.com", password: "vikram123", phone: "9876543214", pin: "5678", role: "STOCK_CLERK", status: "Inactive", joinedDate: "2024-12-01" },
        ];
        for (const u of users) {
          await this.db.collection('users').doc(u.id).set(u);
        }
        console.log("Users seeding verified.");
      }

      const productsSnap = await this.db.collection('products').limit(1).get();
      if (productsSnap.empty) {
        console.log("Seeding default products to Firestore...");

        const now = new Date();
        const fmt = (d: Date) => d.toISOString().split("T")[0];
        const futureDate = (days: number) => { const d = new Date(now); d.setDate(d.getDate() + days); return fmt(d); };
        const pastDate = (days: number) => { const d = new Date(now); d.setDate(d.getDate() - days); return fmt(d); };

        const products: Product[] = [
          // Groceries
          { id: "P001", name: "Tata Salt (1kg)", sku: "GR001", barcode: "8901234567890", category: "Groceries", sellingPrice: 28, costPrice: 22, stock: 450, minStock: 50, unit: "kg", gstRate: 5, manufacturingDate: pastDate(60), expiryDate: futureDate(180), supplier: "Tata Consumer", batchNo: "B2024-001", section: "Aisle 1", lastUpdated: fmt(now) },
          { id: "P002", name: "Fortune Sunflower Oil (1L)", sku: "GR002", barcode: "8901234567891", category: "Groceries", sellingPrice: 155, costPrice: 130, stock: 200, minStock: 30, unit: "L", gstRate: 5, manufacturingDate: pastDate(45), expiryDate: futureDate(90), supplier: "Adani Wilmar", batchNo: "B2024-002", section: "Aisle 1", lastUpdated: fmt(now) },
          { id: "P003", name: "Aashirvaad Atta (5kg)", sku: "GR003", barcode: "8901234567892", category: "Groceries", sellingPrice: 275, costPrice: 230, stock: 150, minStock: 40, unit: "kg", gstRate: 0, manufacturingDate: pastDate(20), expiryDate: futureDate(120), supplier: "ITC Limited", batchNo: "B2024-003", section: "Aisle 2", lastUpdated: fmt(now) },
          { id: "P004", name: "Daawat Basmati Rice (5kg)", sku: "GR004", barcode: "8901234567893", category: "Groceries", sellingPrice: 650, costPrice: 500, stock: 80, minStock: 20, unit: "kg", gstRate: 5, manufacturingDate: pastDate(90), expiryDate: futureDate(365), supplier: "LT Foods", batchNo: "B2024-004", section: "Aisle 2", lastUpdated: fmt(now) },
          { id: "P005", name: "Toor Dal (1kg)", sku: "GR005", barcode: "8901234567894", category: "Groceries", sellingPrice: 160, costPrice: 130, stock: 300, minStock: 50, unit: "kg", gstRate: 5, manufacturingDate: pastDate(30), expiryDate: futureDate(150), supplier: "Local Mills", batchNo: "B2024-005", section: "Aisle 2", lastUpdated: fmt(now) },

          // Dairy
          { id: "P006", name: "Amul Butter (500g)", sku: "DR001", barcode: "8901234567895", category: "Dairy", sellingPrice: 285, costPrice: 250, stock: 60, minStock: 15, unit: "pc", gstRate: 12, manufacturingDate: pastDate(10), expiryDate: futureDate(180), supplier: "Amul", batchNo: "B2024-006", section: "Fridge 1", lastUpdated: fmt(now) },
          { id: "P007", name: "Amul Cheese Slices (10 pack)", sku: "DR002", barcode: "8901234567896", category: "Dairy", sellingPrice: 140, costPrice: 115, stock: 100, minStock: 20, unit: "pk", gstRate: 12, manufacturingDate: pastDate(40), expiryDate: futureDate(200), supplier: "Amul", batchNo: "B2024-007", section: "Fridge 1", lastUpdated: fmt(now) },
          { id: "P008", name: "Mother Dairy Milk (1L)", sku: "DR003", barcode: "8901234567897", category: "Dairy", sellingPrice: 72, costPrice: 65, stock: 50, minStock: 10, unit: "pk", gstRate: 5, manufacturingDate: pastDate(2), expiryDate: futureDate(2), supplier: "Mother Dairy", batchNo: "B2024-008", section: "Fridge 1", lastUpdated: fmt(now) },

          // Household
          { id: "P009", name: "Surf Excel Matic (2kg)", sku: "HH001", barcode: "8901234567898", category: "Household", sellingPrice: 480, costPrice: 380, stock: 120, minStock: 25, unit: "kg", gstRate: 18, manufacturingDate: pastDate(60), expiryDate: futureDate(730), supplier: "Hindustan Unilever", batchNo: "B2024-009", section: "Aisle 3", lastUpdated: fmt(now) },
          { id: "P010", name: "Vim Dishwash Gel (750ml)", sku: "HH002", barcode: "8901234567899", category: "Household", sellingPrice: 180, costPrice: 140, stock: 180, minStock: 40, unit: "btl", gstRate: 18, manufacturingDate: pastDate(45), expiryDate: futureDate(365), supplier: "Hindustan Unilever", batchNo: "B2024-010", section: "Aisle 3", lastUpdated: fmt(now) },
          { id: "P011", name: "Lizol Floor Cleaner (1L)", sku: "HH003", barcode: "8901234567900", category: "Household", sellingPrice: 220, costPrice: 175, stock: 140, minStock: 35, unit: "btl", gstRate: 18, manufacturingDate: pastDate(50), expiryDate: futureDate(730), supplier: "Reckitt Benckiser", batchNo: "B2024-011", section: "Aisle 3", lastUpdated: fmt(now) },

          // Personal Care
          { id: "P012", name: "Colgate Strong Teeth (200g)", sku: "PC001", barcode: "8901234567901", category: "Personal Care", sellingPrice: 110, costPrice: 85, stock: 250, minStock: 50, unit: "pc", gstRate: 18, manufacturingDate: pastDate(30), expiryDate: futureDate(365), supplier: "Colgate-Palmolive", batchNo: "B2024-012", section: "Aisle 4", lastUpdated: fmt(now) },
          { id: "P013", name: "Dove Moisture Soap (3x100g)", sku: "PC002", barcode: "8901234567902", category: "Personal Care", sellingPrice: 195, costPrice: 155, stock: 200, minStock: 40, unit: "pk", gstRate: 18, manufacturingDate: pastDate(40), expiryDate: futureDate(730), supplier: "Hindustan Unilever", batchNo: "B2024-013", section: "Aisle 4", lastUpdated: fmt(now) },
          { id: "P014", name: "Parachute Coconut Oil (250ml)", sku: "PC003", barcode: "8901234567903", category: "Personal Care", sellingPrice: 125, costPrice: 105, stock: 300, minStock: 60, unit: "btl", gstRate: 12, manufacturingDate: pastDate(20), expiryDate: futureDate(540), supplier: "Marico", batchNo: "B2024-014", section: "Aisle 4", lastUpdated: fmt(now) },

          // Beverages
          { id: "P015", name: "Coca Cola (2L)", sku: "BV001", barcode: "8901234567904", category: "Beverages", sellingPrice: 95, costPrice: 75, stock: 120, minStock: 30, unit: "btl", gstRate: 28, manufacturingDate: pastDate(15), expiryDate: futureDate(120), supplier: "Coca-Cola", batchNo: "B2024-015", section: "Fridge 2", lastUpdated: fmt(now) },
          { id: "P016", name: "Nescafe Classic Coffee (100g)", sku: "BV002", barcode: "8901234567905", category: "Beverages", sellingPrice: 320, costPrice: 260, stock: 100, minStock: 25, unit: "jar", gstRate: 18, manufacturingDate: pastDate(60), expiryDate: futureDate(365), supplier: "Nestle", batchNo: "B2024-016", section: "Aisle 5", lastUpdated: fmt(now) },
          { id: "P017", name: "Red Label Tea (500g)", sku: "BV003", barcode: "8901234567906", category: "Beverages", sellingPrice: 280, costPrice: 230, stock: 180, minStock: 45, unit: "pk", gstRate: 5, manufacturingDate: pastDate(30), expiryDate: futureDate(270), supplier: "Hindustan Unilever", batchNo: "B2024-017", section: "Aisle 5", lastUpdated: fmt(now) },

          // Snacks & Others
          { id: "P018", name: "Lays Magic Masala (50g)", sku: "SN001", barcode: "8901234567907", category: "Snacks", sellingPrice: 20, costPrice: 15, stock: 500, minStock: 100, unit: "pk", gstRate: 12, manufacturingDate: pastDate(10), expiryDate: futureDate(90), supplier: "PepsiCo", batchNo: "B2024-018", section: "Aisle 6", lastUpdated: fmt(now) },
          { id: "P019", name: "Britannia Good Day Cashew (200g)", sku: "SN002", barcode: "8901234567908", category: "Snacks", sellingPrice: 40, costPrice: 32, stock: 300, minStock: 60, unit: "pk", gstRate: 12, manufacturingDate: pastDate(25), expiryDate: futureDate(150), supplier: "Britannia", batchNo: "B2024-019", section: "Aisle 6", lastUpdated: fmt(now) },
          { id: "P020", name: "McCain French Fries (400g)", sku: "FZ001", barcode: "8901234567909", category: "Frozen Foods", sellingPrice: 135, costPrice: 105, stock: 80, minStock: 15, unit: "pk", gstRate: 12, manufacturingDate: pastDate(30), expiryDate: futureDate(270), supplier: "McCain", batchNo: "B2024-020", section: "Freezer 1", lastUpdated: fmt(now) },
        ];

        for (const p of products) {
          await this.db.collection('products').doc(p.id).set(p);
        }
        console.log("Products seeding verified.");
      }

      // Seed Attendance if empty
      const attSnap = await this.db.collection('attendance').limit(1).get();
      if (attSnap.empty) {
        console.log("Seeding attendance data to Firestore...");
        const staffMembers = [
          { id: 'U001', name: 'Rajesh Kumar', role: 'ADMIN' },
          { id: 'U002', name: 'Priya Sharma', role: 'CASHIER' },
          { id: 'U003', name: 'Amit Patel', role: 'STOCK_CLERK' },
          { id: 'U004', name: 'Sneha Reddy', role: 'CASHIER' },
          { id: 'U005', name: 'Vikram Singh', role: 'STOCK_CLERK' },
        ];
        const shifts: ('Morning' | 'Afternoon')[] = ['Morning', 'Morning', 'Afternoon', 'Morning', 'Morning'];
        const statusMatrix: ('Present' | 'Late' | 'Absent')[][] = [
          ['Present', 'Present', 'Late', 'Present', 'Absent'],
          ['Present', 'Present', 'Present', 'Late', 'Absent'],
          ['Present', 'Late', 'Present', 'Present', 'Present'],
          ['Present', 'Present', 'Absent', 'Present', 'Late'],
          ['Present', 'Present', 'Present', 'Present', 'Present'],
        ];
        const checkIns = [['09:00', '08:55', '09:15', '13:00', ''], ['09:01', '09:00', '09:05', '13:20', ''], ['09:02', '09:35', '09:00', '13:00', '09:00'], ['09:00', '09:00', '', '13:10', '09:40'], ['09:00', '09:00', '09:00', '13:00', '09:00']];
        const checkOuts = [['18:00', '17:05', '-', '-', ''], ['18:00', '18:00', '18:00', '-', ''], ['18:00', '17:55', '18:00', '21:05', '18:00'], ['18:00', '18:00', '', '-', '18:00'], ['18:00', '18:00', '18:00', '21:00', '18:00']];
        const nowTs = new Date();
        for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
          const d = new Date(nowTs);
          d.setDate(d.getDate() - dayOffset);
          const dateStr = d.toISOString().split('T')[0];
          for (let si = 0; si < staffMembers.length; si++) {
            const staff = staffMembers[si];
            const status = statusMatrix[dayOffset][si];
            const rec: Attendance = {
              id: `ATT-${dateStr}-${staff.id}`,
              userId: staff.id,
              userName: staff.name,
              date: dateStr,
              checkIn: status === 'Absent' ? '-' : checkIns[dayOffset][si],
              checkOut: status === 'Absent' ? '-' : checkOuts[dayOffset][si],
              shift: shifts[si],
              status,
            };
            await this.db.collection('attendance').doc(rec.id).set(rec);
          }
        }
        // Seed Session Logs if empty
        const sessSnap = await this.db.collection('sessionLogs').limit(1).get();
        if (sessSnap.empty) {
          const sessNow = new Date();
          const sessions: SessionLog[] = [
            { id: 'SL001', userId: 'U001', userName: 'Rajesh Kumar', userRole: 'ADMIN', loginTime: new Date(sessNow.getTime() - 2 * 3600000).toISOString(), logoutTime: '', duration: '', status: 'Active' },
            { id: 'SL002', userId: 'U002', userName: 'Priya Sharma', userRole: 'CASHIER', loginTime: new Date(sessNow.getTime() - 8 * 3600000).toISOString(), logoutTime: new Date(sessNow.getTime() - 1 * 3600000).toISOString(), duration: '7h 0m', status: 'Ended' },
            { id: 'SL003', userId: 'U004', userName: 'Sneha Reddy', userRole: 'CASHIER', loginTime: new Date(sessNow.getTime() - 5 * 3600000).toISOString(), logoutTime: '', duration: '', status: 'Active' },
          ];
          for (const s of sessions) {
            await this.db.collection('sessionLogs').doc(s.id).set(s);
          }
        }
        console.log("Attendance seeding verified.");
      }
    } catch (e) {
      console.error("Error seeding Firestore:", e);
    }
  }

  // Helper to convert Firestore doc to object
  private docToObj<T>(doc: FirebaseFirestore.QueryDocumentSnapshot): T {
    const data = doc.data();
    // Convert timestamps back to ISO strings if needed, but for simplicity returning as is
    return { ...data, id: doc.id } as T;
  }

  async getUsers(): Promise<User[]> {
    const snap = await this.db.collection('users').get();
    return snap.docs.map(d => this.docToObj<User>(d));
  }
  async getUser(id: string): Promise<User | undefined> {
    const doc = await this.db.collection('users').doc(id).get();
    return doc.exists ? { ...doc.data(), id: doc.id } as User : undefined;
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    const snap = await this.db.collection('users').where('email', '==', email).limit(1).get();
    if (snap.empty) return undefined;
    return this.docToObj<User>(snap.docs[0]);
  }
  async getUserByPin(pin: string): Promise<User | undefined> {
    const snap = await this.db.collection('users').where('pin', '==', pin).limit(1).get();
    if (snap.empty) return undefined;
    return this.docToObj<User>(snap.docs[0]);
  }
  async createUser(user: Omit<User, "id">): Promise<User> {
    const ref = await this.db.collection('users').add(user);
    const doc = await ref.get();
    return { ...doc.data(), id: doc.id } as User;
  }
  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    await this.db.collection('users').doc(id).update(data);
    return this.getUser(id);
  }
  async deleteUser(id: string): Promise<boolean> {
    await this.db.collection('users').doc(id).delete();
    return true;
  }

  async getProducts(): Promise<Product[]> {
    const snap = await this.db.collection('products').get();
    return snap.docs.map(d => this.docToObj<Product>(d));
  }
  async getProduct(id: string): Promise<Product | undefined> {
    const doc = await this.db.collection('products').doc(id).get();
    return doc.exists ? { ...doc.data(), id: doc.id } as Product : undefined;
  }
  async createProduct(product: Omit<Product, "id">): Promise<Product> {
    const ref = await this.db.collection('products').add(product);
    const doc = await ref.get();
    return { ...doc.data(), id: doc.id } as Product;
  }
  async updateProduct(id: string, data: Partial<Product>): Promise<Product | undefined> {
    await this.db.collection('products').doc(id).update(data);
    return this.getProduct(id);
  }
  async deleteProduct(id: string): Promise<boolean> {
    await this.db.collection('products').doc(id).delete();
    return true;
  }
  async updateStock(id: string, qty: number): Promise<Product | undefined> {
    const ref = this.db.collection('products').doc(id);
    await this.db.runTransaction(async (t) => {
      const doc = await t.get(ref);
      if (!doc.exists) throw new Error("Product not found");
      const current = doc.data()?.stock || 0;
      t.update(ref, {
        stock: current + qty,
        lastUpdated: new Date().toISOString().split("T")[0]
      });
    });
    return this.getProduct(id);
  }

  async getTransactions(): Promise<Transaction[]> {
    const snap = await this.db.collection('transactions').get();
    return snap.docs.map(d => this.docToObj<Transaction>(d)).sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });
  }
  async getTransaction(id: string): Promise<Transaction | undefined> {
    const doc = await this.db.collection('transactions').doc(id).get();
    return doc.exists ? { ...doc.data(), id: doc.id } as Transaction : undefined;
  }
  async createTransaction(tx: Omit<Transaction, "id">): Promise<Transaction> {
    const ref = await this.db.collection('transactions').add(tx);
    const doc = await ref.get();
    return { ...doc.data(), id: doc.id } as Transaction;
  }

  async getActivityLogs(): Promise<ActivityLog[]> {
    const snap = await this.db.collection('activityLogs').orderBy('timestamp', 'desc').limit(50).get();
    return snap.docs.map(d => this.docToObj<ActivityLog>(d));
  }
  async addActivityLog(log: Omit<ActivityLog, "id">): Promise<ActivityLog> {
    const ref = await this.db.collection('activityLogs').add(log);
    const doc = await ref.get();
    return { ...doc.data(), id: doc.id } as ActivityLog;
  }

  async getAttendance(): Promise<Attendance[]> {
    const snap = await this.db.collection('attendance').orderBy('date', 'desc').get();
    return snap.docs.map(d => this.docToObj<Attendance>(d));
  }
  async getSessionLogs(): Promise<SessionLog[]> {
    const snap = await this.db.collection('sessionLogs').orderBy('loginTime', 'desc').get();
    return snap.docs.map(d => this.docToObj<SessionLog>(d));
  }
}

// Logic to select storage
const serviceAccountPath = path.resolve(__dirname, 'serviceAccountKey.json');
const useFirebase = fs.existsSync(serviceAccountPath) || process.env.GOOGLE_APPLICATION_CREDENTIALS;

export const storage: IStorage = useFirebase
  ? new FirebaseStorage(serviceAccountPath)
  : new MemStorage();

// If upgrading to Firebase but no data, seed it (optional implementation)
// For simplicity, we stick to MemStorage default data or empty Firebase
```

## File: app.json
```json
{
  "expo": {
    "name": "RetailPro",
    "slug": "retailpro",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.retailpro.app"
    },
    "android": {
      "package": "com.retailpro.app",
      "softwareKeyboardLayoutMode": "pan",
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      }
    },
    "web": {
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      [
        "expo-router",
        {
          "origin": "https://replit.com/"
        }
      ],
      "expo-font",
      "expo-web-browser"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {
        "origin": "https://replit.com/"
      },
      "eas": {
        "projectId": "32dccf6a-fbd0-43ec-bc8e-5489de0551e9"
      }
    }
  }
}
```
