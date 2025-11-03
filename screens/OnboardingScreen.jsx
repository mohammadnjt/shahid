// import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// import { useState, useRef } from 'react';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as Animatable from 'react-native-animatable';
// import { useRouter } from 'expo-router';
// import { useAuth } from '../contexts/AuthContext';
// import { colors, spacing, typography, borderRadius } from '../constants/theme';
// import { Sparkles, Zap, Heart } from 'lucide-react-native';

// const { width, height } = Dimensions.get('window');

// const slides = [
//   {
//     id: 1,
//     title: 'خوش آمدید',
//     subtitle: 'به دنیای زیبای ما',
//     description: 'تجربه‌ای متفاوت از دیزاین و عملکرد',
//     icon: Sparkles,
//     colors: [colors.primary, colors.primaryDark],
//   },
//   {
//     id: 2,
//     title: 'سریع و روان',
//     subtitle: 'عملکرد بی‌نظیر',
//     description: 'انیمیشن‌های جذاب و کارایی عالی',
//     icon: Zap,
//     colors: [colors.secondary, colors.secondaryDark],
//   },
//   {
//     id: 3,
//     title: 'طراحی زیبا',
//     subtitle: 'احساسی متفاوت',
//     description: 'با Material Design 3 ساخته شده',
//     icon: Heart,
//     colors: [colors.accent, colors.error],
//   },
// ];

// export default function OnboardingScreen() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const router = useRouter();
//   const { completeOnboarding } = useAuth();
//   const viewRef = useRef(null);

//   const handleNext = async () => {
//     if (currentIndex < slides.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//       viewRef.current?.fadeInRight(500);
//     } else {
//       await completeOnboarding();
//       router.replace('/auth/login');
//     }
//   };

//   const handleSkip = async () => {
//     await completeOnboarding();
//     router.replace('/auth/login');
//   };

//   const currentSlide = slides[currentIndex];
//   const Icon = currentSlide.icon;

//   return (
//     <LinearGradient colors={currentSlide.colors} style={styles.container}>
//       <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
//         <Text style={styles.skipText}>رد کردن</Text>
//       </TouchableOpacity>

//       <Animatable.View
//         ref={viewRef}
//         animation="fadeInRight"
//         duration={500}
//         style={styles.content}
//       >
//         <View style={styles.iconContainer}>
//           <Animatable.View
//             animation="pulse"
//             iterationCount="infinite"
//             duration={2000}
//             style={styles.iconCircle}
//           >
//             <Icon size={80} color={colors.textLight} strokeWidth={1.5} />
//           </Animatable.View>
//         </View>

//         <Animatable.Text
//           animation="fadeInUp"
//           delay={200}
//           style={styles.title}
//         >
//           {currentSlide.title}
//         </Animatable.Text>

//         <Animatable.Text
//           animation="fadeInUp"
//           delay={400}
//           style={styles.subtitle}
//         >
//           {currentSlide.subtitle}
//         </Animatable.Text>

//         <Animatable.Text
//           animation="fadeInUp"
//           delay={600}
//           style={styles.description}
//         >
//           {currentSlide.description}
//         </Animatable.Text>
//       </Animatable.View>

//       <View style={styles.footer}>
//         <View style={styles.pagination}>
//           {slides.map((_, index) => (
//             <View
//               key={index}
//               style={[
//                 styles.dot,
//                 index === currentIndex && styles.dotActive,
//               ]}
//             />
//           ))}
//         </View>

