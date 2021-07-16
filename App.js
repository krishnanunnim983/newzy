import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  Dimensions,
  Linking,
  RefreshControl,
  Image
} from "react-native";

const win = Dimensions.get("window");

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Loading = () => {
  return (
    <View style={styles.Loading}>
       <Image style={styles.LoadingIcon}
        source={require('./assets/img/DualBall.gif')}></Image>
    </View>
  );
};

const noImage = require( './assets/img/no-image.png');


const Home = ({ data }) => {

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  >
    <View>
      {data.map((item, index) => {
        return (
          <View key={index} style={styles.news}>
            <ImageBackground
              source={{uri: item.urlToImage}}
              style={styles.image}
            >
              <View style={styles.newsInfo}>
                <View style={styles.mainHeading}>
                  <View style={styles.date}>
                    <Text style={styles.day}>
                      {item.publishedAt.toString().slice(8, 10)}
                    </Text>
                    <Text style={styles.month}>
                      {
                        monthNames[
                          parseInt(item.publishedAt.toString().slice(5, 7)) - 1
                        ]
                      }
                    </Text>
                  </View>
                  <Text style={styles.heading}>{item.title}</Text>
                </View>
                <Text style={styles.newsFull}>{item.description}...</Text>

                <View style={styles.bottomInfo}>
                  <View>
                    <Text style={styles.author}>{item.source.name}</Text>
                  </View>
                  <View>
                    <Text onPress={() => Linking.openURL(item.url)}>
                      <Ionicons name="logo-chrome" size={20} color="#000" />
                    </Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
        );
      })}
    </View>
    </ScrollView>
  );
};

export default function App() {
  

  const API_KEY = "00658b80c25d4755a5227eada33a7c55";
  const apiUrl = `https://newsapi.org/v2/top-headlines?country=in&category=general&apiKey=${API_KEY}`;
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        return data.articles;
      })
      .then((articles) => {
        setItems(articles);
        setFetchingDataState(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [fetchingData, setFetchingDataState] = React.useState(true);

  if (fetchingData) {
    return <Loading />;
  } else {
    return (
     
        <Home data={items} />
     
    );
  }
}

const styles = StyleSheet.create({
  news: {
    width: "100%",
    height: win.height / 2,
    flex: 1,
  },
  image: {
    resizeMode: "cover",
    alignSelf: "center",
    width: "100%",
    height: win.height / 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: '#000'
  },
  newsInfo: {
    height: "auto",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: "100%",
    padding: 25,
    borderTopLeftRadius: 40,
    borderTopEndRadius: 40,
  },
  mainHeading: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    backgroundColor: "#000",
    width: 40,
    height: 40,
    borderRadius: 50,
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
  },
  day: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: 18,
  },
  month: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    lineHeight: 12,
  },
  heading: {
    fontSize: 14,
    color: "#000",
    marginLeft: 15,
    fontWeight: "bold",
    paddingRight: 40,
  },
  newsFull: {
    fontSize: 14,
    color: "#000",
    fontWeight: "400",
    marginTop: 5,
    marginBottom: 5,
  },
  bottomInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  author: {
    fontSize: 14,
    color: "#000",
    fontWeight: "400",
    fontStyle: "italic",
  },
  Loading: {
    flex: 1,
    backgroundColor: "#000",
    height: "100%",
    alignItems:'center',
    justifyContent: 'center'
  },
  LoadingIcon: {
    width: 50,
    height: 50
  }
});
