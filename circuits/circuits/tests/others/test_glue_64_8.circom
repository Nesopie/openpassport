pragma circom 2.1.9;
include "./test_glue.circom";

template test_glue_64_8(kLengthFactor, n, k) {
    var maxPubkeyBytesLength = 525;    

    signal input pubKey_dsc[k * kLengthFactor];
    signal input pubkey_dsc_padded[maxPubkeyBytesLength];
    signal input salt;
    signal input pubKey_csca_hash;

    component test = HashComputationTest(kLengthFactor, n, k, k * kLengthFactor);
    test.pubKey_dsc <== pubKey_dsc;
    test.pubkey_dsc_padded <== pubkey_dsc_padded;
    test.salt <== salt;
    test.pubKey_csca_hash <== pubKey_csca_hash;

}

component main = test_glue_64_8(2, 64, 8);