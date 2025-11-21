-- CreateTable
CREATE TABLE "Playlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MusicaToPlaylist" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MusicaToPlaylist_A_fkey" FOREIGN KEY ("A") REFERENCES "Musica" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MusicaToPlaylist_B_fkey" FOREIGN KEY ("B") REFERENCES "Playlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_MusicaToPlaylist_AB_unique" ON "_MusicaToPlaylist"("A", "B");

-- CreateIndex
CREATE INDEX "_MusicaToPlaylist_B_index" ON "_MusicaToPlaylist"("B");
