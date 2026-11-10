import { ResumeContent } from "@shared/schema";

export interface ResumeTemplateProps {
  content?: ResumeContent;
}

export type TemplateComponent = React.FC<ResumeTemplateProps>;
