
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const candidateId = 3; // Using a known existing ID
  console.log(`Fetching candidate ${candidateId}...`);

  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        hiringRequest: {
          include: {
            recruiter: true,
          },
        },
        validations: {
          include: {
            validator: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        interviews: {
          include: {
            interviewer: true,
          },
          orderBy: {
            scheduledAt: 'desc',
          },
        },
        medicalVisit: true,
        jobOffer: true,
      },
    });
    console.log('Candidate fetched successfully:', candidate ? 'Found' : 'Not Found');
    if (candidate) {
        console.log(JSON.stringify(candidate, null, 2));
    }
  } catch (error) {
    console.error('Error fetching candidate:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
