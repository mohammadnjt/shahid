// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
// import { useState } from 'react';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as Animatable from 'react-native-animatable';
// import { useAuth } from '../contexts/AuthContext';
// import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
// import { Bell, Moon, Globe, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';

// export default function SettingsScreen() {
//   const { signOut } = useAuth();
//   const [darkMode, setDarkMode] = useState(false);
//   const [notifications, setNotifications] = useState(true);
//   const [language, setLanguage] = useState('fa');

//   const handleSignOut = () => {
//     Alert.alert(
//       'خروج از حساب',
//       'آیا مطمئن هستید که می‌خواهید خارج شوید؟',
//       [
//         { text: 'لغو', style: 'cancel' },
//         { text: 'خروج', style: 'destructive', onPress: signOut },
//       ]
//     );
//   };

//   const SettingItem = ({ icon: Icon, title, subtitle, onPress, rightComponent }) => (
//     <TouchableOpacity
//       style={styles.settingItem}
//       onPress={onPress}
//       disabled={!onPress && !rightComponent}
//     >
//       <View style={styles.settingLeft}>
//         <View style={styles.iconContainer}>
//           <Icon size={20} color={colors.primary} />
//         </View>
//         <View style={styles.settingText}>
//           <Text style={styles.settingTitle}>{title}</Text>
//           {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
//         </View>
//       </View>
//       <View style={styles.settingRight}>
//         {rightComponent || <ChevronRight size={20} color={colors.textSecondary} />}
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={[colors.primary, colors.primaryDark]}
//         style={styles.header}
//       >
//         <Text style={styles.headerTitle}>تنظیمات</Text>
//       </LinearGradient>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         <Animatable.View animation="fadeInUp" duration={600} style={styles.section}>
//           <Text style={styles.sectionTitle}>عمومی</Text>

//           <SettingItem
//             icon={Moon}
//             title="حالت تاریک"
//             subtitle="تم تاریک را فعال کنید"
//             rightComponent={
//               <Switch
//                 value={darkMode}
//                 onValueChange={setDarkMode}
//                 trackColor={{ false: colors.border, true: colors.primary }}
//                 thumbColor={darkMode ? colors.textLight : colors.surface}
//               />
//             }
//           />

//           <SettingItem
//             icon={Bell}
//             title="اعلان‌ها"
//             subtitle="دریافت اعلان‌های جدید"
//             rightComponent={
//               <Switch
//                 value={notifications}
//                 onValueChange={setNotifications}
//                 trackColor={{ false: colors.border, true: colors.primary }}
//                 thumbColor={notifications ? colors.textLight : colors.surface}
//               />
//             }
//           />

//           <SettingItem
//             icon={Globe}
//             title="زبان"
//             subtitle="فارسی"
//             onPress={() => Alert.alert('زبان', 'انتخاب زبان')}
//           />
//         </Animatable.View>

//         <Animatable.View animation="fadeInUp" delay={100} duration={600} style={styles.section}>
//           <Text style={styles.sectionTitle}>امنیت و حریم خصوصی</Text>

//           <SettingItem
//             icon={Shield}
//             title="حریم خصوصی"
//             subtitle="مدیریت تنظیمات حریم خصوصی"
//             onPress={() => Alert.alert('حریم خصوصی', 'تنظیمات حریم خصوصی')}
//           />
//         </Animatable.View>

//         <Animatable.View animation="fadeInUp" delay={200} duration={600} style={styles.section}>
//           <Text style={styles.sectionTitle}>پشتیبانی</Text>

//           <SettingItem
//             icon={HelpCircle}
//             title="راهنما"
//             subtitle="سوالات متداول و راهنمای استفاده"
//             onPress={() => Alert.alert('راهنما', 'راهنمای استفاده از برنامه')}
//           />
//         </Animatable.View>

//         <Animatable.View animation="fadeInUp" delay={300} duration={600} style={styles.section}>
//           <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
//             <LinearGradient
//               colors={[colors.error, '#D32F2F']}
//               style={styles.logoutButtonGradient}
//             >
//               <LogOut size={20} color={colors.textLight} />
//               <Text style={styles.logoutButtonText}>خروج از حساب</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </Animatable.View>

