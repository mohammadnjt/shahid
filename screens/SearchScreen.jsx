// import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
// import { useState, useEffect } from 'react';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as Animatable from 'react-native-animatable';
// import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
// import { Search, SlidersHorizontal, X } from 'lucide-react-native';

// export default function SearchScreen() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const [allData, setAllData] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('all');

//   const categories = ['all', 'nature', 'technology', 'people', 'animals', 'food'];

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=50');
//       const data = await response.json();
//       const formattedData = data.map(item => ({
//         id: item.id,
//         image: `https://picsum.photos/200/200?random=${item.id}`,
//         title: item.title,
//         category: categories[Math.floor(Math.random() * categories.length)],
//       }));
//       setAllData(formattedData);
//       setResults(formattedData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleSearch = (text) => {
//     setSearchQuery(text);
//     if (text.trim() === '') {
//       setResults(allData.filter(item =>
//         selectedCategory === 'all' || item.category === selectedCategory
//       ));
//     } else {
//       const filtered = allData.filter(item =>
//         item.title.toLowerCase().includes(text.toLowerCase()) &&
//         (selectedCategory === 'all' || item.category === selectedCategory)
//       );
//       setResults(filtered);
//     }
//   };

//   const handleCategorySelect = (category) => {
//     setSelectedCategory(category);
//     const filtered = allData.filter(item =>
//       (category === 'all' || item.category === category) &&
//       (searchQuery.trim() === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase()))
//     );
//     setResults(filtered);
//     setShowFilters(false);
//   };

//   const renderItem = ({ item, index }) => (
//     <Animatable.View
//       animation="fadeIn"
//       delay={index * 50}
//       duration={400}
//       style={styles.gridItem}
//     >
//       <TouchableOpacity activeOpacity={0.8}>
//         <Image source={{ uri: item.image }} style={styles.gridImage} />
//         <View style={styles.gridOverlay}>
//           <Text style={styles.gridTitle} numberOfLines={2}>
//             {item.title}
//           </Text>
//           <View style={styles.categoryBadge}>
//             <Text style={styles.categoryText}>{item.category}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </Animatable.View>
//   );

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={[colors.primary, colors.primaryDark]}
//         style={styles.header}
//       >
//         <View style={styles.searchContainer}>
//           <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="جستجو..."
//             placeholderTextColor={colors.textSecondary}
//             value={searchQuery}
//             onChangeText={handleSearch}
//           />
//           {searchQuery.length > 0 && (
//             <TouchableOpacity onPress={() => handleSearch('')}>
//               <X size={20} color={colors.textSecondary} />
//             </TouchableOpacity>
//           )}
//         </View>

//         <TouchableOpacity
//           style={styles.filterButton}
//           onPress={() => setShowFilters(true)}
//         >
//           <SlidersHorizontal size={20} color={colors.textLight} />
//           <Text style={styles.filterButtonText}>فیلترها</Text>
//         </TouchableOpacity>
//       </LinearGradient>

//       <FlatList
//         data={results}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={2}
//         contentContainerStyle={styles.gridContent}
//         showsVerticalScrollIndicator={false}
//       />

