// @flow

import Path from './Path'
import {File, Element, Directory} from './Element'
import Repository from './Repository'
import MemoryFileSystem from './file-system/MemoryFileSystem'
import {mapFolderEntry} from './file-system/MapFileSystem'
import FileSystemBuilder, {directory, file} from './file-system/FileSystemBuilder'
import {FileSystem} from './file-system/FileSystem'

// Test Helpers

const assertFileContent = async(file: File, content: string): Promise<any> => {
  const c = await file.getContent()
  expect(c).toBe(content)
}

const assertFile = (repository: Repository,
                    path: Path,
                    name: string,
                    content: string,
                    dirty: boolean,
                    persisted: boolean): Promise<any> => {
  const file: File = getFileByPathOrFail(repository, path)
  expect(file.name).toBe(name)
  expect(file.dirty).toBe(dirty)
  expect(file.persisted).toBe(persisted)
  expect(file.path.toString()).toBe(path.toString())
  return assertFileContent(file, content)
}

const getFileByPathOrFail = (repository: Repository, path: Path): File => {
  const file: ?File = repository.getFileByPath(path)
  expect(file).not.toBeUndefined()
  if (!file) throw Error('Not a valid file')

  return file
}

const assertDirectory = (repository: Repository,
                         path: Path,
                         name: string): void => {
  const directory: Directory = getDirectoryByPathOrFail(repository, path)
  expect(directory.name).toBe(name)
}

const getDirectoryByPathOrFail = (repository: Repository, path: Path): Directory => {
  const element: ?Element = repository.getByPath(path)
  expect(element).not.toBeUndefined()
  if (!element) throw Error('Not a valid element')

  expect(element.isDirectory()).toBeTruthy()
  return element.asDirectory()
}

const createFileSystem = (): Promise<FileSystem> => {
  return new FileSystemBuilder()
    .withFile(file('api.raml', '#%RAML 1.0\ntitle: myApi'))
    .withDirectory(directory('library')
      .withFile(file('lib.raml', '#%RAML 1.0 Library'))
    )
    .withDirectory(directory('examples')
      .withFile(file('example.json', '{"name": "My name"}'))
    )
    .build(MemoryFileSystem.empty())
}

// Test Helpers end

// Add files to repository

it('add a new file to an empty repository', async() => {
  const fileName = 'api.raml'
  const fileContent = '#%RAML 1.0\ntitle: myApi'
  const filePath = Path.emptyPath().append(fileName)

  const fileSystem = MemoryFileSystem.from([])
  const repository = await Repository.fromFileSystem(fileSystem)

  repository.addFile(Path.emptyPath(), fileName, fileContent)
  await assertFile(repository, filePath, fileName, fileContent, true, false)
})

it('add a new file in an existing directory', async() => {
  const directoryName = 'myDir'
  const directoryPath = Path.emptyPath().append(directoryName)

  const fileName = 'api.raml'
  const fileContent = '#%RAML 1.0\ntitle: myApi'
  const filePath = directoryPath.append(fileName)

  const fileSystem = MemoryFileSystem.from([
    mapFolderEntry(directoryName, directoryPath.toString(), [])
  ])

  const repository = await Repository.fromFileSystem(fileSystem)

  repository.addFile(directoryPath, fileName, fileContent)
  assertDirectory(repository, directoryPath, directoryName)
  await assertFile(repository, filePath, fileName, fileContent, true, false)
})

it('add a new file in an existing subdirectory', async() => {
  const directoryName = 'myDir'
  const directoryPath = Path.emptyPath().append(directoryName)

  const subDirectoryName = 'mySubDir'
  const subDirectoryPath = directoryPath.append(subDirectoryName)

  const fileName = 'api.raml'
  const fileContent = '#%RAML 1.0\ntitle: myApi'
  const filePath = subDirectoryPath.append(fileName)

  const fileSystem = MemoryFileSystem.from([
    mapFolderEntry(directoryName, directoryPath.toString(), []),
    mapFolderEntry(subDirectoryName, subDirectoryPath.toString(), [])
  ])
  const repository = await Repository.fromFileSystem(fileSystem)

  repository.addFile(subDirectoryPath, fileName, fileContent)
  assertDirectory(repository, directoryPath, directoryName)
  assertDirectory(repository, subDirectoryPath, subDirectoryName)
  await assertFile(repository, filePath, fileName, fileContent, true, false)
})

// Add directory to repository

it('add a new directory in an empty repository', async() => {
  const directoryName = 'myDir'
  const directoryPath = Path.emptyPath().append(directoryName)

  const fileSystem = MemoryFileSystem.from([])
  const repository = await Repository.fromFileSystem(fileSystem)

  await repository.addDirectory(Path.emptyPath(), directoryName)
  assertDirectory(repository, directoryPath, directoryName)
})

