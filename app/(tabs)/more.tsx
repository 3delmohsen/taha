import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';

export default function MoreScreen() {
    const { t } = useLanguage();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{t('more')} - Coming Soon in Full Port</Text>
        </View>
    )
}
