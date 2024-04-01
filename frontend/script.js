document.getElementById("simulasiForm").addEventListener("submit", async function(event) {
    event.preventDefault();
  
    const id = document.getElementById("simulasiId").value;
    const kode_barang = document.getElementById("kode_barang").value;
    const nilai_komoditas = parseFloat(document.getElementById("nilai_komoditas").value);
  
    let url = "http://localhost:8080/api/simulasi";
    let method = "POST";
  
    if (id) {
      url += `/${id}`;
      method = "PUT";
    }
  
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ kode_barang, nilai_komoditas })
      });
  
      const data = await response.json();
      if (data.status) {
        alert("Simulasi berhasil disimpan.");
        clearForm();
        loadSimulasiData();
      } else {
        alert("Gagal menyimpan simulasi: " + data.error);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Terjadi kesalahan saat menyimpan simulasi.");
    }
  });
  
  async function editSimulasi(id) {
    try {
      const response = await fetch(`http://localhost:8080/api/simulasi/${id}`);
      const data = await response.json();
  
      if (data.status) {
        const simulasi = data.data;
        document.getElementById("simulasiId").value = simulasi.id_simulasi;
        document.getElementById("kode_barang").value = simulasi.kode_barang;
        document.getElementById("nilai_komoditas").value = simulasi.nilai_komoditas;
      } else {
        alert("Gagal mendapatkan data simulasi untuk diedit: " + data.error);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Terjadi kesalahan saat mendapatkan data simulasi untuk diedit.");
    }
  }
  
  async function loadSimulasiData() {
    try {
      const response = await fetch("http://localhost:8080/api/simulasi");
      const data = await response.json();
  
      if (data.status) {
        const simulasiList = data.data;
        let tableHTML = "";
  
        simulasiList.forEach(simulasi => {
          tableHTML += `<tr>
                          <td>${simulasi.id_simulasi}</td>
                          <td>${simulasi.kode_barang}</td>
                          <td>${simulasi.uraian_barang}</td>
                          <td>${simulasi.bm}</td>
                          <td>${simulasi.nilai_komoditas}</td>
                          <td>${simulasi.nilai_bm}</td>
                          <td>
                            <button class="editBtn" onclick="editSimulasi('${simulasi.id_simulasi}')">Edit</button>
                            <button class="deleteBtn" data-id="${simulasi.id_simulasi}">Hapus</button>
                          </td>
                        </tr>`;
        });
  
        document.getElementById("simulasiTableBody").innerHTML = tableHTML;
  
        // Tambahkan event listener untuk setiap tombol hapus
        document.querySelectorAll('.deleteBtn').forEach(btn => {
          btn.addEventListener('click', async function() {
            const id = this.getAttribute('data-id');
            if (confirm("Apakah Anda yakin ingin menghapus simulasi ini?")) {
              try {
                const response = await fetch(`http://localhost:8080/api/simulasi/${id}`, {
                  method: 'DELETE'
                });
                const result = await response.json();
                if (result.status) {
                  alert("Simulasi berhasil dihapus.");
                  loadSimulasiData();
                } else {
                  alert("Gagal menghapus simulasi: " + result.error);
                }
              } catch (error) {
                console.error("Terjadi kesalahan:", error);
                alert("Terjadi kesalahan saat menghapus simulasi.");
              }
            }
          });
        });
      } else {
        alert("Gagal mendapatkan list simulasi: " + data.error);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Terjadi kesalahan saat mendapatkan list simulasi.");
    }
  }
  
  function clearForm() {
    document.getElementById("simulasiId").value = "";
    document.getElementById("kode_barang").value = "";
    document.getElementById("nilai_komoditas").value = "";
  }
  
  // Load simulasi data saat halaman pertama kali dimuat
  loadSimulasiData();
  