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
    "favorito" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    CONSTRAINT "Musica_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Musica" ("album", "ano", "artista", "capaUrl", "criadoEm", "id", "previewUrl", "titulo", "userId") SELECT "album", "ano", "artista", "capaUrl", "criadoEm", "id", "previewUrl", "titulo", "userId" FROM "Musica";
DROP TABLE "Musica";
ALTER TABLE "new_Musica" RENAME TO "Musica";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
