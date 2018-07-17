//
//  NEvent+Feedback.h
//  NeuraSDK
//
//  Created by Neura on 29/06/2017.
//  Copyright © 2017 Neura. All rights reserved.
//
#import "NEvent.h"

/**
 The type of the feedback.
 */
typedef NS_ENUM(NSUInteger, NFeedbackType) {
    /** Positive feedback. */
    NFeedbackTypeApproved,
    /** Negative feedback. */
    NFeedbackTypeRejected,
    /** Just acknowledging that the event was received. */
    NFeedbackTypeAcknowledge
};

@interface NEvent (Feedback)

+(NFeedbackType)feedbackTypeForBool:(BOOL)approved;
+(NSString *)stringForFeedbackType:(NFeedbackType)feedback;

@end
