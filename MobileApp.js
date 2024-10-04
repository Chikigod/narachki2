import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapRef = useRef(null); // Create a reference for the MapView

  useEffect(() => {
    (async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      // Start watching for location updates
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every second
          distanceInterval: 1, // Update if moved 1 meter
        },
        (location) => {
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
          });

          console.log(`Location Accuracy: ${location.coords.accuracy} meters`);

          // Animate map to the user's location
          if (mapRef.current) {
            mapRef.current.animateToRegion(
              {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              },
              1000 // Animation duration in milliseconds
            );
          }
        }
      );

      // Cleanup the subscription on unmount
      return () => {
        if (subscription) {
          subscription.remove();
        }
      };
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation ? currentLocation.latitude : 41.981,
          longitude: currentLocation ? currentLocation.longitude : 21.431,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation={true}
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Your Location"
            description={`Accuracy: ${currentLocation.accuracy} meters`}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '90%',
    height: 400,
    borderRadius: 10,
    margin: 10,
  },
});
