import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthActions } from '@convex-dev/auth/react';
import { theme } from '../../theme';

export default function SignupScreen() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleOAuthSignUp = async (provider: 'google' | 'github') => {
    try {
      setLoadingProvider(provider);
      await signIn(provider);
    } catch (error) {
      console.error(`${provider} sign up error:`, error);
      Alert.alert('Error', `Failed to sign up with ${provider}. Please try again.`);
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleEmailSignUp = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await signIn('password', { email: email.trim(), password, flow: 'signUp' });
      // Successful sign-up will trigger auth state change and redirect
    } catch (error: any) {
      console.error('Email sign up error:', error);
      const errorMessage = error?.message || 'Failed to create account. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-lg py-xxl">
            {/* Logo/Title Section */}
            <View className="items-center mb-xxl mt-xxl">
              <View className="w-16 h-16 rounded-full bg-primary items-center justify-center mb-md">
                <Ionicons name="checkmark-circle" size={40} color="#ffffff" />
              </View>
              <Text className="text-xxl font-bold text-text mb-sm">Create Account</Text>
              <Text className="text-md text-text-secondary text-center">
                Sign up to start organizing your tasks
              </Text>
            </View>

            {/* OAuth Buttons */}
            <View className="gap-md mb-lg">
              <TouchableOpacity
                onPress={() => handleOAuthSignUp('google')}
                disabled={loadingProvider !== null}
                className="bg-background-secondary border border-border rounded-lg py-md px-md flex-row items-center justify-center gap-md"
                style={{ opacity: loadingProvider !== null ? 0.6 : 1 }}
              >
                {loadingProvider === 'google' ? (
                  <ActivityIndicator size="small" color={theme.colors.text} />
                ) : (
                  <>
                    <Ionicons name="logo-google" size={24} color={theme.colors.text} />
                    <Text className="text-md font-semibold text-text">
                      Sign up with Google
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleOAuthSignUp('github')}
                disabled={loadingProvider !== null}
                className="bg-background-secondary border border-border rounded-lg py-md px-md flex-row items-center justify-center gap-md"
                style={{ opacity: loadingProvider !== null ? 0.6 : 1 }}
              >
                {loadingProvider === 'github' ? (
                  <ActivityIndicator size="small" color={theme.colors.text} />
                ) : (
                  <>
                    <Ionicons name="logo-github" size={24} color={theme.colors.text} />
                    <Text className="text-md font-semibold text-text">
                      Sign up with GitHub
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="flex-row items-center mb-lg">
              <View className="flex-1 h-px bg-border" />
              <Text className="px-md text-sm text-text-tertiary">or continue with email</Text>
              <View className="flex-1 h-px bg-border" />
            </View>

            {/* Email Input */}
            <View className="mb-md">
              <Text className="text-sm font-semibold text-text mb-sm">Email</Text>
              <TextInput
                className="bg-background-secondary border border-border rounded-lg px-md py-md text-md text-text"
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                editable={!loading}
              />
            </View>

            {/* Password Input */}
            <View className="mb-md">
              <Text className="text-sm font-semibold text-text mb-sm">Password</Text>
              <TextInput
                className="bg-background-secondary border border-border rounded-lg px-md py-md text-md text-text"
                placeholder="Enter your password (min 8 characters)"
                placeholderTextColor={theme.colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                editable={!loading}
              />
            </View>

            {/* Confirm Password Input */}
            <View className="mb-lg">
              <Text className="text-sm font-semibold text-text mb-sm">Confirm Password</Text>
              <TextInput
                className="bg-background-secondary border border-border rounded-lg px-md py-md text-md text-text"
                placeholder="Confirm your password"
                placeholderTextColor={theme.colors.textTertiary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                editable={!loading}
              />
            </View>

            {/* Create Account Button */}
            <TouchableOpacity
              onPress={handleEmailSignUp}
              disabled={loading || loadingProvider !== null}
              className="bg-primary rounded-lg py-md mb-lg"
              style={{ opacity: loading || loadingProvider !== null ? 0.6 : 1 }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-md font-bold text-white text-center">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            {/* Sign In Link */}
            <View className="flex-row items-center justify-center">
              <Text className="text-md text-text-secondary">Already have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/login')}
                disabled={loading || loadingProvider !== null}
              >
                <Text className="text-md font-semibold text-primary">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
