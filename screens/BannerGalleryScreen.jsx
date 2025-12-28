import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl, ImageBackground, useWindowDimensions, Modal, Pressable, Platform } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { X, Eye, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import {api} from '../utils/api';
import { bgImage } from '../utils/config';
import { getQueryParam } from '../utils/helpers';

// تنظیمات
const SPACING = 10;
const MIN_COLUMN_WIDTH = 200;
const MAX_COLUMN_WIDTH = 350;

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
  const router = useRouter();
  const windowDimensions = useWindowDimensions();
  const [banners, setBanners] = useState([]);
  const [idp, setIdp] = useState(null);
  const [idpHistory, setIdpHistory] = useState([]); // ذخیره تاریخچه idp
  const [refreshing, setRefreshing] = useState(false);
  const [columns, setColumns] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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
  }, [idp]);

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
          // در صورت خطا، یک نسبت پیش‌فرض برمی‌گردانیم
          resolve({ width: 1, height: 1.5 });
        }
      );
    });
  };

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await api.getBanner(idp);
      console.log('res>>', res);

      if(res.status === 1){
        // دریافت ابعاد واقعی تمام تصاویر
        const bannersWithDimensions = await Promise.all(
          res.list.map(async (item) => {
            const dimensions = await getImageDimensions(item.img);
            
            // محاسبه ارتفاع بر اساس aspect ratio واقعی تصویر
            const aspectRatio = dimensions.height / dimensions.width;
            const calculatedHeight = Math.floor(columnConfig.columnWidth * aspectRatio);
            
            return {
              id: item.id,
              image: item.img,
              title: item.tit,
              typ: item.typ,
              height: calculatedHeight,
              q: getQueryParam(item.par, 'q'),
              originalWidth: dimensions.width,
              originalHeight: dimensions.height
            };
          })
        );
        
        setBanners(bannersWithDimensions);
      } else {
        console.error('Failed to fetch banners:', res.message);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (banners.length > 0) {
      redistributeColumns(banners);
    }
  }, [columnConfig.columnCount, banners.length]);

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
    if(banner.typ) {
      // ذخیره idp فعلی در تاریخچه
      setIdpHistory(prev => [...prev, idp]);
      setIdp(banner.id);
    } else {
      console.log('Navigate to posts with id:', banner);
      router.replace('/posts?q=' + encodeURIComponent(banner.q || ''));
    }
  };

  // بازگشت به صفحه قبلی
  const handleGoBack = () => {
    if (idpHistory.length > 0) {
      const previousIdp = idpHistory[idpHistory.length - 1];
      setIdpHistory(prev => prev.slice(0, -1));
      setIdp(previousIdp);
    }
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
            {idpHistory.length > 0 && <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleGoBack}
              activeOpacity={0.8}
            >
              <ArrowLeft size={24} color={colors.textLight} />
            </TouchableOpacity>}
            <Text style={styles.headerTitle}>شهدای مقاومت</Text>
            {idpHistory.length > 0 && <View style={{ width: 40 }} />}
          </Animatable.View>
        </LinearGradient>
      </View>
      {/* <Animatable.View animation="fadeInDown" style={styles.header}>
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>

            {idpHistory.length > 0 && (
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleGoBack}
              >
                <ArrowRight size={24} color={colors.textLight} />
              </TouchableOpacity>
            )}
            
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}></Text>
            </View>
            

            {idpHistory.length > 0 && <View style={styles.backButton} />}
          </View>
        </LinearGradient>
      </Animatable.View> */}

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
        {loading && banners.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>در حال بارگذاری...</Text>
          </View>
        ) : (
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
        )}
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
    paddingBottom: Platform.OS === 'android' ? 60: 10,
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
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  // },
  // headerTextContainer: {
  //   flex: 1,
  //   alignItems: 'center',
  // },
  // headerTitle: {
  //   ...typography.h2,
  //   color: colors.textLight,
  //   textAlign: 'center',
  //   fontWeight: 'bold',
  // },
  // backButton: {
  //   width: 44,
  //   height: 44,
  //   borderRadius: 22,
  //   backgroundColor: 'rgba(212, 175, 55, 0.3)',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderWidth: 1,
  //   borderColor: 'rgba(255, 255, 255, 0.2)',
  // },
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
    fontSize: 16,
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