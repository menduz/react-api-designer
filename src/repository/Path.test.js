// @flow

import Path from "./Path";

it('create relative path from string', () => {
  const path = Path.fromString('file.raml');
  expect(path.isAbsolute()).toBe(false)
})

it('create absolute path from string', () => {
  const path = Path.fromString('/file.raml');
  expect(path.isAbsolute()).toBe(true)
})

it('merge folder with file', () => {
  const basePath = Path.fromString('/folder');
  const file = Path.fromString('file.raml');

  const result = Path.mergePath(basePath, file);

  expect(result.toString()).toBe('/folder/file.raml')
})

it('merge subfolder with parent path', () => {
  const basePath = Path.fromString('/folder/subfolder');
  const file = Path.fromString('../file.raml');

  const result = Path.mergePath(basePath, file);

  expect(result.toString()).toBe('/folder/file.raml')
})

it('merge subfolder with parent path', () => {
  const basePath = Path.fromString('/folder');
  const file = Path.fromString('subfolder/../file.raml');

  const result = Path.mergePath(basePath, file);

  expect(result.toString()).toBe('/folder/file.raml')
})

it('merge 2 absolute paths', () => {
  const basePath = Path.fromString('/folder');
  const file = Path.fromString('/file.raml');

  const result = Path.mergePath(basePath, file);

  expect(result.toString()).toBe('/file.raml')
})

it('merge folder with ".."', () => {
  const basePath = Path.fromString('/folder/subfolder');
  const file = Path.fromString('..');

  const result = Path.mergePath(basePath, file);

  expect(result.toString()).toBe('/folder')
})
