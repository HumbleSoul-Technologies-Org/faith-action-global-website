'use client'

import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface EventMapProps {
  latitude: number
  longitude: number
  title: string
  location: string
}

export default function EventMap({ latitude, longitude, title, location }: EventMapProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Initialize map
    const map = L.map('event-map', {
      center: [latitude, longitude],
      zoom: 15,
      minZoom: 3,
      maxZoom: 19,
    })

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    // Create custom marker with red icon
    const markerIcon = L.icon({
      iconUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 41"%3E%3Cpath fill="%23ef4444" d="M12.5 0C5.609 0 0 5.609 0 12.5c0 12.5 12.5 28.333 12.5 28.333S25 25 25 12.5C25 5.609 19.391 0 12.5 0z"/%3E%3Ccircle cx="12.5" cy="12.5" r="4" fill="white"/%3E%3C/svg%3E',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    })

    // Add marker at event location
    L.marker([latitude, longitude], { icon: markerIcon })
      .bindPopup(`<strong>${title}</strong><br/>${location}`)
      .addTo(map)
      .openPopup()

    // Cleanup
    return () => {
      map.remove()
    }
  }, [latitude, longitude, title, location])

  return <div id="event-map" className="w-full h-full" />
}
