/** Date: 23/01/2020
 * This application was created by Sumedh for Assignment purpose only
 * the images used in this project are rendered locally as no api was provided to fetch images from 
 * provided api response.
 * I have used flexwrap for rendering list of objects, landscape mode won't disturb the UI
 * 
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions
} from 'react-native';
import axios from 'axios';
import ImageZoom from 'react-native-image-pan-zoom';

const reqimages = {
  0: require("./resources/images/tshirt-0.jpeg"),
  1: require("./resources/images/tshirt-1.jpeg"),
  2: require("./resources/images/tshirt-2.jpeg"),
  3: require("./resources/images/tshirt-3.jpeg"),
  4: require("./resources/images/tshirt-4.jpeg"),
  5: require("./resources/images/tshirt-5.jpeg")
 }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      feedback:false,
      modalitem:{},
      myimage:0,
      notification:false
    }
  }

  componentDidMount() {
    this.getDataFromApi(0)
  }

  getDataFromApi(offset) {
    // For this application offset format for api calls has not been provided
    // so offset will remail unused.
    axios.get('https://demo5540272.mockable.io/listingAPI').then(response => {
      console.log('response', response.data.data.listing.products)
      this.setState({ data: response.data.data.listing.products ,modalitem:response.data.data.listing.products[0]})
    }).catch(err => {

    })

  }

  renderImages(images){
    const{myimage}=this.state;
    return <View style={{alignItems:'center'}}>
<ImageZoom cropWidth={Dimensions.get('window').width*.8}
                cropHeight={300}
                imageWidth={200}
                imageHeight={200}
                ref={ ref => this.rnZoom = ref }
                >
      <Image source={reqimages[myimage]} style={{ height: '100%', alignSelf:'center' }} resizeMode="contain" />
      </ImageZoom>
      <FlatList 
    data={images}
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{paddingHorizontal:20,alignItems:'center'}}
    renderItem={({ item, index }) => {
      return  <TouchableOpacity style={{borderWidth:1,borderColor:'#ddd',marginHorizontal:10}} onPress={()=>{this.setState({myimage:index}); this.rnZoom.reset()}}>
      <Image source={reqimages[index]} style={{ height: 100,width:100, alignSelf:'center' }} resizeMode="contain" />
      </TouchableOpacity>
    }}
    />

    <TouchableOpacity style={styles.button}
    onPress={()=>this.setState({feedback:false,notification:true})}>
    <Text style={{color:'#fff'}}>Add to cart</Text>
    </TouchableOpacity>
    </View>
    
  }

  render() {
    const {data,feedback,modalitem,notification} = this.state;
    return (
      <SafeAreaView style={{backgroundColor:'#FFF'}}>
        <View style={styles.header}>
          <Text>Shopping list</Text>
        </View>
        <FlatList
          showsHorizontalScrollIndicator={true}
          data={data}
          onRefresh={() => { this.getDataFromApi(0) }}
          refreshing={false}
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          renderItem={({ item, index }) => {
            return(
              <TouchableOpacity style={styles.items} onPress={()=>this.setState({feedback:true,modalitem:item})}>
                <Text style={styles.producttext}>{item.product}</Text>
                <Image source={require('./resources/images/tshirt-0.jpeg')} style={{ height: 100, alignSelf:'center' }} resizeMode="contain" />
              </TouchableOpacity>
            )
          }}
          keyExtractor={item => item.id}
        />
          <Modal visible={feedback} transparent={false} onRequestClose={() => this.setState({ feedback: false,myimage:0})}>
            <SafeAreaView>
              <ScrollView>
              <View   style={{marginTop:20,alignItems:'flex-end',paddingRight:20}}>
            <TouchableOpacity onPress={()=>this.setState({ feedback: false,myimage:0})}>
              <Text style={{fontSize:20,fontWeight:'700'}}>X</Text>
            </TouchableOpacity>
            </View>
            <Text style={{textAlign:'center',fontSize:22, fontWeight:'700',paddingHorizontal:10,marginTop:10}}>{modalitem.product}</Text>
            {this.renderImages(modalitem.images)}
            </ScrollView>
            </SafeAreaView>
        </Modal>

        <Modal visible={notification} transparent={true} onRequestClose={() => this.setState({ notification: false})}>
            <SafeAreaView style={{backgroundColor:'rgba(0,0,0,0.5)',flex:1, justifyContent:'center',alignItems:'center'}}>
            <View style={{width:'70%',height:200,backgroundColor:'#fff',borderRadius:7}}>
            <Text style={{paddingHorizontal:20,textAlign:'center',marginTop:10}}>{modalitem.product}{'\n'} added successfully to cart</Text>
            <TouchableOpacity onPress={()=>this.setState({modalitem:[],notification:false})}
            style={styles.button}>
              <Text style={{color:'#fff'}}>OK</Text>
            </TouchableOpacity>
            </View>
            </SafeAreaView>
          </Modal>
      </SafeAreaView>
    )
  };
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 40
  },
  items:{
    width: 150,
    borderRadius:7,
    borderWidth:1,
    borderColor:'#eee',
    height:'auto',
    alignSelf:'center',
    marginBottom:20
  },
  container:{
 
  },
  contentContainer:{
   paddingBottom:70,
   flexWrap: 'wrap', 
   flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  producttext:{
    alignSelf:'center',
    marginTop:5,
    textAlign:'center'
  },
  button:{
    borderRadius:7,
    width:150,
    height:50,
    alignSelf:'center',
    justifyContent:'center',
    alignItems:'center',
    marginVertical:30,
    backgroundColor:'#000'
  }
});

export default App;
