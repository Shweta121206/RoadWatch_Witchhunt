declare module "leaflet.heat" {
  import * as L from "leaflet";

  namespace heatLayer {
    function heatLayer(latlng: L.LatLngExpression[] | L.LatLngExpression[][], options?: any): L.Layer;
  }

  export function heatLayer(latlng: L.LatLngExpression[] | L.LatLngExpression[][], options?: any): L.Layer;
}
