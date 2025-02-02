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
          setCoordinates(position.coords);
          setShowLocationWarning(false);
        },
        (error) => {
          console.log("Geolocation error:", error);
          setGeoLocationDenied(true);
          setShowLocationWarning(true);
        }
      );
    } else {
      setGeoLocationDenied(true);
      setShowLocationWarning(true);
    }
  }, []);

  const locationQuery = useQuery<Location>({
    queryKey: ["location", coordinates?.latitude, coordinates?.longitude],
    queryFn: async () => {
      const params = coordinates
        ? {
            lat: coordinates.latitude,
            lon: coordinates.longitude,
          }
        : {};
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
    ],
    queryFn: async () => {
      if (!locationQuery.data?.ll) throw new Error("No coordinates available");
      const { data } = await axios.get(`${API_URL}/location/weather`, {
        params: {
          lat: locationQuery.data.ll[0],
          lon: locationQuery.data.ll[1],
        },
      });
      return data;
    },
    enabled: !!locationQuery.data?.ll,
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
