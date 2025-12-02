import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatInTimeZone, toDate } from 'date-fns-tz';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Gender = 'male' | 'female';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [gender, setGender] = useState<Gender>('male');
  const [calculating, setCalculating] = useState(false);

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
      router.push({ pathname: '/result', params: { birthISO, tz, gender } });
    } finally {
      setCalculating(false);
    }
  }, [birthDate, gender, tz, router]);

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + 8 }] }>
      <View style={styles.header}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded, fontSize: 26, lineHeight: 30 }}>Fortun Learning</ThemedText>
        <ThemedText style={{ textAlign: 'center', marginTop: 4 }}>Discover Your Bazi Destiny</ThemedText>
      </View>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.cardTitle}>Birth Information</ThemedText>

        {Platform.OS === 'web' ? (
          <ThemedText style={{ textAlign: 'center' }}>
            Use the native app or simulator to pick date and time.
          </ThemedText>
        ) : (
          <View style={styles.formRow}>
            <View style={styles.formField}>
              <ThemedText style={styles.label}>Birth Date</ThemedText>
              <DateTimePicker value={date} mode="date" display="default" onChange={(_, d) => d && setDate(d)} />
            </View>
            <View style={styles.formField}>
              <ThemedText style={styles.label}>Birth Time</ThemedText>
              <DateTimePicker value={time} mode="time" display="default" onChange={(_, t) => t && setTime(t)} />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  formField: {
    flex: 1,
    gap: 6,
  },
  label: {
    fontWeight: '600',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  genderBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
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
    marginTop: 8,
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  calcText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  
});
