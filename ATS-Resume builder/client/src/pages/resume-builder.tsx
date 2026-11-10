import { useParams } from "wouter";
import { Header } from "@/components/header";
import { ResumeBuilder as Builder } from "@/components/resume-builder";

export default function ResumeBuilder() {
  // Get resume ID from URL params if it exists
  const params = useParams<{ id: string }>();
  const resumeId = params?.id ? parseInt(params.id) : undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-hidden">
        <Builder resumeId={resumeId} />
      </main>
    </div>
  );
}
