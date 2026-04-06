import bcrypt from 'bcrypt'
import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  const users = [
    { fullName: 'Admin Genius', email: 'admin@genius.com', role: 'ADMIN' as const, sex: 'male', address: 'Jl. Admin No. 1', religion: 'Islam', phone: '08100000000', birthDate: new Date('1990-01-01'), isVerified: true },
    { fullName: 'Budi Santoso', email: 'budi@gmail.com', role: 'USER' as const, sex: 'male', address: 'Jl. Merdeka No. 10', religion: 'Islam', phone: '08111111111', birthDate: new Date('1995-03-20'), isVerified: true },
    { fullName: 'Siti Rahayu', email: 'siti@gmail.com', role: 'USER' as const, sex: 'female', address: 'Jl. Sudirman No. 5', religion: 'Islam', phone: '08122222222', birthDate: new Date('1998-07-12'), isVerified: true },
    { fullName: 'Andi Wijaya', email: 'andi@gmail.com', role: 'USER' as const, sex: 'male', address: 'Jl. Gatot Subroto No. 3', religion: 'Kristen', phone: '08133333333', birthDate: new Date('2001-11-30'), isVerified: false },
    { fullName: 'Dewi Lestari', email: 'dewi@gmail.com', role: 'USER' as const, sex: 'female', address: 'Jl. Diponegoro No. 7', religion: 'Hindu', phone: '08144444444', birthDate: new Date('1999-02-14'), isVerified: true },
    { fullName: 'Riko Firmansyah', email: 'riko@gmail.com', role: 'USER' as const, sex: 'male', address: 'Jl. Ahmad Yani No. 12', religion: 'Islam', phone: '08155555555', birthDate: new Date('1997-06-08'), isVerified: true },
    { fullName: 'Nur Azizah', email: 'azizah@gmail.com', role: 'USER' as const, sex: 'female', address: 'Jl. Imam Bonjol No. 4', religion: 'Islam', phone: '08166666666', birthDate: new Date('2000-09-25'), isVerified: false },
    { fullName: 'Hendra Kusuma', email: 'hendra@gmail.com', role: 'USER' as const, sex: 'male', address: 'Jl. Cut Nyak Dien No. 8', religion: 'Kristen', phone: '08177777777', birthDate: new Date('1993-12-03'), isVerified: true },
    { fullName: 'Mega Putri', email: 'mega@gmail.com', role: 'USER' as const, sex: 'female', address: 'Jl. Veteran No. 15', religion: 'Islam', phone: '08188888888', birthDate: new Date('2002-04-17'), isVerified: true },
    { fullName: 'Fajar Nugroho', email: 'fajar@gmail.com', role: 'USER' as const, sex: 'male', address: 'Jl. Pemuda No. 22', religion: 'Islam', phone: '08199999999', birthDate: new Date('1996-08-11'), isVerified: false },
    { fullName: 'Laila Fitriani', email: 'laila@gmail.com', role: 'USER' as const, sex: 'female', address: 'Jl. Pahlawan No. 9', religion: 'Islam', phone: '08200000001', birthDate: new Date('2001-01-22'), isVerified: true },
    { fullName: 'Doni Prasetyo', email: 'doni@gmail.com', role: 'USER' as const, sex: 'male', address: 'Jl. Kartini No. 6', religion: 'Katolik', phone: '08200000002', birthDate: new Date('1994-05-30'), isVerified: true },
    { fullName: 'Yuni Safitri', email: 'yuni@gmail.com', role: 'USER' as const, sex: 'female', address: 'Jl. Hayam Wuruk No. 11', religion: 'Islam', phone: '08200000003', birthDate: new Date('1999-10-05'), isVerified: false },
    { fullName: 'Rizky Aditya', email: 'rizky@gmail.com', role: 'USER' as const, sex: 'male', address: 'Jl. Patimura No. 2', religion: 'Islam', phone: '08200000004', birthDate: new Date('2003-03-13'), isVerified: true },
    { fullName: 'Eka Sulistyowati', email: 'eka@gmail.com', role: 'USER' as const, sex: 'female', address: 'Jl. Teuku Umar No. 18', religion: 'Hindu', phone: '08200000005', birthDate: new Date('1998-12-28'), isVerified: true },
    { fullName: 'Bagas Setiawan', email: 'bagas@gmail.com', role: 'USER' as const, sex: 'male', address: 'Jl. RA Kartini No. 14', religion: 'Islam', phone: '08200000006', birthDate: new Date('2000-07-19'), isVerified: false },
    { fullName: 'Fitri Handayani', email: 'fitri@gmail.com', role: 'USER' as const, sex: 'female', address: 'Jl. Sisingamangaraja No. 3', religion: 'Kristen', phone: '08200000007', birthDate: new Date('1997-02-07'), isVerified: true },
    { fullName: 'Agus Salim', email: 'agus@gmail.com', role: 'USER' as const, sex: 'male', address: 'Jl. Pangeran Antasari No. 20', religion: 'Islam', phone: '08200000008', birthDate: new Date('1992-09-14'), isVerified: true },
    { fullName: 'Rini Wulandari', email: 'rini@gmail.com', role: 'USER' as const, sex: 'female', address: 'Jl. Sam Ratulangi No. 16', religion: 'Islam', phone: '08200000009', birthDate: new Date('2001-06-02'), isVerified: false },
    { fullName: 'Wahyu Hidayat', email: 'wahyu@gmail.com', role: 'USER' as const, sex: 'male', address: 'Jl. Wolter Monginsidi No. 1', religion: 'Islam', phone: '08200000010', birthDate: new Date('1996-11-23'), isVerified: true },
  ]

  await prisma.user.deleteMany({
    where: { email: { in: users.map(u => u.email) } }
  })

  const result = await prisma.user.createMany({
    data: users.map(u => ({ ...u, password: hashedPassword })),
  })

  console.log(`✅ Berhasil menambah ${result.count} user`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })