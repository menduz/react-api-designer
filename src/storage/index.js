//@flow

class Storage {

  getValue(key: string, defaultValue: string): string {
    throw new Error('Not implemented method')
  }

  setValue(key: string, value: string): void {
    throw new Error('Not implemented method')
  }
}

class LocalStorage extends Storage {

  getValue(key: string, defaultValue: string): string {
    return window.localStorage.getItem(`designer:preference:${key}`) || defaultValue
  }

  setValue(key: string, value: string): void {
    window.localStorage.setItem(`designer:preference:${key}`, value)
  }
}

class MemoryStorage extends Storage {

  values: Map<string, string>

  constructor() {
    super()
    this.values = new Map()
  }

  getValue(key: string, defaultValue: string): string {
    return this.values.get(`designer:preference:${key}`) || defaultValue
  }

  setValue(key: string, value: string): void {
    this.values.set(`designer:preference:${key}`, value)
  }
}

export default window.localStorage ? new LocalStorage() : new MemoryStorage()