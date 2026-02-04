import { createSettingsStyles } from "@/assets/styles/settings.styles";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DangerZone = () => {
  const { colors } = useTheme();
  const settingsStyles = createSettingsStyles(colors);

  // ✅ ORIGINAL LOGIC (UNCHANGED)
  const clearAllTodos = useMutation(api.todos.clearAllTodo);

  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);

  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const openModal = () => {
    setOpen(true);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 14,
        stiffness: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => setOpen(false));
  };

  // ✅ SAME DELETE LOGIC + STRONG HAPTIC ADDED
  const handleDeleteAll = async () => {
    try {
      // 🔴 STRONG iOS VIBRATION
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      const result = await clearAllTodos(); // { deleteCount }
      setDeletedCount(result.deleteCount);

      setOpen(false);
      setSuccessOpen(true);
    } catch (e) {
      console.log("Error clearing todos", e);
      closeModal();
    }
  };

  return (
    <>
      <LinearGradient
        colors={colors.gradients.surface}
        style={settingsStyles.section}
      >
        <Text style={settingsStyles.sectionTitleDanger}>Danger Zone</Text>

        <TouchableOpacity
          style={[settingsStyles.actionButton, { borderBottomWidth: 0 }]}
          onPress={openModal}
          activeOpacity={0.7}
        >
          <View style={settingsStyles.actionLeft}>
            <LinearGradient
              colors={colors.gradients.danger}
              style={settingsStyles.actionIcon}
            >
              <Ionicons name="trash" size={18} color="#fff" />
            </LinearGradient>
            <Text style={settingsStyles.actionTextDanger}>Reset App</Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      </LinearGradient>

      {/* 🔴 DELETE CONFIRM MODAL */}
      <Modal transparent visible={open} animationType="none">
        <Pressable
          onPress={closeModal}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.View
            style={{
              width: "85%",
              borderRadius: 20,
              padding: 22,
              backgroundColor: colors.surface,
              opacity,
              transform: [{ scale }],
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 14 }}>
              <LinearGradient
                colors={colors.gradients.danger}
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 27,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="warning" size={26} color="#fff" />
              </LinearGradient>
            </View>

            <Text
              style={{
                fontSize: 17,
                fontWeight: "600",
                color: colors.text,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Reset app?
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: colors.textMuted,
                textAlign: "center",
                marginBottom: 22,
              }}
            >
              This will permanently delete all your todos.
            </Text>

            <TouchableOpacity
              onPress={handleDeleteAll}
              style={{
                paddingVertical: 14,
                borderRadius: 14,
                backgroundColor: colors.danger,
                alignItems: "center",
                marginBottom: 10,
              }}
              activeOpacity={0.85}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Delete All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeModal}>
              <Text
                style={{
                  textAlign: "center",
                  color: colors.textMuted,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* ✅ SUCCESS CONFIRMATION MODAL */}
      <Modal transparent visible={successOpen} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.35)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "80%",
              borderRadius: 18,
              padding: 22,
              backgroundColor: colors.surface,
              alignItems: "center",
            }}
          >
            <LinearGradient
              colors={colors.gradients.success}
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Ionicons name="checkmark" size={28} color="#fff" />
            </LinearGradient>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.text,
                marginBottom: 6,
              }}
            >
              App reset
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: colors.textMuted,
                textAlign: "center",
                marginBottom: 18,
              }}
            >
              {deletedCount} todo
              {deletedCount === 1 ? "" : "s"} deleted. Your app is now clean.
            </Text>

            <TouchableOpacity
              onPress={() => setSuccessOpen(false)}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 28,
                borderRadius: 12,
                backgroundColor: colors.primary,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DangerZone;
