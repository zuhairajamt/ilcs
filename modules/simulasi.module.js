const prisma = require("../helpers/database");
const Joi = require("joi");
const crypto = require("crypto");
const axios = require("axios");

const generateShortID = (prefix) => {
  const maxLength = 19 - prefix.length;
  const randomHex = crypto
    .randomBytes(Math.ceil(maxLength / 2))
    .toString("hex");
  return prefix + randomHex;
};

class _simulasi {
  getBarang = async (kode_barang) => {
    try {
      const barangResponse = await axios.get(
        `https://insw-dev.ilcs.co.id/my/n/barang?hs_code=${kode_barang}`
      );
      const barang = barangResponse.data.data;
      const uraian_barang = barang[0].sub_header;

      console.log("Response from barang API:", uraian_barang);

      // Get tarif info from API
      const tariffResponse = await axios.get(
        `https://insw-dev.ilcs.co.id/my/n/tarif?hs_code=${kode_barang}`
      );

      const tarif = tariffResponse.data.data;
      const bm = parseFloat(tarif[0].bm);
      const cukai = parseFloat(tarif[0].cukai);

      return { uraian_barang, bm, cukai };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch barang information");
    }
  };

  listSimulasi = async () => {
    try {
      const list = await prisma.simulasi.findMany();

      return {
        status: true,
        data: list,
      };
    } catch (err) {
      console.error("ListSimulasi simulasi module error: ", err);

      return {
        status: false,
        err,
      };
    }
  };

  listSimulasiById = async (id) => {
    try {
      const simulasi = await prisma.simulasi.findUnique({
        where: {
          id_simulasi: id,
        },
      });

      if (!simulasi) {
        return {
          status: false,
          error: "Simulasi not found",
        };
      }

      return {
        status: true,
        data: simulasi,
      };
    } catch (error) {
      console.error("ListSimulasiById simulasi module error: ", error);

      return {
        status: false,
        error: error.message,
      };
    }
  };

  createSimulasi = async (body) => {
    try {
      const { kode_barang, nilai_komoditas } = body;

      // Validate request body
      const schema = Joi.object({
        kode_barang: Joi.string().required(),
        nilai_komoditas: Joi.number().required(),
      });

      const validation = schema.validate(body);

      if (validation.error) {
        const errorDetails = validation.error.details.map(
          (detail) => detail.message
        );

        return {
          status: false,
          code: 442,
          error: errorDetails.join(", "),
        };
      }

      // Get barang information
      const { uraian_barang, bm, cukai } = await this.getBarang(kode_barang);

      // Calculate nilai bm
      const nilai_bm = (nilai_komoditas * cukai) / 100;

      // Generate ID
      const id_simulasi = generateShortID(kode_barang + "-");

      // Create simulasi
      const add = await prisma.simulasi.create({
        data: {
          id_simulasi,
          kode_barang,
          uraian_barang,
          bm,
          nilai_komoditas,
          nilai_bm,
        },
      });

      console.log(uraian_barang);

      return {
        status: true,
        data: add,
      };
    } catch (error) {
      console.error("createSimulasi module error", error);

      return {
        status: false,
        error: error.message,
      };
    }
  };

  editSimulasi = async (id, body) => {
    try {
      const existingSimulasi = await prisma.simulasi.findFirst({
        where: {
          id_simulasi: id,
        },
      });

      console.log("idnya adalah" + id)
  
      if (!existingSimulasi) {
        return {
          status: false,
          error: "Simulasi tidak ditemukan",
        };
      }

      const { kode_barang } = existingSimulasi
  
      const { nilai_komoditas } = body; 
  
      const schema = Joi.object({
        nilai_komoditas: Joi.number().required(),
      });
  
      const validation = schema.validate(body);
  
      if (validation.error) {
        const errorDetails = validation.error.details.map(
          (detail) => detail.message
        );
  
        return {
          status: false,
          code: 442,
          error: errorDetails.join(", "),
        };
      }
     
      const { uraian_barang, bm, cukai, } = await this.getBarang(kode_barang); 
   
      const nilai_bm = (nilai_komoditas * cukai) / 100;
  
      const updatedSimulasi = await prisma.simulasi.update({
        where: {
          id_simulasi: id,
        },
        data: {
          kode_barang,
          uraian_barang,
          bm,
          nilai_komoditas,
          nilai_bm,
        },
      });
  
      return {
        status: true,
        data: updatedSimulasi,
      };
    } catch (error) {
      console.error("editSimulasi module error", error);
  
      return {
        status: false,
        error: error.message,
      };
    }
  };  

  deleteSimulasi = async (id) => {
    try {
      const del = await prisma.simulasi.delete({
        where: {
          id_simulasi: id,
        },
      });

      console.log("iddelete adalah: " + id)

      return {
        status: true,
        data: del,
      };
    } catch (error) {
      console.error("deleteSimulasi module Error: ", error);

      return {
        status: false,
        error: "Unable to delete simulasi",
      };
    }
  };
}

module.exports = new _simulasi();
