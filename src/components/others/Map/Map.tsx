"use client";

import React, { useState, useRef, useMemo } from "react";
import useSupercluster from "use-supercluster";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  OverlayView,
} from "@react-google-maps/api";
import "./Map.scss";
import { Point } from "@/models/IMap";

import pointsDataset from "@/resource/generated/processedGoogleMapsMarkers.json";

interface IMapSectionProps {}

export default function MapSection(props: IMapSectionProps) {
  const defaultZoom = 2;
  const defaultCenter = { lat: 49.1485207, lng: 2.9511712 };
  const libraries = useMemo(() => ["places"], []);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(defaultZoom);
  const [bounds, setBounds] = useState<[number, number, number, number] | null>(
    null
  );
  const [openInfoWindows, setOpenInfoWindows] = useState<{
    [key: string]: boolean;
  }>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [points, setPoints] = useState<Point[]>(pointsDataset as Point[]);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true,
      minZoom: 2,
      maxZoom: 10,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  const onMapLoaded = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const onBoundsChanged = () => {
    const map = mapRef.current;
    if (!map) return;
    const _bounds = map.getBounds();
    const _zoom = map.getZoom() ?? defaultZoom;
    if (_bounds) {
      const ne = _bounds.getNorthEast();
      const sw = _bounds.getSouthWest();
      setBounds([sw.lng(), sw.lat(), ne.lng(), ne.lat()]);
      setZoom(_zoom);
    }
  };

  const onClickCluster = (lat: number, lng: number, cluster: any) => () => {
    const expansionZoom = Math.min(
      supercluster.getClusterExpansionZoom(cluster.id),
      20
    );
    mapRef.current?.setZoom(expansionZoom);
    setMapCenter({ lat, lng });
  };

  const onhandleMouseOverCluster = (clusterId: string) => {
    setHoveredId(clusterId);
  };

  const onhandleMouseOutCluster = () => {
    setHoveredId(null);
  };

  const onClickMarker =
    (lat: number, lng: number, suggestedZoom: number) => () => {
      const map = mapRef.current;
      if (!map) return;

      const currentZoom = map.getZoom() ?? defaultZoom;
      const targetZoom = Math.min(suggestedZoom + 2, 20);
      map.setZoom(Math.max(currentZoom, targetZoom));

      const bounds = map.getBounds();
      const point = new google.maps.LatLng(lat, lng);

      if (!bounds?.contains(point)) {
        map.panTo(point);
      }

      setMapCenter({ lat, lng });
    };

  const onHandleMouseOverMarker = (markerId: string) => {
    setOpenInfoWindows((prevState) => ({ ...prevState, [markerId]: true }));
    setHoveredId(markerId);
  };

  const onHandleMouseOutMarker = (markerId: string) => {
    setOpenInfoWindows((prevState) => ({ ...prevState, [markerId]: false }));
    setHoveredId(null);
  };

  const minScale = 0.04;
  const maxScale = 0.15;
  const minZoom = 2;
  const maxZoom = 21;
  const scale =
    minScale + ((zoom - minZoom) / (maxZoom - minZoom)) * (maxScale - minScale);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <GoogleMap
      options={mapOptions}
      center={mapCenter}
      zoom={zoom}
      mapContainerStyle={{
        width: "100%",
        height: "100%",
        left: "0px",
        top: "0px",
        margin: "0px",
        padding: "0px",
        position: "absolute",
        overflow: "hidden",
      }}
      onLoad={onMapLoaded}
      onBoundsChanged={onBoundsChanged}
    >
      {clusters.map((cluster) => {
        const [lng, lat] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;

        if (isCluster) {
          const isHovered = hoveredId === cluster.id;
          const clusterIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#6aa84f",
            fillOpacity: isHovered ? 0.8 : 0.7,
            strokeColor: isHovered ? "#93c47d" : "#6aa84f",
            strokeOpacity: isHovered ? 0.2 : 0.1,
            strokeWeight: 5,
            scale: 10 + (pointCount / points.length) * 10,
          };
          const clusterLabel = {
            text: `${pointCount}`,
            color: isHovered ? "#444444" : "white",
            fontSize: "12px",
            fontWeight: "bold",
          };

          return (
            <Marker
              key={`cluster-${cluster.id}`}
              position={{ lat, lng }}
              label={clusterLabel}
              icon={clusterIcon}
              onClick={onClickCluster(lat, lng, cluster)}
              onMouseOver={() => onhandleMouseOverCluster(cluster.id)}
              onMouseOut={onhandleMouseOutCluster}
            />
          );
        }

        const isHovered = hoveredId === cluster.properties.markersId;
        const customIcon = {
          path: cluster.geometry.marker,
          fillColor: "#6aa84f",
          fillOpacity: isHovered ? 0.8 : 0.7,
          strokeColor: isHovered ? "#93c47d" : "#6aa84f",
          strokeOpacity: isHovered ? 0.2 : 0.1,
          strokeWeight: 5,
          scale: scale,
          anchor: new google.maps.Point(255.498, -26.204),
          rotation: 180,
        };

        return (
          <Marker
            key={`marker-${cluster.properties.markersId}`}
            position={{ lat, lng }}
            onClick={onClickMarker(lat, lng, cluster.geometry.zoom)}
            onMouseOver={() =>
              onHandleMouseOverMarker(cluster.properties.markersId)
            }
            onMouseOut={() =>
              onHandleMouseOutMarker(cluster.properties.markersId)
            }
            icon={customIcon}
          >
            {openInfoWindows[cluster.properties.markersId] && (
              <OverlayView
                position={{ lat, lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div className="map">
                  <p className="title">{cluster.properties.city}</p>
                </div>
              </OverlayView>
            )}
          </Marker>
        );
      })}
    </GoogleMap>
  );
}
