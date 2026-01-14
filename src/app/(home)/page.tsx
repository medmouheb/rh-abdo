import { ApplicationSources } from "./_components/application-sources";
import { ApplicationsTrend } from "./_components/applications-trend";
import { DashboardFilters } from "./_components/dashboard-filters";
import { DelayCompliance } from "./_components/delay-compliance";
import { FinalDecision } from "./_components/final-decision";
import { RecruitmentMode } from "./_components/recruitment-mode";
import { RecruitmentPipeline } from "./_components/recruitment-pipeline";
import { VacancyStats } from "./_components/vacancy-stats";
import { FadeIn, FadeInStagger } from "@/components/animations/fade-in";

export default function Home() {
  return (
    <FadeInStagger>
      <FadeIn>
        <DashboardFilters />
      </FadeIn>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* Column 1: Pipeline & Decision */}
        <div className="flex flex-col gap-4 md:gap-6 2xl:gap-7.5">
          <FadeIn>
            <RecruitmentPipeline />
          </FadeIn>
          <FadeIn>
            <FinalDecision />
          </FadeIn>
        </div>

        {/* Column 2: Sources & Trend */}
        <div className="flex flex-col gap-4 md:gap-6 2xl:gap-7.5">
          <FadeIn>
            <ApplicationSources />
          </FadeIn>
          <FadeIn>
            <ApplicationsTrend />
          </FadeIn>
        </div>

        {/* Column 3: Mode & Delay */}
        <div className="flex flex-col gap-4 md:gap-6 2xl:gap-7.5">
          <FadeIn>
            <RecruitmentMode />
          </FadeIn>
          <FadeIn>
            <DelayCompliance />
          </FadeIn>
        </div>

        {/* Column 4: Vacancy Stats (Cards & Radial) */}
        <div className="flex flex-col gap-4 md:gap-6 2xl:gap-7.5">
          <FadeIn>
            <VacancyStats />
          </FadeIn>
        </div>
      </div>
    </FadeInStagger>
  );
}