it('add a new directory in an existing directory', async() => {
  const directoryName = 'myDir'
  const directoryPath = Path.emptyPath().append(directoryName)

  const newDirectoryName = 'myNewDir'
  const newDirectoryPath = directoryPath.append(newDirectoryName)

  const fileSystem = MemoryFileSystem.from([
    mapFolderEntry(directoryName, directoryPath.toString(), []),
  ])

  const repository = await Repository.fromFileSystem(fileSystem)

  await repository.addDirectory(directoryPath, newDirectoryName)
  assertDirectory(repository, newDirectoryPath, newDirectoryName)
})

it('add a new directory in an existing subdirectory', async() => {
  const directoryName = 'myDir'
  const directoryPath = Path.emptyPath().append(directoryName)
  const subDirectoryName = 'mySubDir'
  const subDirectoryPath = directoryPath.append(subDirectoryName)

  const newDirectoryName = 'myNewDir'
  const newDirectoryPath = subDirectoryPath.append(newDirectoryName)

  const fileSystem = MemoryFileSystem.from([
    mapFolderEntry(directoryName, directoryPath.toString(), []),
    mapFolderEntry(subDirectoryName, subDirectoryPath.toString(), []),
  ])

  const repository = await Repository.fromFileSystem(fileSystem)

  await repository.addDirectory(subDirectoryPath, newDirectoryName)
  assertDirectory(repository, newDirectoryPath, newDirectoryName)
})

// Add files and directory to repository

it('add several files and folders to an empty Repository', async() => {
  const directory1Name = 'myDir1'
  const directory1Path = Path.emptyPath().append(directory1Name)
  const directory2Name = 'myDir2'
  const directory2Path = Path.emptyPath().append(directory2Name)
  const directory3Name = 'myDir3'
  const directory3Path = directory2Path.append(directory3Name)

  const file1Name = 'api-1.raml'
  const file1Content = '#%RAML 1.0\ntitle: myApi 1'
  const file1Path = Path.emptyPath().append(file1Name)
  const file2Name = 'api-2.raml'
  const file2Content = '#%RAML 1.0\ntitle: myApi 2'
  const file2Path = directory1Path.append(file2Name)
  const file3Name = 'api-3.raml'
  const file3Content = '#%RAML 1.0\ntitle: myApi 3'
  const file3Path = directory2Path.append(file3Name)
  const file4Name = 'api-4.raml'
  const file4Content = '#%RAML 1.0\ntitle: myApi 4'
  const file4Path = directory3Path.append(file4Name)
  const file5Name = 'api-5.raml'
  const file5Content = '#%RAML 1.0\ntitle: myApi 5'
  const file5Path = directory3Path.append(file5Name)

  const fileSystem = MemoryFileSystem.from([])
  const repository = await Repository.fromFileSystem(fileSystem)

  repository.addFile(file1Path.parent(), file1Name, file1Content)
  await assertFile(repository, file1Path, file1Name, file1Content, true, false)

  await repository.addDirectory(directory1Path.parent(), directory1Name)
  assertDirectory(repository, directory1Path, directory1Name)

  repository.addFile(file2Path.parent(), file2Name, file2Content)
  await assertFile(repository, file2Path, file2Name, file2Content, true, false)

  await repository.addDirectory(directory2Path.parent(), directory2Name)
  assertDirectory(repository, directory2Path, directory2Name)

  repository.addFile(file3Path.parent(), file3Name, file3Content)
  await assertFile(repository, file3Path, file3Name, file3Content, true, false)

  await repository.addDirectory(directory3Path.parent(), directory3Name)
  assertDirectory(repository, directory3Path, directory3Name)

  repository.addFile(file4Path.parent(), file4Name, file4Content)
  await assertFile(repository, file4Path, file4Name, file4Content, true, false)

  repository.addFile(file5Path.parent(), file5Name, file5Content)
  await assertFile(repository, file5Path, file5Name, file5Content, true, false)
})

// Save files in repository

it('add a new file to an empty repository and save it', async() => {
  const fileName = 'api.raml'
  const fileContent = '#%RAML 1.0\ntitle: myApi'
  const filePath = Path.emptyPath().append(fileName)

  const fileSystem = MemoryFileSystem.from([])

  const repository = await Repository.fromFileSystem(fileSystem)
  repository.addFile(Path.emptyPath(), fileName, fileContent)
  await assertFile(repository, filePath, fileName, fileContent, true, false)
  await repository.saveFile(filePath)
  await assertFile(repository, filePath, fileName, fileContent, false, true)

  const newRepository = await Repository.fromFileSystem(fileSystem)
  await assertFile(newRepository, filePath, fileName, fileContent, false, true)
})

