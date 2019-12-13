import React from 'react';
import { Text, View, TouchableOpacity , Platform} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    flashMode: Camera.Constants.FlashMode.off,
    photo:null,
    uploading: false,
  };

  async componentWillMount() {
    const cameraStatus = (await Permissions.askAsync(Permissions.CAMERA)).status;
    const storageStatus = (await Permissions.askAsync(Permissions.CAMERA_ROLL)).status;
    this.setState({ hasCameraPermission: cameraStatus === 'granted', hasStoragePermission: storageStatus === 'granted' });
    
  }

  snap = async () => {
    if (this.camera) {

      const { uri } = await this.camera.takePictureAsync();
      const fileString = await FileSystem.readAsStringAsync(uri)
      await FileSystem.writeAsStringAsync(`${FileSystem.documentDirectory}photo.jpg`, fileString)
      await MediaLibrary.createAssetAsync(uri);
      
    }
  };

    pickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
      });  
      console.log(result);
      if (!result.cancelled) {
        this.setState({ photo: result.uri });
      }
      this.handleSubmit();
    } 

    handleSubmit = () => {
      let form_data = new FormData();
      console.log(this.state.photo);
      form_data.append('image', this.state.photo);
      console.log(form_data);
      let url = 'http://f76a602f.ngrok.io/image';
      axios.post(url, form_data, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      })
          .then(res => {
            console.log(res.data);
          })
          .catch(err => console.log(err))
    };




/* var fs = require("fs");
var request = require("request");

const options = {
    method: "POST",
    url: "http://34.93.51.153/images",
    headers: {
        "Content-Type": "multipart/form-data"
    },
    formData : {
        "image" : fs.createReadStream("/home/omiee/Desktop/projects/folder1/pan_api/om_pan.jpg")
    }
};

request(options, function (err, res, body) {
    if(err) console.log(err);
    console.log(body);
}); */
   
   
    // storePicture = () => {
    //   console.log(PicturePath);
    //   if (PicturePath) {
      
    // //     const result = new FormData();
    //     result.append("image", {
    //       uri:PicturePath,
    //       name: 'image.jpg',
    //       type: 'image/jpg'
    //     });
    
    //     const config = {
    //       method: 'POST',
    //       headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'multipart/form-data;',
    //         'type': 'formData'
    //       },
    //       body: result
          
    //     };
    
    //     fetch('http://f1c3e9cb.ngrok.io', config).then(responseData => {
    //       console.log(responseData);
          
    //     }).catch(err => { console.log(err); });
    //   }
    // }
    
       
render() {

    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;      

    } else {
      return (
        <View style={{ flex: 1 }} >
          <Camera style={{ flex: 1 }} 
                type={this.state.type}
                flashMode={this.state.flashMode}
                ref={ref => { this.camera = ref; }}>

            <View
              style={{
                flex: 3,
                backgroundColor: 'transparent',
                position:'absolute',
                top:30,
                right:10               

              }}>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',

                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  });
                }}>
                  <Ionicons
                        name="md-reverse-camera"
                        color="white"
                        size={35}
                    />
                    
              </TouchableOpacity>
            </View>

            <View style={{
              flex:1,
              width:'100%',
                position: 'absolute',
                height: 100,
                bottom: 0,
                flexDirection:'row',
                
            }}>
            <View style={{
                  flex:1,
                  alignItems: 'center',
                  justifyContent: 'center',
              }}>
                <TouchableOpacity onPress={() => {
                  this.setState({
                    flashMode:
                      this.state.flashMode === Camera.Constants.FlashMode.on
                        ? Camera.Constants.FlashMode.off
                        : Camera.Constants.FlashMode.on,
                  });
                }}>
                    <Ionicons
                        name={this.state.flashMode ? "md-flash" : 'md-flash-off' }
                        color="white"
                        size={35}
                    />
                </TouchableOpacity >
            </View>
            <View style={{
                  flex:1,
                  alignItems: 'center',
                  justifyContent: 'center',
              }}>
                <TouchableOpacity onPress={this.snap}>
                    <Ionicons
                        name="md-camera"
                        color="white"
                        size={35}
                    />
                </TouchableOpacity>
            </View>
            <View style={{
                  flex:1,
                  alignItems: 'center',
                  justifyContent: 'center',
              }}>
                <TouchableOpacity onPress={this.pickImage} >
                    <Ionicons
                        name="md-photos"
                        color="white"
                        size={35}
                    />

                </TouchableOpacity>
            </View>
        </View>
          </Camera>
        </View>
      );
    }
  }
}
