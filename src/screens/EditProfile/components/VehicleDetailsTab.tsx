import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

import CustomInput from "./CustomInput";
import DatePickerField from "./DatePickerField";

export default function VehicleDetailsTab() {
  const [vehicleImage, setVehicleImage] = useState<string | null>(null);

  const [form, setForm] = useState<any>({
    numberPlate: "",
    vehicleType: "",
    year: "",
    color: "",
    oilType: "",
    tirePressure: "",
    tireConfig: "",
    insurance: null,
    license: null,
    service: null,
    tireExpiry: null,
  });

  // 📸 Pick vehicle image
  const pickVehicleImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.8,
    });

    if (!result.didCancel && result.assets?.length) {
      setVehicleImage(result.assets[0].uri || null);
    }
  };

  return (
    <View style={styles.container}>
      {/* ===================== */}
      {/* VEHICLE IMAGE UPLOAD */}
      {/* ===================== */}
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={pickVehicleImage}
      >
        {vehicleImage ? (
          <Image source={{ uri: vehicleImage }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Upload Vehicle Image
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* ===================== */}
      {/* FORM FIELDS */}
      {/* ===================== */}

      <Text style={styles.label}>Number Plate</Text>
      <CustomInput
        placeholder="Number Plate"
        value={form.numberPlate}
        onChangeText={(text: string) =>
          setForm({ ...form, numberPlate: text })
        }
      />

      <Text style={styles.label}>Vehicle Type</Text>
      <CustomInput
        placeholder="Vehicle Type"
        value={form.vehicleType}
        onChangeText={(text: string) =>
          setForm({ ...form, vehicleType: text })
        }
      />

      <Text style={styles.label}>Year</Text>
      <CustomInput
        placeholder="Year"
        value={form.year}
        onChangeText={(text: string) =>
          setForm({ ...form, year: text })
        }
      />

      <Text style={styles.label}>Color</Text>
      <CustomInput
        placeholder="Color"
        value={form.color}
        onChangeText={(text: string) =>
          setForm({ ...form, color: text })
        }
      />

      <Text style={styles.label}>Oil Type</Text>
      <CustomInput
        placeholder="Oil Type"
        value={form.oilType}
        onChangeText={(text: string) =>
          setForm({ ...form, oilType: text })
        }
      />

      <Text style={styles.label}>Tire Pressure</Text>
      <CustomInput
        placeholder="Tire Pressure"
        value={form.tirePressure}
        onChangeText={(text: string) =>
          setForm({ ...form, tirePressure: text })
        }
      />

      <Text style={styles.label}>Tire Configuration</Text>
      <CustomInput
        placeholder="Tire Configuration"
        value={form.tireConfig}
        onChangeText={(text: string) =>
          setForm({ ...form, tireConfig: text })
        }
      />

      {/* ===================== */}
      {/* REMINDERS (DATE PICKERS) */}
      {/* ===================== */}

      <DatePickerField
        label="Insurance Renewal"
        value={form.insurance}
        onChange={(date: Date) =>
          setForm({ ...form, insurance: date })
        }
      />

      <DatePickerField
        label="Driving License"
        value={form.license}
        onChange={(date: Date) =>
          setForm({ ...form, license: date })
        }
      />

      <DatePickerField
        label="Car Service"
        value={form.service}
        onChange={(date: Date) =>
          setForm({ ...form, service: date })
        }
      />

      <DatePickerField
        label="Tire Expiry"
        value={form.tireExpiry}
        onChange={(date: Date) =>
          setForm({ ...form, tireExpiry: date })
        }
      />

      {/* ===================== */}
      {/* SAVE BUTTON */}
      {/* ===================== */}

      <TouchableOpacity style={styles.save}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  // Image upload
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
    backgroundColor: "#006c52",
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
