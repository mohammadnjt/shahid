import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Dimensions,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Audio } from 'expo-av';
import { Play, Pause, SkipForward, Volume2, VolumeX, Radio, RefreshCw } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import bg from '../assets/images/islamic-background.jpg';
import { api } from '../utils/api';

const { width: screenWidth } = Dimensions.get('window');
const MAX_WIDTH = 500;
const isWeb = Platform.OS === 'web';
const containerWidth = isWeb ? Math.min(screenWidth * 0.9, MAX_WIDTH) : screenWidth;
const albumSize = isWeb ? Math.min(containerWidth * 0.6, 300) : containerWidth * 0.75;

export default function RadioPlayerScreen() {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [loadingPlaylist, setLoadingPlaylist] = useState(true);

  const soundRef = useRef(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressBarRef = useRef(null);

  useEffect(() => {
    setupAudio();
    fetchPlaylist();
    
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startRotation();
      startPulse();
    } else {
      stopRotation();
      stopPulse();
    }
  }, [isPlaying]);

  const fetchPlaylist = async () => {
    try {
      setLoadingPlaylist(true);
      const res = await api.getRaudio();
      
      if (res.status === 1 && res.list && res.list.length > 0) {
        // تبدیل داده‌های API به فرمت playlist
        const formattedPlaylist = res.list.map((item) => ({
          id: item.id,
          title: item.tit,
          artist: 'رادیو اسلامی',
          uri: item.media,
          image: require('../assets/images/r.jpeg'), // تصویر پیش‌فرض
        }));
        
        setPlaylist(formattedPlaylist);
        
        // اگر playlist خالی نیست، اولین آهنگ را تنظیم کن
        if (formattedPlaylist.length > 0) {
          setCurrentTrack(formattedPlaylist[0]);
        }
      } else {
        Alert.alert('خطا', 'لیست پخش خالی است');
      }
    } catch (error) {
      console.error('Error fetching playlist:', error);
      Alert.alert('خطا', 'خطا در دریافت لیست پخش');
    } finally {
      setLoadingPlaylist(false);
    }
  };

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.error('Error setting audio mode:', error);
    }
  };

  const startRotation = () => {
    rotateAnim.setValue(0);
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopRotation = () => {
    rotateAnim.stopAnimation();
  };

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const loadAudio = async (track, shouldPlay = false) => {
    setIsLoading(true);
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const source = typeof track.uri === 'string' ? { uri: track.uri } : track.uri;
      const { sound: newSound } = await Audio.Sound.createAsync(
        source,
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      soundRef.current = newSound;
      setSound(newSound);
      setCurrentTrack(track);

      if (isMuted) {
        await newSound.setVolumeAsync(0);
      }

      if (shouldPlay) {
        await newSound.playAsync();
      }

      return newSound;
    } catch (error) {
      console.error('Error loading audio:', error);
      Alert.alert('خطا', 'خطا در بارگذاری فایل صوتی');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) {
      if (status.error) {
        console.error('Playback error:', status.error);
      }
      return;
    }

    setDuration(status.durationMillis || 0);
    setPosition(status.positionMillis || 0);
    setIsPlaying(status.isPlaying);

    if (status.didJustFinish) {
      handleNext(true);
    }
  };

  const handlePlayPause = async () => {
    try {
      // اگر playlist خالی است
      if (playlist.length === 0) {
        Alert.alert('توجه', 'لیست پخش خالی است');
        return;
      }

      let currentSound = soundRef.current;

      if (!currentSound) {
        await loadAudio(playlist[currentIndex], true);
        return;
      }

      const status = await currentSound.getStatusAsync();

      if (!status.isLoaded) {
        return;
      }

      if (status.isPlaying) {
        await currentSound.pauseAsync();
      } else {
        await currentSound.playAsync();
      }
    } catch (error) {
      console.error('Error playing/pausing:', error);
    }
  };

  const handleNext = async (autoPlay = isPlaying) => {
    try {
      if (playlist.length === 0) return;

      const nextIndex = (currentIndex + 1) % playlist.length;
      const nextTrack = playlist[nextIndex];

      setCurrentIndex(nextIndex);
      await loadAudio(nextTrack, autoPlay);
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  };

  const toggleMute = async () => {
    const currentSound = soundRef.current;
    if (!currentSound) return;

    try {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      await currentSound.setVolumeAsync(newMuted ? 0 : 1);
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  const handleSeek = (event) => {
    const currentSound = soundRef.current;
    if (!currentSound || duration <= 0) return;

    progressBarRef.current?.measureInWindow((x, _y, barWidth) => {
      const touchX = event.nativeEvent.pageX - x;
      if (typeof barWidth !== 'number' || barWidth <= 0) return;

      const clampedX = Math.min(Math.max(touchX, 0), barWidth);
      const seekRatio = clampedX / barWidth;
      const newPosition = seekRatio * duration;

      if (isFinite(newPosition)) {
        currentSound.setPositionAsync(Math.round(newPosition)).catch(() => {});
      }
    });
  };

  const formatTime = (millis) => {
    if (!isFinite(millis) || millis <= 0) {
      return '0:00';
    }
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRefresh = () => {
    fetchPlaylist();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const track = currentTrack || (playlist.length > 0 ? playlist[currentIndex] : null);
  const progressPercentage = duration > 0 ? Math.min(position / duration, 1) * 100 : 0;

  // نمایش loading اولیه
  if (loadingPlaylist) {
    return (
      <ImageBackground source={bg} style={styles.container} resizeMode="cover">
        <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']} style={styles.overlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D4AF37" />
            <Text style={styles.loadingText}>در حال بارگذاری...</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }

  // اگر playlist خالی است
  if (playlist.length === 0) {
    return (
      <ImageBackground source={bg} style={styles.container} resizeMode="cover">
        <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']} style={styles.overlay}>
          <View style={styles.loadingContainer}>
            <Radio size={48} color="#D4AF37" />
            <Text style={styles.emptyText}>لیست پخش خالی است</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <RefreshCw size={24} color="#1A1A1A" />
              <Text style={styles.refreshButtonText}>بارگذاری مجدد</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={bg} style={styles.container} resizeMode="cover">
      <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']} style={styles.overlay}>
        <View style={styles.contentWrapper}>
          {/* Header */}
          <Animatable.View animation="fadeInDown" style={styles.header}>
            <View style={styles.headerIcon}>
              <Radio size={24} color="#D4AF37" />
            </View>
            <Text style={styles.headerTitle}>رادیو اسلامی</Text>
            {/* <TouchableOpacity style={styles.refreshIconButton} onPress={handleRefresh}>
              <RefreshCw size={20} color="#D4AF37" />
            </TouchableOpacity> */}
          </Animatable.View>

          {/* Playlist Info */}
          {/* <Text style={styles.playlistInfo}>
            آهنگ {currentIndex + 1} از {playlist.length}
          </Text> */}
          
          {/* Album Art */}
          <Animatable.View animation="fadeIn" delay={300} style={styles.albumContainer}>
            <Animated.View
              style={[
                styles.albumWrapper,
                {
                  transform: [{ rotate }, { scale: pulseAnim }],
                },
              ]}
            >
              <View style={styles.vinylOuter}>
                <View style={styles.vinylMiddle}>
                  <View style={styles.vinylInner}>
                    <ImageBackground
                      source={typeof track?.image === 'string' ? { uri: track.image } : track?.image}
                      style={styles.albumArt}
                      imageStyle={styles.albumArtImage}
                    >
                      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']} style={styles.albumGradient} />
                    </ImageBackground>
                  </View>
                </View>
              </View>
            </Animated.View>
            
            {/* Decorative Elements */}
            <View style={styles.decorativeElements}>
              <Animatable.Text animation="pulse" iterationCount="infinite" style={styles.decorativeStar}>
                ✨
              </Animatable.Text>
              <Animatable.Text
                animation="pulse"
                iterationCount="infinite"
                delay={500}
                style={[styles.decorativeStar, styles.star2]}
              >
                ⭐
              </Animatable.Text>
              <Animatable.Text
                animation="pulse"
                iterationCount="infinite"
                delay={1000}
                style={[styles.decorativeStar, styles.star3]}
              >
                ✨
              </Animatable.Text>
            </View>
          </Animatable.View>
          
          {/* Track Info */}
          <Animatable.View animation="fadeInUp" delay={500} style={styles.trackInfo}>
            <BlurView intensity={30} tint="dark" style={styles.infoCard}>
              <Text style={styles.trackTitle} numberOfLines={2}>
                {track?.title || 'بدون عنوان'}
              </Text>
              <Text style={styles.trackArtist}>{track?.artist || 'رادیو اسلامی'}</Text>
            </BlurView>
          </Animatable.View>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <TouchableOpacity ref={progressBarRef} activeOpacity={1} onPress={handleSeek} style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            </TouchableOpacity>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>
          
          {/* Controls */}
          <Animatable.View animation="fadeInUp" delay={700} style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
              {isMuted ? <VolumeX size={28} color="#D4AF37" /> : <Volume2 size={28} color="#D4AF37" />}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayPause}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient colors={['#D4AF37', '#C19A2E', '#A88728']} style={styles.playButtonGradient}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#1A1A1A" />
                ) : isPlaying ? (
                  <Pause size={36} color="#1A1A1A" fill="#1A1A1A" />
                ) : (
                  <Play size={36} color="#1A1A1A" fill="#1A1A1A" />
                )}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={handleRefresh}
              // onPress={() => handleNext(isPlaying)}
              // disabled={playlist.length <= 1}
            >
              <SkipForward size={32} color={playlist.length <= 0 ? '#666' : '#D4AF37'} />
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: isWeb ? MAX_WIDTH : '100%',
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#D4AF37',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 24,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#D4AF37',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  refreshButtonText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  refreshIconButton: {
    position: 'absolute',
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistInfo: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 20,
  },
  albumContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  albumWrapper: {
    width: albumSize,
    height: albumSize,
  },
  vinylOuter: {
    width: '100%',
    height: '100%',
    borderRadius: albumSize / 2,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  vinylMiddle: {
    width: '95%',
    height: '95%',
    borderRadius: (albumSize * 0.95) / 2,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  vinylInner: {
    width: '70%',
    height: '70%',
    borderRadius: (albumSize * 0.7) / 2,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#D4AF37',
  },
  albumArt: {
    width: '100%',
    height: '100%',
  },
  albumArtImage: {
    borderRadius: (albumSize * 0.7) / 2,
  },
  albumGradient: {
    flex: 1,
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  decorativeStar: {
    position: 'absolute',
    fontSize: 24,
    top: 20,
    left: 20,
  },
  star2: {
    top: 50,
    right: 30,
    left: 'auto',
  },
  star3: {
    bottom: 30,
    left: '50%',
    top: 'auto',
  },
  trackInfo: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  infoCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    overflow: 'hidden',
  },
  trackTitle: {
    fontSize: isWeb ? 20 : 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  trackArtist: {
    fontSize: isWeb ? 14 : 16,
    color: '#D4AF37',
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginHorizontal: 30,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  playButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});