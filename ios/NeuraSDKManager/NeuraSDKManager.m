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

@end
