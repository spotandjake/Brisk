export class Decoder {
  // Public Properties
  public currentIndex: number;
  // Private Properties
  private buffer: number[];
  // Constructor
  constructor(buffer: number[], startingIndex: number) {
    // Set Properties
    this.currentIndex = startingIndex;
    this.buffer = buffer;
  }
  // Public Methods
  public getCurrentIndex() {
    this.currentIndex++;
    return this.buffer[this.currentIndex - 1];
  }
  public getCurrentSlice(sliceLength: number) {
    this.currentIndex += sliceLength;
    return this.buffer.slice(this.currentIndex - sliceLength, this.currentIndex);
  }
  public decodeString(): string {
    // Get String Length
    const stringLength = this.decodeSignedLeb128();
    const stringValue = String.fromCharCode(...this.getCurrentSlice(stringLength));
    // Return String Value
    return stringValue;
  }
  public decodeSignedLeb128(): number {
    let result = 0;
    let shift = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const byte = this.getCurrentIndex();
      result |= (byte & 0x7f) << shift;
      shift += 7;
      if ((0x80 & byte) === 0) {
        if (shift < 32 && (byte & 0x40) !== 0) {
          return result | (~0 << shift);
        }
        return result;
      }
    }
  }
}
