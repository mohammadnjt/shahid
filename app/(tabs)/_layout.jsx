// import { Tabs } from 'expo-router';
// import { colors } from '../../constants/theme';
// import { Home, Search, User, MessageCircle, Settings } from 'lucide-react-native';

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: colors.primary,
//         tabBarInactiveTintColor: colors.textSecondary,
//         tabBarStyle: {
//           backgroundColor: colors.surface,
//           borderTopColor: colors.border,
//           borderTopWidth: 1,
//           height: 70,
//           paddingBottom: 8,
//           paddingTop: 8,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: '600',
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'خانه',
//           tabBarIcon: ({ size, color }) => (
//             <Home size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="search"
//         options={{
//           title: 'جستجو',
//           tabBarIcon: ({ size, color }) => (
//             <Search size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'پروفایل',
//           tabBarIcon: ({ size, color }) => (
//             <User size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="chat"
//         options={{
//           title: 'گفتگو',
//           tabBarIcon: ({ size, color }) => (
//             <MessageCircle size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="settings"
//         options={{
//           title: 'تنظیمات',
//           tabBarIcon: ({ size, color }) => (
//             <Settings size={size} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

import { Tabs } from 'expo-router';
import { Home, Search, User, MessageCircle, Radio } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
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
          title: 'پروفایل',
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
        name="chat"
        options={{
          title: 'گفتگو',
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
    </Tabs>
  );
}

const styles = StyleSheet.create({
  androidBarBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
});
// import { Tabs } from 'expo-router';
// import { colors } from '../../constants/theme';
// import { Home, Search, User, MessageCircle, Settings } from 'lucide-react-native';
// import { BlurView } from 'expo-blur';
// import { StyleSheet, Platform } from 'react-native';

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: '#D4AF37',
//         tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
//         tabBarStyle: {
//           position: 'absolute',
//           backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(0, 0, 0, 0.7)',
//           borderTopWidth: 0,
//           elevation: 0,
//           height: 80,
//           paddingBottom: 8,
//           paddingTop: 8,
//           borderTopLeftRadius: 20,
//           borderTopRightRadius: 20,
//           overflow: 'hidden',
//           shadowColor: '#000',
//           shadowOffset: { width: 0, height: -2 },
//           shadowOpacity: 0.1,
//           shadowRadius: 10,
//         },
//         tabBarBackground: () => (
//           Platform.OS === 'ios' ? (
//             <BlurView
//               tint="dark"
//               intensity={80}
//               style={StyleSheet.absoluteFill}
//             />
//           ) : null
//         ),
//         tabBarLabelStyle: {
//           fontSize: 11,
//           fontWeight: '700',
//           marginTop: 4,
//         },
//         tabBarItemStyle: {
//           paddingVertical: 4,
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'خانه',
//           tabBarIcon: ({ size, color, focused }) => (
//             <Home 
//               size={size + 2} 
//               color={color}
//               strokeWidth={focused ? 2.5 : 2}
//               fill={focused ? color : 'transparent'}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="search"
//         options={{
//           title: 'جستجو',
//           tabBarIcon: ({ size, color, focused }) => (
//             <Search 
//               size={size + 2} 
//               color={color}
//               strokeWidth={focused ? 2.5 : 2}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'پروفایل',
//           tabBarIcon: ({ size, color, focused }) => (
//             <User 
//               size={size + 2} 
//               color={color}
//               strokeWidth={focused ? 2.5 : 2}
//               fill={focused ? color : 'transparent'}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="chat"
//         options={{
//           title: 'گفتگو',
//           tabBarIcon: ({ size, color, focused }) => (
//             <MessageCircle 
//               size={size + 2} 
//               color={color}
//               strokeWidth={focused ? 2.5 : 2}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="settings"
//         options={{
//           title: 'تنظیمات',
//           tabBarIcon: ({ size, color, focused }) => (
//             <Settings 
//               size={size + 2} 
//               color={color}
//               strokeWidth={focused ? 2.5 : 2}
//             />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }