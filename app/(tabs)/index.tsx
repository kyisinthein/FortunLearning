import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useThemeController } from '@/hooks/theme-controller';
import { useColorScheme } from '@/hooks/use-color-scheme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatInTimeZone, toDate } from 'date-fns-tz';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Gender = 'male' | 'female';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const { mode, toggle } = useThemeController();
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [name, setName] = useState<string>('');
  const [gender, setGender] = useState<Gender>('male');
  const [calculating, setCalculating] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const tz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  const birthDate = useMemo(() => {
    const ymd = formatInTimeZone(date, tz, "yyyy-MM-dd");
    const hm = formatInTimeZone(time, tz, "HH:mm:ss");
    const isoLocal = `${ymd}T${hm}`;
    return toDate(isoLocal, { timeZone: tz });
  }, [date, time, tz]);

  const calculate = useCallback(async () => {
    setCalculating(true);
    try {
      const birthISO = formatInTimeZone(birthDate, tz, "yyyy-MM-dd'T'HH:mm:ss");
      router.push({ pathname: '/result', params: { birthISO, tz, gender, name } });
    } finally {
      setCalculating(false);
    }
  }, [birthDate, gender, tz, name, router]);

  const formatDate = useCallback((d: Date) => {
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }, []);

  const formatTime = useCallback((d: Date) => {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }, []);

  return (
    <>
    <ThemedView style={[styles.container, { paddingTop: insets.top + 8 }] }>
      <View style={styles.header}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded, fontSize: 26, lineHeight: 30 }}>Fortun Learning</ThemedText>
        <ThemedText style={{ textAlign: 'center', marginTop: 4 }}>Discover Your Bazi Destiny</ThemedText>
        <TouchableOpacity accessibilityRole="button" onPress={toggle} style={styles.themeIconBtn}>
          <IconSymbol name={mode === 'dark' ? 'sun.max.fill' : 'moon.fill'} size={20} color={Colors[theme].icon} />
        </TouchableOpacity>
      </View>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.cardTitle}>Your Information</ThemedText>

        {Platform.OS === 'web' ? (
          <ThemedText style={{ textAlign: 'center' }}>
            Use the native app or simulator to pick date and time.
          </ThemedText>
        ) : (
          <View style={styles.formStack}>
            <View style={styles.formGroup}>
              <ThemedText style={styles.inputLabel}>Name</ThemedText>
              <ThemedView style={[styles.inputField, { borderColor: Colors[theme].border }] }>
                {/* <IconSymbol name="person.fill" size={18} color={Colors[theme].icon} style={{ marginRight: 8 }} /> */}
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={Colors[theme].icon as string}
                  style={[styles.textInput, { color: Colors[theme].text }]}
                />
              </ThemedView>
            </View>
            <View style={styles.formGroup}>
              <ThemedText style={styles.inputLabel}>Birth Date</ThemedText>
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.85}
                onPress={() => setShowDatePicker(true)}
              >
                <ThemedView style={[styles.inputField, { borderColor: Colors[theme].border }] }>
                  <IconSymbol name="calendar" size={18} color={Colors[theme].icon} style={{ marginRight: 8 }} />
                  <ThemedView style={styles.valuePill}>
                    <ThemedText style={styles.valueText}>{formatDate(date)}</ThemedText>
                  </ThemedView>
                </ThemedView>
              </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <ThemedText style={styles.inputLabel}>Birth Time</ThemedText>
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.85}
                onPress={() => setShowTimePicker(true)}
              >
                <ThemedView style={[styles.inputField, { borderColor: Colors[theme].border }] }>
                  <IconSymbol name="clock" size={18} color={Colors[theme].icon} style={{ marginRight: 8 }} />
                  <ThemedView style={styles.valuePill}>
                    <ThemedText style={styles.valueText}>{formatTime(time)}</ThemedText>
                  </ThemedView>
                </ThemedView>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.genderRow}>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => setGender('male')}
            style={[styles.genderBtn, gender === 'male' && styles.genderBtnActive]}
          >
            <ThemedText style={styles.genderText}>♂ Male</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => setGender('female')}
            style={[styles.genderBtn, gender === 'female' && styles.genderBtnActive]}
          >
            <ThemedText style={styles.genderText}>♀ Female</ThemedText>
          </TouchableOpacity>
        </View>

          <TouchableOpacity
            accessibilityRole="button"
            disabled={calculating}
            onPress={calculate}
            style={[styles.calcBtn, calculating && { opacity: 0.7 }]}
          >
            {calculating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.calcText}>✨ Calculate My Bazi</ThemedText>
            )}
          </TouchableOpacity>
      </ThemedView>

      

      
    </ThemedView>

    {Platform.OS === 'android' && showDatePicker && (
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={(_, d) => {
          if (d) setDate(d);
          setShowDatePicker(false);
        }}
      />
    )}
    {Platform.OS === 'android' && showTimePicker && (
      <DateTimePicker
        value={time}
        mode="time"
        display="default"
        onChange={(_, t) => {
          if (t) setTime(t);
          setShowTimePicker(false);
        }}
      />
    )}

    {Platform.OS === 'ios' && (
      <Modal transparent visible={showDatePicker || showTimePicker} animationType="fade">
        <View style={styles.modalBackdrop}>
          <ThemedView style={styles.modalCard}>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={(_, d) => d && setDate(d)}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="spinner"
                onChange={(_, t) => t && setTime(t)}
              />
            )}
            <TouchableOpacity accessibilityRole="button" style={styles.modalClose} onPress={() => { setShowDatePicker(false); setShowTimePicker(false); }}>
              <ThemedText style={styles.modalCloseText}>Done</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </Modal>
    )}
  </>
  );
}

const FIELD_WIDTH = 150;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 12,
  },
  themeIconBtn: {
    position: 'absolute',
    right: 16,
    top: 0,
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    gap: 12,
    width: '90%',
    alignSelf: 'center',
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  formStack: {
    flexDirection: 'column',
    gap: 16,
  },
  formGroup: {
    gap: 8,
  },
  inputLabel: {
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  valuePill: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  textInput: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  label: {
    fontWeight: '600',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginTop: 20,
  },
  genderBtn: {
    width: FIELD_WIDTH,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  genderBtnActive: {
    backgroundColor: 'rgba(0,100,200,0.1)',
    borderColor: 'rgba(0,100,200,0.3)',
  },
  genderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  calcBtn: {
    marginTop: 20,
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    
    borderRadius: 22,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  calcText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    padding: 12,
  },
  modalClose: {
    marginTop: 8,
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  modalCloseText: {
    fontWeight: '600',
  },
  
});
