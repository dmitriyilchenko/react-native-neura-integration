//
//  NeuraSDKBridge.m
//  neuraReactNativeiOS
//
//  Created by Beau Harper on 11/2/16.
//  Copyright © 2016 Neura. All rights reserved.
//
#import "NeuraSDKReact.h"
#import "RCTLog.h"
#import <NeuraSDK/NeuraSDK.h>
#import "AppDelegate.h"

#define kIsUserLogin @"logged_in"

@implementation NeuraSDKReact

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(authenticateWithPermissions:(RCTResponseSenderBlock)callback)
{
  RCTLogInfo(@"Authenticating");
  AppDelegate *delegate = (AppDelegate *) [[UIApplication sharedApplication] delegate];
  UIViewController *controller = delegate.rootViewController;
  NSMutableArray *permissionsList = nil;
  permissionsList = [NSMutableArray arrayWithObjects:@"userLeftWork", @"userLeftHome", nil];
  
  dispatch_async(dispatch_get_main_queue(), ^{
    [[NeuraSDK sharedInstance] authenticateWithPermissions:permissionsList
                                              onController:controller
                                               withHandler:^(NSString *token, NSString *error) {
                                                 if (token) {
                                                   RCTLogInfo(@"%@", token)
                                                   //                                                   [[NSUserDefaults standardUserDefaults] setBool:YES forKey:kIsUserLogin];
                                                   callback(@[token, [NSNull null]]);
                                                 }  else {
                                                   RCTLogInfo(@"login error = %@", error);
                                                   //                                                   [[NSUserDefaults standardUserDefaults] setBool:YES forKey:kIsUserLogin];
                                                   callback(@[[NSNull null], error]);
                                                 }
                                               }];
  });
}

RCT_EXPORT_METHOD(logout)
{
  [[NeuraSDK sharedInstance] logout];
}

RCT_EXPORT_METHOD(getVersion: (RCTResponseSenderBlock)callback)
{
  callback(@[[[NeuraSDK sharedInstance] getVersion]]);
}

RCT_EXPORT_METHOD(openNeuraSettingsPanel)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [[NeuraSDK sharedInstance] openNeuraSettingsPanel];
  });
}

RCT_EXPORT_METHOD(getSubscriptions: (RCTResponseSenderBlock)callback)
{
  //See what user is subscribed to now
  [[NeuraSDK sharedInstance] getSubscriptions:^(NSDictionary *responseData, NSString *error) {
    if (error) {
      callback(@[[NSNull null], error]);
    }
    NSArray *subscriptionsArray = responseData[@"items"];
    callback(@[subscriptionsArray, [NSNull null]]);
  }];
}

RCT_EXPORT_METHOD(getPermissions: (RCTResponseSenderBlock)callback)
{
  [[NeuraSDK sharedInstance]getAppPermissionsWithHandler:^(NSArray *permissionsArray, NSString *error) {
    if (error) {
      callback(@[[NSNull null], error]);
    }
    callback(@[permissionsArray, [NSNull null]]);
  }];
}

RCT_EXPORT_METHOD(isMissingDataForEvent:(NSString *)eventName callback:(RCTResponseSenderBlock)callback)
{
  callback(@[@([[NeuraSDK sharedInstance] isMissingDataForEvent: eventName])]);
}

RCT_EXPORT_METHOD(getMissingDataForEvent:(NSString *)eventName callback:(RCTResponseSenderBlock)callback)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [[NeuraSDK sharedInstance]getMissingDataForEvent:eventName withHandler:^(NSDictionary *responseData, NSString *error) {
      if (error) {
        callback(@[[NSNull null], error]);
        return;
      }
      callback(@[responseData, [NSNull null]]);
    }];
  });
}

RCT_EXPORT_METHOD(subscribeToEvent:(NSString *)eventName callback:(RCTResponseSenderBlock)callback)
{
  [[NeuraSDK sharedInstance]subscribeToEvent:eventName identifier:[NSString stringWithFormat:@"_%@",eventName] webHookID:nil state:[NSString stringWithFormat:@"state_%@",eventName] completion:^(NSDictionary *responseData, NSString *error) {
    if (error) {
      callback(@[[NSNull null], error]);
      return;
    }
    callback(@[responseData, [NSNull null]]);
  }];
}

RCT_EXPORT_METHOD(removeSubscriptionWithIdentifier:(NSString *)eventName callback:(RCTResponseSenderBlock)callback)
{
  [[NeuraSDK sharedInstance]removeSubscriptionWithIdentifier:[NSString stringWithFormat:@"_%@",eventName] complete:^(NSDictionary *responseData, NSString *error) {
    if (error) {
      callback(@[[NSNull null], error]);
      return;
    }
    callback(@[responseData, [NSNull null]]);
  }];
}

RCT_EXPORT_METHOD(getSupportedCapabilities:(RCTResponseSenderBlock)callback)
{
  [[NeuraSDK sharedInstance] getSupportedCapabilitiesListWithHandler:^(NSDictionary *responseData, NSString *error) {
    if (error){
      callback(@[[NSNull null], error]);
      return;
    }
    if (responseData) {
      NSArray *list = [responseData[@"items"] valueForKey:@"name"];
      callback(@[list, [NSNull null]]);
    }}];
}


RCT_EXPORT_METHOD(getSupportedDevices:(RCTResponseSenderBlock)callback)
{
  [[NeuraSDK sharedInstance] getSupportedDevicesListWithHandler:^(NSDictionary *responseData, NSString *error) {
    if (error){
      callback(@[[NSNull null], error]);
      return;
    }
    if (responseData) {
      NSArray *list = [responseData[@"devices"] valueForKey:@"name"];
      callback(@[list, [NSNull null]]);
    }}];
}

RCT_EXPORT_METHOD(hasDeviceWithCapability:(NSString *)capability callback:(RCTResponseSenderBlock)callback)
{
  [[NeuraSDK sharedInstance]
   hasDeviceWithCapability:capability
   withHandler:^(NSDictionary *responseData, NSString *error) {
     if (error) {
       callback(@[[NSNull null], error]);
       return;
     }
     callback(@[responseData, [NSNull null]]);
   }];
}

RCT_EXPORT_METHOD(addDeviceWithCapability:(NSString *)capability deviceName:(NSString *)deviceName callback:(RCTResponseSenderBlock)callback)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [[NeuraSDK sharedInstance]
     addDeviceWithCapability:capability
     deviceName:deviceName
     withHandler:^(NSDictionary *responseData, NSString *error) {
       if (error) {
         callback(@[[NSNull null], error]);
         return;
       }
       callback(@[responseData, [NSNull null]]);
     }];
  });
}

RCT_EXPORT_METHOD(getUserSituationForTimeStamp:(NSDate *)timestamp contextual:(BOOL *)contextual callback:(RCTResponseSenderBlock)callback)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [[NeuraSDK sharedInstance]
     getUserSituationForTimeStamp:timestamp
     contextual: contextual
     withHandler:^(NSDictionary *responseData, NSString *error) {
       if (error) {
         callback(@[[NSNull null], error]);
         return;
       }
       callback(@[responseData, [NSNull null]]);
     }];
  });
}

RCT_EXPORT_METHOD(sendLog)
{
  [[NSNotificationCenter defaultCenter] postNotificationName:@"NeuraSdkPrivateSendLogByMailNotification" object:nil];
}

@end