//       <Modal
//         visible={showFilters}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setShowFilters(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <Animatable.View animation="slideInUp" duration={300} style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>دسته‌بندی‌ها</Text>
//               <TouchableOpacity onPress={() => setShowFilters(false)}>
//                 <X size={24} color={colors.text} />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.categoriesContainer}>
//               {categories.map((category) => (
//                 <TouchableOpacity
//                   key={category}
//                   style={[
//                     styles.categoryButton,
//                     selectedCategory === category && styles.categoryButtonActive,
//                   ]}
//                   onPress={() => handleCategorySelect(category)}
//                 >
//                   <Text
//                     style={[
//                       styles.categoryButtonText,
//                       selectedCategory === category && styles.categoryButtonTextActive,
//                     ]}
//                   >
//                     {category}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </Animatable.View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   header: {
//     paddingTop: 50,
//     paddingBottom: spacing.lg,
//     paddingHorizontal: spacing.lg,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.surface,
//     borderRadius: borderRadius.md,
//     paddingHorizontal: spacing.md,
//     marginBottom: spacing.md,
//   },
//   searchIcon: {
//     marginRight: spacing.sm,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: spacing.md,
//     fontSize: 16,
//     color: colors.text,
//   },
//   filterButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     borderRadius: borderRadius.sm,
//     paddingVertical: spacing.sm,
//     paddingHorizontal: spacing.md,
//     alignSelf: 'flex-start',
//   },
//   filterButtonText: {
//     color: colors.textLight,
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: spacing.xs,
//   },
//   gridContent: {
//     padding: spacing.sm,
//   },
//   gridItem: {
//     flex: 1,
//     margin: spacing.sm,
//     borderRadius: borderRadius.md,
//     overflow: 'hidden',
//     ...shadows.small,
//   },
//   gridImage: {
//     width: '100%',
//     aspectRatio: 1,
//     resizeMode: 'cover',
//   },
//   gridOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     padding: spacing.sm,
//   },
//   gridTitle: {
//     color: colors.textLight,
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   categoryBadge: {
//     alignSelf: 'flex-start',
//     backgroundColor: colors.primary,
//     borderRadius: borderRadius.sm,
//     paddingHorizontal: spacing.xs,
//     paddingVertical: 2,
//     marginTop: spacing.xs,
//   },
//   categoryText: {
//     color: colors.textLight,
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: colors.surface,
//     borderTopLeftRadius: borderRadius.lg,
//     borderTopRightRadius: borderRadius.lg,
//     paddingTop: spacing.lg,
//     paddingBottom: spacing.xxl,
//     paddingHorizontal: spacing.lg,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: spacing.lg,
//   },
//   modalTitle: {
//     ...typography.h3,
//     color: colors.text,
//   },
//   categoriesContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: spacing.sm,
//   },
//   categoryButton: {
//     paddingVertical: spacing.sm,
//     paddingHorizontal: spacing.md,
//     borderRadius: borderRadius.md,
//     borderWidth: 1,
//     borderColor: colors.border,
//     backgroundColor: colors.background,
//   },
//   categoryButtonActive: {
//     backgroundColor: colors.primary,
//     borderColor: colors.primary,
//   },
//   categoryButtonText: {
//     color: colors.text,
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   categoryButtonTextActive: {
//     color: colors.textLight,
//   },
// });


import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, Modal, ImageBackground } from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import bg from '../assets/images/islamic-background.jpg';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allData, setAllData] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'nature', 'technology', 'people', 'animals', 'food'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=50');
      const data = await response.json();
      const formattedData = data.map(item => ({
        id: item.id,
        image: `https://picsum.photos/200/200?random=${item.id}`,
        title: item.title,
        category: categories[Math.floor(Math.random() * categories.length)],
      }));
      setAllData(formattedData);
      setResults(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setResults(allData.filter(item =>
        selectedCategory === 'all' || item.category === selectedCategory
      ));
    } else {
      const filtered = allData.filter(item =>
        item.title.toLowerCase().includes(text.toLowerCase()) &&
        (selectedCategory === 'all' || item.category === selectedCategory)
      );
      setResults(filtered);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const filtered = allData.filter(item =>
      (category === 'all' || item.category === category) &&
      (searchQuery.trim() === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setResults(filtered);
    setShowFilters(false);
  };

  const renderItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeIn"
      delay={index * 50}
      duration={400}
      style={styles.gridItem}
    >
      <TouchableOpacity activeOpacity={0.8}>
        <Image source={{ uri: item.image }} style={styles.gridImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gridOverlay}
        >
          <Text style={styles.gridTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );

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
          <View style={styles.searchContainer}>
            <Search size={20} color={colors.textLight} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="جستجو..."
              placeholderTextColor={colors.textLight + '80'}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <X size={20} color={colors.textLight} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <SlidersHorizontal size={20} color={colors.textLight} />
            <Text style={styles.filterButtonText}>فیلترها</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animatable.View>

      {/* Content */}
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View animation="slideInUp" duration={300} style={styles.modalContent}>
            <LinearGradient
              colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.1)']}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>دسته‌بندی‌ها</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowFilters(false)}
                >
                  <X size={24} color={colors.textLight} />
                </TouchableOpacity>
              </View>

              <View style={styles.categoriesContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category && styles.categoryButtonActive,
                    ]}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === category && styles.categoryButtonTextActive,
                      ]}
                    >
                      {category === 'all' ? 'همه' : category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          </Animatable.View>
        </View>
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'right',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterButtonText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  gridContent: {
    padding: spacing.sm,
    paddingTop: spacing.sm,
  },
  gridItem: {
    flex: 1,
    margin: spacing.sm,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
  gridImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
  },
  gridTitle: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(212, 175, 55, 0.8)',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    marginTop: spacing.xs,
  },
  categoryText: {
    color: colors.textLight,
    fontSize: 10,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    overflow: 'hidden',
    maxHeight: '50%',
  },
  modalGradient: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.6)',
    borderColor: 'rgba(212, 175, 55, 0.8)',
  },
  categoryButtonText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: colors.textLight,
    fontWeight: 'bold',
  },
});