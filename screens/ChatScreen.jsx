// import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
// import { useState, useRef, useEffect } from 'react';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as Animatable from 'react-native-animatable';
// import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
// import { Send, Smile } from 'lucide-react-native';

// export default function ChatScreen() {
//   const [messages, setMessages] = useState([
//     { id: 1, text: 'سلام! چطوری؟', isUser: false, time: '10:30' },
//     { id: 2, text: 'سلام، خوبم ممنون', isUser: true, time: '10:31' },
//     { id: 3, text: 'این اپلیکیشن خیلی زیباست!', isUser: false, time: '10:32' },
//     { id: 4, text: 'ممنون، خوشحالم که دوستش داری', isUser: true, time: '10:33' },
//   ]);
//   const [inputText, setInputText] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const flatListRef = useRef(null);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     setTimeout(() => {
//       flatListRef.current?.scrollToEnd({ animated: true });
//     }, 100);
//   };

//   const handleSend = () => {
//     if (inputText.trim() === '') return;

//     const newMessage = {
//       id: messages.length + 1,
//       text: inputText,
//       isUser: true,
//       time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
//     };

//     setMessages([...messages, newMessage]);
//     setInputText('');

//     setIsTyping(true);
//     setTimeout(() => {
//       setIsTyping(false);
//       const responseMessage = {
//         id: messages.length + 2,
//         text: 'پیام شما دریافت شد!',
//         isUser: false,
//         time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
//       };
//       setMessages(prev => [...prev, responseMessage]);
//     }, 2000);
//   };

//   const renderMessage = ({ item, index }) => (
//     <Animatable.View
//       animation="fadeInUp"
//       delay={index * 50}
//       duration={400}
//       style={[
//         styles.messageContainer,
//         item.isUser ? styles.userMessageContainer : styles.otherMessageContainer,
//       ]}
//     >
//       <View
//         style={[
//           styles.messageBubble,
//           item.isUser ? styles.userMessage : styles.otherMessage,
//         ]}
//       >
//         <Text style={[styles.messageText, item.isUser && styles.userMessageText]}>
//           {item.text}
//         </Text>
//         <Text style={[styles.messageTime, item.isUser && styles.userMessageTime]}>
//           {item.time}
//         </Text>
//       </View>
//     </Animatable.View>
//   );

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={[colors.primary, colors.primaryDark]}
//         style={styles.header}
//       >
//         <Text style={styles.headerTitle}>گفتگو</Text>
//         <Text style={styles.headerSubtitle}>آنلاین</Text>
//       </LinearGradient>

//       <FlatList
//         ref={flatListRef}
//         data={messages}
//         renderItem={renderMessage}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.messagesList}
//         showsVerticalScrollIndicator={false}
//       />

//       {isTyping && (
//         <Animatable.View
//           animation="fadeIn"
//           duration={300}
//           style={styles.typingContainer}
//         >
//           <View style={styles.typingBubble}>
//             <Animatable.View
//               animation="pulse"
//               iterationCount="infinite"
//               duration={1000}
//               style={styles.typingDot}
//             />
//             <Animatable.View
//               animation="pulse"
//               iterationCount="infinite"
//               duration={1000}
//               delay={200}
//               style={styles.typingDot}
//             />
//             <Animatable.View
//               animation="pulse"
//               iterationCount="infinite"
//               duration={1000}
//               delay={400}
//               style={styles.typingDot}
//             />
//           </View>
//         </Animatable.View>
//       )}

//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={0}
//       >
//         <View style={styles.inputContainer}>
//           <TouchableOpacity style={styles.emojiButton}>
//             <Smile size={24} color={colors.primary} />
//           </TouchableOpacity>

//           <TextInput
//             style={styles.input}
//             placeholder="پیام خود را بنویسید..."
//             placeholderTextColor={colors.textSecondary}
//             value={inputText}
//             onChangeText={setInputText}
//             multiline
//             maxLength={500}
//           />

