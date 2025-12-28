// PostDetailScreen.js
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ImageBackground, 
  Platform,
  Dimensions,
  ActivityIndicator,
  Share,
  TextInput,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { 
  Heart, 
  Eye, 
  Share2, 
  Bookmark, 
  ArrowLeft,
  MessageCircle,
  Play,
  Pause,
  Send,
  User
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Video } from 'expo-av';
import { bgImage } from '@/utils/config';
import { api } from '../utils/api';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const colors = {
  textLight: '#FFFFFF',
  textGray: '#CCCCCC',
  primary: '#D4AF37',
  secondary: '#B8860B',
  danger: '#FF6B6B',
  dark: '#1a1a1a',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

const typography = {
  h1: { fontSize: 24 },
  h2: { fontSize: 20 },
  h3: { fontSize: 18 },
  body: { fontSize: 14 },
  caption: { fontSize: 12 },
};

const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export default function PostDetailScreen() {
  const router = useRouter();
  const { postId } = useLocalSearchParams();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaDimensions, setMediaDimensions] = useState({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.5 });
  
  // Comment states
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  
  const videoRef = useRef(null);
  const scrollViewRef = useRef(null);

  // مدیریت lifecycle ویدیو
  useFocusEffect(
    useCallback(() => {
      // وقتی صفحه focus می‌شود
      if (post?.typ === 3 && videoRef.current) {
        videoRef.current.playAsync();
      }

      return () => {
        // وقتی از صفحه خارج می‌شویم، ویدیو را متوقف کن
        if (videoRef.current) {
          videoRef.current.pauseAsync();
          videoRef.current.setPositionAsync(0); // بازگشت به ابتدا
        }
      };
    }, [post?.typ])
  );

  useEffect(() => {
    fetchPostDetail();
    fetchComments();

    // cleanup هنگام unmount
    return () => {
      if (videoRef.current) {
        videoRef.current.pauseAsync();
      }
    };
  }, [postId]);

  const fetchPostDetail = async () => {
    try {
      setLoading(true);
      
      const res = await api.getPostDetail(postId);
      
      if (res.status === 1 && res.list && res.list.length > 0) {
        const postData = res.list[0];
        setPost(postData);
        setLikesCount(parseInt(postData.ulike.replace(/\D/g, '')) || 0);
        
        // محاسبه ابعاد تصویر/ویدیو
        if (postData.typ === 1) {
          Image.getSize(postData.med, (width, height) => {
            calculateMediaDimensions(width, height);
          }, (error) => {
            console.error('Error getting image size:', error);
          });
        }
      } else {
        console.error('Post not found');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const res = await api.getComments(postId);
      
      if (res.status === 1 && res.list) {
        setComments(res.list);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;

    try {
      setSendingComment(true);
      const res = await api.sendComment(postId, commentText.trim());
      
      if (res.status === 1) {
        // اضافه کردن کامنت جدید به لیست
        const newComment = {
          id: Date.now().toString(),
          text: commentText.trim(),
          user: 'شما',
          date: 'همین الان',
          isOwn: true,
        };
        
        setComments(prev => [newComment, ...prev]);
        setCommentText('');
        Keyboard.dismiss();
        
        // scroll به بالا برای نمایش کامنت جدید
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }, 100);
      }
    } catch (error) {
      console.error('Error sending comment:', error);
      alert('خطا در ارسال نظر');
    } finally {
      setSendingComment(false);
    }
  };

  const calculateMediaDimensions = (originalWidth, originalHeight) => {
    const maxHeight = SCREEN_HEIGHT * 0.7;
    const maxWidth = SCREEN_WIDTH;
    
    let width = originalWidth;
    let height = originalHeight;
    
    if (width > maxWidth) {
      const ratio = maxWidth / width;
      width = maxWidth;
      height = height * ratio;
    }
    
    if (height > maxHeight) {
      const ratio = maxHeight / height;
      height = maxHeight;
      width = width * ratio;
    }
    
    setMediaDimensions({ width, height });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${post.tit}\n\nمشاهده در اپلیکیشن`,
        url: post.med,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleVideoPlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const extractHashtags = (hashString) => {
    if (!hashString) return [];
    const regex = /#(\w+)/g;
    const matches = hashString.match(regex);
    return matches || [];
  };

  const renderMedia = () => {
    if (!post) return null;

    switch (post.typ) {
      case 1: // تصویر
        return (
          <Animatable.View 
            animation="fadeIn" 
            duration={600}
            style={styles.mediaWrapper}
          >
            <Image
              source={{ uri: post.med }}
              style={[
                styles.mediaImage,
                {
                  width: mediaDimensions.width,
                  height: mediaDimensions.height,
                }
              ]}
              resizeMode="contain"
            />
          </Animatable.View>
        );

      case 3: // ویدیو
        return (
          <View style={[styles.videoWrapper, { height: mediaDimensions.height }]}>
            <Video
              ref={videoRef}
              source={{ uri: post.med }}
              style={[styles.mediaVideo, {
                width: mediaDimensions.width,
                height: mediaDimensions.height,
              }]}
              resizeMode="contain"
              shouldPlay={true} // ✅ پخش خودکار
              isLooping
              useNativeControls={false}
              onPlaybackStatusUpdate={(status) => {
                if (status.isLoaded) {
                  setIsPlaying(status.isPlaying);
                  
                  if (status.naturalSize) {
                    calculateMediaDimensions(
                      status.naturalSize.width,
                      status.naturalSize.height
                    );
                  }
                }
              }}
            />
            {/* دکمه play/pause اختیاری */}
            <TouchableOpacity
              style={styles.playButton}
              onPress={handleVideoPlayPause}
              activeOpacity={0.8}
            >
              <View style={[
                styles.playButtonInner,
                isPlaying && styles.playButtonInnerPlaying
              ]}>
                {isPlaying ? (
                  <Pause size={32} color={colors.textLight} fill={colors.textLight} />
                ) : (
                  <Play size={32} color={colors.textLight} fill={colors.textLight} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  const renderCommentItem = (comment, index) => {
    return (
      <Animatable.View
        key={comment.id || index}
        animation="fadeInUp"
        delay={index * 50}
        style={[
          styles.commentItem,
          comment.isOwn && styles.commentItemOwn
        ]}
      >
        <View style={styles.commentHeader}>
          <View style={styles.commentUserInfo}>
            <View style={styles.commentAvatar}>
              <User size={20} color={colors.textLight} />
            </View>
            <View>
              <Text style={styles.commentUserName}>
                {comment.user || 'کاربر'}
              </Text>
              <Text style={styles.commentDate}>
                {comment.date || 'الان'}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.commentText}>{comment.text}</Text>
      </Animatable.View>
    );
  };

  if (loading) {
    return (
      <ImageBackground source={bgImage} style={styles.container}>
        <View style={styles.overlay} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>در حال بارگذاری...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (!post) {
    return (
      <ImageBackground source={bgImage} style={styles.container}>
        <View style={styles.overlay} />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>پست پیدا نشد</Text>
          <TouchableOpacity style={styles.errorBackButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>بازگشت</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  const hashtags = extractHashtags(post.hash);

  return (
    <ImageBackground source={bgImage} style={styles.container} resizeMode="cover">
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
            <Text style={styles.headerTitle}>جزئیات پست</Text>
            <View style={{ width: 40 }} />
          </Animatable.View>
        </LinearGradient>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* محتوای اصلی */}
          <View style={styles.mediaContainer}>
            {renderMedia()}
          </View>

          {/* اطلاعات پست */}
          <Animatable.View animation="fadeInUp" delay={200} style={styles.contentCard}>
            <LinearGradient
              colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.08)']}
              style={styles.cardGradient}
            >
              <Text style={styles.postTitle}>{post.tit}</Text>

              {post.dis && (
                <Text style={styles.postDescription}>{post.dis}</Text>
              )}

              {/* آمار */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Eye size={18} color={colors.textGray} />
                  <Text style={styles.statText}>{post.view} بازدید</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Heart size={18} color={colors.danger} />
                  <Text style={styles.statText}>{likesCount} پسندیدن</Text>
                </View>

                <View style={styles.statItem}>
                  <MessageCircle size={18} color={colors.textGray} />
                  <Text style={styles.statText}>{comments.length} نظر</Text>
                </View>
              </View>

              {/* دکمه‌های عملیات */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, isLiked && styles.actionButtonActive]}
                  onPress={handleLike}
                  activeOpacity={0.8}
                >
                  <Animatable.View
                    animation={isLiked ? 'bounceIn' : undefined}
                    duration={300}
                  >
                    <Heart
                      size={24}
                      color={isLiked ? colors.danger : colors.textLight}
                      fill={isLiked ? colors.danger : 'none'}
                    />
                  </Animatable.View>
                  <Text style={[styles.actionButtonText, isLiked && styles.actionButtonTextActive]}>
                    پسندیدن
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, isBookmarked && styles.actionButtonActive]}
                  onPress={handleBookmark}
                  activeOpacity={0.8}
                >
                  <Bookmark
                    size={24}
                    color={isBookmarked ? colors.primary : colors.textLight}
                    fill={isBookmarked ? colors.primary : 'none'}
                  />
                  <Text style={[styles.actionButtonText, isBookmarked && styles.actionButtonTextActive]}>
                    ذخیره
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleShare}
                  activeOpacity={0.8}
                >
                  <Share2 size={24} color={colors.textLight} />
                  <Text style={styles.actionButtonText}>اشتراک‌گذاری</Text>
                </TouchableOpacity>
              </View>

              {/* هشتگ‌ها */}
              {hashtags.length > 0 && (
                <View style={styles.hashtagsContainer}>
                  <Text style={styles.hashtagsTitle}>هشتگ‌ها:</Text>
                  <View style={styles.hashtagsList}>
                    {hashtags.map((tag, index) => (
                      <TouchableOpacity 
                        key={index} 
                        style={styles.hashtagButton}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.hashtagText}>{tag}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </LinearGradient>
          </Animatable.View>

          {/* بخش نظرات */}
          <Animatable.View animation="fadeInUp" delay={300} style={styles.commentsSection}>
            <LinearGradient
              colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.08)']}
              style={styles.cardGradient}
            >
              <View style={styles.commentsSectionHeader}>
                <MessageCircle size={24} color={colors.primary} />
                <Text style={styles.commentsSectionTitle}>
                  نظرات ({comments.length})
                </Text>
              </View>

              {loadingComments ? (
                <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: spacing.lg }} />
              ) : comments.length > 0 ? (
                <View style={styles.commentsList}>
                  {comments.map((comment, index) => renderCommentItem(comment, index))}
                </View>
              ) : (
                <Text style={styles.noCommentsText}>
                  هنوز نظری ثبت نشده است. اولین نفر باشید!
                </Text>
              )}
            </LinearGradient>
          </Animatable.View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* فرم ارسال نظر - ثابت در پایین */}
        <View style={styles.commentInputContainer}>
          <LinearGradient
            colors={['rgba(0,0,0,0.95)', 'rgba(0,0,0,0.85)']}
            style={styles.commentInputGradient}
          >
            <View style={styles.commentInputWrapper}>
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!commentText.trim() || sendingComment) && styles.sendButtonDisabled
                ]}
                onPress={handleSendComment}
                disabled={!commentText.trim() || sendingComment}
                activeOpacity={0.8}
              >
                {sendingComment ? (
                  <ActivityIndicator size="small" color={colors.textLight} />
                ) : (
                  <Send size={20} color={colors.textLight} />
                )}
              </TouchableOpacity>

              <TextInput
                style={styles.commentInput}
                placeholder="نظر خود را بنویسید..."
                placeholderTextColor={colors.textGray}
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={500}
                textAlign="right"
              />
            </View>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
    paddingHorizontal: spacing.lg,
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
    ...typography.h2,
    color: colors.textLight,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scrollView: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 90 : 100,
    // paddingBottom: 40,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  mediaContainer: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    paddingVertical: spacing.lg,
    minHeight: SCREEN_HEIGHT * 0.4,
  },
  mediaWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaImage: {},
  videoWrapper: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaVideo: {},
  playButton: {
    position: 'absolute',
  },
  playButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.textLight,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  playButtonInnerPlaying: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    opacity: 0.7,
  },
  contentCard: {
    margin: spacing.lg,
    borderRadius: borderRadius.xl,
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
  cardGradient: {
    padding: spacing.lg,
  },
  postTitle: {
    ...typography.h1,
    color: colors.textLight,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'right',
    lineHeight: 32,
  },
  postDescription: {
    ...typography.body,
    color: colors.textGray,
    marginBottom: spacing.lg,
    textAlign: 'right',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    ...typography.body,
    color: colors.textGray,
    marginLeft: spacing.xs,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minHeight: 70,
  },
  actionButtonActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.25)',
    borderColor: colors.primary,
  },
  actionButtonText: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  actionButtonTextActive: {
    color: colors.primary,
  },
  hashtagsContainer: {
    marginTop: spacing.md,
  },
  hashtagsTitle: {
    ...typography.body,
    color: colors.textLight,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    textAlign: 'right',
  },
  hashtagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  hashtagButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  hashtagText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  
  // Comments Section
  commentsSection: {
    margin: spacing.lg,
    marginTop: 0,
    borderRadius: borderRadius.xl,
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
  commentsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  commentsSectionTitle: {
    ...typography.h3,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  commentsList: {
    gap: spacing.md,
  },
  commentItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  commentItemOwn: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  commentUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  commentUserName: {
    ...typography.body,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  commentDate: {
    ...typography.caption,
    color: colors.textGray,
    marginTop: 2,
  },
  commentText: {
    ...typography.body,
    color: colors.textGray,
    lineHeight: 22,
    textAlign: 'right',
  },
  noCommentsText: {
    ...typography.body,
    color: colors.textGray,
    textAlign: 'center',
    paddingVertical: spacing.xl,
    fontStyle: 'italic',
  },
  
  // Comment Input
  commentInputContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 24 : 74,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  commentInputGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: Platform.OS === 'android' ? 70 : spacing.xl,
  },
  commentInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  commentInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.textLight,
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
    opacity: 0.5,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textLight,
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.h3,
    color: colors.textLight,
    marginBottom: spacing.lg,
  },
  errorBackButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  backButtonText: {
    ...typography.body,
    color: colors.dark,
    fontWeight: 'bold',
  },
});