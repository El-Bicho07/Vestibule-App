import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import * as Animatable from "react-native-animatable";
import * as Haptics from "expo-haptics";
import { Button } from "./Button";
import { useThemeStore } from "../store/useThemeStore";
import { getColors, radius } from "../constants/theme";
import { generateMathProblem, MathProblem } from "../utils/mathGenerator";

interface FrictionModalProps {
  visible: boolean;
  strictMode: boolean;
  onStay: () => void;
  onLeave: () => void;
  onDismiss: () => void;
}

export const FrictionModal: React.FC<FrictionModalProps> = ({
  visible,
  strictMode,
  onStay,
  onLeave,
  onDismiss,
}) => {
  const { theme } = useThemeStore();
  const c = getColors(theme);
  const [problem, setProblem] = useState<MathProblem>(() => generateMathProblem());
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const shakeRef = useRef<Animatable.View & { shake?: (duration?: number) => void }>(null);

  useEffect(() => {
    if (visible && strictMode) {
      setProblem(generateMathProblem());
      setInput("");
      setError(false);
    }
  }, [visible, strictMode]);

  const handleSubmit = () => {
    Keyboard.dismiss();
    const parsed = parseInt(input.trim(), 10);
    if (!isNaN(parsed) && parsed === problem.answer) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onLeave();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(true);
      shakeRef.current?.shake?.(600);
      setTimeout(() => {
        setError(false);
        setProblem(generateMathProblem());
        setInput("");
      }, 700);
    }
  };

  const renderContent = () => {
    if (strictMode) {
      return (
        <>
          <Text
            style={{
              fontSize: 13,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              color: c.subtext,
              marginBottom: 8,
            }}
          >
            Strict mode
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "600",
              color: c.text,
              marginBottom: 6,
              letterSpacing: -0.3,
            }}
          >
            Prove intent to leave
          </Text>
          <Text style={{ fontSize: 14, color: c.subtext, marginBottom: 24, lineHeight: 20 }}>
            Solve to open the door. Wrong answers regenerate.
          </Text>

          <Animatable.View ref={shakeRef as never}>
            <View
              style={{
                backgroundColor: c.background,
                borderWidth: 1,
                borderColor: error ? c.danger : c.border,
                borderRadius: radius.md,
                padding: 20,
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  color: c.text,
                  textAlign: "center",
                  fontFamily: "Courier",
                  letterSpacing: 1,
                }}
              >
                {problem.expression} = ?
              </Text>
            </View>

            <TextInput
              testID="friction-math-input"
              value={input}
              onChangeText={setInput}
              keyboardType="number-pad"
              placeholder="Your answer"
              placeholderTextColor={c.subtext}
              style={{
                borderWidth: 1,
                borderColor: error ? c.danger : c.border,
                borderRadius: radius.md,
                padding: 16,
                fontSize: 18,
                color: c.text,
                backgroundColor: c.surface,
                marginBottom: 16,
                fontFamily: "Courier",
                textAlign: "center",
              }}
            />
          </Animatable.View>

          <Button
            testID="friction-submit-btn"
            label="Submit"
            onPress={handleSubmit}
            variant="primary"
            haptic="none"
          />
          <View style={{ height: 10 }} />
          <Button testID="friction-stay-btn" label="Stay Inside" onPress={onStay} variant="ghost" />
        </>
      );
    }
    return (
      <>
        <Text
          style={{
            fontSize: 13,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            color: c.subtext,
            marginBottom: 8,
          }}
        >
          Heads up
        </Text>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "600",
            color: c.text,
            marginBottom: 12,
            letterSpacing: -0.3,
          }}
        >
          Leaving early won't count toward your streak.
        </Text>
        <Text style={{ fontSize: 15, color: c.subtext, marginBottom: 28, lineHeight: 22 }}>
          The door is here when you're done. You can also stay — most drift passes within a minute.
        </Text>
        <Button testID="friction-stay-btn" label="Stay Inside" onPress={onStay} variant="primary" />
        <View style={{ height: 10 }} />
        <Button
          testID="friction-leave-btn"
          label="Leave Anyway"
          onPress={onLeave}
          variant="danger"
        />
      </>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      testID="friction-modal"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.55)" }}
      >
        <Pressable style={{ flex: 1 }} onPress={onDismiss} />
        <Animatable.View
          animation="slideInUp"
          duration={350}
          style={{
            backgroundColor: c.surface,
            paddingHorizontal: 24,
            paddingTop: 28,
            paddingBottom: 40,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderTopWidth: 1,
            borderColor: c.border,
          }}
        >
          {renderContent()}
        </Animatable.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
