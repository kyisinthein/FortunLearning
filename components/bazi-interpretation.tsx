import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
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
    
    for (const line of lines) {
      // Check if line looks like a section header (contains numbers or keywords)
      if (line.match(/^\d+\.|personality|character|strength|talent|growth|guidance|advice/i)) {
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
      {/* AI Interpretation Sections */}
      <ThemedView style={[styles.interpretationContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background === '#fff' ? 'rgba(0,100,200,0.08)' : 'rgba(0,100,200,0.15)' }]}>
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
      {/* Daily Insight */}
      {dailyInsight && (
        <ThemedView style={[styles.dailyContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background === '#fff' ? 'rgba(255,193,7,0.1)' : 'rgba(255,193,7,0.2)' }]}>
          <ThemedText type="defaultSemiBold" style={styles.dailyTitle}>🌟 Today's Insight</ThemedText>
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
  },
  interpretationContainer: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,100,200,0.2)',
  },
  mainTitle: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: '#0066CC',
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  dailyContainer: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,193,7,0.3)',
  },
  dailyTitle: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
    color: '#FF8C00',
  },
  dailyText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});