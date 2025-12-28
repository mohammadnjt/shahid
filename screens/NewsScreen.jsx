import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, ActivityIndicator,
  Dimensions, FlatList, RefreshControl, Share, Platform, TouchableOpacity, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Eye, Share2, Bookmark, Clock, Flame } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { bgImage } from '../utils/config';
import { api } from '../utils/api';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const colors = {
  textLight: '#FFFFFF',
  primary: '#D4AF37',
  textGray: '#CCCCCC',
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
const typography = {
  h2: { fontSize: 22 },
  h1: { fontSize: 20 },
  body: { fontSize: 14 },
  caption: { fontSize: 12 },
};
const borderRadius = { lg: 14, md: 10 };

export default function BlogReelsScreen() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  // Progress bar
  const progressAnim = useRef(new Animated.Value(0)).current;

  // For safe access in interval
  const currentIndexRef = useRef(0);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  const cleanText = (txt = '') =>
    txt.replace(/<br\s*\/?>/gi, '\n').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

  const isBreaking = (title = '') =>
    title.includes('فوری') || title.includes('#خبر_فوری') || title.includes('خبر_فوری');

  const getImageUri = (id) => `https://cdn.shahid-moqavemat.ir/news_${id}.jpg`;

  useEffect(() => {
    fetchBlogs(true);
  }, []);

  const fetchBlogs = async (reset = false) => {
    if (reset) setLoading(true);
    try {
      const res = await api.getBlog(0);
      if (res.status === 1 && Array.isArray(res.list)) {
        const mapped = res.list.map(item => ({
          id: item.id,
          title: item.title || '',
          dis: cleanText(item.dis || ''),
          date: item.date || '',
          dir: item.dir || 'rtl',
          image: getImageUri(item.id),
        }));
        setBlogs(mapped);
        setCurrentIndex(0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBlogs(true);
  };

  const handleShare = async (item) => {
    try {
      await Share.share({
        message: `${item.title}\n\n${item.dis.slice(0, 200)}...`,
      });
    } catch (e) {
      console.error('Share error', e);
    }
  };

  const toggleBookmark = (id) => {
    setBookmarks(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const goToIndex = (idx) => {
    if (!blogs.length) return;
    const safeIdx = Math.max(0, Math.min(idx, blogs.length - 1));
    flatListRef.current?.scrollToIndex({ index: safeIdx, animated: true });
    setCurrentIndex(safeIdx);
  };

  // Auto-advance every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentIndexRef.current + 1) % Math.max(blogs.length, 1);
      goToIndex(next);
    }, 10000);
    return () => clearInterval(interval);
  }, [blogs.length]);

  // Progress bar animation reset on index change
  useEffect(() => {
    progressAnim.stopAnimation();
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, progressAnim]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) {
      const newIndex = viewableItems[0].index ?? 0;
      setCurrentIndex(newIndex);
    }
  }).current;
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 60 });

  const renderItem = ({ item }) => (
    <View style={styles.slideContainer}>
      <ImageBackground source={{ uri: item.image }} style={styles.media} resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,0,0,0.65)', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.7)']}
          style={styles.mediaOverlay}
        >
          {/* Progress bar on top of this item */}
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: progressAnim.interpolate({ inputRange: [0,1], outputRange: ['0%', '100%'] }) }
              ]}
            />
          </View>

          <View style={styles.topChips}>
            <View style={styles.dateChip}>
              <Clock size={14} color={colors.textLight} />
              <Text style={styles.dateText}>{item.date || '---'}</Text>
            </View>
            {isBreaking(item.title) && (
              <View style={styles.breakingChip}>
                <Flame size={14} color="#FFB347" />
                <Text style={styles.breakingText}>خبر فوری</Text>
              </View>
            )}
          </View>

          <Animatable.View animation="fadeInUp" delay={120} style={styles.textBlock}>
            <Text
              style={[
                styles.title,
                { textAlign: item.dir === 'rtl' ? 'right' : 'left', writingDirection: item.dir }
              ]}
              numberOfLines={3}
            >
              {item.title}
            </Text>
            {item.dis ? (
              <Text
                style={[
                  styles.excerpt,
                  { textAlign: item.dir === 'rtl' ? 'right' : 'left', writingDirection: item.dir }
                ]}
                numberOfLines={5}
              >
                {item.dis}
              </Text>
            ) : null}

            <View style={styles.footer}>
              <View style={styles.footerLeft}>
                <Eye size={16} color={colors.textGray} />
                <Text style={styles.footerText}>—</Text>
              </View>
              <View style={styles.footerActions}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => handleShare(item)}
                  activeOpacity={0.7}
                >
                  <Share2 size={18} color={colors.textLight} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.iconBtn,
                    bookmarks.has(item.id) && styles.iconBtnActive
                  ]}
                  onPress={() => toggleBookmark(item.id)}
                  activeOpacity={0.7}
                >
                  <Bookmark
                    size={18}
                    color={bookmarks.has(item.id) ? colors.primary : colors.textLight}
                    fill={bookmarks.has(item.id) ? colors.primary : 'none'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.readMoreBtn}
                  onPress={() => router.push(`/blog/${item.id}`)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.readMoreText}>جزئیات</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animatable.View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );

  if (loading && blogs.length === 0) {
    return (
      <ImageBackground source={bgImage} style={styles.container} resizeMode="cover">
        <View style={styles.overlay} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>در حال بارگذاری...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={bgImage} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <FlatList
        ref={flatListRef}
        data={blogs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        horizontal={false}      // عمودی
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT} // اسنپ روی صفحه کامل
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.textLight}
            colors={[colors.textLight]}
          />
        }
        onScrollBeginDrag={() => {
          // ریست تایمر و نوار پیشرفت هنگام اسکرول کاربر
          progressAnim.stopAnimation();
          progressAnim.setValue(0);
          Animated.timing(progressAnim, {
            toValue: 1,
            duration: 10000,
            useNativeDriver: false,
          }).start();
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingBottom: Platform.OS === 'android' ? 20 : 10, 
    backgroundColor: '#000' 
  },
  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.35)' 
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  media: { flex: 1 },
  mediaOverlay: { 
    flex: 1, 
    padding: spacing.lg, 
    justifyContent: 'flex-end' 
  },
  progressBarContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 50,
    left: spacing.lg,
    right: spacing.lg,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  topChips: { 
    position: 'absolute', 
    top: Platform.OS === 'android' ? 52 : 62, 
    left: spacing.lg, 
    right: spacing.lg, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  dateText: { ...typography.caption, color: colors.textLight },
  breakingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255,120,80,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,180,120,0.4)',
  },
  breakingText: { ...typography.caption, color: '#FFB347', fontWeight: '700' },
  textBlock: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    gap: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.textLight,
    fontWeight: '800',
    lineHeight: 28,
  },
  excerpt: {
    ...typography.body,
    color: colors.textGray,
    lineHeight: 22,
  },
  footer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginTop: spacing.sm 
  },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  footerText: { ...typography.caption, color: colors.textGray },
  footerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  iconBtnActive: { 
    backgroundColor: 'rgba(212,175,55,0.25)', 
    borderColor: 'rgba(212,175,55,0.5)' 
  },
  readMoreBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.6)',
    backgroundColor: 'rgba(212,175,55,0.2)',
  },
  readMoreText: { ...typography.caption, color: colors.textLight, fontWeight: '700' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  loadingText: { color: colors.textLight },
});