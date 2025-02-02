/** @format */

import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { Request } from "express";
import { EnvValidationService } from "../config/env.validation";
import axios from "axios";

interface IpApiResponse {
  status: string;
  city: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

@Injectable()
export class LocationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly envValidationService: EnvValidationService
  ) {}

  async getLocation(req: Request, lat?: number, lon?: number) {
    try {
      if (lat && lon) {
        // Use reverse geocoding when coordinates are provided
        const { data } = await firstValueFrom<{ data: IpApiResponse }>(
          this.httpService.get(`http://ip-api.com/json/?lat=${lat}&lon=${lon}`)
        );

        if (data.status === "fail") {
          throw new Error("Geocoding failed");
        }

        return {
          city: data.city,
          region: data.region,
          country: data.country,
          ll: [lat, lon],
          isApproximate: false,
        };
      }

      // Get client IP for IP-based location
      const clientIp = this.getClientIp(req);
      const ipToCheck = this.isLocalhost(clientIp) ? "8.8.8.8" : clientIp;

      const { data } = await firstValueFrom<{ data: IpApiResponse }>(
        this.httpService.get(`http://ip-api.com/json/${ipToCheck}`)
      );

      if (data.status === "fail") {
        throw new Error("IP geolocation failed");
      }

      return {
        city: data.city,
        region: data.region,
        country: data.country,
        ll: [data.lat, data.lon],
        isApproximate: true,
      };
    } catch (error) {
      console.error("Location service error:", error);

      if (process.env.NODE_ENV === "development") {
        return {
          city: "Atlanta",
          region: "GA",
          country: "US",
          ll: [33.7488, -84.3877],
          isApproximate: true,
        };
      }

      throw new HttpException(
        {
          status: HttpStatus.SERVICE_UNAVAILABLE,
          error: "Location Service Unavailable",
          message: "Unable to determine location",
        },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }

  private getClientIp(req: Request): string {
    // Check Vercel-specific headers first
    const vercelForwardedFor = req.headers["x-vercel-forwarded-for"];
    if (vercelForwardedFor) {
      return Array.isArray(vercelForwardedFor)
        ? vercelForwardedFor[0]
        : vercelForwardedFor;
    }

    // Check standard forwarded headers
    const forwardedFor = req.headers["x-forwarded-for"];
    if (forwardedFor) {
      return Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : forwardedFor.split(",")[0];
    }

    // Fallback to direct IP
    return req.ip || req.socket.remoteAddress || "127.0.0.1";
  }

  private isLocalhost(ip: string): boolean {
    return (
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip === "::ffff:127.0.0.1" ||
      ip === "localhost"
    );
  }

  async getLocationFromCoordinates(lat: number, lon: number) {
    try {
      console.log("Getting location for coordinates:", { lat, lon });
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json`,
        {
          params: {
            access_token: process.env.MAPBOX_TOKEN,
            types: "place",
          },
        }
      );

      const features = response.data.features;
      if (!features || features.length === 0) {
        throw new Error("No location found");
      }

      const place = features[0];
      const context = place.context || [];

      const city = place.text;
      const region = context.find((c: any) => c.id.startsWith("region"))?.text;
      const country = context.find((c: any) =>
        c.id.startsWith("country")
      )?.text;

      console.log("Location found:", { city, region, country });

      return {
        city,
        region,
        country,
        ll: [lat, lon],
        isApproximate: false,
      };
    } catch (error) {
      console.error("Error getting location from coordinates:", error);
      throw error;
    }
  }

  async getLocationFromIP(req: Request) {
    try {
      const clientIp = this.getClientIp(req);
      console.log("Client IP:", clientIp);

      // Use ipapi.co with the client's IP
      const response = await axios.get(`https://ipapi.co/${clientIp}/json/`);
      const data = response.data;

      console.log("IP location found:", data);

      return {
        city: data.city,
        region: data.region,
        country: data.country_name,
        ll: [data.latitude, data.longitude],
        isApproximate: true,
      };
    } catch (error) {
      console.error("Error getting location from IP:", error);
      throw error;
    }
  }
}