//         <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
//           <LinearGradient
//             colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
//             style={styles.nextButtonGradient}
//           >
//             <Text style={styles.nextButtonText}>
//               {currentIndex === slides.length - 1 ? 'شروع کنیم' : 'بعدی'}
//             </Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   skipButton: {
//     position: 'absolute',
//     top: 50,
//     right: spacing.lg,
//     zIndex: 10,
//     padding: spacing.sm,
//   },
//   skipText: {
//     color: colors.textLight,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: spacing.xl,
//   },
//   iconContainer: {
//     marginBottom: spacing.xxl,
//   },
//   iconCircle: {
//     width: 160,
//     height: 160,
//     borderRadius: 80,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     ...typography.h1,
//     color: colors.textLight,
//     textAlign: 'center',
//     marginBottom: spacing.sm,
//   },
//   subtitle: {
//     ...typography.h3,
//     color: colors.textLight,
//     textAlign: 'center',
//     marginBottom: spacing.md,
//     opacity: 0.9,
//   },
//   description: {
//     ...typography.body1,
//     color: colors.textLight,
//     textAlign: 'center',
//     opacity: 0.8,
//     maxWidth: 300,
//   },
//   footer: {
//     paddingBottom: spacing.xxl,
//     paddingHorizontal: spacing.xl,
//   },
//   pagination: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: spacing.lg,
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     marginHorizontal: 4,
//   },
//   dotActive: {
//     width: 24,
//     backgroundColor: colors.textLight,
//   },
//   nextButton: {
//     borderRadius: borderRadius.md,
//     overflow: 'hidden',
//   },
//   nextButtonGradient: {
//     paddingVertical: spacing.md,
//     paddingHorizontal: spacing.xl,
//     alignItems: 'center',
//     borderRadius: borderRadius.md,
//     borderWidth: 2,
//     borderColor: 'rgba(255,255,255,0.3)',
//   },
//   nextButtonText: {
//     color: colors.textLight,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { Sparkles, Zap, Heart } from 'lucide-react-native';
import bg from '../assets/images/islamic-background.jpg';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'خوش آمدید',
    subtitle: 'به دنیای زیبای ما',
    description: 'تجربه‌ای متفاوت از دیزاین و عملکرد',
    icon: Sparkles,
    colors: ['rgba(212, 175, 55, 0.8)', 'rgba(212, 175, 55, 0.4)'],
  },
  {
    id: 2,
    title: 'سریع و روان',
    subtitle: 'عملکرد بی‌نظیر',
    description: 'انیمیشن‌های جذاب و کارایی عالی',
    icon: Zap,
    colors: ['rgba(76, 175, 80, 0.8)', 'rgba(76, 175, 80, 0.4)'],
  },
  {
    id: 3,
    title: 'طراحی زیبا',
    subtitle: 'احساسی متفاوت',
    description: 'با Material Design 3 ساخته شده',
    icon: Heart,
    colors: ['rgba(156, 39, 176, 0.8)', 'rgba(156, 39, 176, 0.4)'],
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const viewRef = useRef(null);

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
      viewRef.current?.fadeInRight(500);
    } else {
      await completeOnboarding();
      router.replace('/auth/login');
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace('/auth/login');
  };

  const currentSlide = slides[currentIndex];
  const Icon = currentSlide.icon;

  return (
    <ImageBackground
      source={bg}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Overlay for better readability */}
      <View style={styles.overlay} />
      
      {/* Gradient Overlay */}
      <LinearGradient 
        colors={currentSlide.colors} 
        style={styles.gradientOverlay}
      />

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>رد کردن</Text>
      </TouchableOpacity>

      <Animatable.View
        ref={viewRef}
        animation="fadeInRight"
        duration={500}
        style={styles.content}
      >
        <View style={styles.iconContainer}>
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            duration={2000}
            style={styles.iconCircle}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.iconGradient}
            >
              <Icon size={80} color={colors.textLight} strokeWidth={1.5} />
            </LinearGradient>
          </Animatable.View>
        </View>

        <Animatable.Text
          animation="fadeInUp"
          delay={200}
          style={styles.title}
        >
          {currentSlide.title}
        </Animatable.Text>

        <Animatable.Text
          animation="fadeInUp"
          delay={400}
          style={styles.subtitle}
        >
          {currentSlide.subtitle}
        </Animatable.Text>

        <Animatable.Text
          animation="fadeInUp"
          delay={600}
          style={styles.description}
        >
          {currentSlide.description}
        </Animatable.Text>
      </Animatable.View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === slides.length - 1 ? 'شروع کنیم' : 'بعدی'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  skipText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.xxl,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    ...typography.h3,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.md,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    ...typography.body1,
    color: colors.textLight,
    textAlign: 'center',
    opacity: 0.8,
    maxWidth: 300,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.textLight,
  },
  nextButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  nextButtonGradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  nextButtonText: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});