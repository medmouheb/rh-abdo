import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Seed test users with different roles for testing RBAC
 * 
 * This script creates three test users:
 * - RH user (Human Resources)
 * - MANAGER user
 * - CO user (Chief Officer)
 * 
 * All users have the password: "password123"
 */

const TEST_USERS = [
  // Test users for RBAC
  {
    username: 'rh_user',
    password: 'password123',
    role: 'RH' as const,
    displayName: 'RH User',
  },
  {
    username: 'manager_user',
    password: 'password123',
    role: 'Manager' as const,
    displayName: 'Manager User',
  },
  {
    username: 'co_user',
    password: 'password123',
    role: 'CO' as const,
    displayName: 'CO User',
  },
  // Real users from recruitment types
  {
    username: 'hiba.saadani',
    password: 'password123',
    role: 'RH' as const,
    displayName: 'SAADANI HIBA',
  },
  {
    username: 'aymen.bacouche',
    password: 'password123',
    role: 'Manager' as const,
    displayName: 'MOHAMED AYMEN BACOUCHE',
  },
  {
    username: 'zoubaier.berrebeh',
    password: 'password123',
    role: 'CO' as const,
    displayName: 'zoubaier berrebeh',
  },
  {
    username: 'ahmed.benali',
    password: 'password123',
    role: 'CO' as const,
    displayName: 'Ahmed Ben Ali',
  },
  {
    username: 'leila.mansouri',
    password: 'password123',
    role: 'Manager' as const,
    displayName: 'Leila Mansouri',
  },
];

async function main() {
  console.log('🌱 Seeding test users...\n');

  for (const userData of TEST_USERS) {
    // Hash the password
    const passwordHash = await bcrypt.hash(userData.password, 10);

    // Upsert user (create if doesn't exist, update if exists)
    const user = await prisma.user.upsert({
      where: { username: userData.username },
      update: {
        password: passwordHash,
        role: userData.role,
      },
      create: {
        username: userData.username,
        password: passwordHash,
        role: userData.role,
      },
    });

    console.log(`✅ ${userData.displayName}:`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password: ${userData.password}`);
    console.log(`   ID: ${user.id}\n`);
  }

  console.log('✨ Test users seeded successfully!\n');
  console.log('📝 Login Credentials:');
  console.log('   All users have password: password123\n');
  console.log('   Test Users:');
  console.log('   - RH User:      username: rh_user');
  console.log('   - Manager User: username: manager_user');
  console.log('   - CO User:      username: co_user\n');
  console.log('   Real Users (from recruitment types):');
  console.log('   - SAADANI HIBA (RH):        username: hiba.saadani');
  console.log('   - MOHAMED AYMEN BACOUCHE:   username: aymen.bacouche (Manager)');
  console.log('   - zoubaier berrebeh (CO):   username: zoubaier.berrebeh');
  console.log('   - Ahmed Ben Ali (CO):       username: ahmed.benali');
  console.log('   - Leila Mansouri (Manager): username: leila.mansouri\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
