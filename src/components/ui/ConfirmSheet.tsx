import React from 'react';
import {
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Button } from './Button';

interface ConfirmSheetProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel = '确认',
  cancelLabel = '取消',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <Pressable
        className="flex-1 bg-black/50 items-center justify-end pb-8 px-4"
        onPress={onCancel}
      >
        <Pressable
          className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full gap-4"
          onPress={() => {}}
        >
          <Text className="text-xl font-bold text-gray-900 dark:text-white text-center">{title}</Text>
          <Text className="text-base text-gray-600 dark:text-gray-400 text-center">{message}</Text>
          <View className="gap-3 mt-2">
            <Button
              title={confirmLabel}
              variant={destructive ? 'destructive' : 'primary'}
              onPress={onConfirm}
            />
            <Button title={cancelLabel} variant="secondary" onPress={onCancel} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
