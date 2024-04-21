import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { captureRef } from 'react-native-view-shot';

export default function App() {
  const [locationText, setLocationText] = useState("");
  const cameraRef = useRef(null);
  const [id, setId] = useState(0);

  useEffect(() => {
    (async () => {
      await getPermissions();
      setInterval(getInstant, 1200);
    })();
  }, []);

  const getPermissions = async () => {
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    if (locationStatus !== 'granted') {
      console.error('Location permission not granted!');
    }

    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    if (cameraStatus !== 'granted') {
      console.error('Camera permission not granted!');
    }
  };


  const getCurrentLocation = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      const { latitude, longitude, speed } = coords;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Speed: ${speed}`);
      setLocationText(`Latitude: ${latitude}, Longitude: ${longitude}, Speed: ${speed}`);
      return {"LAT": latitude, "LON": longitude, "SPEED": speed}
    } catch (error) {
      console.error('Error getting location:', error);
      return {"LAT": 0.0, "LON": 0.0, "SPEED": 0.0};
    }
  };

  const getCameraFrame = async () => {
    try {
      // const imageUri = await captureRef(cameraRef, {
      //   result: "base64",
      //   format: 'png',
      //   quality: 0.5,
      // });
      // return imageUri;
      // console.log('Captured image');
      // return imageUri;
      if (this.camera) {
        return (await this.camera.takePictureAsync({base64:true, quality:0.5, skipProcessing: true})).base64;
      }
    } catch (error) {
      console.log('Error capturing image:', error);
    }
  };

  const getInstant = async () => {
    const imgURI = await getCameraFrame();
    const gpsLoc = await getCurrentLocation();

    const ALT = 5.0; // METERS
    const V_FOV = 70.0; // DEGREES
    const FSIZE = 2 * ALT * Math.tan(180.0 / Math.PI * V_FOV / 2);

    fetch("http://10.0.0.71:3003/post_drone_data", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"gpsData": gpsLoc, "image": imgURI}),
    }).then((res) => console.log("SENT data"));

    var spd = gpsLoc["SPEED"];
    spd = Math.min(7.0, Math.max(spd, 1.70));

    const t = Math.min(1.50, FSIZE / spd);
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>{locationText}</Text>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    width: 380,
    height: 720
  },
  locationContainer: {
    position: 'absolute',
    top: 48,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 8,
  },
  locationText: {
    color: '#fff',
  },
});
