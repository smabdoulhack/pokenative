import { Link } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { ThemeText } from "./components/ThemeText";
import { useThemeColors } from "./hooks/useThemeColors";
import { Card } from "./components/Card";
import { PokemonCard } from "./components/pokemon/PokemonCard";
import { useFetchQuery, useInfiniteFetchQuery } from "./hooks/useFetchQuery";
import { getPokemonId } from "@/functions/pokemon";
import { SearchBar } from "./components/SearchBar";
import { useState } from "react";
import { Row } from "./components/Row";
import {SortButton} from "./components/SortButton";
import RootView from "./components/RootView";

export default function Index() {
  const colors = useThemeColors();
  const { data, isFetching, fetchNextPage } = useInfiniteFetchQuery("/pokemon?limit=44");
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<"id" | "name">("id");
  const pokemons = data?.pages.flatMap(page => page.results.map(r => ({name: r.name.toLowerCase() ==='charmeleon' ? 'merry' : r.name, id: getPokemonId(r.url)}))) ?? []
  const filterPokemons = [...(search ? pokemons.filter(p => p.name.includes(search.toLowerCase()) || p.id.toString() === search ) : pokemons)].sort((a, b) => (a[sortKey] < b[sortKey]) ? -1 : 1)

  return (
    <RootView>
      <Row style={styles.header} gap={16}>
        <Image
          source={require("@/assets/images/pokeball.png")}
          width={24}
          height={24}
          tintColor={"white"}
        />
        <ThemeText variant="headline" color="grayWhite">
          MerryEtAmis
        </ThemeText>
      </Row>
      <Row gap={16} style={styles.form}>
        <SearchBar value={search} onChange={setSearch} />
        <SortButton value={sortKey} onChange={setSortKey} />
      </Row>
      <Card style={styles.body}>
        <FlatList
          data={filterPokemons}
          numColumns={3}
          contentContainerStyle={[styles.gridGap, styles.list]}
          columnWrapperStyle={styles.gridGap}
          ListFooterComponent={
            isFetching ? <ActivityIndicator color={colors.tint} /> : null
          }
          onEndReached={search ? undefined : () => fetchNextPage}
          renderItem={({ item }) => (
            <PokemonCard
              id={item.id}
              name={item.name}
              style={{ flex: 1 / 3 }}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </Card>
    </RootView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 12,
    paddingBottom: 8
  },
  body: {
    flex: 1,
    marginTop: 16
  },
  gridGap: {
    gap: 8,
  },
  list: {
    padding: 12,
  },
  form: {
    paddingHorizontal: 12,
  },
});
