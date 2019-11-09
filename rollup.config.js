import typescript from "rollup-plugin-typescript";

export default {
  input: "./src/useJSONP.tsx",
  output: {
    dir: "dist",
    format: "cjs"
  },
  plugins: [typescript()],
  external: ["react"]
};
