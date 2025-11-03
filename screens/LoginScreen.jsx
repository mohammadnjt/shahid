import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ImageBackground } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import { Mail, Lock, Fingerprint, Eye, EyeOff } from 'lucide-react-native';
import loginBg from '../assets/images/loginBg.jpeg';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);
  const router = useRouter();
  const { signIn } = useAuth();

  const validateForm = () => {
    const newErrors = {};
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('خطا', result.error || 'ورود ناموفق بود');
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('خطا', 'دستگاه شما از احراز هویت بیومتریک پشتیبانی نمی‌کند');
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert('خطا', 'لطفاً ابتدا احراز هویت بیومتریک را در تنظیمات فعال کنید');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'ورود با اثر انگشت',
        cancelLabel: 'لغو',
        disableDeviceFallback: false,
      });

      if (result.success) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('خطا', 'احراز هویت ناموفق بود');
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
        <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
          <Text style={styles.title}>خوش آمدید</Text>
          <Text style={styles.subtitle}>وارد حساب خود شوید</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={200} style={styles.glassContainer}>
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
              autoComplete="password"
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

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={[colors.secondary, colors.secondaryDark]}
              style={styles.loginButtonGradient}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'در حال ورود...' : 'ورود'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.biometricButton}
            onPress={handleBiometricAuth}
          >
            <Fingerprint size={24} color={colors.textLight} />
            <Text style={styles.biometricText}>ورود با اثر انگشت</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={styles.signupText}>ثبت نام</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>حساب کاربری ندارید؟ </Text>
          </View>
        </Animatable.View>
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
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
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
  loginButton: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  loginButtonGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
  },
  biometricButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  biometricText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
    marginRight: spacing.sm,
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
  signupText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: spacing.xs,
    textDecorationLine: 'underline',
  },
});