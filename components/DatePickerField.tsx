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
