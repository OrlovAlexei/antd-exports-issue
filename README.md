# Antd Exports Field Issue - Minimal Reproduction

This repository demonstrates an issue with antd module resolution in Vitest when using Yarn PnP.

## The Problem

Antd does not have an `exports` field in its `package.json`. This causes errors when:

- Using Yarn PnP (Plug'n'Play)
- Importing from subpaths like `antd/es/input/Search`
- Consuming libraries that re-export antd components from subpaths

## Repository Structure

```
packages/
├── lib/          # Library that re-exports antd (simulates published npm package)
│   └── src/
│       └── index.ts   # export { default as Search } from 'antd/es/input/Search'
└── app/          # Application with tests (consumes the library)
    └── src/
        ├── App.tsx
        └── App.spec.tsx
```

**Key point**: The `@demo/lib` library imports a component from an antd subpath (`antd/es/input/Search`). When the library is installed from a tarball (simulating npm install), Yarn PnP fails to resolve the subpath because antd lacks an `exports` field.

## Requirements

- Node.js 18+
- Yarn 4.x (Yarn PnP is used)

## Steps to Reproduce

### 1. Clone the repository

```bash
git clone https://github.com/OrlovAlexei/antd-exports-issue.git
cd antd-exports-issue
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Build the library and create a tarball

```bash
yarn build:lib
cd packages/lib && yarn pack && cd ../..
```

### 4. Install dependencies again (to pick up the tarball)

```bash
yarn install
```

### 5. Run the tests

```bash
cd packages/app && yarn vitest run
```

## Expected Result (Error)

When running tests, you should see the following error:

```
Error: Qualified path resolution failed: we looked for the following paths, but none could be accessed.

Source path: .../antd/es/input/Search
Not found: .../antd/es/input/Search
```

## Why This Happens

1. The `@demo/lib` library imports from antd subpath:

   ```typescript
   export { default as Search } from "antd/es/input/Search";
   ```

2. When the library is compiled, this import is preserved in `dist/index.js`

3. The app installs the library from a tarball (`file:../lib/package.tgz`), simulating npm installation

4. Yarn PnP strictly validates which paths are accessible in a package through the `exports` field

5. Antd **does not have** an `exports` field in its `package.json`, so Yarn PnP cannot determine that the path `antd/es/input/Search` is valid

6. This results in a "Qualified path resolution failed" error

## Important Notes

- The issue **only reproduces** when the library is installed from tarball/npm, not with `workspace:*`
- With `workspace:*`, Vite handles the resolution differently and the error doesn't occur
- This matches real-world usage where libraries are published to npm

## Suggested Solution

Add an `exports` field to antd's `package.json`:

```json
{
  "exports": {
    ".": {
      "import": "./es/index.js",
      "require": "./lib/index.js",
      "types": "./es/index.d.ts"
    },
    "./es/*": "./es/*",
    "./lib/*": "./lib/*",
    "./locale/*": "./locale/*"
  }
}
```

## Related Issues

- [Ant Design Issue #46413](https://github.com/ant-design/ant-design/issues/46413) - Fix ESM exports

Thank you for taking the time to look into this issue!
