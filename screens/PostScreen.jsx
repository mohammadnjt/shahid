import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl, ImageBackground, useWindowDimensions, Platform, ActivityIndicator } from 'react-native';
import { useState, useEffect, useMemo, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Heart, Eye, Share2, Bookmark, ArrowUp, ArrowDown, Filter, ArrowLeft } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { bgImage } from '../utils/config';
import {api} from '../utils/api';

// تنظیمات
const SPACING = 10;
const MIN_COLUMN_WIDTH = 200;
const MAX_COLUMN_WIDTH = 350;
const SCROLL_THRESHOLD = 200; // فاصله از انتها برای بارگذاری

const colors = {
  textLight: '#FFFFFF',
  primary: '#D4AF37',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

const typography = {
  h2: { fontSize: 28 },
  h4: { fontSize: 16 },
};

const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
};

export default function PostScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef(null);

  const windowDimensions = useWindowDimensions();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // pagination & filter states
  const [currentPage, setCurrentPage] = useState(0);
  const [sortType, setSortType] = useState(0); // 0: جدیدترین، 1: محبوب‌ترین، 2: پربازدیدترین
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortOptions = [
    { value: 0, label: 'جدیدترین' },
    { value: 1, label: 'محبوب‌ترین' },
    { value: 2, label: 'پربازدیدترین' },
  ];

  // محاسبه دینامیک تعداد ستون‌ها
  const columnConfig = useMemo(() => {
    const availableWidth = windowDimensions.width - (SPACING * 2);
    let columnCount = Math.floor(availableWidth / MIN_COLUMN_WIDTH);
    columnCount = Math.max(2, Math.min(columnCount, 6));
    
    const totalSpacing = SPACING * (columnCount + 1);
    const columnWidth = (availableWidth - totalSpacing + SPACING) / columnCount;
    
    if (columnWidth > MAX_COLUMN_WIDTH && columnCount < 6) {
      columnCount++;
      const newTotalSpacing = SPACING * (columnCount + 1);
      const newColumnWidth = (availableWidth - newTotalSpacing + SPACING) / columnCount;
      return { columnCount, columnWidth: newColumnWidth };
    }
    
    return { columnCount, columnWidth };
  }, [windowDimensions.width]);

  // دریافت ابعاد واقعی تصویر
  const getImageDimensions = (uri) => {
    return new Promise((resolve) => {
      Image.getSize(
        uri,
        (width, height) => {
          resolve({ width, height });
        },
        (error) => {
          console.error('Error getting image size:', error);
          resolve({ width: 1, height: 1.5 });
        }
      );
    });
  };

  useEffect(() => {
    fetchPosts(true);
  }, [params.q, sortType]);

  useEffect(() => {
    if (posts.length > 0) {
      redistributeColumns(posts);
    }
  }, [columnConfig.columnCount, posts.length]);

  const fetchPosts = async (reset = false) => {
    if (!hasMore && !reset) return;
    
    const isFirstLoad = reset || currentPage === 0;
    
    if (isFirstLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const pageToFetch = reset ? 0 : currentPage;
      const res = await api.getPost(params.q, sortType, 0, pageToFetch);
      
      console.log('res>>', res);

      if (res.status === 1) {
        // دریافت ابعاد واقعی تمام تصاویر
        const postsWithDimensions = await Promise.all(
          res.list.map(async (item) => {
            const dimensions = await getImageDimensions(item.img);
            const aspectRatio = dimensions.height / dimensions.width;
            const calculatedHeight = Math.floor(columnConfig.columnWidth * aspectRatio);
            
            return {
              id: item.id,
              image: item.img,
              title: item.tit,
              likes: item.like,
              views: item.view,
              height: calculatedHeight,
              originalWidth: dimensions.width,
              originalHeight: dimensions.height
            };
          })
        );

        if (reset) {
          setPosts(postsWithDimensions);
          setCurrentPage(1);
        } else {
          setPosts(prev => [...prev, ...postsWithDimensions]);
          setCurrentPage(prev => prev + 1);
        }

        // اگر تعداد پست‌های دریافتی کمتر از تعداد مورد انتظار باشد، به پایان رسیده‌ایم
        setHasMore(res.list.length > 0);
      } else {
        console.error('Failed to fetch posts:', res.message);
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const redistributeColumns = (postsData) => {
    const { columnCount } = columnConfig;
    const newColumns = Array.from({ length: columnCount }, () => []);
    const columnHeights = Array(columnCount).fill(0);
    
    postsData.forEach(post => {
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      newColumns[shortestColumnIndex].push(post);
      columnHeights[shortestColumnIndex] += post.height;
    });
    
    setColumns(newColumns);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    await fetchPosts(true);
    setRefreshing(false);
  };

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
    
    if (distanceFromBottom < SCROLL_THRESHOLD && !loadingMore && hasMore) {
      fetchPosts(false);
    }
  };

  const handleSortChange = (newSort) => {
    if (newSort !== sortType) {
      setSortType(newSort);
      setCurrentPage(0);
      setHasMore(true);
      setShowSortMenu(false);
    }
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

  const renderPost = (item, index) => {
    const isLiked = likedPosts.has(item.id);
    
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.9}
        onPress={() => {
          router.replace(`/r?r=post&postId=${item.id}`);
        }}
      >
        <Animatable.View
          animation="fadeInUp"
          delay={index * 30}
          duration={500}
          style={[styles.postCard, { height: item.height }]}
        >
          <Image 
            source={{ uri: item.image }} 
            style={styles.postImage}
            resizeMode="cover"
          />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.postGradient}
          >
            <Text style={styles.postTitle} numberOfLines={2}>
              {item.title}
            </Text>
            
            <View style={styles.postActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleLike(item.id);
                }}
              >
                <Animatable.View
                  animation={isLiked ? 'bounceIn' : undefined}
                  duration={300}
                >
                  <Heart
                    size={18}
                    color={isLiked ? '#FF6B6B' : colors.textLight}
                    fill={isLiked ? '#FF6B6B' : 'none'}
                  />
                </Animatable.View>
                <Text style={[styles.actionText, isLiked && styles.likedText]}>
                  {item.likes + (isLiked ? 1 : 0)}
                </Text>
              </TouchableOpacity>

              <View style={styles.actionButton}>
                <Eye size={16} color={colors.textLight} />
                <Text style={styles.actionText}>{item.views}</Text>
              </View>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={(e) => e.stopPropagation()}
              >
                <Share2 size={18} color={colors.textLight} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.bookmarkButton]}
                onPress={(e) => e.stopPropagation()}
              >
                <Bookmark size={18} color={colors.textLight} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animatable.View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={bgImage}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['rgba(0,0,0,0.95)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)', 'transparent']}
          style={styles.headerGradient}
          locations={[0, 0.5, 0.8, 1]}
        >
          <Animatable.View animation="fadeInDown" style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <ArrowLeft size={24} color={colors.textLight} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>پست ها</Text>
            <View style={{ width: 40 }} />
          </Animatable.View>
        </LinearGradient>
      </View>
      {/* <Animatable.View animation="fadeInDown" style={styles.header}>
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>پست‌ها</Text>
            

            <TouchableOpacity
              style={styles.sortButton}
              onPress={() => setShowSortMenu(!showSortMenu)}
            >
              <Filter size={20} color={colors.textLight} />
              <Text style={styles.sortButtonText}>
                {sortOptions.find(opt => opt.value === sortType)?.label}
              </Text>
            </TouchableOpacity>
          </View>


          {showSortMenu && (
            <Animatable.View 
              animation="fadeInDown"
              duration={200}
              style={styles.sortMenu}
            >
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.sortMenuItem,
                    sortType === option.value && styles.sortMenuItemActive
                  ]}
                  onPress={() => handleSortChange(option.value)}
                >
                  <Text style={[
                    styles.sortMenuText,
                    sortType === option.value && styles.sortMenuTextActive
                  ]}>
                    {option.label}
                  </Text>
                  {sortType === option.value && (
                    <View style={styles.sortMenuIndicator} />
                  )}
                </TouchableOpacity>
              ))}
            </Animatable.View>
          )}
        </LinearGradient>
      </Animatable.View> */}

      {/* Masonry Layout */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.textLight}
            colors={[colors.textLight]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading && posts.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>در حال بارگذاری...</Text>
          </View>
        ) : (
          <>
            <View style={styles.masonryContainer}>
              {columns.map((columnPosts, columnIndex) => (
                <View 
                  key={columnIndex} 
                  style={[styles.column, { width: columnConfig.columnWidth }]}
                >
                  {columnPosts.map((item, index) => renderPost(item, index))}
                </View>
              ))}
            </View>

            {/* Loading More Indicator */}
            {loadingMore && (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingMoreText}>بارگذاری بیشتر...</Text>
              </View>
            )}

            {/* End of List */}
            {!hasMore && posts.length > 0 && (
              <View style={styles.endOfListContainer}>
                <Text style={styles.endOfListText}>
                  تمام پست‌ها نمایش داده شد
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Scroll to Top Button */}
      {posts.length > 10 && (
        <TouchableOpacity
          style={styles.scrollTopButton}
          onPress={() => scrollViewRef.current?.scrollTo({ y: 0, animated: true })}
        >
          <LinearGradient
            colors={['rgba(212, 175, 55, 0.9)', 'rgba(212, 175, 55, 0.7)']}
            style={styles.scrollTopGradient}
          >
            <ArrowUp size={24} color={colors.textLight} />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Platform.OS === 'android' ? 60: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  headerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      elevation: 10,
    },
    headerGradient: {
      paddingTop: Platform.OS === 'android' ? 40 : 50,
      paddingBottom: spacing.xl,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
    headerTitle: {
      fontSize: 20,
      color: '#fff',
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
      margin: 'auto',
    },
    
  // header: {
  //   paddingTop: Platform.OS === 'android' ? 70 : 50,
  //   paddingBottom: spacing.lg,
  //   paddingHorizontal: spacing.lg,
  //   borderBottomLeftRadius: borderRadius.lg,
  //   borderBottomRightRadius: borderRadius.lg,
  //   overflow: 'hidden',
  // },
  // headerGradient: {
  //   ...StyleSheet.absoluteFillObject,
  // },
  // headerContent: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginBottom: spacing.sm,
  // },
  // headerTitle: {
  //   ...typography.h2,
  //   color: colors.textLight,
  //   fontWeight: 'bold',
  // },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sortButtonText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
  sortMenu: {
    marginTop: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  sortMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sortMenuItemActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  sortMenuText: {
    color: colors.textLight,
    fontSize: 16,
  },
  sortMenuTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  sortMenuIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 90 : 50, // فاصله از هدر
  },
  scrollContent: {
    padding: SPACING,
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    color: colors.textLight,
    marginTop: spacing.md,
    fontSize: 16,
  },
  masonryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING,
  },
  column: {},
  postCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.lg,
    marginBottom: SPACING,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
    height: '100%',
    position: 'absolute',
  },
  postGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
    justifyContent: 'flex-end',
    minHeight: 100,
  },
  postTitle: {
    ...typography.h4,
    color: colors.textLight,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: spacing.xs,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  actionText: {
    marginLeft: 4,
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
  likedText: {
    color: '#FF6B6B',
  },
  bookmarkButton: {
    marginLeft: 'auto',
    marginRight: 0,
    backgroundColor: 'rgba(212, 175, 55, 0.4)',
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  loadingMoreText: {
    color: colors.textLight,
    fontSize: 14,
  },
  endOfListContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  endOfListText: {
    color: colors.textLight,
    fontSize: 14,
    opacity: 0.7,
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 100 : 120,
    left: spacing.lg,
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollTopGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
  },
});