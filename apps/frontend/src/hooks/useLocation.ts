/** @format */

import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Location {
  city: string | null;
  region: string | null;
  country: string | null;
  ll: [number, number];
  isApproximate: boolean;
}

interface Weather {
  description: string;
  icon: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const useLocation = () => {
  const [coordinates, setCoordinates] = useState<GeolocationCoordinates | null>(
    null
  );
  const [geoLocationDenied, setGeoLocationDenied] = useState(false);
  const [showLocationWarning, setShowLocationWarning] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Browser geolocation success:", position.coords);
          setCoordinates(position.coords);
          setShowLocationWarning(false);
          setGeoLocationDenied(false);
        },
        (error) => {
          console.error("Browser geolocation error:", error);
          setGeoLocationDenied(true);
          setShowLocationWarning(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  const locationQuery = useQuery({
    queryKey: ["location", coordinates?.latitude, coordinates?.longitude],
    queryFn: async () => {
      const params = coordinates
        ? {
            lat: coordinates.latitude,
            lon: coordinates.longitude,
            useGeolocation: "true", // Signal to backend that this is from browser geolocation
          }
        : {};
      console.log("Sending location request with params:", params);
      const { data } = await axios.get(`${API_URL}/location`, { params });
      return data;
    },
    enabled: coordinates !== null || geoLocationDenied,
  });

  const weatherQuery = useQuery<Weather>({
    queryKey: [
      "weather",
      locationQuery.data?.ll?.[0],
      locationQuery.data?.ll?.[1],
      coordinates?.latitude,
      coordinates?.longitude,
    ],
    queryFn: async () => {
      const params = coordinates
        ? {
            lat: coordinates.latitude,
            lon: coordinates.longitude,
            useGeolocation: "true",
          }
        : {
            lat: locationQuery.data?.ll?.[0],
            lon: locationQuery.data?.ll?.[1],
          };

      if (!params.lat || !params.lon) {
        throw new Error("No coordinates available");
      }

      const { data } = await axios.get(`${API_URL}/location/weather`, {
        params,
      });
      return data;
    },
    enabled: !!(coordinates || locationQuery.data?.ll),
  });

  return {
    location: locationQuery.data,
    weather: weatherQuery.data,
    isLoadingLocation: locationQuery.isLoading,
    isLoadingWeather: weatherQuery.isLoading,
    locationError: locationQuery.error,
    weatherError: weatherQuery.error,
    showLocationWarning,
  };
};
