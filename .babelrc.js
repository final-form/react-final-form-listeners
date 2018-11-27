const test = process.env.NODE_ENV === 'test'
const loose = true

module.exports = {
  presets: [
    [
      '@babel/env',
      test
        ? {
          loose,
          targets: {
            node: 8
          }
        }
        : {
          loose,
          modules: false,
        }
    ],
    '@babel/react',
    '@babel/flow',
  ],
  plugins: [
    test && '@babel/transform-react-jsx-source',
    test && 'istanbul'
  ].filter(Boolean)
}