it('add a new file in an existing directory and save it', async() => {
  const directoryName = 'myDir'
  const directoryPath = Path.emptyPath().append(directoryName)

  const fileName = 'api.raml'
  const fileContent = '#%RAML 1.0\ntitle: myApi'
  const filePath = directoryPath.append(fileName)

  const fileSystem = MemoryFileSystem.from([
    mapFolderEntry(directoryName, directoryPath.toString(), [])
  ])

  const repository = await Repository.fromFileSystem(fileSystem)
  repository.addFile(directoryPath, fileName, fileContent)
  await assertFile(repository, filePath, fileName, fileContent, true, false)
  await repository.saveFile(filePath)
  await assertFile(repository, filePath, fileName, fileContent, false, true)

  const newRepository = await Repository.fromFileSystem(fileSystem)
  await assertFile(newRepository, filePath, fileName, fileContent, false, true)
})

it('add a new file in an existing subdirectory', async() => {
  const directoryName = 'myDir'
  const directoryPath = Path.emptyPath().append(directoryName)

  const subDirectoryName = 'mySubDir'
  const subDirectoryPath = directoryPath.append(subDirectoryName)

  const fileName = 'api.raml'
  const fileContent = '#%RAML 1.0\ntitle: myApi'
  const filePath = subDirectoryPath.append(fileName)

  const fileSystem = MemoryFileSystem.from([
    mapFolderEntry(directoryName, directoryPath.toString(), []),
    mapFolderEntry(subDirectoryName, subDirectoryPath.toString(), [])
  ])

  const repository = await Repository.fromFileSystem(fileSystem)
  repository.addFile(subDirectoryPath, fileName, fileContent)
  await assertFile(repository, filePath, fileName, fileContent, true, false)
  await repository.saveFile(filePath)
  await assertFile(repository, filePath, fileName, fileContent, false, true)

  const newRepository = await Repository.fromFileSystem(fileSystem)
  await assertFile(newRepository, filePath, fileName, fileContent, false, true)
})

it('add a new file in an existing subdirectory', async() => {
  const fileName = 'api-1.raml'
  const fileContent = '#%RAML 1.0\ntitle: myApi'
  const filePath = Path.emptyPath().append(fileName)

  const fileSystem = await createFileSystem()
  const repository = await Repository.fromFileSystem(fileSystem)
  repository.addFile(filePath.parent(), fileName, fileContent)
  await assertFile(repository, filePath, fileName, fileContent, true, false)

  const newRepository = await Repository.fromFileSystem(fileSystem)
  expect(newRepository.getByPath(filePath)).toBeUndefined()
})

// Remove file

it('remove a file from a repository root', async() => {
  const fileSystem = await createFileSystem()
  const pathToDelete = Path.fromString('/api.raml')

  const repository = await Repository.fromFileSystem(fileSystem)
  await assertFile(repository, pathToDelete, 'api.raml', '#%RAML 1.0\ntitle: myApi', false, true)
  await repository.deleteFile(pathToDelete)
  expect(repository.getByPath(pathToDelete)).toBeUndefined()

  const newRepository = await Repository.fromFileSystem(fileSystem)
  expect(newRepository.getByPath(pathToDelete)).toBeUndefined()
})

it('remove a file from a folder', async() => {
  const fileSystem = await createFileSystem()
  const pathToDelete = Path.fromString('/library/lib.raml')

  const repository = await Repository.fromFileSystem(fileSystem)
  await assertFile(repository, pathToDelete, 'lib.raml', '#%RAML 1.0 Library', false, true)
  await repository.deleteFile(pathToDelete)
  expect(repository.getByPath(pathToDelete)).toBeUndefined()

  const newRepository = await Repository.fromFileSystem(fileSystem)
  expect(newRepository.getByPath(pathToDelete)).toBeUndefined()
})

it('remove a directory from a repository root', async() => {
  const fileSystem = await createFileSystem()
  const pathToDelete = Path.fromString('/library')

  const repository = await Repository.fromFileSystem(fileSystem)
  await assertDirectory(repository, pathToDelete, 'library')
  await repository.deleteDirectory(pathToDelete)
  expect(repository.getByPath(pathToDelete)).toBeUndefined()

  const newRepository = await Repository.fromFileSystem(fileSystem)
  expect(newRepository.getByPath(pathToDelete)).toBeUndefined()
})

// Move file

