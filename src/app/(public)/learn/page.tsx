import { FrameworkOverview } from '@/components/learn/framework-overview'
import { SecurityToolsSection } from '@/components/learn/security-tools-section'
import { FAQSection } from '@/components/learn/faq-section'
import { ResourcesSection } from '@/components/learn/resources-section'

export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <FrameworkOverview />
      <SecurityToolsSection />
      <FAQSection />
      <ResourcesSection />
    </div>
  )
}
