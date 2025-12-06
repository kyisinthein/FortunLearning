import { BaziChart } from '@/components/bazi-chart';
import { BaziInterpretation } from '@/components/bazi-interpretation';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useThemeController } from '@/hooks/theme-controller';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DeepSeekService } from '@/services/deepseek';
import { formatInTimeZone, toDate } from 'date-fns-tz';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Gender = 'male' | 'female';

export default function ResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { birthISO, tz, gender, name } = useLocalSearchParams<{ birthISO: string; tz: string; gender: Gender; name?: string }>();
  const { mode, toggle } = useThemeController();
  const [chartData, setChartData] = useState<any | null>(null);
  const [interpretation, setInterpretation] = useState<string>('');
  const [dailyInsight, setDailyInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const birthDate = useMemo(() => toDate(String(birthISO), { timeZone: String(tz) }), [birthISO, tz]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const { BaziCalculator } = await import('@aharris02/bazi-calculator-by-alvamind');
        const calculator = new BaziCalculator(birthDate, String(gender) as Gender, String(tz), true);
        const analysis = calculator.getCompleteAnalysis();

        const map = (pillar: any) => {
          const chinese: string = String(pillar?.chinese ?? '');
          const stem = chinese ? chinese[0] : '';
          const branch = chinese ? chinese.slice(1) : '';
          return { heavenlyStem: stem || 'N/A', earthlyBranch: branch || 'N/A', chinese };
        };

        const data = {
          yearPillar: map(analysis?.mainPillars?.year),
          monthPillar: map(analysis?.mainPillars?.month),
          dayPillar: map(analysis?.mainPillars?.day),
          hourPillar: map(analysis?.mainPillars?.time),
          dayMaster: analysis?.basicAnalysis?.dayMaster?.stem,
        };
        if (cancelled) return;
        setChartData(data);

        const interp = await DeepSeekService.interpretBaziChart(data, typeof name === 'string' ? name : undefined);
        if (cancelled) return;
        setInterpretation(interp);

        const todayStr = formatInTimeZone(new Date(), String(tz), 'yyyy-MM-dd');
        const daily = await DeepSeekService.getDailyInsight(data, todayStr, typeof name === 'string' ? name : undefined);
        if (cancelled) return;
        setDailyInsight(daily);
      } catch {
        setInterpretation('Unable to fetch AI interpretation at the moment.');
        setDailyInsight('Unable to fetch daily insight.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [birthDate, gender, tz, name]);

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + 8 }] }>
      <View style={styles.header}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded, fontSize: 26, lineHeight: 30 }}>Fortun Learning</ThemedText>
        <ThemedText style={{ textAlign: 'center', marginTop: 4 }}>Your Bazi Analysis</ThemedText>
        {/* {typeof name === 'string' && name.trim().length > 0 && (
          <ThemedText style={{ textAlign: 'center', marginTop: 2, fontWeight: '600' }}>{name}</ThemedText>
        )} */}
        <TouchableOpacity accessibilityRole="button" onPress={toggle} style={styles.themeIconBtn}>
          <IconSymbol name={mode === 'dark' ? 'sun.max.fill' : 'moon.fill'} size={20} color={Colors[useColorScheme() ?? 'light'].icon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading && (
          <View style={{ paddingTop: 24, alignItems: 'center' }}>
            <ActivityIndicator />
          </View>
        )}

        {chartData && (
          <ThemedView style={styles.results}>
            <BaziChart chartData={chartData} birthDate={birthDate} gender={String(gender) as Gender} />
            <BaziInterpretation interpretation={interpretation} dailyInsight={dailyInsight} loading={loading} />
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => router.replace('/')}
                style={styles.secondaryBtn}
              >
                <ThemedText style={styles.secondaryText}>🧮 Calculate Another</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 8,
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
  scrollContent: {
    paddingBottom: 32,
  },
  results: {
    marginTop: 12,
    gap: 16,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  secondaryBtn: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  secondaryText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
