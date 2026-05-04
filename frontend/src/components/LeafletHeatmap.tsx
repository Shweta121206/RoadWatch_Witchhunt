import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

interface LeafletHeatmapProps {
  points: [number, number, number][];
}

export default function LeafletHeatmap({ points }: LeafletHeatmapProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    const heatLayer = (L as any).heatLayer(points, {
      radius: 32,
      blur: 24,
      maxZoom: 17,
      max: 2,
      minOpacity: 0.4,
      gradient: {
        0.1: "#6ee7b7",
        0.3: "#facc15",
        0.5: "#f97316",
        0.7: "#dc2626",
        1.0: "#991b1b",
      },
    }).addTo(map);

    return () => {
      if (map.hasLayer(heatLayer)) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, points]);

  return null;
}
