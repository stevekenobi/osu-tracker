import OsuBuffer from './OsuBuffer';

export class OsuCollection {
  public collectionCount: number = 0;
  public collections: OsuCollectionBeatmap[] = [];

  constructor(public version: number = 0) {
  }

  addCollection(collection: OsuCollectionBeatmap): void {
    this.collections.push(collection);
    this.collectionCount++;
  }

  async read(input: Buffer): Promise<void> {
    const buffer = new OsuBuffer(input);

    this.version = buffer.readInt();
    this.collectionCount = buffer.readInt();

    for (let i = 0; i < this.collectionCount; i++) {
      const collection: OsuCollectionBeatmap = {
        name: buffer.readOsuString(),
        beatmapCount: buffer.readInt(),
        beatmaps: [],
      };

      const beatmaps = [];
      for (let i = 0; i < collection.beatmapCount; i++) {
        beatmaps.push(buffer.readOsuString());
      }

      this.collections.push({ ...collection, beatmaps });
    }
  }

  async write(): Promise<Buffer> {
    const buffer = Buffer.allocUnsafe(8 + this.collections.reduce((a, b) => a + 2 + b.name.length + 4 + b.beatmaps.reduce((c, d) => c + 2 + d.length, 0), 0));
    let position = 0;

    buffer.writeInt32LE(this.version, position);
    position += 4;

    buffer.writeInt32LE(this.collectionCount, position);
    position += 4;

    for (const collection of this.collections) {

      buffer[position++] = 11;

      buffer[position++] = collection.name.length;

      buffer.write(collection.name, position, 'utf-8');
      position += collection.name.length;

      buffer.writeInt32LE(collection.beatmapCount, position);
      position += 4;

      for (const b of collection.beatmaps) {
        buffer[position++] = 11;

        buffer[position++] = b.length;

        buffer.write(b, position, 'utf-8');
        position += b.length;
      }
    }

    return buffer;
  }
}

export type OsuCollectionBeatmap = {
  name: string;
  beatmapCount: number,
  beatmaps: string[]
};
