const numSymbols = Number(process.argv[2]);
if (isNaN(numSymbols)) {
  throw new Error('Usage: generate_code.mjs 123');
}

function generateSymbols() {
  const symbols = [];
  for (let i = 0; i < numSymbols; i++) {
    symbols.push({name: `sym${i}`});
  }
  return symbols;
}

const rootNamespace = '__generated';

function generateCodeForSymbol(name, parent) {
  console.log(`declare namespace ${rootNamespace}.${parent} {`);
  console.log(`  export const ${name}: unknown;`);
  console.log(`}`);
}

for (const symbol of generateSymbols()) {
  generateCodeForSymbol(symbol.name, 'foo');
  generateCodeForSymbol(symbol.name, 'foo.bar');
  generateCodeForSymbol(symbol.name, 'foo.bar.baz');
}
