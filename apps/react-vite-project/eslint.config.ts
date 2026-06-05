import baseConfig from '../../eslint.config.ts';
import reactCompiler from 'eslint-plugin-react-compiler';

export default [
  ...baseConfig,
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
];
