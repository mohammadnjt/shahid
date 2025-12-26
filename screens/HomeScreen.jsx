import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl, ImageBackground, useWindowDimensions, Platform } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react-native';

// تنظیمات
const SPACING = 10;
const MIN_COLUMN_WIDTH = 200; // حداقل عرض هر ستون
const MAX_COLUMN_WIDTH = 350; // حداکثر عرض هر ستون

// باید به جای این خط، فایل bg خودت رو import کنی
// import bg from '../assets/images/islamic-background.jpg';
const bg = { uri: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=800' };

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
  lg: 12,
};

export default function HomeScreen() {
  const windowDimensions = useWindowDimensions();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [columns, setColumns] = useState([]);

  // ✅ محاسبه دینامیک تعداد ستون‌ها بر اساس عرض صفحه
  const columnConfig = useMemo(() => {
    const availableWidth = windowDimensions.width - (SPACING * 2);
    
    // محاسبه تعداد ستون‌های ایده‌آل
    let columnCount = Math.floor(availableWidth / MIN_COLUMN_WIDTH);
    columnCount = Math.max(2, Math.min(columnCount, 6)); // حداقل 2، حداکثر 6 ستون
    
    // محاسبه عرض واقعی هر ستون
    const totalSpacing = SPACING * (columnCount + 1);
    const columnWidth = (availableWidth - totalSpacing + SPACING) / columnCount;
    
    // اگر عرض از حد مجاز بیشتر شد، تعداد ستون‌ها رو زیاد کن
    if (columnWidth > MAX_COLUMN_WIDTH && columnCount < 6) {
      columnCount++;
      const newTotalSpacing = SPACING * (columnCount + 1);
      const newColumnWidth = (availableWidth - newTotalSpacing + SPACING) / columnCount;
      return { columnCount, columnWidth: newColumnWidth };
    }
    
    return { columnCount, columnWidth };
  }, [windowDimensions.width]);

  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ هر وقت عرض صفحه یا تعداد ستون‌ها تغییر کرد، دوباره بچین
  useEffect(() => {
    if (posts.length > 0) {
      redistributeColumns(posts);
    }
  }, [columnConfig.columnCount, posts.length]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=30');
      const data = await response.json();
      const formattedPosts = data.map(item => ({
        id: item.id,
        image: `https://picsum.photos/400/${Math.floor(Math.random() * 200) + 250}?random=${item.id}`,
        title: item.title,
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        height: Math.floor(Math.random() * 150) + 200, // 200-350
      }));
      
      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // ✅ توزیع مجدد به ستون‌های دینامیک
  const redistributeColumns = (postsData) => {
    const { columnCount } = columnConfig;
    const newColumns = Array.from({ length: columnCount }, () => []);
    const columnHeights = Array(columnCount).fill(0);
    
    postsData.forEach(post => {
      // پیدا کردن کوتاه‌ترین ستون
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      newColumns[shortestColumnIndex].push(post);
      columnHeights[shortestColumnIndex] += post.height;
    });
    
    setColumns(newColumns);
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

  const renderPost = (item, index) => {
    const isLiked = likedPosts.has(item.id);
    
    return (
      <Animatable.View
        key={item.id}
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
              onPress={() => handleLike(item.id)}
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

            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle size={18} color={colors.textLight} />
              <Text style={styles.actionText}>{item.comments}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={18} color={colors.textLight} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.bookmarkButton]}>
              <Bookmark size={18} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animatable.View>
    );
  };

  return (
    <ImageBackground
      source={bg}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      
      {/* Header */}
      <Animatable.View animation="fadeInDown" style={styles.header}>
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)']}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>خانه</Text>
          {/* نمایش تعداد ستون‌ها برای دیباگ */}
          {/* <Text style={styles.debugText}>
            {columnConfig.columnCount} ستون - عرض: {Math.round(columnConfig.columnWidth)}px
          </Text> */}
        </LinearGradient>
      </Animatable.View>

      {/* Masonry Layout */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
    paddingTop: Platform.OS === 'android' ? 70 : 50,
    // paddingTop: 50,
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
    margin: 'auto',
    bottom: Platform.OS === 'android' ? -10 : 0,
    ...typography.h2,
    color: colors.textLight,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  debugText: {
    color: colors.textLight,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 5,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING,
  },
  masonryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING, // فاصله بین ستون‌ها
  },
  column: {
    // width به صورت دینامیک اعمال می‌شه
  },
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
});
