import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Camera, Video, Lightbulb } from 'lucide-react-native';

export default function MediaCapture() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Camera color="#006c52" size={24} />
        <Text style={styles.title}>Capture the Moment</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.box}>
          <Camera color="#717974" size={36} />
          <Text style={styles.boxText}>ADD PHOTOS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <Video color="#717974" size={36} />
          <Text style={styles.boxText}>VIDEO TOUR</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tip}>
        <Lightbulb color="#006c52" size={20} style={{ marginTop: 3 }} />
        <Text style={styles.tipText}>
          <Text style={{ fontWeight: 'bold' }}>Tip:</Text> A simple 30-second
          walk around your vehicle helps us process your claim up to 4x faster.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e6e9e7',
    padding: 32,
    borderRadius: 32,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#001810',
    lineHeight: 28,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  box: {
    width: '48%',
    height: 110,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#c1c8c34d',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#717974',
    lineHieght: 16,
    marginTop: 8,
  },
  tip: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#006c521a',
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#00513d',
    marginLeft: 12,
    lineHeight: 18,
  },
});
