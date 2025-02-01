/** @format */

import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import * as geoip from "geoip-lite";
import * as NodeGeocoder from "node-geocoder";

@Injectable()
export class LocationService {
  private readonly geocoder: NodeGeocoder.Geocoder;

  constructor() {
    // Initialize with offline provider
    this.geocoder = NodeGeocoder({
      provider: "openstreetmap",
      // No API key needed, works offline with local database
    });
  }

  async getLocationFromCoordinates(lat: number, lon: number) {
    try {
      const results = await this.geocoder.reverse({ lat, lon });
      const location = results[0];

      if (location) {
        return {
          city: location.city || null,
          region:
            location.state || location.administrativeLevels?.level1long || null,
          country: location.country || null,
          ll: [lat, lon],
        };
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }

    // Fallback if geocoding fails
    return {
      city: null,
      region: null,
      country: null,
      ll: [lat, lon],
    };
  }

  getLocationFromIP(ip: string) {
    // Only use IP-based location as fallback
    const cleanIP = this.cleanIPAddress(ip);
    if (!cleanIP) {
      if (process.env.NODE_ENV === "development") {
        return this.getMockLocation();
      }
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: "Location Not Found",
          message: "Unable to determine location from IP address",
        },
        HttpStatus.NOT_FOUND
      );
    }

    const geo = geoip.lookup(cleanIP);
    if (!geo) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: "Location Not Found",
          message: "Unable to determine location from IP address",
        },
        HttpStatus.NOT_FOUND
      );
    }

    return {
      city: geo.city || null,
      region: geo.region || null,
      country: geo.country || null,
      ll: geo.ll,
    };
  }

  private cleanIPAddress(ip: string): string | null {
    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
      return null;
    }

    if (ip.startsWith("::ffff:")) {
      ip = ip.substring(7);
    }

    if (ip === "127.0.0.1" || ip === "localhost") {
      return null;
    }

    return ip;
  }

  private getMockLocation() {
    return {
      city: "Atlanta",
      region: "GA",
      country: "US",
      ll: [33.749, -84.388],
    };
  }
}
