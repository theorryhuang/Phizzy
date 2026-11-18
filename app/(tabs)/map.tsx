import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../_layout';
import { loadCurrentUserProgram } from '../../firebase/program';
import { WEEK_TITLES } from '../../constants/Config';

export default function MapScreen() {
  const router = useRouter();
  const { themeColor } = useContext(ThemeContext);
  const [weekNumbers, setWeekNumbers] = useState<number[]>(
    WEEK_TITLES.map((_, i) => i + 1)
  );

  // Build the map from the user's program; fall back to one stop per story title.
  useEffect(() => {
    loadCurrentUserProgram()
      .then((program) => {
        if (program && program.weeks.length > 0) {
          setWeekNumbers(program.weeks.map((w) => w.weekNumber).sort((x, y) => x - y));
        }
      })
      .catch((error) => console.error('Error loading program for map:', error));
  }, []);

  const navigateToWeek = (weekNumber: number) => {
    router.push({ pathname: '/week/[weekNumber]', params: { weekNumber: String(weekNumber) } });
  };

  const weekTitle = (week: number) => WEEK_TITLES[week - 1] ?? 'Keep Training';

  // Highest week at the top, so the journey is climbed from the bottom up.
  const stops = [...weekNumbers].reverse();

  return (
    <View style={[styles.container, { backgroundColor: themeColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hero Journey</Text>
        </View>

        <View style={styles.mapContent}>
          {stops.map((week, index) => (
            <React.Fragment key={week}>
              <View style={styles.milestone}>
                <View style={[styles.bubbleContainer, { alignItems: week % 2 === 0 ? 'flex-end' : 'flex-start' }]}> 
                  <TouchableOpacity onPress={() => navigateToWeek(week)}>
                    <View style={[styles.bubble, styles.weekBubble]}>
                      <Text style={styles.bubbleText}>
                        Week {week}:{'\n'}
                        {weekTitle(week)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {index < stops.length - 1 && (
                <View style={[styles.pathLine, week % 2 === 0 ? styles.pathLineLeft : styles.pathLineRight]} />
              )}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  mapContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  milestone: {
    marginVertical: 25,
    width: '100%',
  },
  bubbleContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  bubble: {
    borderRadius: 25,
    padding: 20,
    maxWidth: '85%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  weekBubble: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  bubbleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
  },
  pathLine: {
    width: 4,
    height: 100,
    backgroundColor: '#FFA500',
    marginVertical: -30,
  },
  pathLineLeft: {
    alignSelf: 'flex-start',
    marginLeft: '45%',
    transform: [{ rotate: '45deg' }],
  },
  pathLineRight: {
    alignSelf: 'flex-end',
    marginRight: '45%',
    transform: [{ rotate: '-45deg' }],
  },
});