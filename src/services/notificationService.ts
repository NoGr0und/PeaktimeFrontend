// Stub implementation to bypass expo-notifications crashes in Expo Go
export const notificationService = {
  async registerForPushNotificationsAsync(): Promise<string | null> {
    console.log('Push Notifications disabled in local development (Expo Go)');
    return null;
  }
};
