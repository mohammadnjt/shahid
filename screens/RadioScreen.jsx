import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Audio } from 'expo-av';
import { Play, Pause, SkipForward, Volume2, VolumeX, Radio } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import bg from '../assets/images/islamic-background.jpg';
import voice from '../assets/1.mp3';

const { width } = Dimensions.get('window');

export default function RadioPlayerScreen() {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const soundRef = useRef(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressBarRef = useRef(null);

  // لیست آهنگ‌ها
  const playlist = [
    {
      id: 1,
      title: 'ذلت بر ما شد حرام ،ماییم و شور مدام',
      artist: 'مداح',
      uri: voice,
      image: require('../assets/images/r.jpeg'),
    },
    {
      id: 2,
      title: 'دعای کمیل',
      artist: 'باسم الکربلائی',
      uri: voice,
      image: 'https://example.com/dua1.jpg',
    },
    {
      id: 3,
      title: 'مناجات با خدا',
      artist: 'محمد اصفهانی',
      uri: voice,
      image: 'https://example.com/monajat1.jpg',
    },
  ];

  useEffect(() => {
    setupAudio();
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
  }, [isPlaying, rotateAnim, pulseAnim]);

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

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const track = currentTrack || playlist[currentIndex];
  const progressPercentage = duration > 0 ? Math.min(position / duration, 1) * 100 : 0;

  return (
    <ImageBackground source={bg} style={styles.container} resizeMode="cover">
      <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']} style={styles.overlay}>
        {/* Header */}
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <View style={styles.headerIcon}>
            <Radio size={24} color="#D4AF37" />
          </View>
          <Text style={styles.headerTitle}>رادیو اسلامی</Text>
        </Animatable.View>
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
                    source={typeof track.image === 'string' ? { uri: track.image } : track.image}
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
            <Text style={styles.trackTitle}>{track.title}</Text>
            <Text style={styles.trackArtist}>{track.artist}</Text>
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
          <TouchableOpacity style={styles.controlButton} onPress={() => handleNext(isPlaying)}>
            <SkipForward size={32} color="#D4AF37" />
          </TouchableOpacity>
        </Animatable.View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
  albumContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  albumWrapper: {
    width: width * 0.75,
    height: width * 0.75,
  },
  vinylOuter: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.375,
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
    borderRadius: width * 0.36,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  vinylInner: {
    width: '70%',
    height: '70%',
    borderRadius: width * 0.26,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#D4AF37',
  },
  albumArt: {
    width: '100%',
    height: '100%',
  },
  albumArtImage: {
    borderRadius: width * 0.26,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  trackArtist: {
    fontSize: 16,
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
  playlistInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  playlistText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
});