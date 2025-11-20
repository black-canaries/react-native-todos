import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";
import { colors } from "../../theme";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const { signUp, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }

    setLocalError(null);
    try {
      await signUp(email, password);
      router.replace("/(tabs)");
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Sign up failed");
    }
  };

  const displayError = localError || error;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.dark.background }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
          <View style={{ marginBottom: 48 }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: colors.dark.text,
                marginBottom: 8,
              }}
            >
              Create Account
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.dark.textSecondary,
              }}
            >
              Sign up to get started
            </Text>
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.dark.text,
                marginBottom: 8,
              }}
            >
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.dark.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              style={{
                backgroundColor: colors.dark.cardBackground,
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                color: colors.dark.text,
                borderWidth: 1,
                borderColor: colors.dark.border,
              }}
            />
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.dark.text,
                marginBottom: 8,
              }}
            >
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor={colors.dark.textSecondary}
              secureTextEntry
              autoComplete="password-new"
              style={{
                backgroundColor: colors.dark.cardBackground,
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                color: colors.dark.text,
                borderWidth: 1,
                borderColor: colors.dark.border,
              }}
            />
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.dark.text,
                marginBottom: 8,
              }}
            >
              Confirm Password
            </Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              placeholderTextColor={colors.dark.textSecondary}
              secureTextEntry
              autoComplete="password-new"
              style={{
                backgroundColor: colors.dark.cardBackground,
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                color: colors.dark.text,
                borderWidth: 1,
                borderColor: colors.dark.border,
              }}
            />
          </View>

          {displayError && (
            <View
              style={{
                backgroundColor: "#ff4444",
                borderRadius: 8,
                padding: 12,
                marginBottom: 24,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 14 }}>
                {displayError}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleSignUp}
            disabled={isLoading}
            style={{
              backgroundColor: colors.dark.primary,
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                Sign Up
              </Text>
            )}
          </TouchableOpacity>

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: colors.dark.textSecondary, fontSize: 14 }}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
              <Text
                style={{
                  color: colors.dark.primary,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
