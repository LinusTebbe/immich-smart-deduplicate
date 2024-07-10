import { getAssetDuplicates, getAllAlbums, deleteAssets, init } from "@immich/sdk";
import 'dotenv/config';
import ProgressBar from 'progress';



init({ baseUrl: process.env.IMMICH_BASE_URL, apiKey: process.env.IMMICH_API_KEY });

(async () => {
  const duplicates = await getAssetDuplicates();
  const progressBar = new ProgressBar(':bar :percent [:current/:total] :etas remaining (:rate per second)', { total: duplicates.length });

  for (const duplicate of duplicates) {
    const duplicateData = [];
    for (const asset of duplicate.assets) {
      const albumInfo = await getAllAlbums({assetId: asset.id});
      duplicateData.push({
          albumCount: albumInfo.length,
          timestamp: asset.localDateTime,
          pixels: (asset.exifInfo?.exifImageHeight ?? 0) * (asset.exifInfo?.exifImageWidth ?? 0),
          id: asset.id,
      });
    }

    duplicateData.sort((a, b) => {
      if (a.albumCount === b.albumCount) {
        if (a.timestamp === b.timestamp) {
            return a.pixels > b.pixels ? -1 : 1;
        }
        return new Date(a.timestamp).getTime() < new Date(b.timestamp).getTime() ? -1 : 1;
      }
      return a.albumCount > b.albumCount ? -1 : 1
    });

    duplicateData.shift();

    await deleteAssets({
        assetBulkDeleteDto: {
            ids: duplicateData.map(d => d.id)
        }
    });

    progressBar.tick();
  }
})();