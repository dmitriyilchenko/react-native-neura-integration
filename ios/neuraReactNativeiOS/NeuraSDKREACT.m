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


@end

