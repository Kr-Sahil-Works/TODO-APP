import { createSettingsStyles } from "@/assets/styles/settings.styles";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Text,
  View,
} from "react-native";

const AnimatedNumber = ({
  value,
  style,
}: {
  value: number;
  style: any;
}) => {
  const animatedValue = useRef(new Animated.Value(value)).current;
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    animatedValue.stopAnimation();

    Animated.timing(animatedValue, {
      toValue: value,
      duration: 900,
      easing: Easing.inOut(Easing.ease), // ✨ smooth
      useNativeDriver: false,
    }).start();
  }, [value]);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      setDisplayValue(Math.round(value));
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, []);

  return <Text style={style}>{displayValue}</Text>;
};

const ProgressStats = () => {
  const { colors } = useTheme();
  const settingsStyles = createSettingsStyles(colors);

  const todos = useQuery(api.todos.getTodos);
  const totalTodos = todos ? todos.length : 0;
  const completedTodos = todos
    ? todos.filter((todo) => todo.isCompleted).length
    : 0;
  const activeTodos = totalTodos - completedTodos;

  const frostedCard = {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  };

  return (
    <LinearGradient
      colors={colors.gradients.surface}
      style={settingsStyles.section}
    >
      <Text style={settingsStyles.sectionTitle}>Progress Stats</Text>

      <View style={settingsStyles.statsContainer}>
        {/* TOTAL */}
        <View
          style={[
            settingsStyles.statCard,
            frostedCard,
            { borderLeftColor: colors.primary },
          ]}
        >
          <View style={settingsStyles.statIconContainer}>
            <View
              style={[
                settingsStyles.statIcon,
                { backgroundColor: colors.primary },
              ]}
            >
              <Ionicons name="list" size={20} color="#fff" />
            </View>
          </View>

          <View>
            <AnimatedNumber
              value={totalTodos}
              style={settingsStyles.statNumber}
            />
            <Text style={settingsStyles.statLabel}>Total Todos</Text>
          </View>
        </View>

        {/* COMPLETED */}
        <View
          style={[
            settingsStyles.statCard,
            frostedCard,
            { borderLeftColor: colors.success },
          ]}
        >
          <View style={settingsStyles.statIconContainer}>
            <View
              style={[
                settingsStyles.statIcon,
                { backgroundColor: colors.success },
              ]}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            </View>
          </View>

          <View>
            <AnimatedNumber
              value={completedTodos}
              style={settingsStyles.statNumber}
            />
            <Text style={settingsStyles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* ACTIVE */}
        <View
          style={[
            settingsStyles.statCard,
            frostedCard,
            { borderLeftColor: colors.warning },
          ]}
        >
          <View style={settingsStyles.statIconContainer}>
            <View
              style={[
                settingsStyles.statIcon,
                { backgroundColor: colors.warning },
              ]}
            >
              <Ionicons name="time" size={20} color="#fff" />
            </View>
          </View>

          <View>
            <AnimatedNumber
              value={activeTodos}
              style={settingsStyles.statNumber}
            />
            <Text style={settingsStyles.statLabel}>Active</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default ProgressStats;
