import { createHomeStyles } from "@/assets/styles/home.styles";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* 🔴 Soft pulse loader */
const PulseLoader = ({ size = 8, color }: { size?: number; color: string }) => {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.4],
  });

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0],
  });

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Animated.View
        style={{
          position: "absolute",
          width: size * 3,
          height: size * 3,
          borderRadius: (size * 3) / 2,
          backgroundColor: color,
          opacity,
          transform: [{ scale }],
        }}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
};

const TodoInput = () => {
  const { colors } = useTheme();
  const homeStyles = createHomeStyles(colors);

  const [newTodo, setNewTodo] = useState("");
  const [debouncedText, setDebouncedText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const addTodo = useMutation(api.todos.addTodo);

  // 🔒 HARD LOCK (prevents double submit)
  const submitLock = useRef(false);

  // 🎬 Animations
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  // 🕒 Debounce for submit text only
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedText(newTodo);
    }, 250);
    return () => clearTimeout(timeout);
  }, [newTodo]);

  const startLoading = () => {
    setSubmitting(true);
    submitLock.current = true;

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.94,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const stopLoadingSuccess = () => {
    setSubmitting(false);
    submitLock.current = false;

    setSuccess(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    setTimeout(() => setSuccess(false), 650);
  };

  const handleAddTodo = async () => {
    // 🛑 Absolute protection
    if (submitLock.current) return;

    const text = debouncedText.trim();
    if (!text) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      startLoading();
      await addTodo({ text });
      setNewTodo("");
      stopLoadingSuccess();
    } catch (error) {
      console.log("Error adding a todo", error);
      submitLock.current = false;
      setSubmitting(false);
      Alert.alert("Error", "Failed to add the Todo :(");
    }
  };

  const glowScale = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.35],
  });

  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.28],
  });

  const isActive = !!newTodo.trim();

  return (
    <View style={homeStyles.inputSection}>
      <View style={homeStyles.inputWrapper}>
        <TextInput
          style={homeStyles.input}
          placeholder="What needs to be done?"
          value={newTodo}
          onChangeText={setNewTodo}
          onSubmitEditing={handleAddTodo}
          placeholderTextColor={colors.textMuted}
          editable={!submitting}
        />

        <TouchableOpacity
          onPress={handleAddTodo}
          activeOpacity={0.85}
          disabled={!isActive || submitting}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Animated.View
              pointerEvents="none"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 999,
                backgroundColor: colors.primary,
                opacity: glowOpacity,
                transform: [{ scale: glowScale }],
              }}
            />

            <LinearGradient
              colors={
                isActive
                  ? colors.gradients.primary
                  : colors.gradients.muted
              }
              style={homeStyles.addButton}
            >
              {success ? (
                <Ionicons name="checkmark" size={22} color="#fff" />
              ) : submitting ? (
                <PulseLoader size={8} color="#fff" />
              ) : (
                <Ionicons name="add" size={24} color="#fff" />
              )}
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TodoInput;
