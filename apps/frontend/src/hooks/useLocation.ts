/** @format */

import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Location {
  city: string | null;
  region: string | null;
  country: string | null;
  ll: [number, number];
}

interface Weather {
  description: string;
  icon: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
}

export const useLocation = () => {
  const [coordinates, setCoordinates] = useState<GeolocationCoordinates | null>(
    null
  );
  const [locationDetails, setLocationDetails] = useState<{
    city: string | null;
    region: string | null;
  } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setCoordinates(position.coords);

          // Reverse geocode the coordinates
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${
                position.coords.longitude
              },${position.coords.latitude}.json?access_token=${
                import.meta.env.VITE_MAPBOX_TOKEN
              }&types=place,region`
            );
            const data = await response.json();

            const city = data.features.find((f: any) =>
              f.place_type.includes("place")
            )?.text;
            const region = data.features.find((f: any) =>
              f.place_type.includes("region")
            )?.text;

            setLocationDetails({ city, region });
          } catch (error) {
            console.error("Geocoding error:", error);
          }
        },
        (error) => {
          console.log("Geolocation error:", error);
          setCoordinates(null);
        }
      );
    }
  }, []);

  // We only need one query now - for weather
  const weatherQuery = useQuery<Weather>({
    queryKey: ["weather", coordinates?.latitude, coordinates?.longitude],
    queryFn: async () => {
      if (!coordinates) throw new Error("No coordinates available");
      const { data } = await axios.get("/api/location/weather", {
        params: {
          lat: coordinates.latitude,
          lon: coordinates.longitude,
        },
      });
      return data;
    },
    enabled: !!coordinates,
  });

  return {
    location: coordinates
      ? {
          city: locationDetails?.city || null,
          region: locationDetails?.region || null,
          country: "US",
          ll: [coordinates.latitude, coordinates.longitude] as [number, number],
        }
      : null,
    weather: weatherQuery.data,
    isLoadingLocation: false,
    isLoadingWeather: weatherQuery.isLoading,
    locationError: null,
    weatherError: weatherQuery.error,
  };
};
