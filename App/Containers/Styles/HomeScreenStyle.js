import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics } from '../../Themes/';


export default StyleSheet.create({
  ...ApplicationStyles.screen,
  logo: {
    height: 60,
    width: Metrics.images.logo,
    resizeMode: 'contain',
    marginVertical: 0,
  },
  sdklogo: {
    width: Metrics.images.logo,
    resizeMode: 'contain',
  },
  centered: {
    alignItems: 'center',
  },
});
