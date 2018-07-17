//
//  EngagementPlatformAdapter.h
//  NeuraSDK
//
//  Created by Neura on 07/05/2018.
//  Copyright © 2018 Neura. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NUserEngagementAttributes : NSObject

@property (atomic, readonly) BOOL isSupportingEngagementAttributes;

- (void)addToArrayNamed:(NSString *)name stringValues:(NSArray *)array;
- (void)removeFromArrayNamed:(NSString *)name stringValues:(NSArray *)array;
- (void)incAttribute:(NSString *)name incValue:(int)value;
- (void)setAttribute:(NSString *)name stringValue:(NSString *)value;
- (void)setAttribute:(NSString *)name intValue:(int)value;
- (void)setAttribute:(NSString *)name boolValue:(bool)value;
- (void)setAttribute:(NSString *)name dateValue:(NSDate *)value;
- (void)setAttribute:(NSString *)name doubleValue:(double)value;

@end
