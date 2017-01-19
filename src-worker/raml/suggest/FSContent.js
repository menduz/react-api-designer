export default class FSContent {
  constructor(text, offset) {
    this.text = text
    this.offset = offset
  }

  getText() {
    return this.text;
  }

  getPath() {
    return ''
  }

  getBaseName(){
    return ''
  }

  getOffset() {
    return this.offset;
  }
}