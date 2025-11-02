import CryptoJS from "crypto-js";

const KEY = import.meta.env.VITE_CRYPTOJS_KEY;
const IV = import.meta.env.VITE_CRYPTOJS_IV;

const key = CryptoJS.enc.Utf8.parse(KEY);
const iv = CryptoJS.enc.Utf8.parse(IV);

export function decryptOtp(cipherText) {
  try {
    const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("OTP decryption failed:", error);
    return null;
  }
}
