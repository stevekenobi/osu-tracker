import OsuBuffer from './OsuBuffer';

export class OsuCollection {
  public version: number = 0;
  public collectionCount: number = 0;
  public collections: OsuCollectionBeatmap[] = [];

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
}

export type OsuCollectionBeatmap = {
  name: string;
  beatmapCount: number,
  beatmaps: string[]
};
