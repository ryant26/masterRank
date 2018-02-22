// This file configures a web server for testing the production build
// on your local machine.

import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';
import {chalkProcessing} from './chalkConfig';
import proxyMiddleware from 'http-proxy-middleware';

/* eslint-disable no-console */

console.log(chalkProcessing('Opening production build...'));

// Run Browsersync
browserSync({
  port: 4000,
  ui: {
    port: 4001
  },
  server: {
    baseDir: 'dist',
    middleware: [
        proxyMiddleware('/api', {target: 'http://localhost:3003', changeOrigin: true}),
        proxyMiddleware('/auth', {target: 'http://localhost:3003', changeOrigin: true}),
        historyApiFallback()
    ]
  },

  https: {
      key: '../certs/key.pem',
      cert: '../certs/cert.pem'
  },

  files: [
    'src/*.html'
  ],
});
