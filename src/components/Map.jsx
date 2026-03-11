'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { createRoot } from 'react-dom/client'
import 'mapbox-gl/dist/mapbox-gl.css'
import ProfilePopup from './ProfilePopup'
// import Rail from '@/components/Map/Rail'

export default function Map({ profiles }) {
  const [isRailOpen, setIsRailOpen] = useState(true)
  const [idsInView, setIdsInView] = useState([])

  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)

  // shared popup infra
  const popupRef = useRef(null)
  const popupRootRef = useRef(null)

  const profileByIdRef = useRef(new globalThis.Map())

  const hoveredIdRef = useRef(null)
  const selectedIdRef = useRef(null)

  const pendingFcRef = useRef({ type: 'FeatureCollection', features: [] })

  const SOURCE_ID = 'profiles'
  const DOT_LAYER = 'profiles-dot'
  const HOVER_LAYER = 'profiles-hover'
  const SELECTED_LAYER = 'profiles-selected'

  const buildProfilesGeoJSON = (arr) => {
    const byId = new globalThis.Map()

    const features = (arr || [])
      .filter((p) => Number.isFinite(p.lon) && Number.isFinite(p.lat))
      .map((p) => {
        const profileId = p.id ?? `${p.lon},${p.lat}`

        byId.set(String(profileId), p)

        return {
          type: 'Feature',
          id: String(profileId),
          geometry: {
            type: 'Point',
            coordinates: [p.lon, p.lat],
          },
          properties: {
            profileId: String(profileId),
            priceLabel: p.price ? `$${Number(p.price).toLocaleString()}` : '',
          },
        }
      })

    profileByIdRef.current = byId
    return { type: 'FeatureCollection', features }
  }

  const fitToFeatures = (map, fc) => {
    if (!fc?.features?.length) return
    const bounds = new mapboxgl.LngLatBounds()
    fc.features.forEach((f) => bounds.extend(f.geometry.coordinates))
    map.fitBounds(bounds, { padding: 60, maxZoom: 14 })
  }

  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapRef.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [profiles[0].lon, profiles[0].lat],
      zoom: 10,
    })

    mapRef.current = map

    const popupEl = document.createElement('div')
    popupRootRef.current = createRoot(popupEl)
    popupRef.current = new mapboxgl.Popup({
      offset: 18,
      closeButton: true,
      closeOnClick: true,
      maxWidth: '320px',
    }).setDOMContent(popupEl)

    const onLoad = () => {
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
          type: 'geojson',
          data: pendingFcRef.current,
        })
      }

      // base dot
      if (!map.getLayer(DOT_LAYER)) {
        map.addLayer({
          id: DOT_LAYER,
          type: 'circle',
          source: SOURCE_ID,
          paint: {
            'circle-radius': 7,
            'circle-color': '#2563eb',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.9,
          },
        })
      }

      if (!map.getLayer(HOVER_LAYER)) {
        map.addLayer({
          id: HOVER_LAYER,
          type: 'circle',
          source: SOURCE_ID,
          paint: {
            'circle-radius': 12,
            'circle-color': '#2563eb',
            'circle-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.25,
              0,
            ],
          },
        })
      }

      if (!map.getLayer(SELECTED_LAYER)) {
        map.addLayer({
          id: SELECTED_LAYER,
          type: 'circle',
          source: SOURCE_ID,
          paint: {
            'circle-radius': 14,
            'circle-color': '#2563eb',
            'circle-opacity': 0.35,
          },
          filter: ['==', ['get', 'profileId'], ''],
        })
      }

      map.on('mousemove', DOT_LAYER, (e) => {
        map.getCanvas().style.cursor = 'pointer'

        const f = e.features?.[0]
        if (!f || f.id == null) return

        if (hoveredIdRef.current === f.id) return

        if (hoveredIdRef.current != null) {
          map.setFeatureState(
            { source: SOURCE_ID, id: hoveredIdRef.current },
            { hover: false }
          )
        }

        hoveredIdRef.current = f.id

        map.setFeatureState(
          { source: SOURCE_ID, id: hoveredIdRef.current },
          { hover: true }
        )
      })

      map.on('mouseleave', DOT_LAYER, () => {
        map.getCanvas().style.cursor = ''

        if (hoveredIdRef.current != null) {
          map.setFeatureState(
            { source: SOURCE_ID, id: hoveredIdRef.current },
            { hover: false }
          )
        }

        hoveredIdRef.current = null
      })

      map.on('mouseleave', DOT_LAYER, () => {
        map.getCanvas().style.cursor = ''
        if (hoveredIdRef.current !== null) {
          console.log('here')
          map.setFeatureState(
            { source: SOURCE_ID, id: hoveredIdRef.current },
            { hover: false }
          )
        }
        hoveredIdRef.current = null
      })

      map.on('click', DOT_LAYER, (e) => {
        const feature = e.features && e.features[0]
        if (!feature) return

        const id = feature.properties?.profileId
        const profile = profileByIdRef.current.get(String(id))
        if (!profile) return

        selectedIdRef.current = String(id)
        map.setFilter(SELECTED_LAYER, [
          '==',
          ['get', 'profileId'],
          selectedIdRef.current,
        ])

        popupRootRef.current.render(<ProfilePopup profile={profile} />)
        popupRef.current.setLngLat(e.lngLat).addTo(map)
      })

      popupRef.current.on('close', () => {
        selectedIdRef.current = null
        if (map.getLayer(SELECTED_LAYER)) {
          map.setFilter(SELECTED_LAYER, ['==', ['get', 'profileId'], ''])
        }
      })

      // get profiles in view
      map.on('idle', updateProfilesInView)
      map.on('moveend', updateProfilesInView)
      updateProfilesInView()

      const src = map.getSource(SOURCE_ID)
      if (src) src.setData(pendingFcRef.current)
      fitToFeatures(map, pendingFcRef.current)
    }

    map.on('load', onLoad)

    return () => {
      try {
        popupRef.current?.remove()
      } catch {}
      popupRef.current?.remove()

      map.off('load', onLoad)
      map.remove()
      mapRef.current = null
      map.off('idle', updateProfilesInView)
      map.off('moveend', updateProfilesInView)
    }
  }, [])

  useEffect(() => {
    const fc = buildProfilesGeoJSON(profiles)

    pendingFcRef.current = fc

    const map = mapRef.current
    if (!map) return

    const src = map.getSource(SOURCE_ID)
    if (src) {
      src.setData(fc)
      fitToFeatures(map, fc)
    }
  }, [profiles])

  const updateProfilesInView = () => {
    const map = mapRef.current
    if (!map) return

    const feats = map.queryRenderedFeatures({ layers: [DOT_LAYER] }) || []

    const seen = new Set()
    const ids = []
    for (const f of feats) {
      const id = String(f.id)
      if (!id) continue
      if (seen.has(id)) continue
      seen.add(id)
      ids.push(id)
    }

    setIdsInView(ids)
  }

  // const profilesInView = useMemo(() => {
  //   const byId = profileByIdRef.current
  //   return idsInView.map((id) => byId.get(String(id))).filter(Boolean)
  // }, [idsInView])

  // const openProfile = (profile) => {
  //   const map = mapRef.current
  //   if (!map) return

  //   const id = String(profile.id)
  //   if (!id) return

  //   selectedIdRef.current = id
  //   if (map.getLayer(SELECTED_LAYER)) {
  //     map.setFilter(SELECTED_LAYER, ['==', ['get', 'profileId'], id])
  //   }

  //   if (Number.isFinite(profile.lon) && Number.isFinite(profile.lat)) {
  //     map.flyTo({
  //       center: [profile.lon, profile.lat],
  //       zoom: Math.max(map.getZoom(), 13),
  //     })
  //   }

  //   popupRootRef.current.render(<ProfilePopup profile={profile} />)
  //   popupRef.current.setLngLat([profile.lon, profile.lat]).addTo(map)
  // }

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const timeout = setTimeout(() => {
      map.resize()
    }, 200)

    return () => clearTimeout(timeout)
  }, [isRailOpen])

  return (
    <div className="mb-20 flex h-screen w-screen">
      <div className="relative flex-1">
        <div ref={mapContainerRef} className="h-full w-full" />
        {/* {!isRailOpen && (
          <button
            type="button"
            onClick={() => setIsRailOpen(true)}
            className="absolute top-4 right-4 z-10 rounded-md bg-white/90 px-3 py-2 text-sm shadow"
          >
            Show profiles
          </button>
        )} */}
      </div>
      {/* {isRailOpen && (
        <Rail
          profilesInView={profilesInView}
          openProfile={openProfile}
          setIsRailOpen={setIsRailOpen}
        />
      )} */}
    </div>
  )
}
