// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
// import { useState } from 'react';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as Animatable from 'react-native-animatable';
// import { useAuth } from '../contexts/AuthContext';
// import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
// import { Camera, Edit2, Grid, Heart, Bookmark, Settings, X } from 'lucide-react-native';

// export default function ProfileScreen() {
//   const { user, signOut } = useAuth();
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [activeTab, setActiveTab] = useState('posts');
//   const [editName, setEditName] = useState(user?.user_metadata?.full_name || 'کاربر');
//   const [editBio, setEditBio] = useState('طراح و توسعه‌دهنده اپلیکیشن');

//   const stats = [
//     { label: 'پست', value: '42' },
//     { label: 'دنبال‌کننده', value: '1.2K' },
//     { label: 'دنبال‌شونده', value: '856' },
//   ];

//   const posts = Array.from({ length: 12 }, (_, i) => ({
//     id: i + 1,
//     image: `https://picsum.photos/200/200?random=${i + 20}`,
//   }));

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={[colors.primary, colors.primaryDark]}
//         style={styles.header}
//       >
//         <View style={styles.headerActions}>
//           <Text style={styles.headerTitle}>پروفایل</Text>
//           <TouchableOpacity onPress={() => signOut()}>
//             <Settings size={24} color={colors.textLight} />
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         <Animatable.View animation="fadeInDown" duration={600} style={styles.profileSection}>
//           <View style={styles.avatarContainer}>
//             <Image
//               source={{ uri: 'https://picsum.photos/150/150?random=100' }}
//               style={styles.avatar}
//             />
//             <TouchableOpacity style={styles.cameraButton}>
//               <Camera size={20} color={colors.textLight} />
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.name}>{editName}</Text>
//           <Text style={styles.bio}>{editBio}</Text>

//           <TouchableOpacity
//             style={styles.editButton}
//             onPress={() => setShowEditModal(true)}
//           >
//             <Edit2 size={16} color={colors.primary} />
//             <Text style={styles.editButtonText}>ویرایش پروفایل</Text>
//           </TouchableOpacity>
//         </Animatable.View>

//         <Animatable.View animation="fadeInUp" delay={200} duration={600} style={styles.statsContainer}>
//           {stats.map((stat, index) => (
//             <View key={index} style={styles.statItem}>
//               <Text style={styles.statValue}>{stat.value}</Text>
//               <Text style={styles.statLabel}>{stat.label}</Text>
//             </View>
//           ))}
//         </Animatable.View>

//         <View style={styles.tabs}>
//           <TouchableOpacity
//             style={[styles.tab, activeTab === 'posts' && styles.tabActive]}
//             onPress={() => setActiveTab('posts')}
//           >
//             <Grid size={20} color={activeTab === 'posts' ? colors.primary : colors.textSecondary} />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.tab, activeTab === 'liked' && styles.tabActive]}
//             onPress={() => setActiveTab('liked')}
//           >
//             <Heart size={20} color={activeTab === 'liked' ? colors.primary : colors.textSecondary} />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
//             onPress={() => setActiveTab('saved')}
//           >
//             <Bookmark size={20} color={activeTab === 'saved' ? colors.primary : colors.textSecondary} />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.postsGrid}>
//           {posts.map((post, index) => (
//             <Animatable.View
//               key={post.id}
//               animation="zoomIn"
//               delay={index * 50}
//               duration={400}
//               style={styles.postItem}
//             >
//               <Image source={{ uri: post.image }} style={styles.postImage} />
//             </Animatable.View>
//           ))}
//         </View>
//       </ScrollView>

//       <Modal
//         visible={showEditModal}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setShowEditModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <Animatable.View animation="slideInUp" duration={300} style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>ویرایش پروفایل</Text>
//               <TouchableOpacity onPress={() => setShowEditModal(false)}>
//                 <X size={24} color={colors.text} />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>نام</Text>
//               <TextInput
//                 style={styles.input}
//                 value={editName}
//                 onChangeText={setEditName}
//                 placeholder="نام خود را وارد کنید"
//               />
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>بیوگرافی</Text>
//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 value={editBio}
//                 onChangeText={setEditBio}
//                 placeholder="بیوگرافی خود را وارد کنید"
//                 multiline
//                 numberOfLines={4}
//               />
//             </View>

