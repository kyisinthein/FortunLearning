import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface BaziChartProps {
  chartData: any;
  birthDate: Date;
  gender: 'male' | 'female';
}

export function BaziChart({ chartData, birthDate, gender }: BaziChartProps) {
  const colorScheme = useColorScheme();
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Extract pillar information safely
  const getDisplay = (val: any) => {
    if (val == null) return 'N/A';
    if (typeof val === 'string' || typeof val === 'number') return String(val);
    if (typeof val === 'object') {
      if ('character' in val && val.character) return String(val.character);
      if ('name' in val && val.name) return String(val.name);
      if ('chinese' in val && val.chinese) return String(val.chinese);
    }
    return 'N/A';
  };

  const getPillarInfo = (pillar: any) => {
    if (!pillar) return { heavenly: 'N/A', earthly: 'N/A' };
    return {
      heavenly: getDisplay(pillar?.heavenlyStem ?? pillar?.stem),
      earthly: getDisplay(pillar?.earthlyBranch ?? pillar?.branch),
    };
  };

  const yearPillar = getPillarInfo(chartData?.yearPillar);
  const monthPillar = getPillarInfo(chartData?.monthPillar);
  const dayPillar = getPillarInfo(chartData?.dayPillar);
  const hourPillar = getPillarInfo(chartData?.hourPillar);

  return (
    <ThemedView style={[
      styles.container,
      {
        backgroundColor:
          Colors[colorScheme ?? 'light'].background === '#fff'
            ? 'rgba(245,246,250,0.85)'
            : 'rgba(30,32,36,0.85)',
      },
    ]}>
      <ThemedText type="defaultSemiBold" style={styles.title}>🏛️ Four Pillars Chart</ThemedText>
      
      {/* Birth Information */}
      <ThemedView style={styles.birthInfo}>
        <ThemedText style={styles.birthText}>📅 {formatDate(birthDate)}</ThemedText>
        <ThemedText style={styles.birthText}>🕐 {formatTime(birthDate)}</ThemedText>
        <ThemedText style={styles.birthText}>{gender === 'male' ? '♂' : '♀'} {gender.charAt(0).toUpperCase() + gender.slice(1)}</ThemedText>
      </ThemedView>

      {/* Four Pillars Grid */}
      <ThemedView style={styles.pillarsContainer}>
        <ThemedView style={styles.pillarLabels}>
          <ThemedText style={styles.labelText}>Year</ThemedText>
          <ThemedText style={styles.labelText}>Month</ThemedText>
          <ThemedText style={styles.labelText}>Day</ThemedText>
          <ThemedText style={styles.labelText}>Hour</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.stemRow}>
          <ThemedView style={[styles.pillarCell, styles.stemCell]}>
            <ThemedText style={styles.pillarText}>{yearPillar.heavenly}</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.pillarCell, styles.stemCell]}>
            <ThemedText style={styles.pillarText}>{monthPillar.heavenly}</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.pillarCell, styles.stemCell]}>
            <ThemedText style={styles.pillarText}>{dayPillar.heavenly}</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.pillarCell, styles.stemCell]}>
            <ThemedText style={styles.pillarText}>{hourPillar.heavenly}</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.branchRow}>
          <ThemedView style={[styles.pillarCell, styles.branchCell]}>
            <ThemedText style={styles.pillarText}>{yearPillar.earthly}</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.pillarCell, styles.branchCell]}>
            <ThemedText style={styles.pillarText}>{monthPillar.earthly}</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.pillarCell, styles.branchCell]}>
            <ThemedText style={styles.pillarText}>{dayPillar.earthly}</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.pillarCell, styles.branchCell]}>
            <ThemedText style={styles.pillarText}>{hourPillar.earthly}</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.rowLabels}>
          <ThemedText style={styles.rowLabelText}>Heavenly Stems</ThemedText>
          <ThemedText style={styles.rowLabelText}>Earthly Branches</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Day Master */}
      {chartData?.dayMaster && (
        <ThemedView style={styles.dayMasterContainer}>
          <ThemedText style={styles.dayMasterLabel}>Day Master (Self Element):</ThemedText>
          <ThemedText style={styles.dayMasterValue}>{chartData.dayMaster}</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  title: {
    fontSize: 22,
    marginBottom: 12,
    textAlign: 'center',
  },
  birthInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 12,
  },
  birthText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pillarsContainer: {
    marginBottom: 12,
  },
  pillarLabels: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  labelText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  stemRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  branchRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  pillarCell: {
    flex: 1,
    padding: 12,
    margin: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  stemCell: {
    backgroundColor: 'rgba(255,99,71,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,99,71,0.35)',
  },
  branchCell: {
    backgroundColor: 'rgba(30,144,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(30,144,255,0.35)',
  },
  pillarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  rowLabels: {
    flexDirection: 'row',
  },
  rowLabelText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: '#667',
    fontStyle: 'italic',
  },
  dayMasterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
    gap: 8,
  },
  dayMasterLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  dayMasterValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#005BBB',
  },
});
