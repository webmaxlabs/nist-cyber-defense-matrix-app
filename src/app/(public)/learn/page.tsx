import type { Metadata } from 'next'
import { FrameworkOverview } from '@/components/learn/framework-overview'
import { SecurityToolsSection } from '@/components/learn/security-tools-section'
import { FAQSection } from '@/components/learn/faq-section'
import { ResourcesSection } from '@/components/learn/resources-section'
import { faqs } from '@/lib/constants/faq-data'

export const metadata: Metadata = {
  title: "Learn the Cyber Defense Matrix Framework",
  description:
    "Understand Sounil Yu's Cyber Defense Matrix — a 5×5 grid mapping NIST CSF functions against asset classes. Learn maturity assessment, tool mapping, and security gap analysis.",
  alternates: {
    canonical: "https://cyberdefensematrix.ai/learn",
  },
  openGraph: {
    title: "Learn the Cyber Defense Matrix Framework",
    description:
      "Understand Sounil Yu's Cyber Defense Matrix — a 5×5 grid mapping NIST CSF functions against asset classes.",
    url: "https://cyberdefensematrix.ai/learn",
  },
}

export default function LearnPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://cyberdefensematrix.ai",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Learn",
        item: "https://cyberdefensematrix.ai/learn",
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <FrameworkOverview />
        <SecurityToolsSection />
        <FAQSection />
        <ResourcesSection />
      </div>
    </>
  )
}
