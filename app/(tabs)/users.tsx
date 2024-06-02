import { StyleSheet, Image, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import currentEnvironment from '@/constants/environment';
import { useEffect, useState } from 'react';
import Checkbox from 'expo-checkbox';

type Gender = 'female' | 'male' | '';

type User = {
  gender: Gender;
  login: {
    uuid: string;
  };
  name: {
    first: string;
    last: string;
  };
  email: string;
  phone: string;
};

export default function TabTwoScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [gender, setGender] = useState<Gender>('');
  const [pageToGet, setPageToGet] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // const getUsers = async (page: number) => {
  //   // Before fetching data
  //   setLoading(true);

  //   const result = await fetch(
  //     `${currentEnvironment.api.baseUrl}?results=5&gender=${gender}&page=${String(page)}`,
  //   );

  //   const data = await result.json()
  //   const usersResults = data.results as User[] 

  //   // console.log('Users fetched:', usersResults);

  //   setUsers(oldUsers =>
  //     page === 1 ? usersResults : [...oldUsers, ...usersResults],
  //   );

  //   // After fetching data
  //   setLoading(false);
  // };

  const getUsers = async (page: number, gender: Gender) => {
    try {
      setLoading(true); // Before fetching data

      const result = await fetch(
        `${currentEnvironment.api.baseUrl}?results=5&gender=${gender}&page=${String(page)}`,
      );

      if (!result.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await result.json();
      const usersResults = data.results as User[];

      setUsers(oldUsers =>
        page === 1 ? usersResults : [...oldUsers, ...usersResults],
      );
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      // After fetching data
      setLoading(false); 
    }
  };
  

  // useEffect(() => {
  //   void (async () => {
  //     await getUsers(pageToGet);
  //   })();
  // }, [pageToGet, gender]);

  useEffect(() => {
    const fetchData = async () => {
      await getUsers(pageToGet, gender);
    };

    fetchData();
  }, [pageToGet, gender]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#a4c991', dark: '#a4c991' }}
      headerImage={
        <View style={styles.headerContainer}>
          <Image
            source={require('@/assets/images/logo.webp')}
            style={styles.logo}
            resizeMode='contain'
          />
        </View>
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Users</ThemedText>
      </ThemedView>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Checkbox
          value={gender === 'female'}
          onValueChange={() => {
            setGender('female');
            /* Reset page to 1 */
            setPageToGet(1);
          }}
          color={gender === 'female' ? '#4630EB' : undefined}
        />
        <ThemedText> Female</ThemedText>
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Checkbox
          value={gender === 'male'}
          onValueChange={() => {
            setGender('male');
            /* Reset page to 1 */
            setPageToGet(1);
          }}
          color={gender === 'male' ? '#4630EB' : undefined}
        />
        <ThemedText> Male</ThemedText>
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Checkbox
          value={gender === ''}
          onValueChange={() => {
            setGender('');
            /* Reset page to 1 */
            setPageToGet(1);
          }}
          color={gender === '' ? '#4630EB' : undefined}
        />
        <ThemedText> All</ThemedText>
      </View>
      {loading ? (
        <ActivityIndicator size='large' color="#007bff"/>
      ) : users.length > 0 ? (
       users.map((user: User) => (
            <View key={user.login.uuid} style={styles.userContainer}>
              <Text style={styles.userText}>
                Name: {user.name.first} {user.name.last}
              </Text>
              <Text style={styles.userText}>Gender: {user.gender}</Text>
              <Text style={styles.userText}>Email: {user.email}</Text>
              <Text style={styles.userText}>Phone: {user.phone}</Text>
            </View>
          ))
       ) : (
       <ThemedText>No users available</ThemedText>
      )}
      <TouchableOpacity
        style={styles.loadMore}
        onPress={() => {
          setPageToGet(v => v + 1);
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Load More</Text>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 150,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logo: {
    // height: '100%',
    // bottom: 0,
    // left: 0,
    // right: 0,
    // position: 'absolute',
    width: '100%',
    height: '100%',
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  loadMore: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 6,
    marginVertical: 20,
    alignItems: 'center',
  },
  userContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userText: {
    color: 'black',
  }
});
