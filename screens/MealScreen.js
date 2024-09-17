import React, { useLayoutEffect, useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "../context/FavoriteContext";
import Toast from "react-native-toast-message";
import ThemeContext from "../context/ThemeContext";
import { Colors } from "../color";

const { width, height } = Dimensions.get("window");

const MealScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId } = route.params;
  const {
    addFavorite,
    removeFavorite,
    isFavorite: checkIsFavorite,
  } = useFavorites();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity onPress={toggleFavorite}>
        {/* Ionicons icon does not need a Text wrapper, so this is correct */}
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={36}
          color="tomato"
          style={{ marginRight: 10 }}
        />
      </TouchableOpacity>
    ),
  });
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${categoryId}`
        );
        const mealData = response.data.meals[0];
        setMeal(mealData);
        setIsFavorite(checkIsFavorite(response.data.meals[0].idMeal));
      } catch (error) {
        console.error("Error fetching meal:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
    
}, [categoryId, isFavorite]);
const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
      if (!meal) return;
      if (isFavorite) {
      removeFavorite(categoryId);
      Toast.show({
        type: "success",
        text2: `${meal.strMeal} has been removed from your favorites.`,
    });
} else {
    addFavorite(meal);
      Toast.show({
        type: "success",
        text2: `${meal.strMeal} has been added to your favorites!`,
      });
    }
  };
  

  const openYouTube = (url) => {
    Linking.openURL(url);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  if (!meal) {
    return (
      <View
        style={[
          styles.container,
          isDarkMode ? styles.darkContainer : styles.lightContainer,
        ]}
      >
        <Text style={isDarkMode ? Colors.blacl : Colors.white}>
          No find meals
        </Text>
      </View>
    );
  }

  // Lấy danh sách thành phần
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push({
        ingredient: meal[`strIngredient${i}`],
        measure: meal[`strMeasure${i}`],
      });
    }
  }

  return (
      <>
      <ScrollView
        style={[
            styles.container,
            isDarkMode ? styles.darkContainer : styles.lightContainer,
        ]}
        >
        <View
          style={[
              styles.header,
              isDarkMode ? styles.darkHeader : styles.lightHeader,
            ]}
            >
          <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
          <Text
            style={[
              styles.title,
              {color: isDarkMode ? Colors.white : Colors.blacl,}
            ]}
          >
            {meal.strMeal}
          </Text>
          <Text
            style={[
              styles.categoryText,
              {color: isDarkMode ? Colors.white : Colors.blacl,}
            ]}
          >
            Category: {meal.strCategory}
          </Text>
          <Text
            style={[
              styles.areaText,
              {color: isDarkMode ? Colors.white : Colors.blacl,}
            ]}
          >
            Area: {meal.strArea}
          </Text>
        </View>

        <Text
          style={[
            styles.sectionTitle,
            {color: isDarkMode ? Colors.white : Colors.blacl,}
          ]}
        >
          Ingredients
        </Text>
        <View style={styles.ingredientsContainer}>
          {ingredients.map((item, index) => (
            <Text
              key={index}
              style={[
                styles.ingredientText,
                {color: isDarkMode ? Colors.white : Colors.blacl,}
              ]}
            >
              - {item.ingredient}: {item.measure}
            </Text>
          ))}
        </View>

        <Text
          style={[
            styles.sectionTitle,
            {color: isDarkMode ? Colors.white : Colors.blacl,}
            
          ]}
        >
          Instructions
        </Text>
        <Text
          style={[
            styles.description,
            isDarkMode ? styles.darkDescription : styles.lightDescription,
          ]}
        >
          {meal.strInstructions}
        </Text>

        {/* Nút mở YouTube */}
        {meal.strYoutube && (
          <TouchableOpacity
            onPress={() => openYouTube(meal.strYoutube)}
            style={styles.youtubeButton}
          >
            <Text style={styles.youtubeButtonText}>Watch on YouTube</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  lightContainer: {
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    //padding: 20,
  },
  darkHeader: {
    backgroundColor: "#1f1f1f",
  },
  lightHeader: {
    backgroundColor: "#f4f4f4",
  },
  image: {
    flex: 1,
    width: width,
    height: height * 0.3,
    marginBottom: 20,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  categoryText: {
    fontSize: 18,
    marginBottom: 5,
  },
  areaText: {
    fontSize: 18,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    paddingLeft: 20,
  },
  ingredientsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  ingredientText: {
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    textAlign: "justify",
    paddingHorizontal: 20,
    lineHeight: 24,
    marginBottom: 20,
  },
  darkDescription: {
    color: "#e0e0e0",
  },
  lightDescription: {
    color: "#666",
  },
  youtubeButton: {
    backgroundColor: "#FF0000",
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  youtubeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  favoriteIcon: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 50,
    top: 10,
    right: 10,
  },
});

export default MealScreen;
