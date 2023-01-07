import { View, Text,TextInput,TouchableOpacity,ActivityIndicator,Image, Button, PermissionsAndroid} from 'react-native'
import React, { useState } from 'react'
import { Configuration, OpenAIApi } from "openai";
import { API_TOKEN} from "@env";
import RNFetchBlob from "rn-fetch-blob";

const Home = () => {

    const [prompt, onChangePrompt] = useState("");
      const [result, setResult] = useState("");
      const [loading, setLoading] = useState(false);
      const [imagePlaceholder, setimagePlaceholder] = useState(
        "https://img.icons8.com/ios/250/737373/image--v1.png"
      );
    
      const configuration = new Configuration({
        apiKey: API_TOKEN,
      });
 
  const openai = new OpenAIApi(configuration);

  const generateImage = async () => {
    try {
      onChangePrompt(`${prompt}..`);
      setLoading(true);
      const res = await openai.createImage({
        prompt: prompt,
        n: 1,
        size: "256x256",
      });
      setResult(res.data.data[0].url);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const checkPermission = async () => {

    if (Platform.OS === 'ios') {
      downloadImage();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'App needs access to your storage to download Photos',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage Permission Granted.');
          downloadImage();
        } else {
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const downloadImage = () => {
    let date = new Date(); 
    let ext = getExtention(result);
    ext = '.' + ext[0];
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' + 
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', result)
      .then(res => {
        console.log('res -> ', JSON.stringify(res));
        alert('Image Downloaded Successfully !');
      });
  };

  const getExtention = filename => {
    return /[.]/.exec(filename) ?
             /[^.]+$/.exec(filename) : undefined;
  };

  
 

  return (
    <View>
       <View className='py-10 '>
        <Text style={{fontFamily:"Roboto-Medium"}} className='text-xl text-gray-700 font-semibold text-center'>Text-to-Image App 🤓</Text>
        <View className='p-3'>
          <TextInput
            
            className='bg-gray-300 text-center rounded-lg py-3 mt-5'
            onChangeText={onChangePrompt}
            value={prompt}
            editable
            multiline
            numberOfLines={4}
            placeholder='Weird description of an image 👽 :'
            style={{fontFamily:"Roboto-Medium"}}
          />
        </View>
        <TouchableOpacity style={{height:40}} className='mx-10 bg-indigo-800 rounded-xl my-10 justify-center align-middle' onPress={generateImage}>
          <Text style={{fontFamily:"Roboto-Medium"}} className='text-white text-lg text-center'>Generate</Text>
        </TouchableOpacity>
        {loading ? (
          <>
            <View className='p-2'>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={{fontFamily:"Roboto-Medium"}} className='text-center text-xl text-gray-500 font-semibold'>Generating.. 😎🤙</Text>
            </View>
          </>
        ) : (
          <></>
        )}

        <View>
          {result.length > 0 ? (
            <Image
              style={{height:300, width:300, resizeMode:'contain', alignSelf:'center'}}
              source={{
                uri: result,
              }}/>
          ) : (
            
              <Image
                style={{height:300, width:300, resizeMode:'contain', alignSelf:'center'}}
                source={{
                  uri: imagePlaceholder,
                }}
              />
              
            
          )}
        </View>

        <View className='py-3'>
          {result.length > 0 ? (
            <TouchableOpacity onPress={checkPermission} className='my-4 p-3 self-center bg-indigo-800 rounded-full flex-row space-x-2'>
              <Image style={{height:20,width:20,resizeMode:'contain', tintColor:'white'}} source={{uri:"https://img.icons8.com/ios-filled/50/null/downloading-updates.png"}}/>
              <Text style={{fontFamily:"Roboto-Medium"}} className='font-semibold text-white' >Download</Text>
            </TouchableOpacity>
          ) : ( 
              <></>
          )}
        </View>
      
      </View>
    
    </View>
  )
}

export default Home