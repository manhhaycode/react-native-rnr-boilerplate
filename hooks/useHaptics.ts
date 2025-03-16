import * as Haptics from 'expo-haptics';

type ImpactStyle = 'light' | 'medium' | 'heavy';
type NotificationStyle = 'success' | 'warning' | 'error';

export function useHaptics() {
  const triggerImpact = (style: ImpactStyle = 'light') => {
    const intensity =
      style === 'light'
        ? Haptics.ImpactFeedbackStyle.Light
        : style === 'medium'
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Heavy;

    Haptics.impactAsync(intensity);
  };

  const triggerNotification = (type: NotificationStyle = 'success') => {
    const notificationType =
      type === 'success'
        ? Haptics.NotificationFeedbackType.Success
        : type === 'warning'
        ? Haptics.NotificationFeedbackType.Warning
        : Haptics.NotificationFeedbackType.Error;

    Haptics.notificationAsync(notificationType);
  };

  return {
    triggerImpact,
    triggerNotification,
  };
}
