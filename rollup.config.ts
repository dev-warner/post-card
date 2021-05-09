import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'

const pkg = require('./package.json')

export default [
  {
    input: 'lib/post-card.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      { file: pkg.module, format: 'es' },
    ],
    plugins: [typescript({ useTsconfigDeclarationDir: true }), sourceMaps()],
  },
]
