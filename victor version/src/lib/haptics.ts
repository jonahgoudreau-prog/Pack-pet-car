import * as Haptics from 'expo-haptics';

/**
 * Light tap on every log and button press. Kept behind this wrapper so the
 * rest of the app never imports a native module directly.
 */
export function tap() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function success() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
