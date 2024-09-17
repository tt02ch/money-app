import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import ThemeContext from '../context/ThemeContext';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../color';

const CategoryScreen = () => {
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(''); // State for selected area
  const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category
  const [meals, setMeals] = useState([]); // Meals list based on category or area
  const navigation = useNavigation();
  const { isDarkMode } = useContext(ThemeContext);
  
  useEffect(() => {
    const fetchCategoriesAndAreas = async () => {
      try {
        const categoriesResponse = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
        setCategories(categoriesResponse.data.categories);

        const areasResponse = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
        setAreas(areasResponse.data.meals);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchCategoriesAndAreas();
  }, []);

  const fetchMealsByArea = async (area) => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
      setMeals(response.data.meals);
    } catch (error) {
      console.error("Error fetching meals by area: ", error);
    }
  };

  const fetchMealsByCategory = async (category) => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      setMeals(response.data.meals);
    } catch (error) {
      console.error("Error fetching meals by category: ", error);
    }
  };

  // Handle category selection
  const handleCategoryChange = (selectedValue) => {
    setSelectedCategory(selectedValue);
    setSelectedArea(''); // Clear area when category is selected
    if (selectedValue) {
      fetchMealsByCategory(selectedValue); // Fetch meals by selected category
    } else {
      setMeals([]); // Clear meals if no category is selected
    }
  };

  // Handle area selection
  const handleAreaChange = (selectedValue) => {
    setSelectedArea(selectedValue);
    setSelectedCategory(''); // Clear category when area is selected
    if (selectedValue) {
      fetchMealsByArea(selectedValue); // Fetch meals by selected area
    } else {
      setMeals([]); // Clear meals if no area is selected
    }
  };

  const renderMealItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.mealItem, isDarkMode ? styles.darkCategoryItem : styles.lightCategoryItem]}
      onPress={() => navigation.navigate('Meals', { categoryId: item.idMeal, name: item.strMeal })}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.mealImage} />
      <Text style={[styles.mealTitle, isDarkMode ? styles.darkText : styles.lightText]}>
        {item.strMeal}
      </Text>
    </TouchableOpacity>
  );
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryItem, isDarkMode ? styles.darkCategoryItem : styles.lightCategoryItem]}
      onPress={() => handleCategoryChange(item.strCategory)}
    >
      <Image source={{ uri: item.strCategoryThumb }} style={styles.categoryImage} />
      <Text style={[styles.categoryTitle, isDarkMode ? styles.darkText : styles.lightText]}>
        {item.strCategory}
      </Text>
    </TouchableOpacity>
  );
  

  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <StatusBar barStyle={!isDarkMode ? 'dark-content':'light-content'}
            backgroundColor={!isDarkMode ? Colors.lightbg:Colors.darkbg}
          />
      {/* Picker to select category */}
      <Text style={[styles.header,{color: isDarkMode ? Colors.white : Colors.black} ]}>Category</Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.idCategory}
        horizontal
        style={{height:156}}
      />
      {/* Picker to select area */}
      <Text style={[styles.header,{color: isDarkMode ? Colors.white : Colors.black} ]}>Select area</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={selectedArea}
          onValueChange={handleAreaChange}

        >
          <Picker.Item label="Select an Area" value="" />
          {areas.map((areaItem) => (
            <Picker.Item key={areaItem.strArea} label={areaItem.strArea} value={areaItem.strArea} />
          ))}
        </Picker>

      </View>

      <Text style={[styles.header,{color: isDarkMode ? Colors.white : Colors.black} ]}>List Meals</Text>
      {/* Condition to check if meals are available */}
      {meals.length > 0 ? (
        <FlatList
          data={meals}
          renderItem={renderMealItem}
          keyExtractor={(item) => item.idMeal}
          numColumns={2}
          style={{height:'60%'}}
          ListEmptyComponent={<View style={{height:'50%'}}>

            <Text style={styles.emptyText}>No meals available</Text>
          </View>
        }
        />
      ) : (
        <Text style={[styles.selectionText, {height:'50%'}]}>
          {selectedCategory || selectedArea
            ? "No meals available for the selected option."
            : "Please select a category or area to see the meals."}
        </Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%'
  },
  header:{fontSize: 20, fontWeight:'bold', marginLeft: 8, marginBottom:8},
  lightContainer: {
    backgroundColor: Colors.lightbg,
  },
  darkContainer: {
    backgroundColor: Colors.darkbg,
  },
  picker: {
    height: 50,
    width: '90%',
    borderRadius: 10, // Bo góc picker
    borderWidth: 1, // Đường viền cho Picker
    borderColor: false ? '#555' : '#ddd', // Đổi màu đường viền theo theme
    marginVertical: 15,
    alignSelf: 'center',
    backgroundColor: false ? '#444' : '#fff', // Nền đổi theo theme
  },
  mealItem: {
    width: '44%',
    margin: 10,
    alignItems: 'center',
    borderRadius: 15,
    padding: 15,
    backgroundColor: 'white', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  mealImage: {
    width: 120,
    height: 120,
    borderRadius: 15, 
  },
  mealTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categoryItem: {
    width: 120, 
    margin: 8,
    alignItems: 'center',
    borderRadius: 20, 
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.05)', 
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    marginBottom: 6,
  },
  categoryImage: {
    width: 80, 
    height: 80,
    borderRadius: 40, 
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 14, 
    fontWeight: '600',
    textAlign: 'center',
  },
  lightCategoryItem: {
    backgroundColor: '#f8f8f8',
  },
  darkCategoryItem: {
    backgroundColor: '#444',
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
  selectionText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 18,
  },
});

export default CategoryScreen;
