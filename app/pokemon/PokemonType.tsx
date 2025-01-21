import { View, Text, ViewStyle } from "react-native";
import { Colors } from "../constants/Colors";
import { ThemeText } from "../components/ThemeText";

type Props = {
  name: keyof (typeof Colors)["type"];
};

export function PokemonType({ name }: Props) {
  return (
    <View style={[rootStyle, { backgroundColor: Colors.type[name] }]}>
      <ThemeText
        color="grayWhite"
        variant="subtitle3"
        style={{ textTransform: "capitalize" }}
      >
        {name}
      </ThemeText>
    </View>
  );
}

const rootStyle = {
  flex: 0,
  height: 20,
  paddingHorizontal: 8,
  borderRadius: 8,
} satisfies ViewStyle;
