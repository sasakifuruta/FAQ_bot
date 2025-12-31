import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    {
        path: "/ask",
        file: "routes/ask.tsx",
    },
] satisfies RouteConfig;
