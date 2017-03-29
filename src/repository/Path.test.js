// @flow

import Path from "./Path"

it('create relative path from string', () => {
  const path = Path.fromString('file.raml')
  expect(path.isAbsolute()).toBe(false)
})

it('create absolute path from string', () => {
  const path = Path.fromString('/file.raml')
  expect(path.isAbsolute()).toBe(true)
})

it('merge folder with file', () => {
  const basePath = Path.fromString('/folder')
  const file = Path.fromString('file.raml')

  const result = Path.mergePath(basePath, file)

  expect(result.toString()).toBe('/folder/file.raml')
})

it('merge subfolder with parent path', () => {
  const basePath = Path.fromString('/folder/subfolder')
  const file = Path.fromString('../file.raml')

  const result = Path.mergePath(basePath, file)

  expect(result.toString()).toBe('/folder/file.raml')
})

it('merge subfolder with parent path', () => {
  const basePath = Path.fromString('/folder')
  const file = Path.fromString('subfolder/../file.raml')

  const result = Path.mergePath(basePath, file)

  expect(result.toString()).toBe('/folder/file.raml')
})

it('merge 2 absolute paths', () => {
  const basePath = Path.fromString('/folder')
  const file = Path.fromString('/file.raml')

  const result = Path.mergePath(basePath, file)

  expect(result.toString()).toBe('/file.raml')
})

it('merge folder with ".."', () => {
  const basePath = Path.fromString('/folder/subfolder')
  const file = Path.fromString('..')

  const result = Path.mergePath(basePath, file)

  expect(result.toString()).toBe('/folder')
})

it('calc diff between equals paths', () => {
  const first = Path.fromString('/folder/subfolder')
  const second = Path.fromString('/folder/subfolder')

  const result = first.diff(second)

  expect(result[0].toString()).toBe('')
  expect(result[1].toString()).toBe('')
})

it('calc diff between absolute and relative paths', () => {
  const first = Path.fromString('/folder/subfolder')
  const second = Path.fromString('folder/subfolder')

  const result = first.diff(second)

  expect(result[0].toString()).toBe('/folder/subfolder')
  expect(result[1].toString()).toBe('folder/subfolder')
})

it('calc diff between relative and absolute paths', () => {
  const first = Path.fromString('folder/subfolder')
  const second = Path.fromString('/folder/subfolder')

  const result = first.diff(second)

  expect(result[0].toString()).toBe('folder/subfolder')
  expect(result[1].toString()).toBe('/folder/subfolder')
})

it('calc diff between absolute ascendant and descendant paths', () => {
  const first = Path.fromString('/folder/subfolder')
  const second = Path.fromString('/folder/subfolder/api.raml')

  const result = first.diff(second)

  expect(result[0].toString()).toBe('')
  expect(result[1].toString()).toBe('api.raml')
})

it('calc diff between absolute ascendant and descendant paths and two levels of difference', () => {
  const first = Path.fromString('/folder/subfolder')
  const second = Path.fromString('/folder/subfolder/subsubfolder/api.raml')

  const result = first.diff(second)

  expect(result[0].toString()).toBe('')
  expect(result[1].toString()).toBe('subsubfolder/api.raml')
})

it('calc diff between absolute descendant and ascendant paths', () => {
  const first = Path.fromString('/folder/subfolder/api.raml')
  const second = Path.fromString('/folder/subfolder')

  const result = first.diff(second)

  expect(result[0].toString()).toBe('api.raml')
  expect(result[1].toString()).toBe('')
})

it('calc diff between absolute descendant and ascendant paths and two levels of difference', () => {
  const first = Path.fromString('/folder/subfolder/subsubfolder/api.raml')
  const second = Path.fromString('/folder/subfolder')

  const result = first.diff(second)

  expect(result[0].toString()).toBe('subsubfolder/api.raml')
  expect(result[1].toString()).toBe('')
})

it('calc diff between paths with common start and equal depth', () => {
  const first = Path.fromString('/folder/subfolder/api.raml')
  const second = Path.fromString('/folder/othersubfolder/api-1.raml')

  const result = first.diff(second)

  expect(result[0].toString()).toBe('subfolder/api.raml')
  expect(result[1].toString()).toBe('othersubfolder/api-1.raml')
})

it('calc diff between paths with common start and different depth', () => {
  const first = Path.fromString('/folder/subfolder/subsubfolder/api.raml')
  const second = Path.fromString('/folder/othersubfolder/api-1.raml')

  const result = first.diff(second)

  expect(result[0].toString()).toBe('subfolder/subsubfolder/api.raml')
  expect(result[1].toString()).toBe('othersubfolder/api-1.raml')
})


//
it('merge folder with ".."', () => {
  const basePath = Path.fromString('/folder/subfolder')
  const file = Path.fromString('..')

  const result = Path.mergePath(basePath, file)

  expect(result.toString()).toBe('/folder')
})

it('calc relative path between equals paths', () => {
  const first = Path.fromString('/folder/subfolder')
  const second = Path.fromString('/folder/subfolder')

  const result = first.relativePathTo(second)

  expect(result.toString()).toBe('')
})

it('calc relative path between absolute and relative paths', () => {
  const first = Path.fromString('/folder/subfolder')
  const second = Path.fromString('folder/subfolder')

  const result = first.relativePathTo(second)

  expect(result.toString()).toBe('folder/subfolder')
})

it('calc relative path between relative and absolute paths', () => {
  const first = Path.fromString('folder/subfolder')
  const second = Path.fromString('/folder/subfolder')

  const result = first.relativePathTo(second)

  expect(result.toString()).toBe('/folder/subfolder')
})

it('calc relative path between absolute ascendant and descendant paths', () => {
  const first = Path.fromString('/folder/subfolder')
  const second = Path.fromString('/folder/subfolder/api.raml')

  const result = first.relativePathTo(second)

  expect(result.toString()).toBe('api.raml')
})

it('calc relative path between absolute ascendant and descendant paths and two levels of difference', () => {
  const first = Path.fromString('/folder/subfolder')
  const second = Path.fromString('/folder/subfolder/subsubfolder/api.raml')

  const result = first.relativePathTo(second)

  expect(result.toString()).toBe('subsubfolder/api.raml')
})

it('calc relative path between absolute descendant and ascendant paths', () => {
  const first = Path.fromString('/folder/subfolder')
  const second = Path.fromString('/folder/')

  const result = first.relativePathTo(second)

  expect(result.toString()).toBe('..')
})

it('calc relative path between absolute descendant and ascendant paths and two levels of difference', () => {
  const first = Path.fromString('/folder/subfolder/subsubfolder/')
  const second = Path.fromString('/folder')

  const result = first.relativePathTo(second)

  expect(result.toString()).toBe('../..')
})

it('calc relative path between paths with common start and equal depth', () => {
  const first = Path.fromString('/folder/subfolder/subsubfolder')
  const second = Path.fromString('/folder/othersubfolder/othersubsubfolder')

  const result = first.relativePathTo(second)

  expect(result.toString()).toBe('../../othersubfolder/othersubsubfolder')
})

it('calc relative path paths with common start and different depth', () => {
  const first = Path.fromString('/folder/subfolder/subsubfolder')
  const second = Path.fromString('/folder/api-1.raml')

  const result = first.relativePathTo(second)

  expect(result.toString()).toBe('../../api-1.raml')
})
