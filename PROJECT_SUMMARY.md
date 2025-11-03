# BeautifulApp - اپلیکیشن زیبا

یک اپلیکیشن React Native زیبا با Expo که با JavaScript ساخته شده است.

## ویژگی‌ها

### 🎨 طراحی زیبا
- Material Design 3 با رنگ‌های سفارشی
- انیمیشن‌های جذاب و روان
- طراحی ریسپانسیو

### 🔐 احراز هویت
- ورود/ثبت نام با Supabase
- احراز هویت بیومتریک (اثر انگشت)
- مدیریت session امن

### 📱 صفحات اصلی

#### Onboarding
- ۳ صفحه معرفی با انیمیشن
- Hero animations
- Swipe support

#### Home (خانه)
- فید پست‌ها با تصاویر
- Pull-to-refresh
- لایک و کامنت
- انیمیشن برای هر پست

#### Search (جستجو)
- جستجو با پیشنهادات
- فیلترهای دسته‌بندی
- Grid view
- Modal برای فیلترها

#### Profile (پروفایل)
- نمایش اطلاعات کاربر
- آمار (پست، فالوور، فالوینگ)
- ویرایش پروفایل
- گالری پست‌ها

#### Chat (گفتگو)
- پیام‌های real-time
- Typing indicator
- Bubble animations
- ارسال پیام

#### Settings (تنظیمات)
- حالت تاریک
- مدیریت اعلان‌ها
- تنظیمات حریم خصوصی
- خروج از حساب

### 🗄️ پایگاه داده
- Supabase برای ذخیره‌سازی
- جداول: profiles, posts, messages
- Row Level Security (RLS)
- Auto profile creation

## تکنولوژی‌ها

- **Framework:** Expo (SDK 54)
- **Language:** JavaScript
- **Navigation:** Expo Router
- **Database:** Supabase
- **Styling:** React Native StyleSheet
- **Animations:** react-native-animatable
- **Icons:** Lucide React Native
- **Gradients:** expo-linear-gradient
- **Auth:** expo-local-authentication

## نصب و اجرا

```bash
# نصب dependencies
npm install

# اجرا در حالت development
npm run dev

# Build برای production
npm run build
```

## ساختار پروژه

```
project/
├── app/                    # Routing و صفحات
│   ├── (tabs)/            # Tab navigation
│   ├── auth/              # صفحات احراز هویت
│   ├── _layout.jsx        # Layout اصلی
│   └── index.jsx          # Loading screen
├── screens/               # کامپوننت‌های صفحات
│   ├── OnboardingScreen.jsx
│   ├── LoginScreen.jsx
│   ├── SignupScreen.jsx
│   ├── HomeScreen.jsx
│   ├── SearchScreen.jsx
│   ├── ProfileScreen.jsx
│   ├── ChatScreen.jsx
│   └── SettingsScreen.jsx
├── contexts/              # Context providers
│   └── AuthContext.js
├── constants/             # تنظیمات ثابت
│   └── theme.js
├── utils/                 # توابع کمکی
│   └── supabase.js
└── components/            # کامپوننت‌های قابل استفاده مجدد

```

## رنگ‌های Material Design 3

- Primary: #3F51B5 (Indigo)
- Secondary: #9C27B0 (Purple)
- Accent: #FF4081 (Pink)
- Error: #F44336 (Red)
- Success: #4CAF50 (Green)

## Features پیشرفته

- ✅ Offline support (آماده برای پیاده‌سازی)
- ✅ Biometric authentication
- ✅ Pull-to-refresh
- ✅ Infinite scroll (آماده)
- ✅ Image loading با Picsum
- ✅ Smooth animations
- ✅ Form validation
- ✅ Error handling

## نسخه

1.0.0

## توسعه‌دهنده

ساخته شده با ❤️ برای Bolt.new
