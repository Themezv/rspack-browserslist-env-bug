# Rspack Browserslist Environment Variables Bug

This repository demonstrates a bug in Rspack related to browserslist environment variables support.

## Problem Description

Rspack uses `browserslist-rs` which supports environment variables like `BROWSERSLIST`, but there's a compatibility issue with the browserslist configuration loading mechanism.

### The Issue

1. **`browserslist-rs` supports environment variables**: The underlying `browserslist-rs` library correctly reads and processes environment variables like `BROWSERSLIST`.

2. **Configuration check fails**: The condition `!browsers || !inlineQuery && !hasBrowserslistConfig(context)` also returns `false` because `hasBrowserslistConfig` doesn't recognize environment variables as valid configuration.

### Error Message

When this bug occurs, Rspack throws the following error:

```
No browserslist config found to handle the 'browserslist' target.
See https://github.com/browserslist/browserslist#queries for possible ways to provide a config.
The recommended way is to add a 'browserslist' key to your package.json and list supported browsers (resp. node.js versions).
You can also more options via the 'target' option: 'browserslist' / 'browserslist:env' / 'browserslist:query' / 'browserslist:path-to-config' / 'browserslist:path-to-config:env'
```

## Reproduction Steps

1. Install dependencies. After install the dependencies, a postinstall script will be executed and patch the rspack source code to add console.log.

2. Run the build command:

   ```bash
   npm run build
   ```

3. Observe the log and error instead of successful compilation. The log will show the browserslist config that was resolved:
   `console.log("resolved browsers", browsers);`

## Files

- `scripts/patch-rspack.js` - Postinstall script that patches Rspack to add debugging output
- `rspack.config.ts` - Rspack configuration file
- `src/index.ts` - Simple source file for testing
- `package.json` - Project configuration with postinstall script

## Expected Behavior

When `BROWSERSLIST` is set, Rspack should:

1. Successfully Resolve the browserslist query
2. Compile the project with appropriate targets

## Actual Behavior

Rspack fails with a "No browserslist config found" error, even though the environment variable is properly set and `browserslist-rs` can read it.
