/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  Modal,
  FlatList
} from 'react-native';
import firebaseApp from './src/firebase';
import Toast, {DURATION} from 'react-native-easy-toast';
import DatePicker from 'react-native-datepicker';
import {Title, Body, Left, Right, Icon, Button, Container, Header, Footer, FooterTab, Text, Content, Form, Item, Input, Label, Fab, View, List, ListItem} from 'native-base';

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    //realtime listener for firebase db
    this.itemsRef = firebaseApp.database().ref('todos');
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = { description: '', todos: [], date: '', modalVisible: false, active: 'false', listViewData:[]};
  }

  keyExtractor = (item) => item.id;

  renderItem = ({item}) =>
  <View >
    <Text style={{fontSize: 20}}>{item.description}, {item.date}</Text>   
  </View>;

  saveData = () => {
    if (this.state.description != '' && this.state.date != '') {
      this.itemsRef.push({ description: this.state.description, date: this.state.date});
      this.refs.toast.show('Todo saved');
      this.setState({date: '', modalVisible: false});
    }
    else {
      this.refs.toast.show('Some data is missing');      
    }
  };

  cancelButton = () => {
    this.setState({description: '', date: '', modalVisible: false});
  }

  // List todos
  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {
      var items = [];
      var datadesc = [];
      snap.forEach((child) => {
        items.push({
          id: child.key,
          description: child.val().description,
          date: child.val().date,
        });
      });
      snap.forEach((child) => {
        datadesc.push(
         child.val().description);
      });
      this.setState({todos: items});
      this.setState({listViewData: datadesc});
    });
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }

  deleteRow(secId, rowId, rowMap) {
     rowMap[`${secId}${rowId}`].props.closeRow();
    const newData = [...this.state.listViewData];
    newData.splice(rowId, 1);
    this.setState({ listViewData: newData });
    console.log('del',secId,'+',rowId,'+',rowMap);
  }

  render() {
    return (
      <Container>
        <Modal animationType="slide" transparent={false} visible={this.state.modalVisible}
        onRequestClose={() => {}} >
        <Header>
          <Left>
            <Button transparent onPress={this.cancelButton}>
              <Icon name='md-arrow-round-back' />
            </Button>
          </Left>
          <Body>
            <Title>Add To Do</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{padding:8}}>
          <Form>
            
          <Label style={{marginBottom: 8}}>Date</Label>
            <DatePicker
                style={{width: 304, marginBottom: 0}}
                date={this.state.date}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD" 
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                  },
                }}
                onDateChange={(date) => {this.setState({date: date})}}
                />
            <Item floatingLabel style={{marginBottom:16, marginLeft:0}}>
              <Label>Description</Label>
              <Input onChangeText={(description) => this.setState({description})}
                value={this.state.text} />
            </Item>  
              <Button full primary onPress={this.saveData}><Text>Save</Text></Button>
          </Form>
        </Content>
        </Modal>
        <Header>
          <Left>
            <Button transparent>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Our Do</Title>
          </Body>
          <Right />
        </Header>
        <Content>                  
          <Text style={{fontSize: 20, marginRight: 40}}>ALL TODOS</Text>   
         {/*  <FlatList
            data = {this.state.todos}
            keyExtractor = {this.keyExtractor}
            renderItem = {this.renderItem}
            style={{marginTop: 20}}
            /> */}
            {console.log(this.state.listViewData)}
            <List
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
            renderRow={data =>
              <ListItem>
                <Text> {data} </Text>
              </ListItem>}
            renderLeftHiddenRow={data =>
              <Button full onPress={() => alert(data)}>
                <Icon active name="information-circle" />
              </Button>}
            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
              <Button full danger onPress={_ => this.deleteRow(secId, rowId, rowMap)}>
                <Icon active name="trash" />
              </Button>}
            leftOpenValue={75}
            rightOpenValue={-75}
          />
           <Toast ref="toast" position="top"/>
        </Content>
      <Fab
        direction="up"
        containerStyle={{ }}
        style={{ backgroundColor: '#5067FF' }}
        position="bottomRight"
        onPress={() => this.setState({modalVisible: true})}>
        <Icon name="add" />
      </Fab>
      </Container>
    );
  }
}

const datas = [
  'Simon Mignolet',
  'Nathaniel Clyne',
  'Dejan Lovren',
  'Mama Sakho',
  'Alberto Moreno',
  'Emre Can',
  'Joe Allen',
  'Phil Coutinho',
];

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  headercontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },  
  inputcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  listcontainer: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  cancelbutton: {
    backgroundColor: '#DB1D1D',
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
  }
});