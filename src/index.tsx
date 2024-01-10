import { render } from "solid-js/web";
import * as echarts from "echarts";
import type { GeoJSON } from "echarts/types/src/coord/geo/geoTypes";
import "preline/preline";
import App from "./App";
import chinaMap from "./assets/china.json";
import { MAP_NAME } from "./config/variable.config";
import "./style/index.css";

// 注入地图数据
echarts.registerMap(MAP_NAME, chinaMap as GeoJSON);
const root = document.getElementById("root");

render(() => <App />, root!);