it('move a file from root to directory and back', async() => {
  const fileName = 'api.raml'
  const fileContent = '#%RAML 1.0\ntitle: myApi'
  const from = Path.fromString('/api.raml')
  const to = Path.fromString('/library/api.raml')

  const fileSystem = await createFileSystem()
  const repository = await Repository.fromFileSystem(fileSystem)
  await assertFile(repository, from, fileName, fileContent, false, true)
  await repository.move(from, to)
  expect(repository.getByPath(from)).toBeUndefined()
  await assertFile(repository, to, fileName, fileContent, false, true)

  const newRepository1 = await Repository.fromFileSystem(fileSystem)
  expect(newRepository1.getByPath(from)).toBeUndefined()
  await assertFile(newRepository1, to, fileName, fileContent, false, true)

  // Move file back
  await repository.move(to, from)
  expect(repository.getByPath(to)).toBeUndefined()
  await assertFile(repository, from, fileName, fileContent, false, true)

  const newRepository2 = await Repository.fromFileSystem(fileSystem)
  expect(newRepository2.getByPath(to)).toBeUndefined()
  await assertFile(newRepository2, from, fileName, fileContent, false, true)
})

it('move a directory from root to directory and back', async() => {
  const fileName = 'api.raml'
  const fileContent = '#%RAML 1.0\ntitle: myApi'
  const from = Path.fromString('/api.raml')
  const to = Path.fromString('/library/api.raml')

  const fileSystem = await createFileSystem()
  const repository = await Repository.fromFileSystem(fileSystem)
  await assertFile(repository, from, fileName, fileContent, false, true)
  await repository.move(from, to)
  expect(repository.getByPath(from)).toBeUndefined()
  await assertFile(repository, to, fileName, fileContent, false, true)

  const newRepository1 = await Repository.fromFileSystem(fileSystem)
  expect(newRepository1.getByPath(from)).toBeUndefined()
  await assertFile(newRepository1, to, fileName, fileContent, false, true)

  // Move file back
  await repository.move(to, from)
  expect(repository.getByPath(to)).toBeUndefined()
  await assertFile(repository, from, fileName, fileContent, false, true)

  const newRepository2 = await Repository.fromFileSystem(fileSystem)
  expect(newRepository2.getByPath(to)).toBeUndefined()
  await assertFile(newRepository2, from, fileName, fileContent, false, true)
})

// Rename

it('rename a file in root', async() => {
  const dirPath = Path.emptyPath()
  const originalName = 'api.raml'
  const originalPath = dirPath.append(originalName)
  const fileContent = '#%RAML 1.0\ntitle: myApi'
  const newName = 'api-1.raml'
  const newPath = dirPath.append(newName)

  const fileSystem = await createFileSystem()
  const repository = await Repository.fromFileSystem(fileSystem)
  await assertFile(repository, originalPath, originalName, fileContent, false, true)

  await repository.rename(originalPath, newName)
  expect(repository.getByPath(originalPath)).toBeUndefined()
  await assertFile(repository, newPath, newName, fileContent, false, true)

  const newRepository1 = await Repository.fromFileSystem(fileSystem)
  expect(newRepository1.getByPath(originalPath)).toBeUndefined()
  await assertFile(newRepository1, newPath, newName, fileContent, false, true)

  // Rename file back
  await repository.rename(newPath, originalName)
  expect(repository.getByPath(newPath)).toBeUndefined()
  await assertFile(repository, originalPath, originalName, fileContent, false, true)

  const newRepository2 = await Repository.fromFileSystem(fileSystem)
  expect(newRepository2.getByPath(newPath)).toBeUndefined()
  await assertFile(newRepository2, originalPath, originalName, fileContent, false, true)
})

it('rename a directory in root', async() => {
  const parentPath = Path.emptyPath()
  const dirName = 'library'
  const dirPath = parentPath.append(dirName)
  const childName = 'lib.raml'
  const childPath = dirPath.append(childName)
  const childContent = '#%RAML 1.0 Library'
  const newName = 'library-new'
  const newPath = parentPath.append(newName)
  const newChildPath = newPath.append(childName)

  const fileSystem = await createFileSystem()
  const repository = await Repository.fromFileSystem(fileSystem)
  assertDirectory(repository, dirPath, dirName)
  await assertFile(repository, childPath, childName, childContent, false, true)

  await repository.rename(dirPath, newName)
  expect(repository.getByPath(dirPath)).toBeUndefined()
  assertDirectory(repository, newPath, newName)
  await assertFile(repository, newChildPath, childName, childContent, false, true)

  const newRepository1 = await Repository.fromFileSystem(fileSystem)
  expect(newRepository1.getByPath(dirPath)).toBeUndefined()
  assertDirectory(newRepository1, newPath, newName)
  await assertFile(newRepository1, newChildPath, childName, childContent, false, true)

  // Rename file back
  await repository.rename(newPath, dirName)
  expect(repository.getByPath(newPath)).toBeUndefined()
  assertDirectory(repository, dirPath, dirName)
  await assertFile(repository, childPath, childName, childContent, false, true)

  const newRepository2 = await Repository.fromFileSystem(fileSystem)
  expect(newRepository2.getByPath(newPath)).toBeUndefined()
  assertDirectory(newRepository2, dirPath, dirName)
  await assertFile(newRepository2, childPath, childName, childContent, false, true)
})