//           <TouchableOpacity
//             style={styles.sendButton}
//             onPress={handleSend}
//             disabled={inputText.trim() === ''}
//           >
//             <LinearGradient
//               colors={inputText.trim() === '' ? [colors.border, colors.border] : [colors.primary, colors.primaryDark]}
//               style={styles.sendButtonGradient}
//             >
//               <Send size={20} color={colors.textLight} />
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
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
//   headerTitle: {
//     ...typography.h2,
//     color: colors.textLight,
//   },
//   headerSubtitle: {
//     ...typography.caption,
//     color: colors.textLight,
//     opacity: 0.8,
//     marginTop: spacing.xs,
//   },
//   messagesList: {
//     padding: spacing.md,
//     paddingBottom: spacing.lg,
//   },
//   messageContainer: {
//     marginBottom: spacing.md,
//     maxWidth: '80%',
//   },
//   userMessageContainer: {
//     alignSelf: 'flex-end',
//   },
//   otherMessageContainer: {
//     alignSelf: 'flex-start',
//   },
//   messageBubble: {
//     borderRadius: borderRadius.md,
//     padding: spacing.md,
//     ...shadows.small,
//   },
//   userMessage: {
//     backgroundColor: colors.primary,
//     borderBottomRightRadius: 4,
//   },
//   otherMessage: {
//     backgroundColor: colors.surface,
//     borderBottomLeftRadius: 4,
//   },
//   messageText: {
//     ...typography.body1,
//     color: colors.text,
//     marginBottom: spacing.xs,
//   },
//   userMessageText: {
//     color: colors.textLight,
//   },
//   messageTime: {
//     ...typography.caption,
//     color: colors.textSecondary,
//     alignSelf: 'flex-end',
//   },
//   userMessageTime: {
//     color: colors.textLight,
//     opacity: 0.7,
//   },
//   typingContainer: {
//     paddingHorizontal: spacing.md,
//     marginBottom: spacing.sm,
//   },
//   typingBubble: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.surface,
//     borderRadius: borderRadius.md,
//     padding: spacing.md,
//     alignSelf: 'flex-start',
//     ...shadows.small,
//   },
//   typingDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: colors.textSecondary,
//     marginHorizontal: 2,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     padding: spacing.md,
//     backgroundColor: colors.surface,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//   },
//   emojiButton: {
//     padding: spacing.sm,
//     marginRight: spacing.sm,
//   },
//   input: {
//     flex: 1,
//     backgroundColor: colors.background,
//     borderRadius: borderRadius.md,
//     paddingHorizontal: spacing.md,
//     paddingVertical: spacing.sm,
//     fontSize: 16,
//     color: colors.text,
//     maxHeight: 100,
//   },
//   sendButton: {
//     marginLeft: spacing.sm,
//     borderRadius: borderRadius.full,
//     overflow: 'hidden',
//   },
//   sendButtonGradient: {
//     width: 44,
//     height: 44,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import { Send, Smile } from 'lucide-react-native';
import bg from '../assets/images/islamic-background.jpg';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'سلام! چطوری؟', isUser: false, time: '10:30' },
    { id: 2, text: 'سلام، خوبم ممنون', isUser: true, time: '10:31' },
    { id: 3, text: 'این اپلیکیشن خیلی زیباست!', isUser: false, time: '10:32' },
    { id: 4, text: 'ممنون، خوشحالم که دوستش داری', isUser: true, time: '10:33' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responseMessage = {
        id: messages.length + 2,
        text: 'پیام شما دریافت شد!',
        isUser: false,
        time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  const renderMessage = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 50}
      duration={400}
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.otherMessageContainer,
      ]}
    >
      <LinearGradient
        colors={item.isUser ? 
          ['rgba(212, 175, 55, 0.8)', 'rgba(212, 175, 55, 0.6)'] : 
          ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']
        }
        style={[
          styles.messageBubble,
          item.isUser ? styles.userMessage : styles.otherMessage,
        ]}
      >
        <Text style={[styles.messageText, item.isUser && styles.userMessageText]}>
          {item.text}
        </Text>
        <Text style={[styles.messageTime, item.isUser && styles.userMessageTime]}>
          {item.time}
        </Text>
      </LinearGradient>
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
          <Text style={styles.headerTitle}>گفتگو</Text>
          <Text style={styles.headerSubtitle}>آنلاین</Text>
        </LinearGradient>
      </Animatable.View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <Animatable.View
          animation="fadeIn"
          duration={300}
          style={styles.typingContainer}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.typingBubble}
          >
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              duration={1000}
              style={styles.typingDot}
            />
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              duration={1000}
              delay={200}
              style={styles.typingDot}
            />
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              duration={1000}
              delay={400}
              style={styles.typingDot}
            />
          </LinearGradient>
        </Animatable.View>
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.emojiButton}>
            <Smile size={24} color={colors.textLight} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="پیام خود را بنویسید..."
            placeholderTextColor={colors.textLight + '80'}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={inputText.trim() === ''}
          >
            <LinearGradient
              colors={inputText.trim() === '' ? 
                ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)'] : 
                ['rgba(212, 175, 55, 0.8)', 'rgba(212, 175, 55, 0.6)']
              }
              style={styles.sendButtonGradient}
            >
              <Send size={20} color={colors.textLight} />
            </LinearGradient>
          </TouchableOpacity>
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
  headerTitle: {
    ...typography.h2,
    color: colors.textLight,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textLight,
    opacity: 0.8,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  messagesList: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  messageContainer: {
    marginBottom: spacing.md,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
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
  userMessage: {
    borderBottomRightRadius: spacing.xs,
  },
  otherMessage: {
    borderBottomLeftRadius: spacing.xs,
  },
  messageText: {
    ...typography.body1,
    color: colors.textLight,
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  userMessageText: {
    color: colors.textLight,
    fontWeight: '600',
  },
  messageTime: {
    ...typography.caption,
    color: colors.textLight,
    opacity: 0.7,
    alignSelf: 'flex-end',
    fontSize: 10,
  },
  userMessageTime: {
    color: colors.textLight,
    opacity: 0.9,
  },
  typingContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textLight,
    marginHorizontal: 2,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  emojiButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.sm,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.textLight,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    textAlign: 'right',
  },
  sendButton: {
    marginLeft: spacing.sm,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.full,
  },
});