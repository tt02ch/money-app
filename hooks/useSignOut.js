import { useCallback } from 'react';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const useSignOut = () => {
  const navigation = useNavigation();

  const signOutUser = useCallback(() => {
    auth
      .signOut()
      .then(() => navigation.replace('Login'))
      .catch((error) => alert(error.message));
  }, [navigation]);

  return signOutUser;
};

export default useSignOut;