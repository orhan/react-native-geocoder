import { NativeModules, Platform } from 'react-native';
import GoogleApi from './googleApi.js';

const { RNGeocoder } = NativeModules;

export default {
  apiKey: null,
  language: null,

  setGoogleApiKey(key) {
    this.apiKey = key;
  },

  setLanguage(language) {
    RNGeocoder.setLanguage(language, (result) => {
      this.language = result;
    });
  },

  geocodePosition(position, useGoogle = false) {
    if (!position || !position.lat || !position.lng) {
      return Promise.reject(new Error("invalid position: {lat, lng} required"));
    }

    if (useGoogle && this.apiKey) {
      return GoogleApi.geocodePosition(this.apiKey, position, this.language);
    } else {
      return RNGeocoder.geocodePosition(position).catch(err => {
        if (!this.apiKey || err.code !== 'NOT_AVAILABLE') { throw err; }
        return GoogleApi.geocodePosition(this.apiKey, position, this.language);
      });
    }
  },

  geocodeAddress(address, useGoogle) {
    if (!address) {
      return Promise.reject(new Error("address is null"));
    }

    if (this.language && (Platform.OS === 'ios')) {
      return this.geocodeAddressFallback(address);
    }

    return RNGeocoder.geocodeAddress(address).catch(err => {
      if (err.code !== 'NOT_AVAILABLE') { throw err; }
      return this.geocodeAddressFallback(address);
    });
  },
}
