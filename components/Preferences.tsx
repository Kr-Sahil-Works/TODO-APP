import { createSettingsStyles } from "@/assets/styles/settings.styles";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Switch, Text, View } from "react-native";

const Preferences = () => {
  const [isAutoSync, setIsAutoSync] = useState(true);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const { isDarkMode, toggleDarkMode, colors } = useTheme();

  const settingsStyles = createSettingsStyles(colors);

  const hapticToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <LinearGradient
      colors={colors.gradients.surface}
      style={[
        settingsStyles.section,
        {
          backgroundColor: "rgba(255,255,255,0.12)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.25)",
        },
      ]}
    >
      <Text style={settingsStyles.sectionTitle}>Preferences</Text>

      {/* DARK MODE */}
      <View style={settingsStyles.settingItem}>
        <View style={settingsStyles.settingLeft}>
          <View
            style={[
              settingsStyles.settingIcon,
              { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons name="moon" size={18} color="#fff" />
          </View>
          <Text style={settingsStyles.settingText}>Dark Mode</Text>
        </View>

        <Switch
          value={isDarkMode}
          onValueChange={() => {
            hapticToggle();
            toggleDarkMode();
          }}
          trackColor={{ false: colors.border, true: "#34C759" }} // iOS green
          thumbColor="#fff"
        />
      </View>

      {/* NOTIFICATIONS */}
      <View style={settingsStyles.settingItem}>
        <View style={settingsStyles.settingLeft}>
          <View
            style={[
              settingsStyles.settingIcon,
              { backgroundColor: colors.warning },
            ]}
          >
            <Ionicons name="notifications" size={18} color="#fff" />
          </View>
          <Text style={settingsStyles.settingText}>Notifications</Text>
        </View>

        <Switch
          value={isNotificationsEnabled}
          onValueChange={() => {
            hapticToggle();
            setIsNotificationsEnabled(!isNotificationsEnabled);
          }}
          trackColor={{ false: colors.border, true: "#c3c90c" }}
          thumbColor="#fff"
        />
      </View>

      {/* AUTO SYNC */}
      <View
        style={[
          settingsStyles.settingItem,
          { borderBottomWidth: 0 },
        ]}
      >
        <View style={settingsStyles.settingLeft}>
          <View
            style={[
              settingsStyles.settingIcon,
              { backgroundColor:"#350930" },
            ]}
          >
            <Ionicons name="sync" size={18} color="#fff" />
          </View>
          <Text style={settingsStyles.settingText}>Auto Sync</Text>
        </View>

        <Switch
          value={isAutoSync}
          onValueChange={() => {
            hapticToggle();
            setIsAutoSync(!isAutoSync);
          }}
          trackColor={{ false: colors.border, true: "#571c44" }}
          thumbColor="#fff"
        />
      </View>
    </LinearGradient>
  );
};

export default Preferences;
