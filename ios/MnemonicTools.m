//
//  MnemonicTools.m
//  metabit
//
//  Created by Aaron Cao on 2023/3/30.
//

#import <Foundation/Foundation.h>

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(MnemonicTools, NSObject)

RCT_EXTERN_METHOD(generate: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(getSeedFromMnemonic: (NSString)mnemonic callback: (RCTResponseSenderBlock)callback)

@end
