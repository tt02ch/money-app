import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Text, Avatar } from "react-native-elements";
import { auth, db } from "../firebase";
import { StatusBar } from "expo-status-bar";
import { AntDesign, Feather, FontAwesome5 } from "@expo/vector-icons";
import { collection, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore"; // Ensure proper imports
import useSignOut from "../hooks/useSignOut";
import CustomListItem from "../components/CustomListItem";

const HomeScreen = ({ navigation }) => {
  const signOutUser = useSignOut();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Quản lý chi tiêu",
      headerRight: () => (
        <View style={{ marginRight: 20 }}>
          <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
            <Text style={{ fontWeight: "bold" }}>Logout</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const userDocRef = doc(db, "users", uid); // Get user document reference
        const userSnapshot = await getDoc(userDocRef); // Fetch user data

        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data()); // Set user data to state
        } else {
          console.log("No such user document!"); // Handle non-existent document
        }
      } else {
        console.log("No user is signed in!"); // Handle case where user is not signed in
      }
      setLoading(false); // Set loading to false after attempting to fetch user data
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "expense"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTransactions = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      setTransactions(fetchedTransactions);

      // Calculate total income and expense
      const income = fetchedTransactions.reduce((acc, doc) => {
        return doc.data.email === auth.currentUser?.email && doc.data.type === "income"
          ? acc + doc.data.price
          : acc;
      }, 0);

      const expense = fetchedTransactions.reduce((acc, doc) => {
        return doc.data.email === auth.currentUser?.email && doc.data.type === "expense"
          ? acc + doc.data.price
          : acc;
      }, 0);

      setTotalIncome(income);
      setTotalExpense(expense);
      setTotalBalance(income - expense);
    });

    return () => unsubscribe();
  }, []);

  const filter = transactions.filter(
    (transaction) => transaction.data.email === auth.currentUser?.email
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.fullName}>
          <Avatar
            size="medium"
            rounded
            source={{
              uri:
                userData?.imageUrl || "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/anh-dai-dien-tet-18.jpg",
            }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontWeight: "bold" }}>Xin chào</Text>
            <Text h4 style={{ color: "#4A2D5D" }}>
              {userData?.fullName || "User"}
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={{ textAlign: "center", color: "aliceblue" }}>
              Tổng tiền hiện tại
            </Text>
            <Text h3 style={{ textAlign: "center", color: "aliceblue" }}>
              $ {totalBalance.toFixed(2)}
            </Text>
          </View>
          <View style={styles.cardBottom}>
            <View>
              <View style={styles.cardBottomSame}>
                <Feather name="arrow-down" size={18} color="green" />
                <Text style={{ textAlign: "center", marginLeft: 5 }}>
                  Thu nhập
                </Text>
              </View>
              <Text h4 style={{ textAlign: "center" }}>
                {`$ ${totalIncome.toFixed(2)}`}
              </Text>
            </View>
            <View>
              <View style={styles.cardBottomSame}>
                <Feather name="arrow-up" size={18} color="red" />
                <Text style={{ textAlign: "center", marginLeft: 5 }}>
                  Chi tiêu
                </Text>
              </View>
              <Text h4 style={{ textAlign: "center" }}>
                {`$ ${totalExpense.toFixed(2)}`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.recentTitle}>
          <Text h4 style={{ color: "#4A2D5D" }}>
            Giao dịch gần đây
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("All")}
          >
            <Text style={styles.seeAll}>Tất cả</Text>
          </TouchableOpacity>
        </View>

        {filter.length > 0 ? (
          <View style={styles.recentTransactions}>
            {filter.slice(0, 3).map((info) => (
              <View key={info.id}>
                <CustomListItem
                  info={info.data}
                  navigation={navigation}
                  id={info.id}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.containerNull}>
            <FontAwesome5 name="list-alt" size={24} color="#EF8A76" />
            <Text h4 style={{ color: "#4A2D5D" }}>
              No Transactions
            </Text>
          </View>
        )}
      </View>
      <View style={styles.addButton}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Home")}
        >
          <AntDesign name="home" size={24} color="#66AFBB" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => navigation.navigate("Add")}
          activeOpacity={0.5}
        >
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("All")}
        >
          <FontAwesome5 name="list-alt" size={24} color="#EF8A76" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullName: {
    flexDirection: "row",
  },
  card: {
    backgroundColor: "#535F93",
    alignItems: "center",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginVertical: 20,
  },
  cardTop: {
    marginBottom: 20,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    margin: "auto",
    backgroundColor: "#E0D1EA",
    borderRadius: 5,
  },
  cardBottomSame: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  recentTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  recentTransactions: {
    backgroundColor: "white",
    width: "100%",
  },
  seeAll: {
    fontWeight: "bold",
    color: "green",
    fontSize: 16,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  plusButton: {
    backgroundColor: "#66AFBB",
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  containerNull: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
