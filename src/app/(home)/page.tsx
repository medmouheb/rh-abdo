import { ApplicationSources } from "./_components/application-sources";
import { ApplicationsTrend } from "./_components/applications-trend";
import { DashboardFilters } from "./_components/dashboard-filters";
import { DelayCompliance } from "./_components/delay-compliance";
import { FinalDecision } from "./_components/final-decision";
import { RecruitmentMode } from "./_components/recruitment-mode";
import { RecruitmentPipeline } from "./_components/recruitment-pipeline";
import { VacancyStats } from "./_components/vacancy-stats";
import {
  PageAnimationWrapper,
  StaggerContainer,
  StaggerItem,
  CardAnimation
} from "@/components/animations/PageAnimations";

export default function Home() {
  return (
    <PageAnimationWrapper>
      <StaggerContainer>
        <StaggerItem className="mb-6">
          <CardAnimation>
            <DashboardFilters />
          </CardAnimation>
        </StaggerItem>

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
      </StaggerContainer>
    </PageAnimationWrapper>
  );
}
