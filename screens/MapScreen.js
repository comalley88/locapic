import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Overlay, Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

// import local storage module

import AsyncStorage from '@react-native-async-storage/async-storage';
import socketIOClient from "socket.io-client";

var socket = socketIOClient("https://chat-websocket-lacapsule.herokuapp.com/");



export default function MapScreen(props) {

  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [addPOI, setAddPOI] = useState(false);
  const [listPOI, setListPOI] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const [titrePOI, setTitrePOI] = useState();
  const [descPOI, setDescPOI] = useState();

  const [tempPOI, setTempPOI] = useState();


  const [userLocation, setUserLocation] = useState([])
  console.log(userLocation)

  useEffect(() => {
    async function askPermissions() {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        Location.watchPositionAsync({ distanceInterval: 2 },
          (location) => {
            setCurrentLatitude(location.coords.latitude);
            setCurrentLongitude(location.coords.longitude);
            socket.emit("userLocation", {latitude: currentLatitude, longitude: currentLongitude, pseudo: props.pseudo} ); 
      })
    };
  }
    askPermissions();
  }, []);

useEffect(() => {
  AsyncStorage.getItem("POI", function(error, data) {

    console.log('current POI list', JSON.parse(data));

    var placesSaved = JSON.parse(data)
    console.log(placesSaved)

    if (placesSaved) {
      setListPOI(placesSaved)
    }else{
      console.log(error)
    }

    })
}, [])

useEffect(() => { 
  socket.on('SendLocationToAll', (locationData) => {
    setUserLocation([...userLocation, {locationData}]);
  });
}, [userLocation]);

console.log(userLocation)


  var selectPOI = (e) => {
    if (addPOI) {
      setAddPOI(false);
      setIsVisible(true);
      setTempPOI({ latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude });
    }
  }

  var handleSubmit = () => {
    setListPOI([...listPOI, { longitude: tempPOI.longitude, latitude: tempPOI.latitude, titre: titrePOI, description: descPOI }]);
    setIsVisible(false);
    setTempPOI();
    setDescPOI();
    setTitrePOI();
    AsyncStorage.setItem("POI", JSON.stringify([...listPOI, {longitude: tempPOI.longitude, latitude: tempPOI.latitude, titre: titrePOI, description: descPOI}]))
  }

  var markerPOI = listPOI.map((POI, i) => {
    return <Marker key={i} pinColor="blue" coordinate={{ latitude: POI.latitude, longitude: POI.longitude }}
      title={POI.titre}
      description={POI.description}
    />
  });
  var isDisabled = false;
  if (addPOI) {
    isDisabled = true;
  }
  
    return (
      <View style={{ flex: 1 }} >
        <Overlay
          isVisible={isVisible}
          onBackdropPress={() => { setIsVisible(false) }}
        >
          <View>
            <Input
              containerStyle={{ marginBottom: 25 }}
              placeholder='titre'
              onChangeText={(val) => setTitrePOI(val)}
  
            />
  
            <Input
              containerStyle={{ marginBottom: 25 }}
              placeholder='description'
              onChangeText={(val) => setDescPOI(val)}
  
            />
  
            <Button
              title="Ajouter POI"
              buttonStyle={{ backgroundColor: "#eb4d4b" }}
              onPress={() => {handleSubmit();}}
              type="solid"
            />
          </View>
        </Overlay>
  
        <MapView
          onPress={(e) => { selectPOI(e) }}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 48.866667,
            longitude: 2.333333,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker key={"currentPos"}
            pinColor="red"
            title={props.pseudo}
            description="I'am here"
            coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
          />
          {markerPOI}
        </MapView>
        <Button
          disabled={isDisabled}
          title="Add POI"
          icon={
            <Icon
              name="map-marker"
              size={20}
              color="#ffffff"
            />
          }
          buttonStyle={{ backgroundColor: "#eb4d4b" }}
          type="solid"
          onPress={() => setAddPOI(true)} />
      </View>
    );
}

function mapStateToProps(state) {
  return { pseudo : state.pseudo }
}

