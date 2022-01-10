import React, {useState, useEffect} from 'react';
import { StyleSheet, ImageBackground } from 'react-native';

import {Button, Input, Text} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';

import {connect} from 'react-redux';

//import local storage module

import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeScreen(props) {
    const[exists, setExists] = useState(false)
    const [pseudo, setPseudo] = useState('');

    useEffect(() => {
      AsyncStorage.getItem("pseudo", function(error, data) {
        if (data) {
          console.log('user exists')
          setPseudo(data)
          setExists(true)
          
        }
       });
    }, [])

    if (exists){
      return (
        <ImageBackground source={require('../assets/home.jpg')} style={styles.container}>

        <Text>Welcome Back {pseudo}</Text>

        <Button
                icon={
                    <Icon
                    name="arrow-right"
                    size={20}
                    color="#eb4d4b"
                    />
                }
    
                title="Go to Map"
                type="solid"
                onPress={() => {props.onSubmitPseudo(pseudo); AsyncStorage.setItem("pseudo", pseudo); props.navigation.navigate('BottomNavigator', { screen: 'Map' })}}
            />
    
        </ImageBackground>
      )
    }else{
      return (
        <ImageBackground source={require('../assets/home.jpg')} style={styles.container}>
            <Input
                containerStyle = {{marginBottom: 25, width: '70%'}}
                inputStyle={{marginLeft: 10}}
                placeholder='John'
                leftIcon={
                    <Icon
                    name='user'
                    size={24}
                    color="#eb4d4b"
                    />
                }
                onChangeText={(val) => setPseudo(val)}
            />
    
            <Button
                icon={
                    <Icon
                    name="arrow-right"
                    size={20}
                    color="#eb4d4b"
                    />
                }
    
                title="Go to Map"
                type="solid"
                onPress={() => {props.onSubmitPseudo(pseudo); AsyncStorage.setItem("pseudo", pseudo); props.navigation.navigate('BottomNavigator', { screen: 'Map' })}}
            />
    
        </ImageBackground>
      );
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


function mapDispatchToProps(dispatch) {
    return {
      onSubmitPseudo: function(pseudo) { 
        dispatch( {type: 'savePseudo', pseudo: pseudo }) 
      }
    }
  }
  
  export default connect(
      null, 
      mapDispatchToProps
  )(HomeScreen);