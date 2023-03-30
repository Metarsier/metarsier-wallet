//
//  MnemonicTools.swift
//  metabit
//
//  Created by Aaron Cao on 2023/3/30.
//

import Foundation

import MnemonicKit

@objc(MnemonicTools)
class MnemonicTools: NSObject {
  
  @objc
  func generate(_ callback: RCTResponseSenderBlock) {
    let mnemonic: String = Mnemonic.generateMnemonic(strength: 128, language: .english)!
    callback([mnemonic])
  }
  
  @objc
  func getSeedFromMnemonic(_ mnemonic: String, callback: RCTResponseSenderBlock) {
    let seedHex: String = Mnemonic.deterministicSeedString(from: mnemonic)!
    callback([seedHex])
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
