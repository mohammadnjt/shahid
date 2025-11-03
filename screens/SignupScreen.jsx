import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ImageBackground, ScrollView } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import loginBg from '../assets/images/loginBg.jpeg';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);
  const router = useRouter();
  const { signUp } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'نام الزامی است';
    }
    if (!email) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'ایمیل نامعتبر است';
    }
    if (!password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'رمز عبور مطابقت ندارد';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const result = await signUp(email, password, fullName);
    setLoading(false);

    if (result.success) {
      Alert.alert('موفق', 'حساب شما با موفقیت ایجاد شد');
      router.replace('/(tabs)');
    } else {
      Alert.alert('خطا', result.error || 'ثبت نام ناموفق بود');
    }
  };

  return (
    <ImageBackground
      source={loginBg}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Overlay for better readability */}
      <View style={styles.overlay} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
            <Text style={styles.title}>ثبت نام</Text>
            <Text style={styles.subtitle}>حساب جدید ایجاد کنید</Text>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" duration={800} delay={200} style={styles.glassContainer}>
            <View style={[
              styles.inputContainer,
              focusedInput === 'fullName' && styles.inputContainerFocused
            ]}>
              <User size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="نام کامل"
                placeholderTextColor={colors.textLight + '80'}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                textAlign="right"
                onFocus={() => setFocusedInput('fullName')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
            {errors.fullName && (
              <Animatable.Text animation="shake" style={styles.errorText}>
                {errors.fullName}
              </Animatable.Text>
            )}

            <View style={[
              styles.inputContainer,
              focusedInput === 'email' && styles.inputContainerFocused
            ]}>
              <Mail size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="ایمیل"
                placeholderTextColor={colors.textLight + '80'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textAlign="right"
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
            {errors.email && (
              <Animatable.Text animation="shake" style={styles.errorText}>
                {errors.email}
              </Animatable.Text>
            )}

            <View style={[
              styles.inputContainer,
              focusedInput === 'password' && styles.inputContainerFocused
            ]}>
              <Lock size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="رمز عبور"
                placeholderTextColor={colors.textLight + '80'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                textAlign="right"
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.textLight} />
                ) : (
                  <Eye size={20} color={colors.textLight} />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Animatable.Text animation="shake" style={styles.errorText}>
                {errors.password}
              </Animatable.Text>
            )}

            <View style={[
              styles.inputContainer,
              focusedInput === 'confirmPassword' && styles.inputContainerFocused
            ]}>
              <Lock size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="تکرار رمز عبور"
                placeholderTextColor={colors.textLight + '80'}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                textAlign="right"
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color={colors.textLight} />
                ) : (
                  <Eye size={20} color={colors.textLight} />
                )}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Animatable.Text animation="shake" style={styles.errorText}>
                {errors.confirmPassword}
              </Animatable.Text>
            )}

            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}
              disabled={loading}
            >
              <LinearGradient
                colors={[colors.secondary, colors.secondaryDark]}
                style={styles.signupButtonGradient}
              >
                <Text style={styles.signupButtonText}>
                  {loading ? 'در حال ثبت نام...' : 'ثبت نام'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginText}>ورود</Text>
              </TouchableOpacity>
              <Text style={styles.footerText}>قبلاً حساب دارید؟ </Text>
            </View>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textLight,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body1,
    color: colors.textLight,
    opacity: 0.9,
    textAlign: 'center',
  },
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
  },
  inputContainerFocused: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  inputIcon: {
    marginLeft: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'right',
    outlineStyle: 'none',
  },
  eyeIcon: {
    padding: spacing.sm,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
    marginRight: spacing.md,
    textAlign: 'right',
  },
  signupButton: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  signupButtonGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  signupButtonText: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    color: colors.textLight,
    fontSize: 14,
    opacity: 0.9,
  },
  loginText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: spacing.xs,
    textDecorationLine: 'underline',
  },
});