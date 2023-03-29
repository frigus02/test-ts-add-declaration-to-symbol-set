# Test TypeScript compiler performance for many symbols declared in repeated namespaces

We have a .d.ts generator that emits symbols in nested namespaces. For simplicity the generator always emits the entire namespace. Example:

```ts
declare namespace __generated.foo.bar {
  export class A {}
}
declare namespace __generated.foo.bar {
  export class B {}
}
declare namespace __generated.foo.bar.baz {
  export class C {}
}
```

It seems this pattern runs into a performance issue inside `addDeclarationToSymbol`. It calls `appendIfUnique(symbol.declarations, node)`, which iterates through the `symbol.declarations` array. The code above leads to lots of declarations of the symbols `__generated`, `__generated.foo`, etc.

The patch `tsc_patch.diff` uses a `Set` rather than iterating the array. This seems to speed up the build time significantly.

## Run the test

```sh
# Install TypeScript
$ npm ci

# Create a patched version of tsc.js
$ npm run patch_tsc

# Generate code with 100 symbols and build with stable and the patched tsc version
# --> "Total time" should be similar.
$ npm run generate_code_100
$ npm build_stable
$ npm build_patched

# Generate code with 5000 symbols and build with stable and the patched tsc version
# --> "Total time" should be much faster with the patched version.
$ npm run generate_code_5000
$ npm build_stable
$ npm build_patched
```

## Performance on my machine

Generated on 2023-03-29. Omitted irrelevant output.

```
$ npm run generate_code_100

$ npm run build_stable
Bind time:       0.16s
Total time:      0.65s

$ npm run build_patched
Bind time:       0.17s
Total time:      0.62s

$ npm run generate_code_5000

$ npm run build_stable
Bind time:        4.87s
Total time:       5.61s

$ npm run build_patched
Bind time:        0.45s
Total time:       1.19s
```
