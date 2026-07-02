import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

/**
 * GET /api/profil
 * Returns the site profile (public, no auth needed).
 * If no profile exists yet, returns a default placeholder.
 */
export async function GET() {
  try {
    const profile = await db.siteProfile.findUnique({
      where: { id: 'singleton' },
    });

    if (!profile) {
      // Return default placeholder content
      return NextResponse.json({
        id: 'singleton',
        officeName: 'Dinas Perdagangan dan Perindustrian Kabupaten Ngada',
        address:
          'Jl. Ahmed Suhadi, Bajawa, Kecamatan Bajawa, Kabupaten Ngada, Nusa Tenggara Timur 86412',
        history:
          'Dinas Perdagangan dan Perindustrian (Perindag) Kabupaten Ngada merupakan perangkat daerah yang dibentuk untuk membantu Bupati dalam melaksanakan urusan pemerintahan bidang perdagangan dan perindustrian.\n\nSeiring dengan diberlakukannya otonomi daerah berdasarkan UU Nomor 22 Tahun 1999 dan UU Nomor 32 Tahun 2004 tentang Pemerintahan Daerah, Dinas Perindag Kabupaten Ngada terus berkembang dalam menjalankan tugas dan fungsinya untuk memberdayakan UMKM dan mengembangkan produk unggulan daerah.\n\nKabupaten Ngada dikenal sebagai salah satu pusat produksi tenun ikat, kopi Bajawa, dan kerajinan bambu di Pulau Flores. Dinas Perindag berperan strategis dalam memfasilitasi pelaku usaha lokal untuk mengakses pasar yang lebih luas, baik di tingkat nasional maupun internasional.',
        leaderName: '',
        leaderPosition: 'Kepala Dinas Perdagangan dan Perindustrian Kabupaten Ngada',
        leaderPhoto: null,
        vision:
          'Terwujudnya Kabupaten Ngada yang Maju, Mandiri, dan Berdaya Saing di Bidang Perdagangan dan Perindustrian dalam Bingkai Kearifan Lokal.',
        mission:
          'Meningkatkan kapasitas dan kualitas UMKM melalui pendampingan, pelatihan, dan akses pembiayaan.\nMemperluas jangkauan pemasaran produk unggulan daerah ke pasar nasional dan internasional.\nMelestarikan dan mengembangkan kearifan lokal sebagai nilai tambah produk daerah.\nMembangun ekosistem perdagangan yang inklusif, berkelanjutan, dan berbasis teknologi.\nMemperkuat tata kelola pemerintahan yang bersih, transparan, dan akuntabel.',
        duties:
          'Membantu Bupati dalam melaksanakan urusan pemerintahan bidang perdagangan dan perindustrian yang menjadi kewenangan Daerah.\nMelaksanakan tugas pembantuan di bidang perdagangan dan perindustrian.',
        functions:
          'Perumusan kebijakan di bidang perdagangan dan perindustrian.\nPelaksanaan kebijakan di bidang perdagangan dan perindustrian.\nPelaksanaan evaluasi dan pelaporan di bidang perdagangan dan perindustrian.\nPelaksanaan administrasi dinas di bidang perdagangan dan perindustrian.\nPelaksanaan fungsi lain yang diberikan oleh Bupati sesuai dengan tugas dan fungsinya.',
        email: 'perindag@ngadakab.go.id',
        phone: '+62 384 21023',
        workingHours: 'Senin - Kamis: 08.00 - 16.00 WITA | Jumat: 08.00 - 11.30 WITA',
        mapEmbed: '',
        updatedAt: new Date().toISOString(),
        isDefault: true,
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching site profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site profile' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/profil
 * Update the site profile (admin only). Creates if not exists (upsert).
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const body = await request.json();
    const {
      officeName,
      address,
      history,
      leaderName,
      leaderPosition,
      leaderPhoto,
      vision,
      mission,
      duties,
      functions,
      email,
      phone,
      workingHours,
      mapEmbed,
    } = body;

    // Validate required fields
    if (!officeName || !address || !history || !vision || !mission) {
      return NextResponse.json(
        {
          error: 'Missing required fields: officeName, address, history, vision, mission',
        },
        { status: 400 }
      );
    }

    // Validate leaderPhoto URL if provided
    if (leaderPhoto && typeof leaderPhoto === 'string' && leaderPhoto.trim()) {
      try {
        new URL(leaderPhoto.trim());
      } catch {
        // Allow local paths like /uploads/...
        if (!leaderPhoto.startsWith('/uploads/') && !leaderPhoto.startsWith('/')) {
          return NextResponse.json(
            { error: 'Format URL foto pimpinan tidak valid' },
            { status: 400 }
          );
        }
      }
    }

    // Validate email format if provided
    if (email && typeof email === 'string' && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { error: 'Format email tidak valid' },
          { status: 400 }
        );
      }
    }

    const data = {
      officeName,
      address,
      history,
      leaderName: leaderName || null,
      leaderPosition: leaderPosition || null,
      leaderPhoto: leaderPhoto || null,
      vision,
      mission,
      duties: duties || null,
      functions: functions || null,
      email: email || null,
      phone: phone || null,
      workingHours: workingHours || null,
      mapEmbed: mapEmbed || null,
    };

    const profile = await db.siteProfile.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', ...data },
      update: data,
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating site profile:', error);
    return NextResponse.json(
      { error: 'Failed to update site profile' },
      { status: 500 }
    );
  }
}
