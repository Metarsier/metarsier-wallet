package com.metabit;

import androidx.annotation.NonNull;

import com.facebook.common.util.Hex;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.apache.commons.lang3.StringUtils;
import org.bitcoinj.crypto.MnemonicCode;
import org.bitcoinj.crypto.MnemonicException;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.List;

public class MnemonicTools extends ReactContextBaseJavaModule {

    public MnemonicTools(@NonNull ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "MnemonicTools";
    }

    @ReactMethod
    public void generate(Callback callback) throws IOException, MnemonicException.MnemonicLengthException {
        MnemonicCode mnemonicCode = new MnemonicCode();
        SecureRandom secureRandom = new SecureRandom();
        /**必须是被4整除*/
        byte[] initialEntropy = new byte[16];
        secureRandom.nextBytes(initialEntropy);
        List<String> strings = mnemonicCode.toMnemonic(initialEntropy);
        String mnemonic = String.join(" ", strings);
        callback.invoke(mnemonic);
    }

    @ReactMethod
    public void getSeedFromMnemonic(String mnemonic, Callback callback) throws IOException {
        String[] s = StringUtils.split(mnemonic, " ");
        List<String> words = Arrays.asList(s);
        byte[] seed = MnemonicCode.toSeed(words, "");
        String seedHex = Hex.encodeHex(seed, false);
        callback.invoke(seedHex);
    }
}
