import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Memulai database seeding...');

  // 1. Seed Admin
  const email = process.env.ADMIN_EMAIL || 'admin@studio.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.admin.create({
      data: {
        email,
        passwordHash,
      },
    });
    console.log(`Admin user berhasil dibuat: ${email}`);
  } else {
    console.log(`Admin user sudah ada: ${email}`);
  }

  // 2. Seed Kategori
  const kategoriData = [
    { nama: 'Cat Minyak', slug: 'cat-minyak' },
    { nama: 'Akrilik', slug: 'akrilik' },
    { nama: 'Cat Air', slug: 'cat-air' },
    { nama: 'Mixed Media', slug: 'mixed-media' },
    { nama: 'Sketsa', slug: 'sketsa' },
    { nama: 'Mural', slug: 'mural' },
  ];

  const kategoriMap = {};
  for (const kat of kategoriData) {
    const existingKat = await prisma.kategori.findUnique({
      where: { nama: kat.nama },
    });
    if (!existingKat) {
      const created = await prisma.kategori.create({
        data: kat,
      });
      kategoriMap[kat.nama] = created;
      console.log(`Kategori dibuat: ${kat.nama}`);
    } else {
      kategoriMap[kat.nama] = existingKat;
      console.log(`Kategori sudah ada: ${kat.nama}`);
    }
  }

  // 3. Seed Lukisan (Jika database kosong)
  const countLukisan = await prisma.lukisan.count();
  if (countLukisan === 0) {
    console.log('Seeding data lukisan contoh...');
    
    const lukisanContoh = [
      {
        slug: 'mimpi-yang-tertunda',
        judul: 'Mimpi yang Tertunda',
        tahun: 2025,
        medium: 'Cat Minyak di atas Kanvas',
        ukuran: '100 × 120 cm',
        kanvas: 'Kanvas',
        deskripsi: 'Sebuah refleksi tentang ambisi yang tertahan oleh waktu. Sapuan kuas tebal membentuk figur abstrak yang seolah terjebak dalam ruang gelap, mencoba meraih cahaya yang semakin menjauh. Karya ini dibuat dalam satu sesi marathon 18 jam — tanpa jeda, tanpa ragu.',
        harga: 15000000,
        tampilHarga: true,
        status: 'TERSEDIA',
        featured: true,
        fotoUtama: 'https://picsum.photos/seed/lukisan1/800/1000',
        fotoLain: [
          'https://picsum.photos/seed/lukisan1b/800/600',
          'https://picsum.photos/seed/lukisan1c/600/800',
        ],
        kategoriNama: ['Cat Minyak', 'Mixed Media'],
      },
      {
        slug: 'perempuan-di-ujung-senja',
        judul: 'Perempuan di Ujung Senja',
        tahun: 2025,
        medium: 'Akrilik di atas Kanvas',
        ukuran: '80 × 100 cm',
        kanvas: 'Kanvas',
        deskripsi: 'Potret seorang perempuan yang berdiri di tepi jurang, menatap matahari terbenam. Warna-warna hangat menyatu dengan bayangan gelap — sebuah dualitas antara harapan dan keputusasaan.',
        harga: 12000000,
        tampilHarga: true,
        status: 'TERJUAL',
        featured: false,
        fotoUtama: 'https://picsum.photos/seed/lukisan2/800/900',
        fotoLain: [],
        kategoriNama: ['Akrilik'],
      },
      {
        slug: 'kota-yang-tidak-tidur',
        judul: 'Kota yang Tidak Tidur',
        tahun: 2024,
        medium: 'Cat Minyak di atas Kayu',
        ukuran: '60 × 90 cm',
        kanvas: 'Kayu',
        deskripsi: 'Pemandangan urban yang kacau — gedung-gedung miring, lampu neon menyala di mana-mana, dan manusia-manusia kecil yang berlarian seperti semut. Sebuah kritik terhadap kehidupan kota modern yang tidak pernah berhenti.',
        harga: 8500000,
        tampilHarga: false,
        status: 'TERSEDIA',
        featured: true,
        fotoUtama: 'https://picsum.photos/seed/lukisan3/900/700',
        fotoLain: ['https://picsum.photos/seed/lukisan3b/800/600'],
        kategoriNama: ['Cat Minyak'],
      },
      {
        slug: 'dialog-dengan-sunyi',
        judul: 'Dialog dengan Sunyi',
        tahun: 2024,
        medium: 'Mixed Media',
        ukuran: '70 × 70 cm',
        kanvas: 'Kanvas',
        deskripsi: 'Kolase dari kertas koran, cat akrilik, dan benang — membentuk wajah yang setengah tersembunyi. Karya ini berbicara tentang komunikasi yang gagal, tentang kata-kata yang tidak pernah sampai.',
        harga: null,
        tampilHarga: false,
        status: 'TIDAK_DIJUAL',
        featured: false,
        fotoUtama: 'https://picsum.photos/seed/lukisan4/700/700',
        fotoLain: [],
        kategoriNama: ['Mixed Media'],
      },
    ];

    for (const luk of lukisanContoh) {
      const { kategoriNama, ...lukData } = luk;
      
      // Ambil ID kategori terkait
      const connectKats = kategoriNama
        .map(nama => kategoriMap[nama] || null)
        .filter(k => k !== null)
        .map(k => ({ id: k.id }));

      await prisma.lukisan.create({
        data: {
          ...lukData,
          kategori: {
            connect: connectKats,
          },
        },
      });
      console.log(`Lukisan dibuat: ${luk.judul}`);
    }
  } else {
    console.log('Data lukisan sudah ada, melewati seeding lukisan.');
  }

  // 4. Seed HalamanKonten ("tentang")
  const existingTentang = await prisma.halamanKonten.findUnique({
    where: { kunci: 'tentang' },
  });
  if (!existingTentang) {
    const tentangKonten = {
      nama: 'Ari "Urakan" Wibowo',
      tagline: 'Melukis bukan karena bisa, tapi karena harus.',
      foto: 'https://picsum.photos/seed/pelukis/600/800',
      bio: `Lahir di gang sempit Yogyakarta, 1990. Tidak pernah sekolah seni formal — belajar dari tembok-tembok kota, dari poster band punk yang ditempel di tiang listrik, dari buku-buku yang dicuri dari perpustakaan keliling.

Mulai melukis serius tahun 2015 setelah kehilangan pekerjaan kantoran. Kanvas pertama: dinding kamar kos 3x3 meter. Cat pertama: sisa cat tembok yang dikasih tetangga.

Sekarang, setiap karya adalah percakapan jujur antara kuas dan kanvas — tanpa filter, tanpa pretensi. Seni yang mentah, seperti hidup itu sendiri.`,
      timeline: [
        { tahun: '2015', peristiwa: 'Mulai melukis — dinding kamar kos sebagai kanvas pertama' },
        { tahun: '2017', peristiwa: 'Pameran pertama di warung kopi, 7 lukisan terjual' },
        { tahun: '2019', peristiwa: 'Residensi seni di Bali — 3 bulan hidup dari melukis' },
        { tahun: '2021', peristiwa: 'Pameran tunggal "TERIAK" di Galeri Nasional Jakarta' },
        { tahun: '2023', peristiwa: 'Mural pertama — dinding pabrik 15 meter di Surabaya' },
        { tahun: '2025', peristiwa: 'Membuka studio sendiri di Yogyakarta' },
      ],
    };
    await prisma.halamanKonten.create({
      data: {
        kunci: 'tentang',
        konten: tentangKonten,
      },
    });
    console.log('HalamanKonten "tentang" berhasil dibuat.');
  }

  // 5. Seed HalamanKonten ("info")
  const existingInfo = await prisma.halamanKonten.findUnique({
    where: { kunci: 'info' },
  });
  if (!existingInfo) {
    const infoKonten = {
      intro: 'Setiap lukisan adalah pesanan khusus. Tidak ada template. Tidak ada jalan pintas. Hanya kuas, cat, dan cerita yang ingin kamu sampaikan.',
      layanan: [
        {
          nama: 'Lukisan Potret',
          deskripsi: 'Potret realistis atau semi-abstrak dari foto. Bisa individu, pasangan, atau keluarga. Setiap wajah diceritakan ulang dengan goresan yang jujur.',
          hargaMin: 5000000,
          hargaMax: 20000000,
          estimasiWaktu: '2–4 minggu',
        },
        {
          nama: 'Lukisan Custom',
          deskripsi: 'Lukisan berdasarkan tema, cerita, atau ide kamu. Abstrak, ekspresionis, atau gaya apa pun yang terasa benar. Diskusi mendalam sebelum kuas menyentuh kanvas.',
          hargaMin: 8000000,
          hargaMax: 30000000,
          estimasiWaktu: '3–6 minggu',
        },
        {
          nama: 'Mural & Dinding',
          deskripsi: 'Mengubah dinding kosong jadi karya seni. Cocok untuk cafe, kantor, ruang publik. Survei lokasi termasuk dalam paket.',
          hargaMin: 15000000,
          hargaMax: 50000000,
          estimasiWaktu: '1–3 minggu (tergantung ukuran)',
        },
        {
          nama: 'Ilustrasi',
          deskripsi: 'Ilustrasi untuk buku, poster, merchandise. Gaya mentah dan ekspresif — bukan ilustrasi digital yang bersih. Ini tinta dan kertas.',
          hargaMin: 2000000,
          hargaMax: 8000000,
          estimasiWaktu: '1–2 minggu',
        },
      ],
      caraPesan: [
        {
          nomor: 1,
          judul: 'Ceritakan Idemu',
          deskripsi: 'Isi form kontak atau kirim pesan WA. Ceritakan apa yang kamu inginkan — sedetail mungkin atau sesederhana "aku butuh lukisan untuk ruang tamu".',
        },
        {
          nomor: 2,
          judul: 'Diskusi & Kesepakatan',
          deskripsi: 'Kita ngobrol. Bahas gaya, ukuran, medium, timeline, dan budget. Tidak ada tekanan. Kalau cocok, kita lanjut dengan DP 50%.',
        },
        {
          nomor: 3,
          judul: 'Proses & Serah Terima',
          deskripsi: 'Kamu bisa lihat progress via foto/video. Setelah selesai, pelunasan dan pengiriman. Lukisan siap menghiasi dindingmu.',
        },
      ],
    };
    await prisma.halamanKonten.create({
      data: {
        kunci: 'info',
        konten: infoKonten,
      },
    });
    console.log('HalamanKonten "info" berhasil dibuat.');
  }

  // 6. Seed HalamanKonten ("settings")
  const existingSettings = await prisma.halamanKonten.findUnique({
    where: { kunci: 'settings' },
  });
  if (!existingSettings) {
    const settingsKonten = {
      studioName: 'STUDIO URAKAN',
      heroTitleFirst: 'STUDIO',
      heroTitleSecond: 'URAKAN',
      heroTagline: 'Seni yang jujur tidak butuh packaging yang mewah.\nTapi tetap butuh rancangan yang matang.',
      manifestoQuote: 'Melukis bukan tentang membuat yang indah. Melukis adalah menyampaikan yang jujur — meskipun jujur itu jelek, kasar, dan tidak enak dilihat.',
      manifestoCite: 'Ari "Urakan" Wibowo',
      ctaTitle: 'PUNYA CERITA\nYANG INGIN\nDILUKIS?',
      ctaDesc: 'Setiap lukisan dimulai dari percakapan. Ceritakan idemu.',
      email: 'studio@urakan.com',
      whatsapp: '6281234567890',
      instagram: 'https://instagram.com',
    };
    await prisma.halamanKonten.create({
      data: {
        kunci: 'settings',
        konten: settingsKonten,
      },
    });
    console.log('HalamanKonten "settings" berhasil dibuat.');
  }

  console.log('Database seeding selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
