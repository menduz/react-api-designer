
export interface FileSystem {

    /**
     *
     * Path
     * ----
     *
     * A path is an string that represents a location in a File System.
     * A path is composed of path parts:
     *  * A Path Part is expressed by the following regular expression:
     *  [A-Za-z\-\._0-9]+.
     *  * Path Parts are case sensitive: 'hello' and 'Hello' are different
     *  Path parts.
     *
     * A valid path is:
     *  * The root path '/' that represents the topmost of the hierarchy.
     *  * A path that is derived from the root path and appending Path Parts
     *  separated by '/'. Each of the Path Parts that are added are known as
     *  children of the previous path. The previous path is called parent path.
     *
     *
     * If a given nested path exists, after subtracting the last part is should
     * be a valid path too. That means that all the ancestors of a given path
     * exists. For instance, if we have path /a/b/c/d then, /a/b/c, /a/b/, /a/
     * and / must exist.
     * If a path does not have a trailing '/', a '/' is prepended to it.
     *
     * Entry
     * -----
     *
     * An Entry is a data structure with the following keys:
     *
     *  id: identifier provided by the underlying system to uniquely identify a
     *    file or folder. It does not change when a file or folder is moved or
     *    renamed.
     *  name: An string containing the last path part of the full path.
     *  fullpath: The path of the entry that represents it unequivocally.
     *  type: Flag that can be set to 'file' or 'folder' that represents what
     *    kind of entry is.
     *  meta: a key/value repository for contextual information about the file.
     *    standard fields include created, accessed and modified dates.
     *
     *  Examples:
     *
     *  [{
     *    name:       "my.raml",
     *    fullpath:   "/payments-api/my.raml",
     *    type:       "file"
     *  }]
     *
     *  [{
     *    name:       "examples",
     *    fullpath:   "/payments-api/examples",
     *    type:       "folder",
     *    children: [{
     *      name:       "json",
     *      fullpath:   "/payments-api/examples/json",
     *      type:       "folder"
     *      children:   [{
     *        name:       "user.json",
     *        fullpath:   "/payments-api/examples/json/user.json",
     *        type:       "file"
     *      }]
     *    }]
     *   },
     *   {
     *      name:       "xml",
     *      fullpath:   "/payments-api/examples/xml",
     *      type:       "folder"
     *    }]
     *  }]
     *
     * Files
     * -----
     *
     * Content of files is encoded in UTF-8.
     */

    /**
     * Returns a promise that contains the list the Entries that are contained starting from that fullpath.
     *
     * If the method is applied to a fullpath of type file an Entry with that data is fulfilled in the promise.
     */


    directory(path: Path): Promise<Entry>;

    /**
     * Saves content to a given file to the given fullpath. It creates the necessary folders if needed.
     *
     * Returns a promise that fulfills on success or rejects on fail.
     */
    save(path: Path, content: string): Promise<void>;

    /**
     * Creates a folder. Creates all the required previous folder levels if needed.
     *
     * Returns a promise that fulfills on success or rejects on fail.
     */
    createFolder(path: Path): Promise<any>

    /**
     * Returns a promise that contains the content of the file found at fullpath. Fails if the fullpath does not exist or is a folder.
     */
    load(path: Path): Promise<string>;

    /**
     * Removes a fullpath and all the nested children of the hierarchy.
     *
     * Returns a promise that fulfills on success or rejects on fail.
     */
    remove(path: Path): Promise<any>;

    /**
     * Renames a file or folder. If the destination is a different folder
     * it effectively moves the item, preserving the tree if it's a folder.
     *
     * Returns a promise that fulfills on success or rejects on fail.
     */
    rename(source: Path, destination: Path): Promise<any>;
}

export type Path = string;

export interface Entry {
    name: string;
    path: string;
    type: 'folder' | 'file';
    meta?: {[key: string]: any}
    children?: Entry[];
}

export const EntryFolder = 'folder';
export const EntryFile = 'file';