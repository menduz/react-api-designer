class Storage {

  static getValue(key: string, defaultValue: any): any {
    throw new Error('Not implemented method')
  }

  static setValue(key: string, value: any): void {
    throw new Error('Not implemented method')
  }

  static getStorage(): any {
    throw new Error('Not implemented method')
  }
}

export default class LocalStorage extends Storage {

  static getValue(key: string, defaultValue: any): any {
    return localStorage.getItem(`designer:preference:${key}`) || defaultValue
  }

  static setValue(key: string, value: any): void {
    localStorage.setItem(`designer:preference:${key}`, value)
  }

  static getStorage(): any {
    return localStorage
  }
}