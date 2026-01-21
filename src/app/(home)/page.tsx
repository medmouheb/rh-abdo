import { ApplicationSources } from "./_components/application-sources";
import { ApplicationsTrend } from "./_components/applications-trend";
import { DashboardFilters } from "./_components/dashboard-filters";
import { DelayCompliance } from "./_components/delay-compliance";
import { FinalDecision } from "./_components/final-decision";
import { RecruitmentMode } from "./_components/recruitment-mode";
import { RecruitmentPipeline } from "./_components/recruitment-pipeline";
import { VacancyStats } from "./_components/vacancy-stats";
import { CandidatesByDepartmentGender } from "./_components/candidates-by-department-gender";
import { TotalHiringCost } from "./_components/total-hiring-cost";
import { DashboardKPICards } from "./_components/dashboard-kpi-cards";
import { VacantPositionsTable } from "./_components/vacant-positions-table";
import { CandidatesTable } from "./_components/candidates-table";
import { ServicesStatisticsTable } from "./_components/services-statistics-table";
import {
  PageAnimationWrapper,
  StaggerContainer,
  StaggerItem,
  CardAnimation
} from "@/components/animations/PageAnimations";
import AnimatedBackground from "@/components/backgrounds/AnimatedBackground";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home() {
  // Server-side auth check
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');

  if (!accessToken) {
    redirect('/auth/sign-in');
  }

  return (
    <>
      <AnimatedBackground variant="gradient" />
      <PageAnimationWrapper>
        <StaggerContainer>
          <StaggerItem className="mb-6">
            <CardAnimation>
              <DashboardFilters />
            </CardAnimation>
          </StaggerItem>

          {/* Dashboard KPI Cards */}
          <StaggerItem className="mb-6">
            <DashboardKPICards />
          </StaggerItem>

          {/* New KPI Section */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 2xl:gap-7.5 mb-6">
            <StaggerItem>
              <CardAnimation className="h-full">
                <CandidatesByDepartmentGender />
              </CardAnimation>
            </StaggerItem>
            <StaggerItem>
              <CardAnimation className="h-full">
                <TotalHiringCost />
              </CardAnimation>
            </StaggerItem>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
            {/* Column 1: Pipeline & Decision */}
            <div className="flex flex-col gap-4 md:gap-6 2xl:gap-7.5">
              <StaggerItem>
                <CardAnimation className="h-full">
                  <RecruitmentPipeline />
                </CardAnimation>
              </StaggerItem>
              <StaggerItem>
                <CardAnimation className="h-full">
                  <FinalDecision />
                </CardAnimation>
              </StaggerItem>
            </div>

            {/* Column 2: Sources & Trend */}
            <div className="flex flex-col gap-4 md:gap-6 2xl:gap-7.5">
              <StaggerItem>
                <CardAnimation className="h-full">
                  <ApplicationSources />
                </CardAnimation>
              </StaggerItem>
              <StaggerItem>
                <CardAnimation className="h-full">
                  <ApplicationsTrend />
                </CardAnimation>
              </StaggerItem>
            </div>

            {/* Column 3: Mode & Delay */}
            <div className="flex flex-col gap-4 md:gap-6 2xl:gap-7.5">
              <StaggerItem>
                <CardAnimation className="h-full">
                  <RecruitmentMode />
                </CardAnimation>
              </StaggerItem>
              <StaggerItem>
                <CardAnimation className="h-full">
                  <DelayCompliance />
                </CardAnimation>
              </StaggerItem>
            </div>

            {/* Column 4: Vacancy Stats (Cards & Radial) */}
            <div className="flex flex-col gap-4 md:gap-6 2xl:gap-7.5">
              <StaggerItem>
                <CardAnimation className="h-full">
                  <VacancyStats />
                </CardAnimation>
              </StaggerItem>
            </div>
          </div>

          {/* Data Tables Section */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <StaggerItem>
              <CardAnimation className="h-full">
                <VacantPositionsTable />
              </CardAnimation>
            </StaggerItem>
            <StaggerItem>
              <CardAnimation className="h-full">
                <CandidatesTable />
              </CardAnimation>
            </StaggerItem>
          </div>

          {/* Services Statistics Table - Full Width */}
          <div className="mt-6">
            <StaggerItem>
              <CardAnimation>
                <ServicesStatisticsTable />
              </CardAnimation>
            </StaggerItem>
          </div>
        </StaggerContainer>
      </PageAnimationWrapper>
    </>
  );
}
