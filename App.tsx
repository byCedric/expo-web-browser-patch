import React, { useCallback } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { getAuthorizeUrl } from './helpers';

export default function App() {
  const startAuth = useCallback(async () => {
    const returnUrl = AuthSession.getDefaultReturnUrl();
    const authUrl = getAuthorizeUrl(
      {
        client_id: 'INSERT_YOUR_CLIENT_ID', // https://www.reddit.com/prefs/apps/ + match redirect Url with aformentioned returnUrl
        duration: 'temporary',
        redirect_uri: returnUrl,
        response_type: 'code',
        scope: ['identity'],
      },
      '.compact'
    );

    console.log('starting auth session');
    try {
      const result = await AuthSession.startAsync({ authUrl, returnUrl });
      // Without the patch, this is called too early in production mode
      // see: https://github.com/expo/expo/pull/6743
      console.log('result received', result);
    } catch (error) {
      console.log('error received', error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button title='Press me' onPress={startAuth} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
