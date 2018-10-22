
# react-native-neura-integration

## Getting started
Follow the instructions to install the SDK for
  * [iOS](https://dev.theneura.com/tutorials/ios)
  * [Android](https://dev.theneura.com/tutorials/android)

`$ npm install bitbucket:dayzz/react-native-neura-integration --save`

### Mostly automatic installation
`$ react-native link react-native-neura-integration`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-neura-integration` and add `RNNeuraIntegration.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNNeuraIntegration.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.dayzzpublic.neuraintegration.RNNeuraIntegrationPackage;` to the imports at the top of the file
  - Add `new RNNeuraIntegrationPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-neura-integration'
  	project(':react-native-neura-integration').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-neura-integration/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-neura-integration')
  	```


## Usage
```javascript
import RNNeuraIntegration from 'react-native-neura-integration';

// TODO: What to do with the module?
RNNeuraIntegration;
```


