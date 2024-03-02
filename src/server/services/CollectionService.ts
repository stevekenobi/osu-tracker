import type { Request, Response } from 'express';
import AbstractService from '../AbstractService';
import fs from 'fs/promises';
import { OsuCollectionFile } from '../../client/OsuCollection';
import { getCollections } from '../helpers/collection';
import path from 'path';

export default class CollectionService extends AbstractService {
  override init(): void {
    /* empty */
  }
  override shutDown(): void {
    /* empty */
  }

  override registerRoutes(): void {
    this.app.get('/api/collection', (req: Request, res: Response) => {
      this._getCollectionRequestHandler(req, res);
    });
  }

  private async _getCollectionRequestHandler(_req: Request, res: Response): Promise<void> {
    const collections = await getCollections(this.databaseClient, this.sheetClient);
    const osuCollection = new OsuCollectionFile(20240123);
    collections.forEach(c => {
      osuCollection.addCollection(c);
    });
    const pathName = path.join(__dirname, 'collection.db');
    await fs.writeFile(pathName, await osuCollection.write());
    res.download(pathName);
    fs.rm(pathName);
  }
}
