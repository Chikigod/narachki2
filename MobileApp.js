import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [orderLocations, setOrderLocations] = useState([]); // Store an array of order locations
  const mapRef = useRef(null); // Create a reference for the MapView

  // Function to calculate distance between two points (Haversine formula)
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371e3; // Earth radius in meters

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Function to check if any radiuses overlap
  const checkRadiusOverlap = () => {
    for (let i = 0; i < orderLocations.length; i++) {
      for (let j = i + 1; j < orderLocations.length; j++) {
        const location1 = orderLocations[i];
        const location2 = orderLocations[j];
        const distance = haversineDistance(
          location1.latitude,
          location1.longitude,
          location2.latitude,
          location2.longitude
        );

        // If the distance between the centers is less than the sum of the radiuses
        if (distance < location1.accuracy + location2.accuracy) {
          Alert.alert('Radius Overlap', `Order ${i + 1} and Order ${j + 1} overlap.`);
        }
      }
    }
  };

  const handleSubmitOrder = async () => {
    // Request permission to access location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Permission to access location was denied.');
      return;
    }

    // Get the current location when the order is submitted
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    const { latitude, longitude, accuracy } = location.coords;

    // Add the new location to the array of order locations
    setOrderLocations((prevLocations) => [
      ...prevLocations,
      {
        latitude,
        longitude,
        accuracy,
      },
    ]);

    Alert.alert('Order Submitted', `Location Accuracy: ${accuracy} meters`);

    // Animate map to the new order location
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000 // Animation duration in milliseconds
      );
    }
  };

  // Check for overlapping radiuses each time a new location is added
  useEffect(() => {
    if (orderLocations.length > 1) {
      checkRadiusOverlap();
    }
  }, [orderLocations]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 41.981,
          longitude: 21.431,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        {/* Show all markers and accuracy circles for each submitted order location */}
        {orderLocations.map((location, index) => (
          <React.Fragment key={index}>
            <Marker
              coordinate={location}
              title={`Order ${index + 1}`}
              description={`Accuracy: ${location.accuracy} meters`}
            />
            {/* Circle to represent location accuracy */}
            <Circle
              center={location}
              radius={location.accuracy} // Radius based on accuracy
              strokeColor="rgba(0, 150, 255, 0.5)" // Border color
              fillColor="rgba(0, 150, 255, 0.2)" // Fill color for accuracy area
            />
          </React.Fragment>
        ))}
      </MapView>

      {/* Submit Order Button */}
      <View style={styles.buttonContainer}>
        <Button title="Submit Order" onPress={handleSubmitOrder} />
      </View>
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
  buttonContainer: {
    marginTop: 20,
  },
});
