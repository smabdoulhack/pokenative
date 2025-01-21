import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import RootView from "../components/RootView";
import { Row } from "../components/Row";
import { ThemeText } from "../components/ThemeText";
import { useFetchQuery } from "../hooks/useFetchQuery";
import { useThemeColors } from "../hooks/useThemeColors";
import { Colors } from "../constants/Colors";
import {
  basePokemonStats,
  formatSize,
  formatWeight,
  getPokemonArtwork,
} from "@/functions/pokemon";
import { Card } from "../components/Card";
import { PokemonType } from "./PokemonType";
import { PokemonSpec } from "../components/pokemon/PokemonSpec";
import { PokemonStat } from "../components/pokemon/PokemonStat";
import { Audio } from "expo-av";
import { Asset } from "expo-asset";

export default function Pokemon() {
  const colors = useThemeColors();
  const params = useLocalSearchParams() as { id: string };
  const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id: params.id });
  const id = parseInt(params.id, 10);
  const { data: species } = useFetchQuery("/pokemon-species/[id]", {
    id: params.id,
  });
  const mainType = pokemon?.types?.[0].type.name;
  const colorType = mainType ? Colors.type[mainType] : colors.tint;
  const types = pokemon?.types ?? [];
  const bio = id === 5 ? "Je suis Merry. J'aime dormir et je déteste réviser. Je déteste faire la lessive. J'adore la bonne bouffe et le basket." : species?.flavor_text_entries
    ?.find((e) => e.language.name === "en")
    ?.flavor_text.replaceAll("\n", ". ");

  const stats = pokemon?.stats ?? basePokemonStats; //avoir des stats par défaut avant que les vrais se chargent

  const merrySound = "https:/drive.google.com/uc?export=download&id=1Fhb6MPkFHKU2fk0ZmXGmnfdFTgiwlGDh"
  // "https://drive.google.com/file/d/1Fhb6MPkFHKU2fk0ZmXGmnfdFTgiwlGDh/view";

  const onImagePress = async () => {
    const cry = pokemon?.cries.latest;
    if (!cry) {
      return;
    }

    const { sound } = await Audio.Sound.createAsync(
      // require("./assets/sounds/merry.ogg"),
      {
        uri: id === 5 ? merrySound: cry,
      },
      { shouldPlay: true }
    );
    sound.playAsync();
    // alert("cried");
  };

  const onPrevious = () => {
    router.replace({
      pathname: "/pokemon/[id]",
      params: { id: Math.max(id - 1, 1) },
    });
  };

  const onNext = () => {
    router.replace({
      pathname: "/pokemon/[id]",
      params: { id: Math.min(id + 1, 151) },
    });
  };

  const isFirst = id === 1;
  const isLast = id === 151;

  return (
    <RootView backgroundColor={colorType}>
      <View>
        <Image
          style={styles.pokeball}
          source={require("@/assets/images/pokeball-big.png")}
          width={208}
          height={208}
        />
        <Row style={styles.header}>
          <Pressable onPress={router.back}>
            <Row gap={8}>
              <Image
                source={require("@/assets/images/back.png")}
                width={32}
                height={32}
              />
              <ThemeText
                color="grayWhite"
                variant="headline"
                style={{ textTransform: "capitalize" }}
              >
                {id===5 ? "Merry" : pokemon?.name}{" "}
              </ThemeText>
            </Row>
          </Pressable>
          <ThemeText color="grayWhite" variant="subtitle2">
            # {params.id.padStart(3, "0")}{" "}
          </ThemeText>
        </Row>
        <View style={styles.body}>
          <Row style={styles.imageRow}>
            {isFirst ? (
              <View style={{ width: 24, height: 24 }} />
            ) : (
              <Pressable onPress={onPrevious}>
                <Image
                  source={require("@/assets/images/chevron_left.png")}
                  width={24}
                  height={24}
                />
              </Pressable>
            )}
            <Pressable onPress={onImagePress}>
              <Image
                style={styles.artwork}
                source={{
                  uri: getPokemonArtwork(params.id),
                }}
                width={200}
                height={200}
              />
            </Pressable>
            {isLast ? (
              <View style={{ width: 24, height: 24 }} />
            ) : (
              <Pressable onPress={onNext}>
                <Image
                  source={require("@/assets/images/chevron_right.png")}
                  width={24}
                  height={24}
                />
              </Pressable>
            )}
          </Row>
          <Card style={styles.card}>
            {/* TYPES START*/}
            <Row gap={16} style={{ height: 20 }}>
              {types.map((type) => (
                <PokemonType name={type.type.name} key={type.type.name} />
              ))}
            </Row>
            {/* TYPES END*/}
            {/* ABOUT START*/}
            <ThemeText variant="subtitle1" style={{ color: colorType }}>
              A propos
            </ThemeText>
            <Row>
              <PokemonSpec
                style={{
                  borderStyle: "solid",
                  borderRightWidth: 1,
                  borderColor: colors.grayLight,
                }}
                title={formatWeight(pokemon?.weight)}
                description="Weight"
                image={require("@/assets/images/weight.png")}
              />
              <PokemonSpec
                style={{
                  borderStyle: "solid",
                  borderRightWidth: 1,
                  borderColor: colors.grayLight,
                }}
                title={formatSize(pokemon?.height)}
                description="Height"
                image={require("@/assets/images/straighten.png")}
              />
              <PokemonSpec
                title={pokemon?.moves
                  .slice(0, 2)
                  .map((m) => m.move.name)
                  .join("\n")}
                description="Height"
              />
            </Row>
            {/* ABOUT END*/}
            <ThemeText>{bio}</ThemeText>
            {/* STATS START*/}
            <ThemeText variant="subtitle1" style={{ color: colorType }}>
              Base stats
            </ThemeText>
            <View style={{ alignSelf: "stretch" }}>
              {stats.map((stat) => (
                <PokemonStat
                  name={stat.stat.name}
                  value={stat.base_stat}
                  color={colorType}
                  key={stat.stat.name}
                />
              ))}
            </View>
            {/* STATS END*/}
          </Card>
        </View>
      </View>
    </RootView>
  );
}

const styles = StyleSheet.create({
  header: {
    margin: 20,
    justifyContent: "space-between",
  },
  pokeball: {
    opacity: 1,
    position: "absolute",
    right: 8,
    top: 8,
  },
  imageRow: {
    position: "absolute",
    top: -140,
    zIndex: 2,
    justifyContent: "space-between",
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  artwork: {},
  body: {
    marginTop: 144,
  },
  card: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    gap: 16,
    alignItems: "center",
  },
});
