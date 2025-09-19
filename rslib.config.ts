import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'cjs',
      syntax: ['node 16'],
      dts: false,
      autoExternal: false,
    },
  ]
});
