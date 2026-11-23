import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Feather from 'react-native-vector-icons/Feather';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { loginUser, clearAuthError } from '../slice/authSlice';
import { useAppTheme } from '../../../shared/hooks/useAppTheme';
import { PrimaryButton } from '../../../shared/components/PrimaryButton';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    dispatch(clearAuthError());
    dispatch(loginUser(data));
  };

  const fillDemoCredentials = () => {
    setValue('username', 'emilys');
    setValue('password', 'emilyspass');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <View style={styles.brandContainer}>
            <View
              style={[
                styles.logoBadge,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Feather name="activity" size={28} color="#FFFFFF" />
            </View>
            <Text style={[styles.brandTitle, { color: theme.colors.textPrimary }]}>
              Scoreline
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.themeToggle,
              { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
            ]}
            accessibilityLabel="Toggle Dark Mode"
          >
            <Feather
              name={isDark ? 'sun' : 'moon'}
              size={20}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
          Your offline-first sports, leagues & teams hub
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Sign in to access your teams and favourites
          </Text>

          {error ? (
            <View
              style={[
                styles.errorContainer,
                { backgroundColor: theme.colors.errorBackground },
              ]}
              testID="login-error-message"
            >
              <Feather
                name="alert-circle"
                size={16}
                color={theme.colors.error}
                style={styles.errorIcon}
              />
              <Text style={[styles.errorBannerText, { color: theme.colors.error }]}>
                {error}
              </Text>
            </View>
          ) : null}

          {/* Username Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
              Username
            </Text>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: theme.colors.inputBackground,
                      borderColor: errors.username
                        ? theme.colors.error
                        : theme.colors.border,
                    },
                  ]}
                >
                  <Feather
                    name="user"
                    size={18}
                    color={theme.colors.textMuted}
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: theme.colors.textPrimary }]}
                    placeholder="e.g. emilys"
                    placeholderTextColor={theme.colors.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    testID="username-input"
                  />
                </View>
              )}
            />
            {errors.username ? (
              <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                {errors.username.message}
              </Text>
            ) : null}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
              Password
            </Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: theme.colors.inputBackground,
                      borderColor: errors.password
                        ? theme.colors.error
                        : theme.colors.border,
                    },
                  ]}
                >
                  <Feather
                    name="lock"
                    size={18}
                    color={theme.colors.textMuted}
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: theme.colors.textPrimary }]}
                    placeholder="Enter your password"
                    placeholderTextColor={theme.colors.textMuted}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    testID="password-input"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(p => !p)}
                    style={styles.eyeButton}
                  >
                    <Feather
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={18}
                      color={theme.colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password ? (
              <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                {errors.password.message}
              </Text>
            ) : null}
          </View>

          {/* Demo Credentials Quick Fill */}
          <TouchableOpacity
            onPress={fillDemoCredentials}
            style={styles.demoFillButton}
          >
            <Feather
              name="info"
              size={14}
              color={theme.colors.primary}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.demoFillText, { color: theme.colors.primary }]}>
              Fill DummyJSON credentials (emilys / emilyspass)
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <PrimaryButton
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            iconName="log-in"
            style={styles.submitButton}
            testID="login-submit-button"
          />

          {/* Switch to Register */}
          <View style={styles.switchAuthRow}>
            <Text style={[styles.switchAuthText, { color: theme.colors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.switchAuthLink, { color: theme.colors.primary }]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  brandTitle: {
    ...typography.h1,
    letterSpacing: 0.5,
  },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  tagline: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
  card: {
    borderRadius: spacing.borderRadiusLg,
    padding: spacing.lg,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  title: {
    ...typography.heading,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: spacing.borderRadiusSm,
    marginBottom: spacing.md,
  },
  errorIcon: {
    marginRight: spacing.sm,
  },
  errorBannerText: {
    ...typography.captionBold,
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.subheading,
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: spacing.borderRadiusMd,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    minHeight: spacing.minTouchTarget, // >= 48dp
  },
  fieldIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: spacing.minTouchTarget,
    fontSize: 15,
  },
  eyeButton: {
    padding: spacing.xs,
  },
  fieldError: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  demoFillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
  },
  demoFillText: {
    ...typography.captionBold,
    textDecorationLine: 'underline',
  },
  submitButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  switchAuthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  switchAuthText: {
    ...typography.body,
  },
  switchAuthLink: {
    ...typography.bodyBold,
  },
});
