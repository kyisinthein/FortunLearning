import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface BaziInterpretationProps {
  interpretation: string;
  dailyInsight?: string;
}

export function BaziInterpretation({ interpretation, dailyInsight }: BaziInterpretationProps) {
  const colorScheme = useColorScheme();
  
  const sanitizeText = (text: string) => {
    return (text || '')
      .replace(/^#{1,6}\s*/gm, '')   // remove leading markdown headings
      .replace(/\*\*/g, '')          // remove bold markers
      .replace(/\*/g, '')            // remove remaining asterisks
      .replace(/^\s*[-•]\s+/gm, '')  // remove list bullets if present
      .trim();
  };
  
  // Parse the interpretation into sections
  const parseInterpretation = (text: string) => {
    const sections = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentSection = { title: '', content: [] as string[] };

    const looksLikeTitle = (line: string) => {
      const trimmed = line.trim();

      // Reject common generic words
      const genericTitles = ['analysis', 'introduction', 'overview', 'summary'];
      if (genericTitles.includes(trimmed.toLowerCase())) return false;

      // A real section title usually has at least 2 words
      const words = trimmed.split(' ');
      if (words.length < 2) return false;

      // Titles should NOT end with punctuation
      if (/[.!?]$/.test(trimmed)) return false;

      // Titles should not contain commas
      if (trimmed.includes(',')) return false;

      // Should start with uppercase (English or Chinese)
      if (!/^[A-Z\u4E00-\u9FFF]/.test(trimmed)) return false;

      // Limit length to avoid full paragraph false-positives
      if (trimmed.split(' ').length > 8) return false;

      return true;
    };
    
    for (const line of lines) {
      if (looksLikeTitle(line)) {
        // Save previous section
        if (currentSection.title) {
          sections.push(currentSection);
        }
        currentSection = { title: line, content: [] };
      } else {
        currentSection.content.push(line);
      }
    }
    
    if (currentSection.title) {
      sections.push(currentSection);
    }
    
    return sections.length > 0 ? sections : [{ title: 'Analysis', content: [text] }];
  };

  const sections = parseInterpretation(sanitizeText(interpretation));

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.interpretationContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background === '#fff' ? 'rgba(230,240,255,0.9)' : 'rgba(20,40,70,0.6)' }]}>
        <ThemedText type="defaultSemiBold" style={styles.mainTitle}>🤖 AI Interpretation</ThemedText>
        {sections.map((section, index) => (
          <ThemedView key={index} style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              {section.title}
            </ThemedText>
            {section.content.map((paragraph, pIndex) => (
              <ThemedText key={pIndex} style={styles.sectionContent}>
                {paragraph}
              </ThemedText>
            ))}
          </ThemedView>
        ))}
      </ThemedView>
      {dailyInsight && (
        <ThemedView style={[styles.dailyContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background === '#fff' ? 'rgba(255,238,200,0.9)' : 'rgba(110,80,10,0.5)' }]}>
          <ThemedText type="defaultSemiBold" style={styles.dailyTitle}>🌟 Today&apos;s Insight</ThemedText>
          <ThemedText style={styles.dailyText}>
            {sanitizeText(dailyInsight)}
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    maxWidth: 560,
    alignSelf: 'center',
  },
  interpretationContainer: {
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(90,140,200,0.25)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  mainTitle: {
    fontSize: 22,
    marginBottom: 14,
    textAlign: 'center',
  },
  section: {
    marginBottom: 14,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 17,
    marginBottom: 8,
    color: '#005BBB',
    backgroundColor: 'transparent',
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  dailyContainer: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,180,0,0.35)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  dailyTitle: {
    fontSize: 19,
    marginBottom: 12,
    textAlign: 'center',
    color: '#FF8C00',
  },
  dailyText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