//             <TouchableOpacity
//               style={styles.saveButton}
//               onPress={() => setShowEditModal(false)}
//             >
//               <LinearGradient
//                 colors={[colors.primary, colors.primaryDark]}
//                 style={styles.saveButtonGradient}
//               >
//                 <Text style={styles.saveButtonText}>ذخیره</Text>
//               </LinearGradient>
//             </TouchableOpacity>
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
//   headerActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     ...typography.h2,
//     color: colors.textLight,
//   },
//   profileSection: {
//     alignItems: 'center',
//     paddingVertical: spacing.xl,
//   },
//   avatarContainer: {
//     position: 'relative',
//     marginBottom: spacing.md,
//   },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 4,
//     borderColor: colors.primary,
//   },
//   cameraButton: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: colors.primary,
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: colors.background,
//   },
//   name: {
//     ...typography.h2,
//     color: colors.text,
//     marginBottom: spacing.xs,
//   },
//   bio: {
//     ...typography.body2,
//     color: colors.textSecondary,
//     marginBottom: spacing.md,
//   },
//   editButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.background,
//     borderWidth: 1,
//     borderColor: colors.primary,
//     borderRadius: borderRadius.sm,
//     paddingVertical: spacing.sm,
//     paddingHorizontal: spacing.lg,
//   },
//   editButtonText: {
//     color: colors.primary,
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: spacing.xs,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: spacing.lg,
//     backgroundColor: colors.surface,
//     marginHorizontal: spacing.lg,
//     borderRadius: borderRadius.md,
//     ...shadows.small,
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statValue: {
//     ...typography.h3,
//     color: colors.text,
//   },
//   statLabel: {
//     ...typography.caption,
//     color: colors.textSecondary,
//     marginTop: spacing.xs,
//   },
//   tabs: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//     marginTop: spacing.lg,
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: spacing.md,
//     alignItems: 'center',
//     borderBottomWidth: 2,
//     borderBottomColor: 'transparent',
//   },
//   tabActive: {
//     borderBottomColor: colors.primary,
//   },
//   postsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     padding: 1,
//   },
//   postItem: {
//     width: '33.33%',
//     aspectRatio: 1,
//     padding: 1,
//   },
//   postImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
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
//   inputGroup: {
//     marginBottom: spacing.md,
//   },
//   inputLabel: {
//     ...typography.body2,
//     color: colors.text,
//     fontWeight: '600',
//     marginBottom: spacing.xs,
//   },
//   input: {
//     backgroundColor: colors.background,
//     borderRadius: borderRadius.sm,
//     padding: spacing.md,
//     fontSize: 16,
//     color: colors.text,
//     borderWidth: 1,
//     borderColor: colors.border,
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   saveButton: {
//     borderRadius: borderRadius.md,
//     overflow: 'hidden',
//     marginTop: spacing.md,
//   },
//   saveButtonGradient: {
//     paddingVertical: spacing.md,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: colors.textLight,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput, ImageBackground } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import { Camera, Edit2, Grid, Heart, Bookmark, Settings, X } from 'lucide-react-native';
import bg from '../assets/images/islamic-background.jpg';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [editName, setEditName] = useState(user?.user_metadata?.full_name || 'کاربر');
  const [editBio, setEditBio] = useState('طراح و توسعه‌دهنده اپلیکیشن');

  const stats = [
    { label: 'پست', value: '42' },
    { label: 'دنبال‌کننده', value: '1.2K' },
    { label: 'دنبال‌شونده', value: '856' },
  ];

  const posts = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    image: `https://picsum.photos/200/200?random=${i + 20}`,
  }));

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
          <View style={styles.headerActions}>
            <Text style={styles.headerTitle}>پروفایل</Text>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => signOut()}
            >
              <Settings size={24} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animatable.View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <Animatable.View animation="fadeInDown" duration={600} style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://picsum.photos/150/150?random=100' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{editName}</Text>
          <Text style={styles.bio}>{editBio}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setShowEditModal(true)}
          >
            <Edit2 size={16} color={colors.textLight} />
            <Text style={styles.editButtonText}>ویرایش پروفایل</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Stats Section */}
        <Animatable.View animation="fadeInUp" delay={200} duration={600} style={styles.statsContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.statsGradient}
          >
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </LinearGradient>
        </Animatable.View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.tabsGradient}
          >
            <TouchableOpacity
              style={[styles.tab, activeTab === 'posts' && styles.tabActive]}
              onPress={() => setActiveTab('posts')}
            >
              <Grid size={20} color={activeTab === 'posts' ? colors.textLight : colors.textLight + '80'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'liked' && styles.tabActive]}
              onPress={() => setActiveTab('liked')}
            >
              <Heart size={20} color={activeTab === 'liked' ? colors.textLight : colors.textLight + '80'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
              onPress={() => setActiveTab('saved')}
            >
              <Bookmark size={20} color={activeTab === 'saved' ? colors.textLight : colors.textLight + '80'} />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Posts Grid */}
        <View style={styles.postsGrid}>
          {posts.map((post, index) => (
            <Animatable.View
              key={post.id}
              animation="zoomIn"
              delay={index * 50}
              duration={400}
              style={styles.postItem}
            >
              <Image source={{ uri: post.image }} style={styles.postImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)']}
                style={styles.postOverlay}
              />
            </Animatable.View>
          ))}
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View animation="slideInUp" duration={300} style={styles.modalContent}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>ویرایش پروفایل</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowEditModal(false)}
                >
                  <X size={24} color={colors.textLight} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>نام</Text>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="نام خود را وارد کنید"
                  placeholderTextColor={colors.textLight + '80'}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>بیوگرافی</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editBio}
                  onChangeText={setEditBio}
                  placeholder="بیوگرافی خود را وارد کنید"
                  placeholderTextColor={colors.textLight + '80'}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => setShowEditModal(false)}
              >
                <LinearGradient
                  colors={['rgba(212, 175, 55, 0.8)', 'rgba(212, 175, 55, 0.6)']}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>ذخیره</Text>
                </LinearGradient>
              </TouchableOpacity>
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
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textLight,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(212, 175, 55, 0.8)',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(212, 175, 55, 0.8)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
  name: {
    ...typography.h2,
    color: colors.textLight,
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bio: {
    ...typography.body2,
    color: colors.textLight,
    opacity: 0.9,
    marginBottom: spacing.md,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backdropFilter: 'blur(10px)',
  },
  editButtonText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  statsContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  statsGradient: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h3,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textLight,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  tabsContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  tabsGradient: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.lg,
    backdropFilter: 'blur(10px)',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: 'rgba(212, 175, 55, 0.8)',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 1,
  },
  postItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 1,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  postOverlay: {
    ...StyleSheet.absoluteFillObject,
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
    maxHeight: '70%',
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
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.body2,
    color: colors.textLight,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textLight,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    textAlign: 'right',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  saveButtonGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  saveButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
});