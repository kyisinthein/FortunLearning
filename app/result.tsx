import { BaziChart } from '@/components/bazi-chart';
import { BaziInterpretation } from '@/components/bazi-interpretation';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
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
  const { birthISO, tz, gender } = useLocalSearchParams<{ birthISO: string; tz: string; gender: Gender }>();
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

        const interp = await DeepSeekService.interpretBaziChart(data);
        if (cancelled) return;
        setInterpretation(interp);

        const todayStr = formatInTimeZone(new Date(), String(tz), 'yyyy-MM-dd');
        const daily = await DeepSeekService.getDailyInsight(data, todayStr);
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
  }, [birthDate, gender, tz]);

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + 8 }] }>
      <View style={styles.header}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded, fontSize: 26, lineHeight: 30 }}>Fortun Learning</ThemedText>
        <ThemedText style={{ textAlign: 'center', marginTop: 4 }}>Your Bazi Analysis</ThemedText>
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
            <BaziInterpretation interpretation={interpretation} dailyInsight={dailyInsight} />
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
    marginTop: 8,
    marginBottom: 8,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  results: {
    marginTop: 12,
    gap: 16,
    maxWidth: 560,
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
