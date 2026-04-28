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

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {/* Tap outside to dismiss keyboard */}
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

          {/* FORM */}
          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

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
              placeholder="Password"
              placeholderTextColor="#7a7a7a"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            <TouchableOpacity>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* DIVIDER */}
            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.or}>OR</Text>
              <View style={styles.line} />
            </View>

            {/* SIGN UP */}
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account?</Text>

              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text style={styles.signupLink}> Create Account</Text>
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
  paddingTop: 40,
  paddingBottom: 40,
  },

  /* LOGO */
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
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

  /* FORGOT */
  forgot: {
    textAlign: "right",
    color: "#0d2b1f",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 16,
  },

  /* BUTTON */
  button: {
    backgroundColor: "#0d2b1f",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
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

  /* SIGNUP */
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    fontSize: 13,
    color: "#666",
  },
  signupLink: {
    fontSize: 13,
    color: "#0d2b1f",
    fontWeight: "700",
  },
});
