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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const { signIn, isLoading, error } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setLocalError("Please fill in all fields");
      return;
    }

    setLocalError(null);
    try {
      await signIn(email, password);
      router.replace("/(tabs)");
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Login failed");
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
              Welcome Back
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.dark.textSecondary,
              }}
            >
              Sign in to continue
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
              placeholder="Enter your password"
              placeholderTextColor={colors.dark.textSecondary}
              secureTextEntry
              autoComplete="password"
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
            onPress={handleLogin}
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
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: colors.dark.textSecondary, fontSize: 14 }}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/signup")}>
              <Text
                style={{
                  color: colors.dark.primary,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
