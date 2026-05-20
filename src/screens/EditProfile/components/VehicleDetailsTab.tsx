import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";

import CustomInput from "./CustomInput";
import DatePickerField from "./DatePickerField";
import { getVehicleProfile, updateVehicleProfile } from "../../../api/profile";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { updateVehicle } from "../../../redux/slices/vehicle/vehicleSlice";
import Toast from "react-native-toast-message";

export default function VehicleDetailsTab() {
  const [loading, setLoading] = useState(false);

  const vehicle = useAppSelector((state) => state.vehicle);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  const [vehicleImage, setVehicleImage] = useState<string | null>(null);

  const [form, setForm] = useState({
    numberPlate: "",
    vehicleType: "",
    year: "",
    color: "",
    oilType: "",
    tirePressure: "",
    tireConfig: "",
    insurance: null as Date | null,
    license: null as Date | null,
    service: null as Date | null,
    tireExpiry: null as Date | null,
  });

  // =========================
  // HELPERS
  // =========================
  const formatDate = (date: Date | null) =>
    date ? date.toISOString() : null;

  const normalizeImageUri = (uri: string | null) =>
    uri ? (uri.startsWith("file://") ? uri : `file://${uri}`) : null;

  // =========================
  // SYNC FUNCTION
  // =========================
  const syncVehicle = useCallback((v: any) => {
    if (!v) return;

    setForm({
      numberPlate: v.numberPlate ?? "",
      vehicleType: v.vehicleType ?? "",
      year: v.year ?? "",
      color: v.color ?? "",
      oilType: v.oilType ?? "",
      tirePressure: v.tirePressure ?? "",
      tireConfig: v.tireConfig ?? "",
      insurance: v.insuranceRenewal ? new Date(v.insuranceRenewal) : null,
      license: v.drivingLicenseExpiry ? new Date(v.drivingLicenseExpiry) : null,
      service: v.carServiceDate ? new Date(v.carServiceDate) : null,
      tireExpiry: v.tireExpiryDate ? new Date(v.tireExpiryDate) : null,
    });

    if (v.vehicleImage) {
      setVehicleImage(v.vehicleImage);
    }
  }, []);

  // =========================
  // FETCH + SYNC (SINGLE FLOW)
  // =========================
  const fetchVehicle = useCallback(async () => {
    try {
      const res = await getVehicleProfile(token);

      if (res.success && res.vehicle) {
        // 1. update redux
        dispatch(updateVehicle(res.vehicle));

        // 2. immediately sync UI (IMPORTANT FIX)
        syncVehicle(res.vehicle);
      }
    } catch (err) {
      console.log("Failed to fetch vehicle", err);
    }
  }, [token, dispatch, syncVehicle]);

  useFocusEffect(
    useCallback(() => {
      fetchVehicle();
    }, [fetchVehicle])
  );

  // =========================
  // IMAGE PICKER
  // =========================
  const pickVehicleImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.8,
    });

    if (!result.didCancel && result.assets?.length) {
      setVehicleImage(result.assets[0].uri || null);
    }
  };

  // =========================
  // SAVE
  // =========================
  const handleSave = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await updateVehicleProfile(
        token,
        {
          numberPlate: form.numberPlate,
          vehicleType: form.vehicleType,
          year: form.year,
          color: form.color,
          oilType: form.oilType,
          tirePressure: form.tirePressure,
          tireConfig: form.tireConfig,
          insuranceRenewal: formatDate(form.insurance),
          drivingLicenseExpiry: formatDate(form.license),
          carServiceDate: formatDate(form.service),
          tireExpiryDate: formatDate(form.tireExpiry),
        },
        normalizeImageUri(vehicleImage)
      );

      if (res.success) {
        dispatch(updateVehicle(res.vehicle));

        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Vehicle updated successfully",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: res.message || "Update failed",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageContainer} onPress={pickVehicleImage}>
        {vehicleImage ? (
          <Image source={{ uri: vehicleImage }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text>Upload Vehicle Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Number Plate</Text>
      <CustomInput value={form.numberPlate} onChangeText={(t: string) => setForm({ ...form, numberPlate: t })} />

      <Text style={styles.label}>Vehicle Type</Text>
      <CustomInput value={form.vehicleType} onChangeText={(t: string) => setForm({ ...form, vehicleType: t })} />

      <Text style={styles.label}>Year</Text>
      <CustomInput value={form.year} onChangeText={(t: string) => setForm({ ...form, year: t })} />

      <Text style={styles.label}>Color</Text>
      <CustomInput value={form.color} onChangeText={(t: string) => setForm({ ...form, color: t })} />

      <Text style={styles.label}>Oil Type</Text>
      <CustomInput value={form.oilType} onChangeText={(t: string) => setForm({ ...form, oilType: t })} />

      <Text style={styles.label}>Tire Pressure</Text>
      <CustomInput value={form.tirePressure} onChangeText={(t: string) => setForm({ ...form, tirePressure: t })} />

      <Text style={styles.label}>Tire Configuration</Text>
      <CustomInput value={form.tireConfig} onChangeText={(t: string) => setForm({ ...form, tireConfig: t })} />

      <DatePickerField label="Insurance Renewal" value={form.insurance} onChange={(d) => setForm({ ...form, insurance: d })} />
      <DatePickerField label="Driving License" value={form.license} onChange={(d) => setForm({ ...form, license: d })} />
      <DatePickerField label="Car Service" value={form.service} onChange={(d) => setForm({ ...form, service: d })} />
      <DatePickerField label="Tire Expiry" value={form.tireExpiry} onChange={(d) => setForm({ ...form, tireExpiry: d })} />

      <TouchableOpacity
        style={[styles.save, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveText}>
          {loading ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// =========================
// STYLES
// =========================
const styles = StyleSheet.create({
  container: { padding: 20 },

  imageContainer: {
    height: 180,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
  },

  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 7,
    marginTop: 10,
  },

  save: {
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: "#0d2b1f",
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
