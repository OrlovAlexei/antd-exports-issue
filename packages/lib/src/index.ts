// Library re-exports antd components and types
export * from 'antd';
export type { TooltipPlacement } from 'antd/es/tooltip';
export type { UploadChangeParam } from 'antd/es/upload';

// This is the key: a runtime import from antd subpath
// When this library is compiled, this import is preserved in dist/Search.js
// Yarn PnP cannot resolve 'antd/es/input/Search' because antd lacks 'exports' field
export { default as Search } from 'antd/es/input/Search';
