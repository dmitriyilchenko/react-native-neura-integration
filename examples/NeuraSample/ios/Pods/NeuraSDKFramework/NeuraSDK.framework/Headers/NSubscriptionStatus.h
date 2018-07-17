//
//  SubscriptionStatus.h
//  NeuraSDK
//
//  Created by Neura on 21/03/2018.
//  Copyright © 2018 Neura. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "NeuraAPIObject.h"

@interface NSubscriptionStatus : NeuraAPIObject
@property (nonatomic, readonly) NSString *eventName;
@property (nonatomic, readonly) BOOL isSubscribed;
@property (nonatomic, readonly) NSString *status;
@property (nonatomic, readonly) NSNumber *timestamp;

- (instancetype)initSubscriptionStatus:(NSDictionary *)dict;
+ (NSArray *)initSubscriptionsStatus:(NSDictionary *)dict;
@end
