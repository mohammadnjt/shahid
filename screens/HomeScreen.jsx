// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   RefreshControl,
//   Dimensions,
//   ImageBackground,
//   Platform,
// } from 'react-native';
// import { useState, useEffect } from 'react';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as Animatable from 'react-native-animatable';
// import { BlurView } from 'expo-blur';
// import bg from '../assets/images/islamic-background.jpg'; // پس‌زمینه‌ی جدید
// import {
//   colors,
//   spacing,
//   typography,
//   borderRadius,
//   shadows,
// } from '../constants/theme';
// import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react-native';

// const { width } = Dimensions.get('window');

// export default function HomeScreen() {
//   const [posts, setPosts] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [likedPosts, setLikedPosts] = useState(new Set());

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const fetchPosts = async () => {
//     try {
//       const response = await fetch(
//         'https://jsonplaceholder.typicode.com/photos?_limit=20'
//       );
//       const data = await response.json();
//       const formattedPosts = data.map((item) => ({
//         id: item.id,
//         image: `https://picsum.photos/400/300?random=${item.id}`,
//         title: item.title,
//         likes: Math.floor(Math.random() * 1000),
//         comments: Math.floor(Math.random() * 100),
//       }));
//       setPosts(formattedPosts);
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchPosts();
//     setRefreshing(false);
//   };

//   const handleLike = (postId) => {
//     setLikedPosts((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(postId)) {
//         newSet.delete(postId);
//       } else {
//         newSet.add(postId);
//       }
//       return newSet;
//     });
//   };

//   const renderPost = ({ item, index }) => {
//     const isLiked = likedPosts.has(item.id);

//     return (
//       <Animatable.View
//         animation="fadeInUp"
//         delay={index * 80}
//         duration={500}
//         style={styles.postCard}
//       >
//         <LinearGradient
//           colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.05)']}
//           style={styles.postCardOverlay}
//         >
//           <Image source={{ uri: item.image }} style={styles.postImage} />

//           <LinearGradient
//             colors={['transparent', 'rgba(0,0,0,0.75)']}
//             style={styles.postGradient}
//           >
//             <Text style={styles.postTitle} numberOfLines={2}>
//               {item.title}
//             </Text>
//           </LinearGradient>

//           <BlurView
//             tint="dark"
//             intensity={30}
//             style={styles.postActionsBlur}
//           >
//             <View style={styles.postActions}>
//               <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={() => handleLike(item.id)}
//                 activeOpacity={0.8}
//               >
//                 <Animatable.View
//                   animation={isLiked ? 'bounceIn' : undefined}
//                   duration={300}
//                 >
//                   <Heart
//                     size={24}
//                     color={isLiked ? colors.error : colors.textLight}
//                     fill={isLiked ? colors.error : 'transparent'}
//                   />
//                 </Animatable.View>
//                 <Text
//                   style={[
//                     styles.actionText,
//                     isLiked && styles.likedText,
//                   ]}
//                 >
//                   {item.likes + (isLiked ? 1 : 0)}
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
//                 <MessageCircle size={24} color={colors.textLight} />
//                 <Text style={styles.actionText}>{item.comments}</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
//                 <Share2 size={24} color={colors.textLight} />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.actionButton, styles.bookmarkButton]}
//                 activeOpacity={0.8}
//               >
//                 <Bookmark size={24} color={colors.textLight} />
//               </TouchableOpacity>
//             </View>
//           </BlurView>
//         </LinearGradient>
//       </Animatable.View>
//     );
//   };

//   return (
//     <ImageBackground source={bg} style={styles.background} resizeMode="cover">
//       <LinearGradient
//         colors={['rgba(15, 15, 15, 0.92)', 'rgba(5, 5, 5, 0.96)']}
//         style={styles.overlay}
//       >
//         <View style={styles.container}>
//           <BlurView tint="dark" intensity={60} style={styles.headerBlur}>
//             <LinearGradient
//               colors={['rgba(212, 175, 55, 0.08)', 'rgba(0, 0, 0, 0.3)']}
//               style={styles.header}
//             >
//               <Text style={styles.headerTitle}>خانه</Text>
//               <Text style={styles.headerSubtitle}>
//                 جدیدترین مطالب معنوی و مذهبی
//               </Text>
//             </LinearGradient>
//           </BlurView>

//           <FlatList
//             data={posts}
//             renderItem={renderPost}
//             keyExtractor={(item) => item.id.toString()}
//             contentContainerStyle={styles.listContent}
//             refreshControl={
//               <RefreshControl
//                 refreshing={refreshing}
//                 onRefresh={onRefresh}
//                 tintColor="#D4AF37"
//                 colors={['#D4AF37']}
//               />
//             }
//             showsVerticalScrollIndicator={false}
//           />
//         </View>
//       </LinearGradient>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//   },
//   overlay: {
//     flex: 1,
//     paddingTop: Platform.OS === 'android' ? spacing.lg : spacing.xl,
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: spacing.lg,
//   },
//   headerBlur: {
//     borderRadius: borderRadius.xl,
//     overflow: 'hidden',
//     marginBottom: spacing.lg,
//   },
//   header: {
//     paddingVertical: spacing.xl,
//     paddingHorizontal: spacing.lg,
//     borderRadius: borderRadius.xl,
//     borderWidth: 1,
//     borderColor: 'rgba(212, 175, 55, 0.25)',
//   },
//   headerTitle: {
//     ...typography.h2,
//     color: colors.textLight,
//     marginBottom: spacing.xs,
//     textShadowColor: 'rgba(0, 0, 0, 0.4)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 8,
//   },
//   headerSubtitle: {
//     ...typography.body,
//     color: 'rgba(255, 255, 255, 0.7)',
//   },
//   listContent: {
//     paddingBottom: spacing.xxl * 2,
//   },
//   postCard: {
//     borderRadius: borderRadius.lg,
//     marginBottom: spacing.xl,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: 'rgba(212, 175, 55, 0.15)',
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//     ...shadows.large,
//   },
//   postCardOverlay: {
//     borderRadius: borderRadius.lg,
//     overflow: 'hidden',
//   },
//   postImage: {
//     width: '100%',
//     height: width * 0.6,
//     resizeMode: 'cover',
//   },
//   postGradient: {
//     position: 'absolute',
//     bottom: 70,
//     left: 0,
//     right: 0,
//     paddingHorizontal: spacing.lg,
//     paddingBottom: spacing.lg,
//   },
//   postTitle: {
//     ...typography.h4,
//     color: colors.textLight,
//     textShadowColor: 'rgba(0, 0, 0, 0.45)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 6,
//   },
//   postActionsBlur: {
//     overflow: 'hidden',
//   },
//   postActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: spacing.md,
//     paddingHorizontal: spacing.lg,
//     backgroundColor: 'rgba(10, 10, 10, 0.45)',
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: spacing.lg,
//   },
//   actionText: {
//     marginLeft: spacing.xs,
//     color: colors.textLight,
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   likedText: {
//     color: colors.error,
//   },
//   bookmarkButton: {
//     marginLeft: 'auto',
//   },
// });

import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl, Dimensions, ImageBackground } from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react-native';
import bg from '../assets/images/islamic-background.jpg';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=20');
      const data = await response.json();
      const formattedPosts = data.map(item => ({
        id: item.id,
        image: `https://picsum.photos/400/300?random=${item.id}`,
        title: item.title,
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
      }));
      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const renderPost = ({ item, index }) => {
    const isLiked = likedPosts.has(item.id);

    return (
      <Animatable.View
        animation="fadeInUp"
        delay={index * 100}
        duration={600}
        style={styles.postCard}
      >
        <Image source={{ uri: item.image }} style={styles.postImage} />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.postGradient}
        >
          <Text style={styles.postTitle} numberOfLines={2}>
            {item.title}
          </Text>
        </LinearGradient>

        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}
          >
            <Animatable.View
              animation={isLiked ? 'bounceIn' : undefined}
              duration={300}
            >
              <Heart
                size={24}
                color={isLiked ? '#FF6B6B' : colors.textLight}
                fill={isLiked ? '#FF6B6B' : 'none'}
              />
            </Animatable.View>
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              {item.likes + (isLiked ? 1 : 0)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={24} color={colors.textLight} />
            <Text style={styles.actionText}>{item.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={24} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.bookmarkButton]}>
            <Bookmark size={24} color={colors.textLight} />
          </TouchableOpacity>
        </View>
      </Animatable.View>
    );
  };

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
          <Text style={styles.headerTitle}>خانه</Text>
        </LinearGradient>
      </Animatable.View>

      {/* Content */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.textLight}
            colors={[colors.textLight]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
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
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textLight,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  listContent: {
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  postCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
  postImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  postGradient: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  postTitle: {
    ...typography.h4,
    color: colors.textLight,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionText: {
    marginLeft: spacing.xs,
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
  likedText: {
    color: '#FF6B6B',
  },
  bookmarkButton: {
    marginLeft: 'auto',
    marginRight: 0,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
  },
});