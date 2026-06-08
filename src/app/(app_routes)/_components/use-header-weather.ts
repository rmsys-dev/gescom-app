"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import type { LucideIcon } from "lucide-react"
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
} from "lucide-react"

const IUB_COORDS = { latitude: -18.4200, longitude: -49.2200 }

const WEATHER_STALE_TIME = 10 * 60_000
const WEATHER_REFETCH_INTERVAL = 15 * 60_000

type Coordinates = {
  latitude: number
  longitude: number
}

type OpenMeteoResponse = {
  current?: {
    temperature_2m?: number
    weather_code?: number
  }
}

type ReverseGeocodeResponse = {
  city?: string
  locality?: string
}

export type HeaderWeatherData = {
  temperature: number | null
  weatherCode: number | null
  city: string | null
}

async function fetchWeather(coords: Coordinates): Promise<HeaderWeatherData> {
  const [weatherResponse, geocodeResponse] = await Promise.all([
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,weather_code&timezone=auto`
    ),
    fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=pt`
    ),
  ])

  if (!weatherResponse.ok) {
    throw new Error("Falha ao obter dados do clima")
  }

  const weather = (await weatherResponse.json()) as OpenMeteoResponse
  let city: string | null = null

  if (geocodeResponse.ok) {
    const geocode = (await geocodeResponse.json()) as ReverseGeocodeResponse
    city = geocode.city ?? geocode.locality ?? null
  }

  return {
    temperature:
      typeof weather.current?.temperature_2m === "number"
        ? Math.round(weather.current.temperature_2m)
        : null,
    weatherCode:
      typeof weather.current?.weather_code === "number"
        ? weather.current.weather_code
        : null,
    city,
  }
}

export function weatherCodeToIcon(code: number | null): LucideIcon {
  if (code === null) return Cloud

  if (code === 0) return Sun
  if (code <= 3) return Cloud
  if (code <= 48) return CloudFog
  if (code <= 67) return CloudRain
  if (code <= 77) return CloudSnow
  if (code <= 82) return CloudRain
  if (code <= 86) return CloudSnow
  return CloudLightning
}

export function useGeolocationCoords() {
  const [coords, setCoords] = useState<Coordinates | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setTimeout(() => {
        setCoords(IUB_COORDS)
      }, 0)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => {
        setTimeout(() => {
          setCoords(IUB_COORDS)
        }, 0)
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 600_000 }
    )
  }, [])

  return coords
}

export function useHeaderWeather(coords: Coordinates | null) {
  return useQuery({
    queryKey: ["header-weather", coords?.latitude, coords?.longitude],
    queryFn: () => fetchWeather(coords!),
    enabled: coords !== null,
    staleTime: WEATHER_STALE_TIME,
    refetchInterval: WEATHER_REFETCH_INTERVAL,
  })
}
