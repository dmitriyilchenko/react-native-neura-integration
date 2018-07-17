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
  if (![NeuraSDK.shared isAuthenticated]) {
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
    }];
  });
}

RCT_REMAP_METHOD(addWebhookSubsciption,
                 eventName:(NSString *)eventName
                 identifier:(NSString *)identifier
                 webhookId:(NSString *)WebhookId
                 tagEngagementFeatureResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
      NSubscription *subscription = [[NSubscription alloc] initWithEventName:eventName identifier:identifier webhookId:WebhookId method:NSubscriptionMethodWebhook];
        [NeuraSDK.shared addSubscription:(subscription) callback:^(NeuraAddSubscriptionResult * _Nonnull result){
            if (result.success) {
                resolve(@(YES));
            } else {
                NeuraAPIError *err = result.error;
                reject([NSString stringWithFormat: @"%lu", (long)err.code], err.localizedDescription, err);
            }
        }];
    });
}

RCT_REMAP_METHOD(addPushSubscription,
                 eventName:(NSString *)eventName
                 pushIdentifier:(NSString *)pushIdentifier
                 tagEngagementFeatureResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSubscription *subscription = [[NSubscription alloc] initWithEventName:eventName identifier:pushIdentifier webhookId:nil method:NSubscriptionMethodPush];
    [NeuraSDK.shared addSubscription:(subscription) callback:^(NeuraAddSubscriptionResult * _Nonnull result){
      if (result.success) {
        resolve(@(YES));
      } else {
        NeuraAPIError *err = result.error;
        reject([NSString stringWithFormat: @"%lu", (long)err.code], err.localizedDescription, err);
      }
    }];
  });
}

RCT_REMAP_METHOD(simulateEvent,
                 eventName:(NSString *)eventName
                 simulateEventResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NEventName enumEventName = [NEvent enumForEventName:eventName];
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
                 featureName:(NSString *)featureName
                 value:(nullable NSString *)value
                 instanceId:(nullable NSString *)instanceId
                 tagEngagementAttemptResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSError *error = nil;
    BOOL success = [NeuraSDK.shared tagEngagementAttempt:featureName value:nil instanceId:nil error:&error];
    if (success) {
      resolve(@(YES));
    } else {
      reject([NSString stringWithFormat: @"%lu", (long)error.code], error.localizedDescription, error);
    }
  });
}

RCT_REMAP_METHOD(tagEngagementFeature,
                 featureName:(NSString *)featureName
                 action:(NSString *)action
                 value:(nullable NSString *)value
                 instanceId:(nullable NSString *)instanceId
                 tagEngagementFeatureResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSDictionary *enumValueByName = @{
      @"FeatureActionSnooze":   @(NEngagementFeatureActionSnooze),
      @"FeatureActionSuccess":  @(NEngagementFeatureActionSuccess),
      @"FeatureActionRejected": @(NEngagementFeatureActionRejected),
      @"FeatureActionOpposite": @(NEngagementFeatureActionOpposite),
      @"FeatureActionClose":    @(NEngagementFeatureActionClose)
    };
    NSNumber *enumValueNumber = enumValueByName[action];

    NSError *error = nil;
    BOOL success = [NeuraSDK.shared tagEngagementFeature:featureName action:(NEngagementFeatureAction)[enumValueNumber integerValue] value:value instanceId:instanceId error:&error];
    if (success) {
      resolve(@(YES));
    } else {
      reject([NSString stringWithFormat: @"%lu", (long)error.code], error.localizedDescription, error);
    }
  });
}
@end
