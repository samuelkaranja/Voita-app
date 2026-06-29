import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Navigation } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';

import { setDestination } from '../../../redux/slices/map/mapsSlice';

const GOOGLE_KEY = 'AIzaSyDAaZnQ6p4Zase38K03Rk8LbCyGlfmaUCg';

// 1. ADD THE style PROP HERE
export default function DestinationCard({ style }: { style?: any }) {
  const dispatch = useDispatch();
  const userPhone = useSelector((state: any) => state.auth.user?.phone);

  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const HISTORY_KEY = userPhone
    ? `voita_destination_history_${userPhone}`
    : null;
  const MAX_HISTORY = 5;

  const [history, setHistory] = useState<
    { place_id: string; description: string }[]
  >([]);

  const [historyExpanded, setHistoryExpanded] = useState(false);

  useEffect(() => {
    if (!HISTORY_KEY) return;
    AsyncStorage.getItem(HISTORY_KEY).then(raw => {
      if (raw) setHistory(JSON.parse(raw));
    });
  }, [HISTORY_KEY]);

  // =========================
  // AUTOCOMPLETE
  // =========================
  useEffect(() => {
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            text,
          )}&key=${GOOGLE_KEY}&components=country:ke`,
        );

        const data = await res.json();

        if (data.status !== 'OK') {
          setSuggestions([]);
          return;
        }

        setSuggestions(data.predictions || []);
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Network error',
          text2: 'Failed to fetch suggestions',
        });
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [text]);

  // =========================
  // PLACE DETAILS
  // =========================
  const selectPlace = async (place: any) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${GOOGLE_KEY}`,
      );

      const data = await res.json();

      const location = data?.result?.geometry?.location;

      if (!location) {
        Toast.show({
          type: 'error',
          text1: 'Could not get location',
          text2: 'Try again',
        });
        return;
      }

      dispatch(
        setDestination({
          text: place.description,
          latitude: location.lat,
          longitude: location.lng,
        }),
      );

      const newEntry = {
        place_id: place.place_id,
        description: place.description,
      };
      const updated = [
        newEntry,
        ...history.filter(h => h.place_id !== place.place_id),
      ].slice(0, MAX_HISTORY);
      setHistory(updated);
      if (HISTORY_KEY) {
        AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      }

      setText(place.description);
      setSuggestions([]);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network error',
        text2: 'Check your connection',
      });
    }
  };

  // =========================
  // 🔥 NAV ICON CLICK (IMPORTANT FIX)
  // =========================
  const handleConfirmDestination = async () => {
    if (!text.trim()) return;

    try {
      if (suggestions.length > 0) {
        await selectPlace(suggestions[0]);
        return;
      }

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          text,
        )}&key=${GOOGLE_KEY}&components=country:ke`,
      );

      const data = await res.json();

      if (!data.predictions?.length) {
        Toast.show({
          type: 'error',
          text1: 'Location not found',
          text2: 'Try a different destination',
        });
        return;
      }

      await selectPlace(data.predictions[0]);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network error',
        text2: 'Check your internet connection',
      });
    }
  };

  return (
    // 2. COMBINE THE BASE CONTAINER STYLE WITH THE PASSED IN DYNAMIC STYLE
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Destination</Text>

      {/* INPUT */}
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Where to?"
          placeholderTextColor="#6b7280"
          style={styles.input}
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleConfirmDestination}
        >
          <View style={[styles.icon, !text.trim() && { opacity: 0.4 }]}>
            <Navigation size={20} color="#ffffff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* SUGGESTIONS */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsBox}>
          <FlatList
            data={suggestions}
            keyExtractor={item => item.place_id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => selectPlace(item)}
                style={styles.suggestionItem}
              >
                <Text style={styles.suggestionText}>{item.description}</Text>
              </Pressable>
            )}
          />
        </View>
      )}

      {/* HISTORY — shown when input is empty and no suggestions */}
      {suggestions.length === 0 && text.length === 0 && history.length > 0 && (
        <View style={styles.suggestionsBox}>
          <TouchableOpacity
            onPress={() => setHistoryExpanded(prev => !prev)}
            style={styles.historyToggle}
            activeOpacity={0.7}
          >
            <Text style={styles.historyLabel}>🕐 Recent</Text>
            <Text style={styles.historyChevron}>
              {historyExpanded ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {historyExpanded && (
            <FlatList
              data={history}
              keyExtractor={item => item.place_id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    selectPlace(item);
                    setHistoryExpanded(false);
                  }}
                  style={styles.suggestionItem}
                >
                  <Text style={styles.historyIcon}>🕐</Text>
                  <Text style={styles.suggestionText}>{item.description}</Text>
                </Pressable>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    width: '65%',
    backgroundColor: '#f1f7f6',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#006c52',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0d2b1f',
    marginRight: 8,
  },
  icon: {
    padding: 10,
    backgroundColor: '#001810',
    borderRadius: 16,
  },
  suggestionsBox: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: 200,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 8,
  },
  suggestionText: {
    fontSize: 13,
    color: '#0d2b1f',
  },
  historyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  historyLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000000',
  },
  historyChevron: {
    fontSize: 10,
    color: '#6b7280',
  },
  historyIcon: {
    fontSize: 13,
  },
});
