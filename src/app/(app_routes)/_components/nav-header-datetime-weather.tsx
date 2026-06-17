"use client"

import { useEffect, useState } from "react"
// import { MapPin } from "lucide-react"

// import {
//   useGeolocationCoords,
//   useHeaderWeather,
//   weatherCodeToIcon,
// } from "@/app/(app_routes)/_components/use-header-weather"
// import { Separator } from "@/components/ui/separator"
// import { Skeleton } from "@/components/ui/skeleton"

type LiveClock = {
  dateLabel: string
  timeLabel: string
}

function formatLiveClock(now: Date): LiveClock {
  const dateParts = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
  }).formatToParts(now)

  const weekday =
    dateParts.find((part) => part.type === "weekday")?.value.replace(".", "") ??
    ""
  const day = dateParts.find((part) => part.type === "day")?.value ?? ""
  const capitalizedWeekday =
    weekday.length > 0
      ? `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}`
      : weekday

  const timeLabel = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now)

  return {
    dateLabel: `${capitalizedWeekday}, ${day}`,
    timeLabel,
  }
}

function useLiveClock(): LiveClock {
  const [clock, setClock] = useState<LiveClock>(() =>
    formatLiveClock(new Date())
  )

  useEffect(() => {
    const updateClock = () => {
      setClock(formatLiveClock(new Date()))
    }

    updateClock()
    const intervalId = window.setInterval(updateClock, 30_000)
    return () => window.clearInterval(intervalId)
  }, [])

  return clock
}

// function WeatherSkeleton() {
//   return (
//     <div className="flex items-center gap-2" aria-hidden>
//       <Skeleton className="size-5 shrink-0 bg-border/70" />
//       <div className="grid gap-1 leading-tight">
//         <Skeleton className="h-5 w-9 bg-border/70" />
//         <div className="flex items-center gap-1">
//           <Skeleton className="size-3 shrink-0 bg-border/70" />
//           <Skeleton className="h-3 w-20 bg-border/70 sm:w-24" />
//         </div>
//       </div>
//     </div>
//   )
// }

export function NavHeaderDateTimeWeather() {
  const { dateLabel, timeLabel } = useLiveClock()
  // const coords = useGeolocationCoords()
  // const { data: weather, isPending } = useHeaderWeather(coords)

  // const isWeatherLoading = coords === null || isPending
  // const temperatureLabel =
  //   weather?.temperature === null || weather?.temperature === undefined
  //     ? "—°"
  //     : `${weather.temperature}°`
  // const cityLabel = weather?.city ?? null

  return (
    <div
      className="flex shrink-0 items-center gap-4"
      aria-label="Data, hora e clima local"
    >
      <div className="flex flex-col items-start">
        <span className="text-xs text-foreground">{dateLabel}</span>
        <span className="text-lg font-bold">{timeLabel}</span>
      </div>

      {/* <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-auto"
      />

      <div
        className="flex items-center gap-2"
        aria-busy={isWeatherLoading}
        aria-live="polite"
      >
        {isWeatherLoading ? (
          <WeatherSkeleton />
        ) : (
          <>
            {createElement(weatherCodeToIcon(weather?.weatherCode ?? null), {
              className: "size-5 shrink-0 text-muted-foreground",
              "aria-hidden": true,
            })}
            <div className="flex flex-col items-start">
              <span className="text-lg font-bold">
                {temperatureLabel}
              </span>
              {cityLabel ? (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3 shrink-0" aria-hidden />
                  <span className="truncate max-w-28 sm:max-w-40">
                    {cityLabel}
                  </span>
                </span>
              ) : null}
            </div>
          </>
        )}
      </div> */}
    </div>
  )
}
