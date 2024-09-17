import React, { useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useFavorites } from "../context/FavoriteContext";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../color";

const FavoriteScreen = () => {
  const { favorites, removeFavorite } = useFavorites();
  const navigation = useNavigation();
  const { isDarkMode } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFavorite = favorites
    .sort((a, b) => a.strMeal.localeCompare(b.strMeal))
    .filter((favorite) =>
      favorite.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const renderFavoriteItem = ({ item }) => (
    <View
      style={[
        styles.favoriteItem,
        isDarkMode ? styles.darkFavoriteItem : styles.lightFavoriteItem,
      ]}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Meals", {
            categoryId: item.idMeal,
            name: item.strMeal,
          })
        }
      >
        <Image
          source={{ uri: item.strMealThumb }}
          style={styles.favoriteImage}
        />
        <Text
          style={[
            styles.title,
            isDarkMode ? styles.darkText : styles.lightText,
          ]}
        >
          {item.strMeal}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => removeFavorite(item.idMeal)}
        style={styles.deleteButton}
      >
        <Ionicons name="heart" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  if (favorites.length === 0) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          isDarkMode ? styles.darkContainer : styles.lightContainer,
          {
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Text
          style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}
        >
          No favorite meal in your favorite.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        isDarkMode ? styles.darkContainer : styles.lightContainer,
      ]}
    >
      <TextInput
        style={styles.searchInput}
        placeholder={"Search by name"}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredFavorite}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.idMeal}
        numColumns={2}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: Colors.white
  },
  lightContainer: {
    backgroundColor: Colors.lightbg,
  },
  darkContainer: {
    backgroundColor: Colors.darkbg,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#000",
  },
  favoriteItem: {
    width: "44%",
    margin: 10,
    alignItems: "center",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  lightFavoriteItem: {
    backgroundColor: "#f8f8f8",
  },
  darkFavoriteItem: {
    backgroundColor: "#444",
  },
  favoriteImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  deleteButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});

export default FavoriteScreen;
