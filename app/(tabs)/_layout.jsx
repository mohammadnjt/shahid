import { Tabs } from 'expo-router';
import { Home, Search, User, MessageCircle, Radio } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

export default function TabLayout() {
  const { user, loading, isFirstLaunch } = useAuth();
  console.log('User in TabLayout:', user);
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 16);
  const tabBarHeight = 75 + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: tabBarHeight,
          paddingBottom: bottomInset,
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView tint="dark" intensity={80} style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.androidBarBackground]} />
          ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'خانه',
          tabBarIcon: ({ size, color, focused }) => (
            <Home
              size={size + 2}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'جستجو',
          tabBarIcon: ({ size, color, focused }) => (
            <Search
              size={size + 2}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: user ? 'پروفایل' : 'ورود / ثبت‌نام',
          href: user ? 'profile' : 'auth/login',
          tabBarIcon: ({ size, color, focused }) => (
            <User
              size={size + 2}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      /> 
      <Tabs.Screen
        name="news"
        options={{
          title: 'اخبار',
          tabBarIcon: ({ size, color, focused }) => (
            <MessageCircle
              size={size + 2}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="radio"
        options={{
          title: 'رادیو',
          tabBarIcon: ({ size, color, focused }) => (
            <Radio
              size={size + 2}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      {/* صفحه های مخفی */}
      <Tabs.Screen
        name="posts"
        options={{
          title: 'پست ها',
          href: null, // این باعث میشه توی تب‌بار نمایش داده نشه
        }}
      />
      <Tabs.Screen
        name="auth/login"
        options={{
          title: 'ورود',
          href: null,
        }}
      />
      <Tabs.Screen
        name="auth/signup"
        options={{
          title: 'ثبت نام',
          href: null,
        }}
      />
      <Tabs.Screen
        name="r"
        options={{
          title: 'روتر',
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  androidBarBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
});