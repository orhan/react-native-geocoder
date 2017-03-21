import { NativeModules } from 'react-native';
import GoogleApi from './googleApi.js';

const { RNGeocoder } = NativeModules;

export default {
  apiKey: null,

  setGoogleApiKey(key) {
    this.apiKey = key;
  },

  geocodePosition(position, useGoogle = false) {
    if (!position || !position.lat || !position.lng) {
      return Promise.reject(new Error("invalid position: {lat, lng} required"));
    }

    if (useGoogle && this.apiKey) {
      return GoogleApi.geocodePosition(this.apiKey, position);
    } else {
      return RNGeocoder.geocodePosition(position).catch(err => {
        if (!this.apiKey || err.code !== 'NOT_AVAILABLE') { throw err; }
        return GoogleApi.geocodePosition(this.apiKey, position);
      });
    }
  },

  geocodeAddress(address, useGoogle) {
    if (!address) {
      return Promise.reject(new Error("address is null"));
    }

    if (useGoogle && this.apiKey) {
      return GoogleApi.geocodeAddress(this.apiKey, address);
    } else {
      return RNGeocoder.geocodeAddress(address).catch(err => {
        if (!this.apiKey || err.code !== 'NOT_AVAILABLE') { throw err; }
        return GoogleApi.geocodeAddress(this.apiKey, address);
      });
    }
  },
}
