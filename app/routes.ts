import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("cartela", "routes/cartela.tsx"),
  route("sorteador", "routes/sorteador.tsx"),
] satisfies RouteConfig;