//         <View style={styles.footer}>
//           <Text style={styles.footerText}>نسخه ۱.۰.۰</Text>
//           <Text style={styles.footerText}>ساخته شده با ❤️</Text>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   header: {
//     paddingTop: 50,
//     paddingBottom: spacing.lg,
//     paddingHorizontal: spacing.lg,
//   },
//   headerTitle: {
//     ...typography.h2,
//     color: colors.textLight,
//   },
//   section: {
//     marginTop: spacing.lg,
//     paddingHorizontal: spacing.lg,
//   },
//   sectionTitle: {
//     ...typography.h4,
//     color: colors.text,
//     marginBottom: spacing.md,
//   },
//   settingItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: colors.surface,
//     borderRadius: borderRadius.md,
//     padding: spacing.md,
//     marginBottom: spacing.sm,
//     ...shadows.small,
//   },
//   settingLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: colors.primaryLight,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: spacing.md,
//   },
//   settingText: {
//     flex: 1,
//   },
//   settingTitle: {
//     ...typography.body1,
//     color: colors.text,
//     fontWeight: '600',
//   },
//   settingSubtitle: {
//     ...typography.caption,
//     color: colors.textSecondary,
//     marginTop: 2,
//   },
//   settingRight: {
//     marginLeft: spacing.md,
//   },
//   logoutButton: {
//     borderRadius: borderRadius.md,
//     overflow: 'hidden',
//     marginTop: spacing.lg,
//   },
//   logoutButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: spacing.md,
//     gap: spacing.sm,
//   },
//   logoutButtonText: {
//     color: colors.textLight,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   footer: {
//     alignItems: 'center',
//     paddingVertical: spacing.xxl,
//   },
//   footerText: {
//     ...typography.caption,
//     color: colors.textSecondary,
//     marginBottom: spacing.xs,
//   },
// });
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, ImageBackground } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import { Bell, Moon, Globe, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import bg from '../assets/images/islamic-background.jpg';

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('fa');

  const handleSignOut = () => {
    Alert.alert(
      'خروج از حساب',
      'آیا مطمئن هستید که می‌خواهید خارج شوید؟',
      [
        { text: 'لغو', style: 'cancel' },
        { text: 'خروج', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const SettingItem = ({ icon: Icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress && !rightComponent}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Icon size={20} color={colors.textLight} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent || <ChevronRight size={20} color={colors.textLight} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={bg}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Overlay for better readability */}
      <View style={styles.overlay} />
      
      {/* Header */}
      <Animatable.View animation="fadeInDown" style={styles.header}>
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)']}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>تنظیمات</Text>
        </LinearGradient>
      </Animatable.View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* General Settings */}
        <Animatable.View animation="fadeInUp" duration={600} style={styles.section}>
          <Text style={styles.sectionTitle}>عمومی</Text>

          <View style={styles.settingsCard}>
            <SettingItem
              icon={Moon}
              title="حالت تاریک"
              subtitle="تم تاریک را فعال کنید"
              rightComponent={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: 'rgba(212, 175, 55, 0.6)' }}
                  thumbColor={darkMode ? colors.textLight : 'rgba(255, 255, 255, 0.5)'}
                />
              }
            />

            <SettingItem
              icon={Bell}
              title="اعلان‌ها"
              subtitle="دریافت اعلان‌های جدید"
              rightComponent={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: 'rgba(212, 175, 55, 0.6)' }}
                  thumbColor={notifications ? colors.textLight : 'rgba(255, 255, 255, 0.5)'}
                />
              }
            />

            <SettingItem
              icon={Globe}
              title="زبان"
              subtitle="فارسی"
              onPress={() => Alert.alert('زبان', 'انتخاب زبان')}
            />
          </View>
        </Animatable.View>

        {/* Security & Privacy */}
        <Animatable.View animation="fadeInUp" delay={100} duration={600} style={styles.section}>
          <Text style={styles.sectionTitle}>امنیت و حریم خصوصی</Text>

          <View style={styles.settingsCard}>
            <SettingItem
              icon={Shield}
              title="حریم خصوصی"
              subtitle="مدیریت تنظیمات حریم خصوصی"
              onPress={() => Alert.alert('حریم خصوصی', 'تنظیمات حریم خصوصی')}
            />
          </View>
        </Animatable.View>

        {/* Support */}
        <Animatable.View animation="fadeInUp" delay={200} duration={600} style={styles.section}>
          <Text style={styles.sectionTitle}>پشتیبانی</Text>

          <View style={styles.settingsCard}>
            <SettingItem
              icon={HelpCircle}
              title="راهنما"
              subtitle="سوالات متداول و راهنمای استفاده"
              onPress={() => Alert.alert('راهنما', 'راهنمای استفاده از برنامه')}
            />
          </View>
        </Animatable.View>

        {/* Logout Button */}
        <Animatable.View animation="fadeInUp" delay={300} duration={600} style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <LinearGradient
              colors={['rgba(239, 68, 68, 0.8)', 'rgba(220, 38, 38, 0.6)']}
              style={styles.logoutButtonGradient}
            >
              <LogOut size={20} color={colors.textLight} />
              <Text style={styles.logoutButtonText}>خروج از حساب</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>نسخه ۱.۰.۰</Text>
          <Text style={styles.footerText}>ساخته شده با ❤️</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  header: {
    paddingTop: 50,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textLight,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textLight,
    marginBottom: spacing.md,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  settingsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body1,
    color: colors.textLight,
    fontWeight: '600',
  },
  settingSubtitle: {
    ...typography.caption,
    color: colors.textLight,
    opacity: 0.8,
    marginTop: 2,
  },
  settingRight: {
    marginLeft: spacing.md,
  },
  logoutButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  logoutButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  footerText: {
    ...typography.caption,
    color: colors.textLight,
    opacity: 0.7,
    marginBottom: spacing.xs,
  },
});