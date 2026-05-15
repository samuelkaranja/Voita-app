import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ProfileImagePicker from "./ProfileImagePicker";
import CustomInput from "./CustomInput";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { updateUser } from "../../../redux/slices/user/userSlice";
import Toast from "react-native-toast-message";
import { updateUserProfile } from "../../../api/profile";

export default function UserDetailsTab({ token }: any) {
  const [loading, setLoading] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  
  console.log("🔥 REDUX USER STATE:", user);

  // =========================
  // LOCAL STATE
  // =========================
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  // =========================
  // PREFILL FROM REDUX (FINAL FIX)
  // =========================
  useEffect(() => {
    // guard: only run when user actually has data
    if (!user || (!user.firstName && !user.email)) return;

    setForm({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phone: user.phone ?? "",
      email: user.email ?? "",
    });

    if (user.profileImageUrl) {
      setProfileImage(user.profileImageUrl);
    }
  }, [user]);

  // =========================
  // IMAGE HANDLER
  // =========================
  const handleImageSelect = (uri: string) => {
    setProfileImage(uri);
  };

  const normalizeImageUri = (uri: string | null) => {
    if (!uri) return null;
    if (uri.startsWith("http")) return uri;
    if (uri.startsWith("file://")) return uri;
    return `file://${uri}`;
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSave = async () => {
    if (loading) return;

    setLoading(true);

    try {
      let profileImageToSend: string | null = null;

      if (profileImage && profileImage.startsWith("file://")) {
        profileImageToSend = normalizeImageUri(profileImage);
      }

      const res = await updateUserProfile(token, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        profileImage: profileImageToSend,
      });

      if (res.success) {
        const updatedUser = res.user;

        dispatch(
          updateUser({
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            phone: updatedUser.phone,
            email: updatedUser.email,
            profileImageUrl: updatedUser.profileImageUrl,
          })
        );

        setProfileImage(updatedUser.profileImageUrl || null);

        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Profile updated successfully",
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
      <ProfileImagePicker onImageSelected={handleImageSelect} />

      <Text style={styles.label}>First Name</Text>
      <CustomInput
        value={form.firstName}
        onChangeText={(text: string) =>
          setForm({ ...form, firstName: text })
        }
      />

      <Text style={styles.label}>Last Name</Text>
      <CustomInput
        value={form.lastName}
        onChangeText={(text: string) =>
          setForm({ ...form, lastName: text })
        }
      />

      <Text style={styles.label}>Phone Number</Text>
      <CustomInput
        value={form.phone}
        onChangeText={(text: string) =>
          setForm({ ...form, phone: text })
        }
      />

      <Text style={styles.label}>Email Address</Text>
      <CustomInput
        value={form.email}
        onChangeText={(text: string) =>
          setForm({ ...form, email: text })
        }
      />

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

  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 7,
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
