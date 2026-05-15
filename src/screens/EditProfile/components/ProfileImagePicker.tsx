import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

type Props = {
  onImageSelected: (uri: string | null) => void;
};

export default function ProfileImagePicker({ onImageSelected }: Props) {
  const [image, setImage] = useState<string | null>(null);

  // 🧠 Normalize URI to avoid backend issues
  const normalizeUri = (uri: string | null | undefined) => {
    if (!uri) return null;

    // already correct
    if (uri.startsWith("file://") || uri.startsWith("content://")) {
      return uri;
    }

    return `file://${uri}`;
  };

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        quality: 0.8,
      });

      // ❌ user cancelled
      if (result.didCancel) return;

      // ❌ no assets returned
      if (!result.assets || result.assets.length === 0) return;

      const rawUri = result.assets[0]?.uri;

      const cleanUri = normalizeUri(rawUri);

      setImage(cleanUri);
      onImageSelected(cleanUri);
    } catch (error) {
      console.log("Image picker error:", error);
      onImageSelected(null);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={
            image
              ? { uri: image }
              : require("../../../assets/images/car.png")
          }
          style={styles.image}
        />
      </TouchableOpacity>

      <Text style={styles.text}>Change Profile Photo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  text: {
    marginTop: 10,
    color: "#006c52",
    fontWeight: "500",
  },
});
