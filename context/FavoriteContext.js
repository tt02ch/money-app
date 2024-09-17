import React, { createContext, useState, useContext } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (meal) => {
    if (!meal || !meal.idMeal) {
      console.error("Invalid meal object passed to addFavorite");
      return;
    }
  
    setFavorites((prevFavorites) => [...prevFavorites, meal]);
  };
  
  const removeFavorite = (mealId) => {
    if (!mealId) {
      console.error("Invalid mealId passed to removeFavorite");
      return;
    }
  
    setFavorites((prevFavorites) => prevFavorites.filter((meal) => meal.idMeal !== mealId));
  };
  

  const isFavorite = (mealId) => {
    return favorites.some((meal) => meal.idMeal === mealId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};