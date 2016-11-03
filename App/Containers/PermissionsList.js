import React from 'react';
import { ScrollView, Text, KeyboardAvoidingView, ListView, View } from 'react-native';
import { connect } from 'react-redux';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
// import { Metrics } from '../Themes';
// external libs
// import Icon from 'react-native-vector-icons/FontAwesome';

// Styles
import styles from './Styles/PermissionsListStyle';


class PermissionsList extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
    };
  }

  render() {
    return (
      <View style={{ marginTop: 70 }}>
        <Text>This app is allowed to request the following permissions:</Text>
        <ScrollView className={styles.container}>
          <KeyboardAvoidingView behavior="position">
            <ListView
              dataSource={this.state.dataSource}
              renderRow={(rowData) => <Text>{rowData}</Text>}
            >
            </ListView>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PermissionsList);
