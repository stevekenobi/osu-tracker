export default class OsuBuffer {
  private buffer: Buffer;
  private position: number = 0;

  constructor(input: Buffer) {
    this.buffer = Buffer.from(input);
  }

  slice(length: number): Buffer {
    this.position += length;
    return this.buffer.subarray(this.position - length, this.position);
  }

  readByte(): number {
    this.position++;
    return this.buffer.readInt8(this.position - 1);
  }

  readInt(): number {
    this.position += 4;
    return this.buffer.readIntLE(this.position - 4, 4);
  }

  readVarint(): number {
    let total = 0;
    let shift = 0;
    let byte = this.buffer.readUIntLE(this.position, 1);
    this.position++;

    if ((byte & 0x80) === 0) {
      total |= ((byte & 0x7F) << shift);
    } else {
      let end = false;
      do {
        if (shift) {
          byte = this.buffer.readUIntLE(this.position, 1);
          this.position++;
        }
        total |= ((byte & 0x7F) << shift);
        if ((byte & 0x80) === 0) end = true;
        shift += 7;
      } while (!end);
    }

    return total;
  }

  readString(length: number): string {
    return this.slice(length).toString();
  }

  readOsuString(): string {
    const nextByte = this.readByte();
    if (nextByte !== 11) return '';

    const len = this.readVarint();
    return this.readString(len);
  }
}
