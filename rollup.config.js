import typescript from '@rollup/plugin-typescript';

const DIST_DIR = "dist";
const NAME = "makeKeyedData";
const FILE = `${DIST_DIR}/${NAME}`;

export default {
  input: `${NAME}.ts`,
  output: [{
    file: `${FILE}.js`,
    name: NAME,
    format: 'umd',
  }, {
    file: `${FILE}.esm.js`,
    format: 'es',
  }],
  plugins: [typescript({
    exclude: ["**/*.test.ts"]
  })],
};
