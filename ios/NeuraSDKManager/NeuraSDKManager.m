//
//  NeuraManagerSDK.m
//  NeuraRN
//
//  Created by Bohdan Pomohaibo.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "NeuraSDKManager.h"
#import <NeuraSDK/NeuraSDK.h>

@implementation NeuraSDKManager


RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(authenticate,
                 authenticateResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NeuraAnonymousAuthenticationRequest *request = [NeuraAnonymousAuthenticationRequest new];
    
    [NeuraSDK.shared authenticateWithRequest:request callback:^(NeuraAuthenticationResult *result) {
      if (result.success) {
        resolve(result.info.accessToken);
      } else {
        NeuraAPIError *err = result.error;

        reject([NSString stringWithFormat: @"%lu", (long)err.code], err.localizedDescription, err);
      }
    }];
  });
}

RCT_REMAP_METHOD(isAuthenticated,
                 isAuthenticatedResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve(@([NeuraSDK.shared isAuthenticated]));
}

RCT_REMAP_METHOD(getUserAccessToken,
                 getUserAccessTokenResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve([NeuraSDK.shared appToken]);
}

RCT_REMAP_METHOD(getUserId,
                 getUserIdResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve([NeuraSDK.shared neuraUserId]);
}

RCT_REMAP_METHOD(logOut,
                 logOutResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  if ([NeuraSDK.shared isAuthenticated]) {
    resolve(@(YES));
  }
  dispatch_async(dispatch_get_main_queue(), ^{
    [NeuraSDK.shared logoutWithCallback:^(NeuraLogoutResult * _Nonnull result) {
      if (result.success) {
        resolve(@(YES));
      } else {
        NeuraAPIError *err = result.error;
        reject([NSString stringWithFormat: @"%lu", (long)err.code], err.localizedDescription, err);     
      }
    }]
  });
}

RCT_REMAP_METHOD(simulateEvent,
                 simulateEventResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NEventName enumEventName = [NEvent enumForEventName:"userStartedDriving"];
    [NeuraSDK.shared simulateEvent:(enumEventName) callback:^(NeuraAPIResult * result){
      if (result.success) {
        resolve(@(YES));
      } else {
        NeuraAPIError *err = result.error;

        reject([NSString stringWithFormat: @"%lu", (long)err.code], err.localizedDescription, err);
      }
    }];
  });
}


// follow https://dev.theneura.com/pages/how-to-use-engagement-api/ for details on how to utilize the Insights API
RCT_REMAP_METHOD(tagEngagementAttempt,
                 tagEngagementAttemptResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSError *error = nil;

    BOOL success = [NeuraSDK.shared tagEngagementAttempt:"featureName" value:"ABTestId" instanceId:nil error:&error];
    if (success) {
      resolve(@(YES));
    } else {
      reject([NSString stringWithFormat: @"%lu", (long)err.code], err.localizedDescription, err);
    }
  });
}

RCT_REMAP_METHOD(tagEngagementFeature,
                 tagEngagementFeatureResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSError *error = nil;
    BOOL success = [NeuraSDK.shared tagEngagementFeature:"featureName" action: NEngagementFeatureActionSuccess value:valueField.text instanceId:instanceIdField.text error:&error];
    if (success) {
      resolve(@(YES));
    } else {
      reject([NSString stringWithFormat: @"%lu", (long)err.code], err.localizedDescription, err);
    }
  });
}
@end
