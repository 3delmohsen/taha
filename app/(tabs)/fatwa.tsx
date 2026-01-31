import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Send, User, Bot } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../contexts/LanguageContext';
import { getFatwaResponse } from '../../services/geminiService';
import { ChatMessage } from '../../types';

export default function FatwaChat() {
  const { t, isRTL } = useLanguage();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
      { id: '1', role: 'model', text: t('welcomeMsg') }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
      if (!input.trim()) return;
      
      const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
      setMessages(p => [...p, userMsg]);
      setInput('');
      setLoading(true);

      const response = await getFatwaResponse(userMsg.text);
      const botMsg: ChatMessage = { id: (Date.now()+1).toString(), role: 'model', text: response };
      setMessages(p => [...p, botMsg]);
      setLoading(false);
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
      const isUser = item.role === 'user';
      return (
          <View style={[
              styles.msgRow, 
              isUser ? (isRTL ? styles.rowLeft : styles.rowRight) : (isRTL ? styles.rowRight : styles.rowLeft)
          ]}>
              <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
                  <Text style={[styles.msgText, isUser ? styles.userText : styles.botText]}>{item.text}</Text>
              </View>
          </View>
      );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
            <Bot size={24} color="#fff" style={styles.botIcon} />
            <Text style={styles.headerTitle}>{t('fatwaTitle')}</Text>
        </View>

        {/* FIX: Wrapped FlatList in View with padding to resolve type error with contentContainerStyle */}
        <View style={{ flex: 1, padding: 16 }}>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
            />
        </View>

        {loading && <ActivityIndicator color="#4f46e5" style={{ margin: 10 }} />}

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
            <View style={[styles.inputContainer, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}>
                <TextInput
                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                    value={input}
                    onChangeText={setInput}
                    placeholder={t('placeholder')}
                    placeholderTextColor="#94a3b8"
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
                    <Send size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  botIcon: { backgroundColor: '#4f46e5', borderRadius: 8, padding: 4, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  
  msgRow: { marginVertical: 8, width: '100%', flexDirection: 'row' },
  rowRight: { justifyContent: 'flex-end' },
  rowLeft: { justifyContent: 'flex-start' },
  
  bubble: { padding: 12, borderRadius: 16, maxWidth: '80%' },
  userBubble: { backgroundColor: '#1e293b' },
  botBubble: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' },
  
  msgText: { fontSize: 14, lineHeight: 20 },
  userText: { color: '#fff' },
  botText: { color: '#334155' },

  inputContainer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0', alignItems: 'center', gap: 10 },
  input: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: '#1e293b' },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center' }
});