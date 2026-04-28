import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function SignUpScreen() {
  const navigation = useNavigation<any>();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.inner}
            keyboardShouldPersistTaps="handled"
          >
            {/* LOGO */}
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/VoitaLogo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* CARD */}
            <View style={styles.card}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Start your journey with Voita</Text>

              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#7a7a7a"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
              />

              <TextInput
                placeholder="Email"
                placeholderTextColor="#7a7a7a"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                placeholder="Phone Number (optional)"
                placeholderTextColor="#7a7a7a"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                keyboardType="phone-pad"
              />

              <TextInput
                placeholder="Password"
                placeholderTextColor="#7a7a7a"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />

              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#7a7a7a"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
              />

              {/* SIGN UP BUTTON */}
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>

              {/* DIVIDER */}
              <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.or}>OR</Text>
                <View style={styles.line} />
              </View>

              {/* LOGIN LINK */}
              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Already have an account?</Text>

                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginLink}> Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8f7",
  },

  inner: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },

  /* LOGO */
  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  logo: {
    width: 160,
    height: 160,
  },

  /* CARD */
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  title: {
    fontSize: 27,
    fontWeight: "700",
    color: "#0d2b1f",
  },
  subtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
    marginBottom: 18,
  },

  /* INPUTS */
  input: {
    backgroundColor: "#f2f4f3",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    color: "#000",
  },

  /* BUTTON */
  button: {
    backgroundColor: "#0d2b1f",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  /* DIVIDER */
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  or: {
    marginHorizontal: 10,
    fontSize: 12,
    color: "#888",
  },

  /* LOGIN LINK */
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    fontSize: 13,
    color: "#666",
  },
  loginLink: {
    fontSize: 13,
    color: "#0d2b1f",
    fontWeight: "700",
  },
});
