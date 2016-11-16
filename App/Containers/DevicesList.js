import React, { PropTypes } from 'react';
import { View, Text, ListView, Alert } from 'react-native';
import NeuraSDKManager from '../Lib/NeuraSDKManager';

// For empty lists
import AlertMessage from '../Components/AlertMessage';

// Styles
import styles from './Styles/CapabilitiesListStyle';

class DevicesList extends React.Component {

  constructor(props) {
    super(props);
    const dataObjects = [];
    const rowHasChanged = (r1, r2) => (r1 !== r2);

    // DataSource configured
    this.ds = new ListView.DataSource({ rowHasChanged });

    // Datasource is always in state
    this.state = {
      dataSource: this.ds.cloneWithRows(dataObjects),
    };
    this.fetchDevices();
  }

  /* ***********************************************************
  * STEP 3
  * `_renderRow` function -How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={rowData.title} description={rowData.description} />
  *************************************************************/


  /* ***********************************************************
  * STEP 4
  * If your datasource is driven by Redux, you'll need to
  * reset it when new data arrives.
  * DO NOT! place `cloneWithRows` inside of render, since render
  * is called very often, and should remain fast!  Just replace
  * state's datasource on newProps.
  *
  * e.g.
    componentWillReceiveProps (newProps) {
      if (newProps.someData) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(newProps.someData)
        })
      }
    }
  *************************************************************/

  // Used for friendly AlertMessage
  // returns true if the dataSource is empty
  noRowData() {
    return this.state.dataSource.getRowCount() === 0;
  }


  fetchDevices() {
    NeuraSDKManager.getKnownDevices((devicesArray, error) => {
      if (error) {
        Alert.alert(
          'Error',
          'There was an error fetching data in fetchDevices.',
          [
            { text: 'OK', onPress: () => null },
          ]
        );
        return;
      }
      this.setState({
        dataSource: this.ds.cloneWithRows(devicesArray),
      });
    });
  }

  renderRow(rowData) {
    return (
      <View style={styles.row}>
        <Text style={styles.boldLabel}>{rowData}</Text>
      </View>
    );
  }

  // Render a footer.
  renderFooter = () => {
    return (
      <Text> - Footer - </Text>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <AlertMessage title="Nothing to See Here, Move Along" show={this.noRowData()} />
        <ListView
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          enableEmptySections
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default DevicesList;
