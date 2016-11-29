import { MutableRepository } from '../mutable/Repository';
import {Repository} from "./Repository";
import {Path} from './../Path';
import {List} from 'immutable';

import MutableFileRepository = MutableRepository.Repository;
import MutableElement = MutableRepository.Repository.Element;
import MutableDirectory = MutableRepository.Repository.Directory;
import MutableFile = MutableRepository.Repository.File;

export class RepositoryFactory {
    static fileRepository(mutableRepository: MutableFileRepository) {
        return new Repository(RepositoryFactory.directory(mutableRepository.root));
    }

    static directory(mutableDirectory: MutableDirectory) {
        const children = List.of(... mutableDirectory.children)
            .map((element) => RepositoryFactory.element(element))
            .toList();

        return Repository.Directory.directory(mutableDirectory.name,
            Path.fromString(mutableDirectory.path),
            children);
    }

    static file(file: MutableFile) {
        return new Repository.File(file.name, Path.fromString(file.path), file.dirty);
    }

    private static element(element: MutableElement): Repository.Element {
        if (element.isDirectory()) return RepositoryFactory.directory(element as MutableDirectory);

        return RepositoryFactory.file(element as MutableFile);
    }
}
