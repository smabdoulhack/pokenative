import { View, Text, StyleSheet, ViewProps } from "react-native";
import { Row } from "../Row";
import { ThemeText } from "../ThemeText";
import { useThemeColor } from "@/app-example/hooks/useThemeColor";
import { useThemeColors } from "@/app/hooks/useThemeColors";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";

type Props = ViewProps & {
  name: string;
  value: number;
  color: string;
};

function statShortName(name: string): string {
  return name
    .replaceAll("special", "S")
    .replaceAll("defense", "DEF")
    .replaceAll("attack", "ATK")
    .replaceAll("speed", "SPD")
    .replaceAll("6", "")
    .toUpperCase();
}

export function PokemonStat({ style, color, name, value, ...rest }: Props) {
  const colors = useThemeColors();
  const sharedValue = useSharedValue(value);
  const barInnerStyle = useAnimatedStyle(() => {
    return {
      flex: sharedValue.value,
    };
  });

  const barBackgroundStyle = useAnimatedStyle(() => {
    return {
      flex: 255 - sharedValue.value,
    };
  });

  useEffect(() => {
    sharedValue.value = withSpring(value);
  }, [value]);

  return (
    <Row style={[style, styles.root]} {...rest} gap={8}>
      <View style={[styles.name, { borderColor: colors.grayLight }]}>
        <ThemeText variant="subtitle3" style={{ color: color }}>
          {statShortName(name)}
        </ThemeText>
      </View>
      <View style={styles.number}>
        <ThemeText>{value.toString().padStart(3, "0")}</ThemeText>
      </View>
      <Row style={styles.bar}>
        <Animated.View
          style={[styles.barInner, { backgroundColor: color }, barInnerStyle]}
        />
        <Animated.View
          style={[
            styles.barBackground,
            { flex: 255 - value, backgroundColor: color },
            barBackgroundStyle,
          ]}
        />
      </Row>
    </Row>
  );
}

const styles = StyleSheet.create({
  root: {},
  name: {
    width: 40,
    paddingRight: 8,
    borderRightWidth: 1,
    borderStyle: "solid",
  },
  number: {
    width: 23,
  },
  bar: {
    flex: 1,
    borderRadius: 20,
    height: 4,
    overflow: "hidden",
  },
  barInner: {
    height: 4,
  },
  barBackground: {
    height: 4,
    opacity: 0.24,
  },
});
