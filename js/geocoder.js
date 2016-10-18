import { NativeModules } from 'react-native';
import GoogleApi from './googleApi.js';

const { RNGeocoder } = NativeModules;

export default {
  apiKey: null,

  fallbackToGoogle(key) {
    this.apiKey = key;
  },

  geocodePositionFallback(position) {
    if (!this.apiKey) { throw new Error("Google API key required"); }

    return GoogleApi.geocodePosition(this.apiKey, position);
  },

  geocodeAddressFallback(address) {
    if (!this.apiKey) { throw new Error("Google API key required"); }

    return GoogleApi.geocodeAddress(this.apiKey, address);
  },

  geocodePosition(position) {
    if (!position || !position.lat || !position.lng) {
      return Promise.reject(new Error("invalid position: {lat, lng} required"));
    }

    return RNGeocoder.geocodePosition(position).catch(err => {
      if (!this.apiKey || err.code !== 'NOT_AVAILABLE') { throw err; }
      return this.geocodePositionFallback(position);
    });
  },

  geocodeAddress(address) {
    if (!address) {
      return Promise.reject(new Error("address is null"));
    }

    return RNGeocoder.geocodeAddress(address).catch(err => {
      if (!this.apiKey || err.code !== 'NOT_AVAILABLE') { throw err; }
      return this.geocodeAddressFallback(address);
    });
  },
}
