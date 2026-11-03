# Insta-Check

Website sederhana untuk memeriksa hubungan Followers dan Following Instagram menggunakan file ekspor data resmi Instagram (ZIP).

## Fitur

- **Followers**: Menampilkan daftar akun yang mengikuti Anda
- **Following**: Menampilkan daftar akun yang Anda ikuti
- **Belum di-follow balik**: Akun yang mengikuti Anda tetapi tidak Anda ikuti kembali
- **Tidak follow back**: Akun yang Anda ikuti tetapi tidak mengikuti Anda kembali

## Keamanan dan Privasi

- Seluruh proses dilakukan di browser Anda (100% client-side)
- Tidak ada data yang dikirim ke server
- Tidak ada penyimpanan permanen
- Tidak memerlukan login Instagram
- File ZIP diproses secara lokal

## Cara Menggunakan

1. Unduh data Instagram Anda melalui **Accounts Center** → **Your information and permissions** → **Download your information**
2. Pilih kategori **Followers and Following**, format **JSON**
3. Tunggu Instagram mengirimkan file ZIP ke email Anda
4. Unggah file ZIP ke Insta-Check
5. Hasil pengecekan akan ditampilkan secara langsung

## Teknologi

- HTML5
- CSS3
- Vanilla JavaScript
- JSZip (untuk membaca file ZIP)

## Lisensi

Proyek ini bersifat open-source untuk tujuan edukasi dan penggunaan pribadi.
