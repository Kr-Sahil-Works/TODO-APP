// import useTheme from "@/hooks/useTheme";
// import { LinearGradient } from "expo-linear-gradient";
// import React, { useEffect, useRef } from "react";
// import { Animated, Easing, StyleSheet, Text, View } from "react-native";

// export default function NotesLoader() {
//   const { colors } = useTheme();

//   const paperSlide = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(paperSlide, {
//           toValue: -22,
//           duration: 1400,
//           easing: Easing.out(Easing.cubic),
//           useNativeDriver: true,
//         }),
//         Animated.delay(300),
//         Animated.timing(paperSlide, {
//           toValue: 0,
//           duration: 1200,
//           easing: Easing.in(Easing.cubic),
//           useNativeDriver: true,
//         }),
//       ]),
//     ).start();
//   }, []);

//   return (
//     <LinearGradient
//       colors={colors.gradients.background}
//       style={styles.container}
//     >
//       <View style={styles.wrapper}>
//         {/* Paper (clipped by folder) */}
//         <Animated.View
//           style={[
//             styles.paper,
//             {
//               backgroundColor: colors.surface,
//               transform: [{ translateY: paperSlide }],
//             },
//           ]}
//         >
//           <View style={[styles.line, { backgroundColor: colors.border }]} />
//           <View style={[styles.line, { backgroundColor: colors.border }]} />
//           <View
//             style={[styles.lineShort, { backgroundColor: colors.border }]}
//           />
//         </Animated.View>

//         {/* Folder */}
//         <View style={[styles.folder, { backgroundColor: colors.surface }]} />
//         <View style={[styles.folderTab, { backgroundColor: colors.surface }]} />
//       </View>

//       <Text style={[styles.text, { color: colors.textMuted }]}>
//         Loading your notes…
//       </Text>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   wrapper: {
//     width: 140,
//     height: 110,
//     alignItems: "center",
//     marginBottom: 20,
//     overflow: "hidden",
//   },

//   /* Paper */
//   paper: {
//     position: "absolute",
//     width: 110,
//     height: 70,
//     borderRadius: 10,
//     top: 20,
//     padding: 10,
//     zIndex: 1,
//   },
//   line: {
//     height: 2,
//     borderRadius: 2,
//     marginBottom: 6,
//     width: "100%",
//     opacity: 0.5,
//   },
//   lineShort: {
//     height: 2,
//     borderRadius: 2,
//     width: "60%",
//     opacity: 0.5,
//   },

//   /* Folder */
//   folder: {
//     position: "absolute",
//     bottom: 0,
//     width: 130,
//     height: 60,
//     borderRadius: 12,
//     zIndex: 2,
//     elevation: 3,
//   },
//   folderTab: {
//     position: "absolute",
//     bottom: 46,
//     left: 18,
//     width: 50,
//     height: 18,
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//     zIndex: 0,
//   },

//   text: {
//     fontSize: 14,
//     letterSpacing: 0.3,
//   },
// });

// 2nd loader option

import useTheme from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const DOTS = 10;

export default function HoleLoader() {
  const { colors } = useTheme();

  const animations = useRef(
    Array.from({ length: DOTS }).map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    const loops = animations.map((anim, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 300),
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ),
    );

    loops.forEach((loop) => loop.start());
  }, []);

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <View style={styles.hole}>
        {animations.map((anim, i) => {
          const scale = anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [2, 1, 0.1],
          });

          const opacity = anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1, 0],
          });

          const translateY = anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, -5, 5],
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.circle,
                {
                  backgroundColor: colors.surface,
                  opacity,
                  transform: [{ scale }, { translateY }],
                },
              ]}
            />
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  hole: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },

  circle: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 100,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
  },
});
