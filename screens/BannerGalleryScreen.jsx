import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl, ImageBackground, useWindowDimensions, Modal, Pressable } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { X, Eye } from 'lucide-react-native';

// تنظیمات
const SPACING = 10;
const MIN_COLUMN_WIDTH = 200;
const MAX_COLUMN_WIDTH = 350;

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
  h3: { fontSize: 22 },
  h4: { fontSize: 16 },
  body: { fontSize: 14 },
};

const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
};

export default function BannerGalleryScreen() {
  const windowDimensions = useWindowDimensions();
  const [banners, setBanners] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [columns, setColumns] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // محاسبه تعداد ستون‌ها
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

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      redistributeColumns(banners);
    }
  }, [columnConfig.columnCount, banners.length]);

  const fetchBanners = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=25');
      const data = await response.json();
      const formattedBanners = data.map(item => ({
        id: item.id,
        image: `https://picsum.photos/400/${Math.floor(Math.random() * 200) + 250}?random=${item.id}`,
        title: item.title,
        description: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.',
        views: Math.floor(Math.random() * 5000) + 500,
        height: Math.floor(Math.random() * 150) + 200,
      }));
      
      setBanners(formattedBanners);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const redistributeColumns = (bannersData) => {
    const { columnCount } = columnConfig;
    const newColumns = Array.from({ length: columnCount }, () => []);
    const columnHeights = Array(columnCount).fill(0);
    
    bannersData.forEach(banner => {
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      newColumns[shortestColumnIndex].push(banner);
      columnHeights[shortestColumnIndex] += banner.height;
    });
    
    setColumns(newColumns);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBanners();
    setRefreshing(false);
  };

  const handleBannerClick = (banner) => {
    setSelectedBanner(banner);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedBanner(null), 300);
  };

  const renderBanner = (item, index) => {
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.9}
        onPress={() => handleBannerClick(item)}
      >
        <Animatable.View
          animation="fadeInUp"
          delay={index * 30}
          duration={500}
          style={[styles.bannerCard, { height: item.height }]}
        >
          <Image 
            source={{ uri: item.image }} 
            style={styles.bannerImage}
            resizeMode="cover"
          />
          
          {/* Overlay with hover effect */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            style={styles.bannerGradient}
          >
            <View style={styles.bannerInfo}>
              <Text style={styles.bannerTitle} numberOfLines={2}>
                {item.title}
              </Text>
              
              <View style={styles.viewsContainer}>
                <Eye size={16} color={colors.textLight} />
                <Text style={styles.viewsText}>
                  {item.views.toLocaleString('fa-IR')} بازدید
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Click indicator */}
          {/* <View style={styles.clickIndicator}>
            <View style={styles.clickIcon}>
              <Text style={styles.clickText}>👁</Text>
            </View>
          </View> */}
        </Animatable.View>
      </TouchableOpacity>
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
          <Text style={styles.headerTitle}>بنرها</Text>
          <Text style={styles.headerSubtitle}>
            مجموعه بنرهای تبلیغاتی و اطلاع‌رسانی
          </Text>
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
          {columns.map((columnBanners, columnIndex) => (
            <View 
              key={columnIndex} 
              style={[styles.column, { width: columnConfig.columnWidth }]}
            >
              {columnBanners.map((item, index) => renderBanner(item, index))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal for Banner Details */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={closeModal}
        >
          <Animatable.View 
            animation="zoomIn"
            duration={300}
            style={styles.modalContent}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              {selectedBanner && (
                <>
                  <Image
                    source={{ uri: selectedBanner.image }}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                  
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    style={styles.modalGradient}
                  >
                    <Text style={styles.modalTitle}>
                      {selectedBanner.title}
                    </Text>
                    <Text style={styles.modalDescription}>
                      {selectedBanner.description}
                    </Text>
                    
                    <View style={styles.modalStats}>
                      <View style={styles.statItem}>
                        <Eye size={20} color={colors.primary} />
                        <Text style={styles.statText}>
                          {selectedBanner.views.toLocaleString('fa-IR')} بازدید
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>

                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={closeModal}
                  >
                    <LinearGradient
                      colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                      style={styles.closeButtonGradient}
                    >
                      <X size={24} color={colors.textLight} />
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </Pressable>
          </Animatable.View>
        </Pressable>
      </Modal>
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
  headerSubtitle: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.xs,
    opacity: 0.8,
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
    gap: SPACING,
  },
  column: {},
  bannerCard: {
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
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    justifyContent: 'flex-end',
    minHeight: 90,
  },
  bannerInfo: {
    gap: spacing.sm,
  },
  bannerTitle: {
    ...typography.h4,
    color: colors.textLight,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  viewsText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
  clickIndicator: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(212, 175, 55, 0.9)',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  clickIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  clickText: {
    fontSize: 20,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  modalImage: {
    width: '100%',
    height: 400,
  },
  modalGradient: {
    padding: spacing.xl,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textLight,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'right',
  },
  modalDescription: {
    ...typography.body,
    color: colors.textLight,
    lineHeight: 24,
    marginBottom: spacing.lg,
    textAlign: 'right',
    opacity: 0.9,
  },
  modalStats: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  statText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 22,
  },
});