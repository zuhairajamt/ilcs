-- CreateTable
CREATE TABLE `simulasi` (
    `id_simulasi` VARCHAR(191) NOT NULL,
    `kode_barang` VARCHAR(191) NOT NULL,
    `uraian_barang` VARCHAR(191) NOT NULL,
    `bm` INTEGER NOT NULL,
    `nilai_komoditas` DOUBLE NOT NULL,
    `nilai_bm` DOUBLE NOT NULL,
    `waktu_insert` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_simulasi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
