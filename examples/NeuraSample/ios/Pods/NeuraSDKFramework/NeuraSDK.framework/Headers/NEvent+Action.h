//
//  NEvent+Action.h
//  NeuraSDK
//
//  Created by Neura on 28/11/2017.
//  Copyright © 2017 Neura. All rights reserved.
//

#import "NEvent.h"

/**
 The type of the Action Caused by the Engagement.
 */
typedef NS_ENUM(NSUInteger, NEngagementFeatureAction) {
    /** The user snoozed the requested action.*/
    NEngagementFeatureActionSnooze,
    /** The user Approved the requested action .*/
    NEngagementFeatureActionSuccess,
    /** The user Rejected the requested action.*/
    NEngagementFeatureActionRejected,
    /** The user did the opposite action.*/
    NEngagementFeatureActionOpposite,
    /** The user closed the action.*/
    NEngagementFeatureActionClose
};

@interface NEvent (Action)
+ (NSString *)stringForActionType:(NEngagementFeatureAction)action;
@end
