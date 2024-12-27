import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useCount } from '../context/CountContext';

interface Item {
  id: number;
  country: string;
  cases: number;
  deaths: number;
  recovered: number;
  flag: string;
}

const HomeScreen: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { count, incrementCount } = useCount();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('https://disease.sh/v3/covid-19/countries');
        const data = response.data.map((item: any, index: number) => ({
          id: index,
          country: item.country,
          cases: item.cases,
          deaths: item.deaths,
          recovered: item.recovered,
          flag: item.countryInfo.flag,
        }));
        setItems(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={incrementCount}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.flag }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.country}</Text>
        <Text style={styles.description}>
          Cases: {item.cases.toLocaleString()}
        </Text>
        <Text style={styles.description}>
          Deaths: {item.deaths.toLocaleString()}
        </Text>
        <Text style={styles.description}>
          Recovered: {item.recovered.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#2E7D52" />
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity style={styles.floatingButton}>
        <Text style={styles.floatingButtonText}>{count}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F7',
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D52',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#2E7D52',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
