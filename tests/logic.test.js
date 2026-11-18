const { test } = require('node:test');
const assert = require('node:assert/strict');
const { filterAndSort, validateProperty, formatINR } = require('../logic.js');

const properties = [
  { id: 1, title: '2BHK Flat', location: 'Mohali', rent: 32000, bedrooms: 2, furnishing: 'Fully Furnished' },
  { id: 2, title: '1BHK Studio', location: 'Chandigarh', rent: 20000, bedrooms: 1, furnishing: 'Semi Furnished' },
  { id: 3, title: '3BHK Flat', location: 'Mohali', rent: 35000, bedrooms: 3, furnishing: 'Fully Furnished' }
];

test('search matches location case-insensitively', () => {
  assert.deepEqual(filterAndSort(properties, {query:'mOHaLi'}).map(p=>p.id), [1, 3]);
});
test('bedroom filter matches selected number', () => {
  assert.deepEqual(filterAndSort(properties, {bedrooms:'1'}).map(p=>p.id), [2]);
});
test('maximum rent includes values equal to the maximum', () => {
  assert.deepEqual(filterAndSort(properties, {maxRent:'32000'}).map(p=>p.id), [1, 2]);
});
test('sorts rent ascending without changing original array', () => {
  assert.deepEqual(filterAndSort(properties, {sort:'rent-asc'}).map(p=>p.id), [2, 1, 3]);
  assert.deepEqual(properties.map(p=>p.id), [1, 2, 3]);
});
test('sorts rent descending', () => {
  assert.deepEqual(filterAndSort(properties, {sort:'rent-desc'}).map(p=>p.id), [3, 1, 2]);
});
test('favorites filter returns only saved properties', () => {
  assert.deepEqual(filterAndSort(properties, {favoritesOnly:true}, [3]).map(p=>p.id), [3]);
});
test('validates good property input and converts rent to a number', () => {
  const result=validateProperty({title:' 2BHK ',location:'Mohali',rent:'32000',bedrooms:'2',furnishing:'Fully Furnished'});
  assert.equal(result.valid,true);
  assert.equal(result.property.rent,32000);
  assert.equal(result.property.title,'2BHK');
});
test('rejects invalid rent and empty title', () => {
  const result=validateProperty({title:'',location:'Mohali',rent:'-5',bedrooms:'2',furnishing:'Fully Furnished'});
  assert.equal(result.valid,false);
  assert.ok(result.errors.length>=2);
});
test('formats Indian rupees', () => {
  assert.match(formatINR(32000), /32,000/);
});


test('search matches property title with case-insensitive input', () => {
  assert.deepEqual(filterAndSort(properties, {query: '1bhk'}).map(p=>p.id), [2]);
});
test('search ignores leading and trailing whitespace', () => {
  assert.deepEqual(filterAndSort(properties, {query: '  Mohali  '}).map(p=>p.id), [1, 3]);
});
test('nonmatching query produces an empty result', () => {
  assert.deepEqual(filterAndSort(properties, {query: 'Atlantis'}), []);
});
test('combines bedroom, price, and location filters', () => {
  assert.deepEqual(filterAndSort(properties, {query:'mohali',bedrooms:'2',maxRent:'32000'}).map(p=>p.id), [1]);
});
test('saved-only returns empty when no properties are saved', () => {
  assert.deepEqual(filterAndSort(properties, {favoritesOnly:true}, []), []);
});
test('sorting does not mutate input object order', () => {
  const before = properties.map(p=>p.id);
  filterAndSort(properties, {sort:'rent-desc'});
  assert.deepEqual(properties.map(p=>p.id), before);
});
test('rejects decimal and zero rents', () => {
  const base={title:'Flat',location:'Mohali',bedrooms:'2',furnishing:'Fully Furnished'};
  assert.equal(validateProperty({...base,rent:'4500.5'}).valid, false);
  assert.equal(validateProperty({...base,rent:'0'}).valid, false);
});
test('rejects unsupported furnishing types', () => {
  const result=validateProperty({title:'Flat',location:'Mohali',rent:'20000',bedrooms:'2',furnishing:'Luxury'});
  assert.equal(result.valid,false);
});
test('rejects out-of-range and fractional bedroom values', () => {
  const base={title:'Flat',location:'Mohali',rent:'20000',furnishing:'Fully Furnished'};
  for (const bedrooms of ['0','5','1.5']) assert.equal(validateProperty({...base,bedrooms}).valid,false);
});
test('rejects overly long property title and location', () => {
  const base={rent:'20000',bedrooms:'2',furnishing:'Fully Furnished'};
  assert.equal(validateProperty({...base,title:'X'.repeat(71),location:'Mohali'}).valid,false);
  assert.equal(validateProperty({...base,title:'Flat',location:'X'.repeat(91)}).valid,false);
});
test('price comparator correctly sorts after filtering', () => {
  const got=filterAndSort(properties,{query:'Mohali',sort:'rent-desc'}).map(p=>p.rent);
  assert.deepEqual(got,[35000,32000]);
});
