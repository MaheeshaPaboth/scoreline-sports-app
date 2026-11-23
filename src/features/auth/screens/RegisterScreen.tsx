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
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Feather from 'react-native-vector-icons/Feather';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { registerUser, clearAuthError, resetRegisterSuccess } from '../slice/authSlice';
import { useAppTheme } from '../../../shared/hooks/useAppTheme';
import { PrimaryButton } from '../../../shared/components/PrimaryButton';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name is required (min 2 chars)').trim(),
    lastName: z.string().min(2, 'Last name is required (min 2 chars)').trim(),
    username: z.string().min(3, 'Username must be at least 3 characters').trim(),
    email: z.string().email('Please enter a valid email address').trim(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Register'
>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    dispatch(clearAuthError());
    const resultAction = await dispatch(
      registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: data.password,
      })
    );

    if (registerUser.fulfilled.match(resultAction)) {
      dispatch(resetRegisterSuccess());
      Alert.alert(
        'Registration Simulated',
        `Account for ${data.username} simulated successfully via DummyJSON! Please log in.`,
        [{ text: 'Go to Login', onPress: () => navigation.navigate('Login') }]
      );
    }
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Back to Login"
        >
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>

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
            Create an Account
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Simulate user registration via DummyJSON API
          </Text>

          {error ? (
            <View
              style={[
                styles.errorContainer,
                { backgroundColor: theme.colors.errorBackground },
              ]}
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

          {/* First Name & Last Name */}
          <View style={styles.nameRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.sm }]}>
              <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
                First Name
              </Text>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: theme.colors.inputBackground,
                        borderColor: errors.firstName
                          ? theme.colors.error
                          : theme.colors.border,
                      },
                    ]}
                  >
                    <TextInput
                      style={[styles.input, { color: theme.colors.textPrimary }]}
                      placeholder="John"
                      placeholderTextColor={theme.colors.textMuted}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                )}
              />
              {errors.firstName ? (
                <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                  {errors.firstName.message}
                </Text>
              ) : null}
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
                Last Name
              </Text>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: theme.colors.inputBackground,
                        borderColor: errors.lastName
                          ? theme.colors.error
                          : theme.colors.border,
                      },
                    ]}
                  >
                    <TextInput
                      style={[styles.input, { color: theme.colors.textPrimary }]}
                      placeholder="Doe"
                      placeholderTextColor={theme.colors.textMuted}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                )}
              />
              {errors.lastName ? (
                <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                  {errors.lastName.message}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Username */}
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
                    placeholder="Choose a username"
                    placeholderTextColor={theme.colors.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
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

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
              Email Address
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: theme.colors.inputBackground,
                      borderColor: errors.email
                        ? theme.colors.error
                        : theme.colors.border,
                    },
                  ]}
                >
                  <Feather
                    name="mail"
                    size={18}
                    color={theme.colors.textMuted}
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: theme.colors.textPrimary }]}
                    placeholder="john@example.com"
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            {errors.email ? (
              <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                {errors.email.message}
              </Text>
            ) : null}
          </View>

          {/* Password */}
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
                    placeholder="At least 6 characters"
                    placeholderTextColor={theme.colors.textMuted}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
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

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
              Confirm Password
            </Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: theme.colors.inputBackground,
                      borderColor: errors.confirmPassword
                        ? theme.colors.error
                        : theme.colors.border,
                    },
                  ]}
                >
                  <Feather
                    name="shield"
                    size={18}
                    color={theme.colors.textMuted}
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: theme.colors.textPrimary }]}
                    placeholder="Re-enter password"
                    placeholderTextColor={theme.colors.textMuted}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            {errors.confirmPassword ? (
              <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                {errors.confirmPassword.message}
              </Text>
            ) : null}
          </View>

          {/* Submit */}
          <PrimaryButton
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            iconName="user-plus"
            style={styles.submitButton}
          />

          {/* Switch to Login */}
          <View style={styles.switchAuthRow}>
            <Text style={[styles.switchAuthText, { color: theme.colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.switchAuthLink, { color: theme.colors.primary }]}>
                Sign In
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    marginBottom: spacing.md,
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
  nameRow: {
    flexDirection: 'row',
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
