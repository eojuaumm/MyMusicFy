/*
  Warnings:

  - You are about to drop the column `PreviewUrl` on the `Musica` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Musica" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "artista" TEXT NOT NULL,
    "album" TEXT,
    "ano" INTEGER,
    "capaUrl" TEXT,
    "previewUrl" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    CONSTRAINT "Musica_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Musica" ("album", "ano", "artista", "capaUrl", "criadoEm", "id", "titulo", "userId") SELECT "album", "ano", "artista", "capaUrl", "criadoEm", "id", "titulo", "userId" FROM "Musica";
DROP TABLE "Musica";
ALTER TABLE "new_Musica" RENAME TO "Musica";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
