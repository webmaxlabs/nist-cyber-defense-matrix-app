export interface SecurityToolData {
  id: string
  vendorName: string
  category: string
  description: string
  keyProducts: string[]
  coverageCells: Array<{
    row: 'devices' | 'applications' | 'networks' | 'data' | 'users'
    column: 'identify' | 'protect' | 'detect' | 'respond' | 'recover'
  }>
  costRange: 'free' | 'low' | 'medium' | 'high' | 'enterprise'
  popularityRank: number
  websiteUrl: string
}

export const SECURITY_TOOLS: SecurityToolData[] = [
  // ─────────────────────────────────────────────
  // 1-10
  // ─────────────────────────────────────────────
  {
    id: 'crowdstrike',
    vendorName: 'CrowdStrike',
    category: 'Endpoint Security',
    description:
      'Cloud-native endpoint protection platform that combines next-gen antivirus, endpoint detection and response, and managed threat hunting.',
    keyProducts: [
      'Falcon Prevent',
      'Falcon Insight',
      'Falcon OverWatch',
      'Falcon Discover',
      'Falcon Identity Protection',
    ],
    coverageCells: [
      { row: 'devices', column: 'protect' },
      { row: 'devices', column: 'detect' },
      { row: 'devices', column: 'respond' },
      { row: 'users', column: 'detect' },
      { row: 'applications', column: 'detect' },
    ],
    costRange: 'enterprise',
    popularityRank: 1,
    websiteUrl: 'https://www.crowdstrike.com',
  },
  {
    id: 'microsoft',
    vendorName: 'Microsoft',
    category: 'Endpoint Security',
    description:
      'Comprehensive security ecosystem spanning endpoint protection, identity management, cloud security, and SIEM through the Microsoft Defender and Entra families.',
    keyProducts: [
      'Microsoft Defender for Endpoint',
      'Microsoft Entra ID',
      'Microsoft Sentinel',
      'Microsoft Defender for Cloud',
      'Microsoft Purview',
    ],
    coverageCells: [
      { row: 'devices', column: 'protect' },
      { row: 'devices', column: 'detect' },
      { row: 'users', column: 'protect' },
      { row: 'applications', column: 'protect' },
      { row: 'data', column: 'protect' },
      { row: 'networks', column: 'detect' },
    ],
    costRange: 'enterprise',
    popularityRank: 2,
    websiteUrl: 'https://www.microsoft.com/security',
  },
  {
    id: 'palo-alto-networks',
    vendorName: 'Palo Alto Networks',
    category: 'Network Security',
    description:
      'Leading network security company delivering next-generation firewalls, cloud-native security, and AI-driven security operations.',
    keyProducts: [
      'Strata (Next-Gen Firewall)',
      'Prisma Access',
      'Cortex XDR',
      'Cortex XSOAR',
      'Prisma Cloud',
    ],
    coverageCells: [
      { row: 'networks', column: 'protect' },
      { row: 'networks', column: 'detect' },
      { row: 'devices', column: 'detect' },
      { row: 'devices', column: 'respond' },
      { row: 'applications', column: 'protect' },
    ],
    costRange: 'enterprise',
    popularityRank: 3,
    websiteUrl: 'https://www.paloaltonetworks.com',
  },
  {
    id: 'cisco',
    vendorName: 'Cisco',
    category: 'Network Security',
    description:
      'Enterprise networking and security provider offering firewalls, secure access, email security, and extended detection and response across hybrid environments.',
    keyProducts: [
      'Cisco Secure Firewall',
      'Cisco Umbrella',
      'Cisco Duo',
      'Cisco Secure Endpoint',
      'Cisco SecureX',
    ],
    coverageCells: [
      { row: 'networks', column: 'protect' },
      { row: 'networks', column: 'detect' },
      { row: 'users', column: 'protect' },
      { row: 'devices', column: 'protect' },
      { row: 'applications', column: 'protect' },
    ],
    costRange: 'enterprise',
    popularityRank: 4,
    websiteUrl: 'https://www.cisco.com/site/us/en/products/security/index.html',
  },
  {
    id: 'okta',
    vendorName: 'Okta',
    category: 'Identity & Access Management',
    description:
      'Cloud-based identity and access management platform providing single sign-on, multi-factor authentication, and lifecycle management for workforce and customer identities.',
    keyProducts: [
      'Okta Single Sign-On',
      'Okta Adaptive MFA',
      'Okta Lifecycle Management',
      'Okta Identity Governance',
      'Auth0 by Okta',
    ],
    coverageCells: [
      { row: 'users', column: 'identify' },
      { row: 'users', column: 'protect' },
      { row: 'applications', column: 'protect' },
      { row: 'users', column: 'detect' },
    ],
    costRange: 'high',
    popularityRank: 5,
    websiteUrl: 'https://www.okta.com',
  },
  {
    id: 'sentinelone',
    vendorName: 'SentinelOne',
    category: 'Endpoint Security',
    description:
      'AI-powered endpoint security platform providing autonomous prevention, detection, and response across endpoints, cloud workloads, and IoT devices.',
    keyProducts: [
      'Singularity Platform',
      'Singularity XDR',
      'Singularity Cloud',
      'Singularity Ranger',
      'Singularity Identity',
    ],
    coverageCells: [
      { row: 'devices', column: 'protect' },
      { row: 'devices', column: 'detect' },
      { row: 'devices', column: 'respond' },
      { row: 'devices', column: 'recover' },
      { row: 'applications', column: 'detect' },
    ],
    costRange: 'enterprise',
    popularityRank: 6,
    websiteUrl: 'https://www.sentinelone.com',
  },
  {
    id: 'splunk',
    vendorName: 'Splunk',
    category: 'SIEM & Analytics',
    description:
      'Industry-leading SIEM and observability platform that ingests machine data at scale for security monitoring, threat detection, and incident investigation.',
    keyProducts: [
      'Splunk Enterprise Security',
      'Splunk SOAR',
      'Splunk Cloud Platform',
      'Splunk User Behavior Analytics',
      'Splunk Attack Analyzer',
    ],
    coverageCells: [
      { row: 'devices', column: 'detect' },
      { row: 'networks', column: 'detect' },
      { row: 'applications', column: 'detect' },
      { row: 'devices', column: 'respond' },
      { row: 'users', column: 'detect' },
    ],
    costRange: 'enterprise',
    popularityRank: 7,
    websiteUrl: 'https://www.splunk.com',
  },
  {
    id: 'fortinet',
    vendorName: 'Fortinet',
    category: 'Network Security',
    description:
      'Broad cybersecurity platform delivering high-performance network security through next-gen firewalls, SD-WAN, and a converged security fabric.',
    keyProducts: [
      'FortiGate (Next-Gen Firewall)',
      'FortiAnalyzer',
      'FortiSIEM',
      'FortiEDR',
      'FortiSASE',
    ],
    coverageCells: [
      { row: 'networks', column: 'protect' },
      { row: 'networks', column: 'detect' },
      { row: 'devices', column: 'protect' },
      { row: 'devices', column: 'detect' },
      { row: 'applications', column: 'protect' },
    ],
    costRange: 'enterprise',
    popularityRank: 8,
    websiteUrl: 'https://www.fortinet.com',
  },
  {
    id: 'zscaler',
    vendorName: 'Zscaler',
    category: 'Network Security',
    description:
      'Cloud-native zero-trust network access platform that secures internet and private application access without traditional VPNs or firewalls.',
    keyProducts: [
      'Zscaler Internet Access (ZIA)',
      'Zscaler Private Access (ZPA)',
      'Zscaler Digital Experience (ZDX)',
      'Zscaler Data Protection',
    ],
    coverageCells: [
      { row: 'networks', column: 'protect' },
      { row: 'users', column: 'protect' },
      { row: 'applications', column: 'protect' },
      { row: 'data', column: 'protect' },
    ],
    costRange: 'enterprise',
    popularityRank: 9,
    websiteUrl: 'https://www.zscaler.com',
  },
  {
    id: 'cloudflare',
    vendorName: 'Cloudflare',
    category: 'Network Security',
    description:
      'Global cloud network providing DDoS protection, web application firewall, zero-trust access, and edge security services for applications and infrastructure.',
    keyProducts: [
      'Cloudflare WAF',
      'Cloudflare Zero Trust',
      'Cloudflare DDoS Protection',
      'Cloudflare Magic Transit',
      'Cloudflare Access',
    ],
    coverageCells: [
      { row: 'networks', column: 'protect' },
      { row: 'applications', column: 'protect' },
      { row: 'networks', column: 'detect' },
      { row: 'networks', column: 'recover' },
    ],
    costRange: 'medium',
    popularityRank: 10,
    websiteUrl: 'https://www.cloudflare.com',
  },

  // ─────────────────────────────────────────────
  // 11-20
  // ─────────────────────────────────────────────
  {
    id: 'cyberark',
    vendorName: 'CyberArk',
    category: 'Identity & Access Management',
    description:
      'Privileged access management leader that secures, manages, and audits privileged credentials and sessions across on-premises and cloud environments.',
    keyProducts: [
      'Privileged Access Manager',
      'Endpoint Privilege Manager',
      'Secrets Manager',
      'CyberArk Identity',
      'Conjur',
    ],
    coverageCells: [
      { row: 'users', column: 'identify' },
      { row: 'users', column: 'protect' },
      { row: 'users', column: 'detect' },
      { row: 'data', column: 'protect' },
    ],
    costRange: 'enterprise',
    popularityRank: 11,
    websiteUrl: 'https://www.cyberark.com',
  },
  {
    id: 'tenable',
    vendorName: 'Tenable',
    category: 'Vulnerability Management',
    description:
      'Exposure management platform that provides continuous visibility into vulnerabilities, misconfigurations, and attack paths across the modern attack surface.',
    keyProducts: [
      'Tenable Nessus',
      'Tenable.io',
      'Tenable.sc',
      'Tenable.ad',
      'Tenable Cloud Security',
    ],
    coverageCells: [
      { row: 'devices', column: 'identify' },
      { row: 'applications', column: 'identify' },
      { row: 'networks', column: 'identify' },
      { row: 'devices', column: 'detect' },
    ],
    costRange: 'high',
    popularityRank: 12,
    websiteUrl: 'https://www.tenable.com',
  },
  {
    id: 'rapid7',
    vendorName: 'Rapid7',
    category: 'Vulnerability Management',
    description:
      'Security analytics and automation company offering vulnerability management, incident detection and response, application security testing, and cloud security.',
    keyProducts: [
      'InsightVM',
      'InsightIDR',
      'InsightConnect',
      'InsightAppSec',
      'Metasploit Pro',
    ],
    coverageCells: [
      { row: 'devices', column: 'identify' },
      { row: 'devices', column: 'detect' },
      { row: 'applications', column: 'identify' },
      { row: 'devices', column: 'respond' },
      { row: 'networks', column: 'detect' },
    ],
    costRange: 'high',
    popularityRank: 13,
    websiteUrl: 'https://www.rapid7.com',
  },
  {
    id: 'proofpoint',
    vendorName: 'Proofpoint',
    category: 'Email Security',
    description:
      'People-centric security platform protecting organizations from advanced email threats, data loss, and compliance risks across email, cloud, and social channels.',
    keyProducts: [
      'Proofpoint Email Protection',
      'Proofpoint Targeted Attack Protection',
      'Proofpoint Security Awareness Training',
      'Proofpoint Information Protection',
      'Proofpoint Insider Threat Management',
    ],
    coverageCells: [
      { row: 'users', column: 'protect' },
      { row: 'applications', column: 'protect' },
      { row: 'data', column: 'protect' },
      { row: 'users', column: 'detect' },
    ],
    costRange: 'enterprise',
    popularityRank: 14,
    websiteUrl: 'https://www.proofpoint.com',
  },
  {
    id: 'mimecast',
    vendorName: 'Mimecast',
    category: 'Email Security',
    description:
      'Cloud-based email security and resilience platform that defends against phishing, ransomware, impersonation attacks, and data leaks in email communications.',
    keyProducts: [
      'Mimecast Secure Email Gateway',
      'Mimecast Targeted Threat Protection',
      'Mimecast Awareness Training',
      'Mimecast Archive',
      'Mimecast Brand Exploit Protect',
    ],
    coverageCells: [
      { row: 'users', column: 'protect' },
      { row: 'applications', column: 'protect' },
      { row: 'data', column: 'protect' },
      { row: 'data', column: 'recover' },
    ],
    costRange: 'high',
    popularityRank: 15,
    websiteUrl: 'https://www.mimecast.com',
  },
  {
    id: 'qualys',
    vendorName: 'Qualys',
    category: 'Vulnerability Management',
    description:
      'Cloud-based IT, security, and compliance platform delivering continuous vulnerability management, policy compliance, and web application scanning.',
    keyProducts: [
      'Qualys VMDR',
      'Qualys Web Application Scanning',
      'Qualys Policy Compliance',
      'Qualys Container Security',
      'Qualys Global AssetView',
    ],
    coverageCells: [
      { row: 'devices', column: 'identify' },
      { row: 'applications', column: 'identify' },
      { row: 'networks', column: 'identify' },
      { row: 'devices', column: 'detect' },
    ],
    costRange: 'high',
    popularityRank: 16,
    websiteUrl: 'https://www.qualys.com',
  },
  {
    id: 'carbon-black-vmware',
    vendorName: 'Carbon Black (VMware)',
    category: 'Endpoint Security',
    description:
      'Cloud-native endpoint and workload protection platform leveraging behavioral analytics to prevent, detect, and respond to cyber threats across the enterprise.',
    keyProducts: [
      'Carbon Black Cloud Endpoint Standard',
      'Carbon Black Cloud Enterprise EDR',
      'Carbon Black Cloud Audit & Remediation',
      'Carbon Black Cloud Workload',
    ],
    coverageCells: [
      { row: 'devices', column: 'protect' },
      { row: 'devices', column: 'detect' },
      { row: 'devices', column: 'respond' },
      { row: 'applications', column: 'detect' },
    ],
    costRange: 'enterprise',
    popularityRank: 17,
    websiteUrl: 'https://www.broadcom.com/products/cybersecurity/endpoint/carbon-black-cloud',
  },
  {
    id: 'trend-micro',
    vendorName: 'Trend Micro',
    category: 'Endpoint Security',
    description:
      'Global cybersecurity company offering layered threat defense across endpoints, servers, cloud workloads, networks, and email with its Vision One platform.',
    keyProducts: [
      'Trend Vision One',
      'Trend Micro Apex One',
      'Trend Micro Cloud One',
      'Trend Micro Deep Security',
      'Trend Micro Email Security',
    ],
    coverageCells: [
      { row: 'devices', column: 'protect' },
      { row: 'devices', column: 'detect' },
      { row: 'applications', column: 'protect' },
      { row: 'networks', column: 'detect' },
      { row: 'data', column: 'protect' },
    ],
    costRange: 'high',
    popularityRank: 18,
    websiteUrl: 'https://www.trendmicro.com',
  },
  {
    id: 'sophos',
    vendorName: 'Sophos',
    category: 'Endpoint Security',
    description:
      'Cybersecurity company delivering synchronized security across endpoints, networks, email, and cloud with AI-driven threat prevention and managed detection and response.',
    keyProducts: [
      'Sophos Intercept X',
      'Sophos XGS Firewall',
      'Sophos MDR',
      'Sophos Central',
      'Sophos Cloud Optix',
    ],
    coverageCells: [
      { row: 'devices', column: 'protect' },
      { row: 'devices', column: 'detect' },
      { row: 'networks', column: 'protect' },
      { row: 'devices', column: 'respond' },
    ],
    costRange: 'high',
    popularityRank: 19,
    websiteUrl: 'https://www.sophos.com',
  },
  {
    id: 'check-point',
    vendorName: 'Check Point',
    category: 'Network Security',
    description:
      'Pioneering network security vendor providing firewall, threat prevention, and unified security management for enterprises, cloud, and mobile environments.',
    keyProducts: [
      'Check Point Quantum (Next-Gen Firewall)',
      'Check Point CloudGuard',
      'Check Point Harmony',
      'Check Point Infinity',
      'Check Point ThreatCloud',
    ],
    coverageCells: [
      { row: 'networks', column: 'protect' },
      { row: 'networks', column: 'detect' },
      { row: 'devices', column: 'protect' },
      { row: 'applications', column: 'protect' },
      { row: 'data', column: 'protect' },
    ],
    costRange: 'enterprise',
    popularityRank: 20,
    websiteUrl: 'https://www.checkpoint.com',
  },

  // ─────────────────────────────────────────────
  // 21-30
  // ─────────────────────────────────────────────
  {
    id: 'arctic-wolf',
    vendorName: 'Arctic Wolf',
    category: 'SIEM & Analytics',
    description:
      'Security operations company providing 24x7 managed detection and response, managed risk, and managed security awareness as a concierge service.',
    keyProducts: [
      'Arctic Wolf MDR',
      'Arctic Wolf Managed Risk',
      'Arctic Wolf Managed Security Awareness',
      'Arctic Wolf Incident Response',
    ],
    coverageCells: [
      { row: 'devices', column: 'detect' },
      { row: 'devices', column: 'respond' },
      { row: 'networks', column: 'detect' },
      { row: 'users', column: 'protect' },
    ],
    costRange: 'enterprise',
    popularityRank: 21,
    websiteUrl: 'https://arcticwolf.com',
  },
  {
    id: 'darktrace',
    vendorName: 'Darktrace',
    category: 'SIEM & Analytics',
    description:
      'AI-driven cyber defense company using self-learning technology to autonomously detect, investigate, and respond to threats in real time across digital environments.',
    keyProducts: [
      'Darktrace DETECT',
      'Darktrace RESPOND',
      'Darktrace PREVENT',
      'Darktrace HEAL',
      'Darktrace Email',
    ],
    coverageCells: [
      { row: 'networks', column: 'detect' },
      { row: 'networks', column: 'respond' },
      { row: 'devices', column: 'detect' },
      { row: 'applications', column: 'detect' },
      { row: 'users', column: 'detect' },
    ],
    costRange: 'enterprise',
    popularityRank: 22,
    websiteUrl: 'https://darktrace.com',
  },
  {
    id: 'mandiant',
    vendorName: 'Mandiant',
    category: 'Threat Intelligence',
    description:
      'World-renowned threat intelligence and incident response firm (now part of Google Cloud) offering frontline expertise in breach investigation and adversary intelligence.',
    keyProducts: [
      'Mandiant Advantage Threat Intelligence',
      'Mandiant Incident Response',
      'Mandiant Managed Defense',
      'Mandiant Attack Surface Management',
      'Mandiant Security Validation',
    ],
    coverageCells: [
      { row: 'devices', column: 'identify' },
      { row: 'devices', column: 'detect' },
      { row: 'devices', column: 'respond' },
      { row: 'networks', column: 'identify' },
      { row: 'applications', column: 'identify' },
    ],
    costRange: 'enterprise',
    popularityRank: 23,
    websiteUrl: 'https://www.mandiant.com',
  },
  {
    id: 'wiz',
    vendorName: 'Wiz',
    category: 'Cloud Security',
    description:
      'Agentless cloud security platform providing full-stack visibility into risks, vulnerabilities, misconfigurations, and attack paths across multi-cloud environments.',
    keyProducts: [
      'Wiz Cloud Security Platform',
      'Wiz CSPM',
      'Wiz CNAPP',
      'Wiz DSPM',
      'Wiz CDR',
    ],
    coverageCells: [
      { row: 'applications', column: 'identify' },
      { row: 'applications', column: 'detect' },
      { row: 'data', column: 'identify' },
      { row: 'networks', column: 'identify' },
    ],
    costRange: 'enterprise',
    popularityRank: 24,
    websiteUrl: 'https://www.wiz.io',
  },
  {
    id: 'snyk',
    vendorName: 'Snyk',
    category: 'Application Security',
    description:
      'Developer-first security platform that finds and automatically fixes vulnerabilities in open-source dependencies, container images, infrastructure as code, and custom code.',
    keyProducts: [
      'Snyk Open Source',
      'Snyk Code',
      'Snyk Container',
      'Snyk IaC',
      'Snyk AppRisk',
    ],
    coverageCells: [
      { row: 'applications', column: 'identify' },
      { row: 'applications', column: 'protect' },
      { row: 'applications', column: 'detect' },
    ],
    costRange: 'medium',
    popularityRank: 25,
    websiteUrl: 'https://snyk.io',
  },
  {
    id: 'sonarqube',
    vendorName: 'SonarQube',
    category: 'Application Security',
    description:
      'Open-source code quality and security analysis platform that continuously inspects code for bugs, vulnerabilities, and code smells across 30+ programming languages.',
    keyProducts: [
      'SonarQube Community Edition',
      'SonarQube Developer Edition',
      'SonarQube Enterprise Edition',
      'SonarCloud',
      'SonarLint',
    ],
    coverageCells: [
      { row: 'applications', column: 'identify' },
      { row: 'applications', column: 'detect' },
    ],
    costRange: 'medium',
    popularityRank: 26,
    websiteUrl: 'https://www.sonarsource.com/products/sonarqube',
  },
  {
    id: 'hashicorp',
    vendorName: 'HashiCorp',
    category: 'Data Security',
    description:
      'Infrastructure automation company providing secrets management, infrastructure as code, and zero-trust networking for cloud-operating-model security.',
    keyProducts: [
      'HashiCorp Vault',
      'HashiCorp Consul',
      'HashiCorp Boundary',
      'HashiCorp Terraform',
    ],
    coverageCells: [
      { row: 'data', column: 'protect' },
      { row: 'networks', column: 'protect' },
      { row: 'users', column: 'protect' },
      { row: 'applications', column: 'protect' },
    ],
    costRange: 'high',
    popularityRank: 27,
    websiteUrl: 'https://www.hashicorp.com',
  },
  {
    id: 'elastic',
    vendorName: 'Elastic',
    category: 'SIEM & Analytics',
    description:
      'Search and analytics platform offering Elastic Security for SIEM, endpoint protection, and cloud security built on the Elasticsearch engine.',
    keyProducts: [
      'Elastic Security (SIEM)',
      'Elastic Endpoint Security',
      'Elastic Cloud Security',
      'Elastic Observability',
      'Elasticsearch',
    ],
    coverageCells: [
      { row: 'devices', column: 'detect' },
      { row: 'networks', column: 'detect' },
      { row: 'applications', column: 'detect' },
      { row: 'devices', column: 'respond' },
    ],
    costRange: 'high',
    popularityRank: 28,
    websiteUrl: 'https://www.elastic.co',
  },
  {
    id: 'datadog',
    vendorName: 'Datadog',
    category: 'SIEM & Analytics',
    description:
      'Cloud-scale monitoring and security platform offering infrastructure monitoring, APM, log management, and cloud SIEM in a unified observability solution.',
    keyProducts: [
      'Datadog Cloud SIEM',
      'Datadog Application Security Management',
      'Datadog Cloud Security Management',
      'Datadog Log Management',
      'Datadog APM',
    ],
    coverageCells: [
      { row: 'applications', column: 'detect' },
      { row: 'networks', column: 'detect' },
      { row: 'devices', column: 'detect' },
      { row: 'applications', column: 'identify' },
    ],
    costRange: 'high',
    popularityRank: 29,
    websiteUrl: 'https://www.datadoghq.com',
  },
  {
    id: 'sumo-logic',
    vendorName: 'Sumo Logic',
    category: 'SIEM & Analytics',
    description:
      'Cloud-native machine data analytics platform providing real-time security intelligence, compliance, and cloud SIEM for modern security operations.',
    keyProducts: [
      'Sumo Logic Cloud SIEM',
      'Sumo Logic Cloud SOAR',
      'Sumo Logic Cloud Security Monitoring',
      'Sumo Logic Log Analytics',
    ],
    coverageCells: [
      { row: 'devices', column: 'detect' },
      { row: 'networks', column: 'detect' },
      { row: 'applications', column: 'detect' },
    ],
    costRange: 'high',
    popularityRank: 30,
    websiteUrl: 'https://www.sumologic.com',
  },

  // ─────────────────────────────────────────────
  // 31-40
  // ─────────────────────────────────────────────
  {
    id: 'varonis',
    vendorName: 'Varonis',
    category: 'Data Security',
    description:
      'Data security and analytics platform that protects sensitive data by providing visibility into data access, detecting insider threats, and automating data protection.',
    keyProducts: [
      'Varonis DatAdvantage',
      'Varonis Data Classification Engine',
      'Varonis DatAlert',
      'Varonis DataPrivilege',
      'Varonis Automation Engine',
    ],
    coverageCells: [
      { row: 'data', column: 'identify' },
      { row: 'data', column: 'protect' },
      { row: 'data', column: 'detect' },
      { row: 'users', column: 'detect' },
    ],
    costRange: 'enterprise',
    popularityRank: 31,
    websiteUrl: 'https://www.varonis.com',
  },
  {
    id: 'sailpoint',
    vendorName: 'SailPoint',
    category: 'Identity & Access Management',
    description:
      'Enterprise identity governance platform that automates the discovery, management, and control of user access rights across all applications and data.',
    keyProducts: [
      'SailPoint IdentityNow',
      'SailPoint IdentityIQ',
      'SailPoint Identity Security Cloud',
      'SailPoint AI-Driven Identity Security',
    ],
    coverageCells: [
      { row: 'users', column: 'identify' },
      { row: 'users', column: 'protect' },
      { row: 'data', column: 'protect' },
      { row: 'applications', column: 'protect' },
    ],
    costRange: 'enterprise',
    popularityRank: 32,
    websiteUrl: 'https://www.sailpoint.com',
  },
  {
    id: 'beyondtrust',
    vendorName: 'BeyondTrust',
    category: 'Identity & Access Management',
    description:
      'Privileged access management company providing solutions for privileged password management, endpoint privilege management, and secure remote access.',
    keyProducts: [
      'BeyondTrust Privilege Management for Windows & Mac',
      'BeyondTrust Password Safe',
      'BeyondTrust Privileged Remote Access',
      'BeyondTrust Identity Security Insights',
    ],
    coverageCells: [
      { row: 'users', column: 'identify' },
      { row: 'users', column: 'protect' },
      { row: 'devices', column: 'protect' },
      { row: 'users', column: 'detect' },
    ],
    costRange: 'enterprise',
    popularityRank: 33,
    websiteUrl: 'https://www.beyondtrust.com',
  },
  {
    id: 'thales',
    vendorName: 'Thales',
    category: 'Data Security',
    description:
      'Global technology company providing data encryption, key management, hardware security modules, and cloud data protection solutions for enterprise environments.',
    keyProducts: [
      'Thales CipherTrust Manager',
      'Thales Luna HSM',
      'Thales SafeNet Trusted Access',
      'Thales Data Protection on Demand',
      'Thales KeySecure',
    ],
    coverageCells: [
      { row: 'data', column: 'protect' },
      { row: 'data', column: 'identify' },
      { row: 'users', column: 'protect' },
      { row: 'applications', column: 'protect' },
    ],
    costRange: 'enterprise',
    popularityRank: 34,
    websiteUrl: 'https://cpl.thalesgroup.com',
  },
  {
    id: 'imperva',
    vendorName: 'Imperva',
    category: 'Application Security',
    description:
      'Application and data security company protecting web applications, APIs, and databases from cyberattacks with WAF, DDoS protection, and data masking.',
    keyProducts: [
      'Imperva Cloud WAF',
      'Imperva DDoS Protection',
      'Imperva API Security',
      'Imperva Data Security',
      'Imperva Database Activity Monitoring',
    ],
    coverageCells: [
      { row: 'applications', column: 'protect' },
      { row: 'data', column: 'protect' },
      { row: 'applications', column: 'detect' },
      { row: 'networks', column: 'protect' },
    ],
    costRange: 'high',
    popularityRank: 35,
    websiteUrl: 'https://www.imperva.com',
  },
  {
    id: 'f5-networks',
    vendorName: 'F5 Networks',
    category: 'Application Security',
    description:
      'Application security and delivery company providing advanced WAF, bot protection, API security, and DDoS mitigation for multi-cloud environments.',
    keyProducts: [
      'F5 BIG-IP',
      'F5 Distributed Cloud WAF',
      'F5 NGINX App Protect',
      'F5 Silverline',
      'F5 Shape Defense',
    ],
    coverageCells: [
      { row: 'applications', column: 'protect' },
      { row: 'networks', column: 'protect' },
      { row: 'applications', column: 'detect' },
    ],
    costRange: 'enterprise',
    popularityRank: 36,
    websiteUrl: 'https://www.f5.com',
  },
  {
    id: 'akamai',
    vendorName: 'Akamai',
    category: 'Application Security',
    description:
      'Content delivery and cloud security platform delivering web application firewall, bot management, DDoS protection, and zero-trust access from the edge.',
    keyProducts: [
      'Akamai App & API Protector',
      'Akamai Prolexic (DDoS)',
      'Akamai Guardicore Segmentation',
      'Akamai Enterprise Application Access',
      'Akamai Bot Manager',
    ],
    coverageCells: [
      { row: 'applications', column: 'protect' },
      { row: 'networks', column: 'protect' },
      { row: 'applications', column: 'detect' },
      { row: 'networks', column: 'detect' },
    ],
    costRange: 'enterprise',
    popularityRank: 37,
    websiteUrl: 'https://www.akamai.com',
  },
  {
    id: 'barracuda',
    vendorName: 'Barracuda',
    category: 'Email Security',
    description:
      'Cloud-first security company offering email protection, application security, network security, and data protection for organizations of all sizes.',
    keyProducts: [
      'Barracuda Email Security Gateway',
      'Barracuda CloudGen Firewall',
      'Barracuda WAF-as-a-Service',
      'Barracuda Cloud-to-Cloud Backup',
      'Barracuda SecureEdge',
    ],
    coverageCells: [
      { row: 'applications', column: 'protect' },
      { row: 'networks', column: 'protect' },
      { row: 'data', column: 'protect' },
      { row: 'data', column: 'recover' },
    ],
    costRange: 'medium',
    popularityRank: 38,
    websiteUrl: 'https://www.barracuda.com',
  },
  {
    id: 'knowbe4',
    vendorName: 'KnowBe4',
    category: 'Email Security',
    description:
      'Security awareness training and simulated phishing platform that helps organizations train employees to recognize and avoid social engineering attacks.',
    keyProducts: [
      'KnowBe4 Security Awareness Training',
      'KnowBe4 PhishER',
      'KnowBe4 Simulated Phishing',
      'KnowBe4 Compliance Training',
      'KnowBe4 SecurityCoach',
    ],
    coverageCells: [
      { row: 'users', column: 'protect' },
      { row: 'users', column: 'identify' },
      { row: 'users', column: 'detect' },
    ],
    costRange: 'medium',
    popularityRank: 39,
    websiteUrl: 'https://www.knowbe4.com',
  },
  {
    id: 'recorded-future',
    vendorName: 'Recorded Future',
    category: 'Threat Intelligence',
    description:
      'Real-time threat intelligence platform that uses AI and machine learning to analyze open, dark, and technical sources for proactive security decision-making.',
    keyProducts: [
      'Recorded Future Intelligence Cloud',
      'Recorded Future Threat Intelligence',
      'Recorded Future Brand Intelligence',
      'Recorded Future SecOps Intelligence',
      'Recorded Future Vulnerability Intelligence',
    ],
    coverageCells: [
      { row: 'devices', column: 'identify' },
      { row: 'networks', column: 'identify' },
      { row: 'applications', column: 'identify' },
      { row: 'devices', column: 'detect' },
    ],
    costRange: 'enterprise',
    popularityRank: 40,
    websiteUrl: 'https://www.recordedfuture.com',
  },

  // ─────────────────────────────────────────────
  // 41-50
  // ─────────────────────────────────────────────
  {
    id: 'ibm-security',
    vendorName: 'IBM Security',
    category: 'SIEM & Analytics',
    description:
      'Enterprise security division offering SIEM, SOAR, identity governance, data security, and AI-powered threat management through the QRadar and Guardium families.',
    keyProducts: [
      'IBM QRadar SIEM',
      'IBM QRadar SOAR',
      'IBM Guardium',
      'IBM Security Verify',
      'IBM X-Force Threat Intelligence',
    ],
    coverageCells: [
      { row: 'devices', column: 'detect' },
      { row: 'networks', column: 'detect' },
      { row: 'data', column: 'protect' },
      { row: 'users', column: 'protect' },
      { row: 'devices', column: 'respond' },
    ],
    costRange: 'enterprise',
    popularityRank: 41,
    websiteUrl: 'https://www.ibm.com/security',
  },
  {
    id: 'aws-security',
    vendorName: 'AWS Security',
    category: 'Cloud Security',
    description:
      'Amazon Web Services security portfolio providing cloud-native identity, network security, threat detection, and data protection services for AWS workloads.',
    keyProducts: [
      'AWS GuardDuty',
      'AWS Security Hub',
      'AWS IAM',
      'AWS WAF',
      'AWS Macie',
    ],
    coverageCells: [
      { row: 'applications', column: 'protect' },
      { row: 'applications', column: 'detect' },
      { row: 'data', column: 'protect' },
      { row: 'users', column: 'protect' },
      { row: 'networks', column: 'protect' },
    ],
    costRange: 'high',
    popularityRank: 42,
    websiteUrl: 'https://aws.amazon.com/security',
  },
  {
    id: 'google-cloud-security',
    vendorName: 'Google Cloud Security',
    category: 'Cloud Security',
    description:
      'Google Cloud security suite providing security command center, BeyondCorp zero-trust, Chronicle SIEM, and AI-driven threat detection for cloud-native environments.',
    keyProducts: [
      'Google Chronicle',
      'Google Security Command Center',
      'Google BeyondCorp Enterprise',
      'Google Cloud Armor',
      'Google reCAPTCHA Enterprise',
    ],
    coverageCells: [
      { row: 'applications', column: 'protect' },
      { row: 'applications', column: 'detect' },
      { row: 'networks', column: 'protect' },
      { row: 'users', column: 'protect' },
      { row: 'data', column: 'detect' },
    ],
    costRange: 'high',
    popularityRank: 43,
    websiteUrl: 'https://cloud.google.com/security',
  },
  {
    id: 'tanium',
    vendorName: 'Tanium',
    category: 'Endpoint Security',
    description:
      'Converged endpoint management and security platform providing real-time visibility, control, and remediation across all endpoints at enterprise scale.',
    keyProducts: [
      'Tanium Threat Response',
      'Tanium Comply',
      'Tanium Discover',
      'Tanium Deploy',
      'Tanium Patch',
    ],
    coverageCells: [
      { row: 'devices', column: 'identify' },
      { row: 'devices', column: 'protect' },
      { row: 'devices', column: 'detect' },
      { row: 'devices', column: 'respond' },
      { row: 'devices', column: 'recover' },
    ],
    costRange: 'enterprise',
    popularityRank: 44,
    websiteUrl: 'https://www.tanium.com',
  },
  {
    id: 'logrhythm',
    vendorName: 'LogRhythm',
    category: 'SIEM & Analytics',
    description:
      'Next-gen SIEM platform combining log management, security analytics, UEBA, network detection, and SOAR in a unified threat lifecycle management solution.',
    keyProducts: [
      'LogRhythm SIEM',
      'LogRhythm NDR',
      'LogRhythm UEBA',
      'LogRhythm SOAR',
      'LogRhythm Cloud',
    ],
    coverageCells: [
      { row: 'devices', column: 'detect' },
      { row: 'networks', column: 'detect' },
      { row: 'devices', column: 'respond' },
      { row: 'users', column: 'detect' },
    ],
    costRange: 'enterprise',
    popularityRank: 45,
    websiteUrl: 'https://logrhythm.com',
  },
  {
    id: 'secureworks',
    vendorName: 'Secureworks',
    category: 'SIEM & Analytics',
    description:
      'Managed security services provider delivering threat detection and response, vulnerability management, and security consulting backed by Counter Threat Unit research.',
    keyProducts: [
      'Secureworks Taegis XDR',
      'Secureworks Taegis ManagedXDR',
      'Secureworks Taegis VDR',
      'Secureworks Incident Response',
    ],
    coverageCells: [
      { row: 'devices', column: 'detect' },
      { row: 'devices', column: 'respond' },
      { row: 'networks', column: 'detect' },
      { row: 'applications', column: 'detect' },
    ],
    costRange: 'enterprise',
    popularityRank: 46,
    websiteUrl: 'https://www.secureworks.com',
  },
  {
    id: 'netskope',
    vendorName: 'Netskope',
    category: 'Cloud Security',
    description:
      'Cloud-native SASE and SSE platform providing secure web gateway, CASB, ZTNA, and data loss prevention for safe cloud application and internet access.',
    keyProducts: [
      'Netskope Intelligent SSE',
      'Netskope CASB',
      'Netskope Secure Web Gateway',
      'Netskope ZTNA',
      'Netskope DLP',
    ],
    coverageCells: [
      { row: 'applications', column: 'protect' },
      { row: 'data', column: 'protect' },
      { row: 'networks', column: 'protect' },
      { row: 'users', column: 'protect' },
    ],
    costRange: 'enterprise',
    popularityRank: 47,
    websiteUrl: 'https://www.netskope.com',
  },
  {
    id: 'illumio',
    vendorName: 'Illumio',
    category: 'Network Security',
    description:
      'Zero-trust segmentation platform that prevents the lateral movement of breaches by enforcing microsegmentation policies across data centers and cloud environments.',
    keyProducts: [
      'Illumio Core',
      'Illumio CloudSecure',
      'Illumio Endpoint',
      'Illumio Zero Trust Segmentation',
    ],
    coverageCells: [
      { row: 'networks', column: 'protect' },
      { row: 'networks', column: 'identify' },
      { row: 'applications', column: 'protect' },
    ],
    costRange: 'enterprise',
    popularityRank: 48,
    websiteUrl: 'https://www.illumio.com',
  },
  {
    id: 'lacework',
    vendorName: 'Lacework',
    category: 'Cloud Security',
    description:
      'Data-driven cloud security platform providing automated threat detection, compliance monitoring, and workload protection across multi-cloud environments.',
    keyProducts: [
      'Lacework Polygraph Data Platform',
      'Lacework Cloud Security',
      'Lacework Workload Protection',
      'Lacework Container Security',
    ],
    coverageCells: [
      { row: 'applications', column: 'detect' },
      { row: 'applications', column: 'identify' },
      { row: 'data', column: 'detect' },
    ],
    costRange: 'enterprise',
    popularityRank: 49,
    websiteUrl: 'https://www.lacework.com',
  },
  {
    id: 'orca-security',
    vendorName: 'Orca Security',
    category: 'Cloud Security',
    description:
      'Agentless cloud security platform delivering full-stack visibility into cloud risks, vulnerabilities, malware, misconfigurations, and lateral movement paths.',
    keyProducts: [
      'Orca Cloud Security Platform',
      'Orca CSPM',
      'Orca CWPP',
      'Orca DSPM',
      'Orca Shift Left Security',
    ],
    coverageCells: [
      { row: 'applications', column: 'identify' },
      { row: 'applications', column: 'detect' },
      { row: 'data', column: 'identify' },
      { row: 'networks', column: 'identify' },
    ],
    costRange: 'enterprise',
    popularityRank: 50,
    websiteUrl: 'https://orca.security',
  },

  // ─────────────────────────────────────────────
  // 51-60
  // ─────────────────────────────────────────────
  {
    id: 'aqua-security',
    vendorName: 'Aqua Security',
    category: 'Cloud Security',
    description:
      'Cloud-native application protection platform securing containers, serverless functions, VMs, and Kubernetes workloads throughout the software development lifecycle.',
    keyProducts: [
      'Aqua Cloud Native Application Protection Platform',
      'Aqua Container Security',
      'Aqua Kubernetes Security',
      'Aqua Supply Chain Security',
      'Trivy (Open Source Scanner)',
    ],
    coverageCells: [
      { row: 'applications', column: 'protect' },
      { row: 'applications', column: 'detect' },
      { row: 'applications', column: 'identify' },
    ],
    costRange: 'high',
    popularityRank: 51,
    websiteUrl: 'https://www.aquasec.com',
  },
  {
    id: 'prisma-cloud',
    vendorName: 'Prisma Cloud',
    category: 'Cloud Security',
    description:
      'Palo Alto Networks comprehensive cloud-native application protection platform delivering CSPM, CWPP, CIEM, and code-to-cloud security across multi-cloud environments.',
    keyProducts: [
      'Prisma Cloud CSPM',
      'Prisma Cloud CWPP',
      'Prisma Cloud Code Security',
      'Prisma Cloud Data Security',
      'Prisma Cloud Identity Security',
    ],
    coverageCells: [
      { row: 'applications', column: 'identify' },
      { row: 'applications', column: 'protect' },
      { row: 'data', column: 'protect' },
      { row: 'applications', column: 'detect' },
      { row: 'users', column: 'protect' },
    ],
    costRange: 'enterprise',
    popularityRank: 52,
    websiteUrl: 'https://www.paloaltonetworks.com/prisma/cloud',
  },
  {
    id: 'venafi',
    vendorName: 'Venafi',
    category: 'Data Security',
    description:
      'Machine identity management platform that automates the lifecycle of TLS/SSL certificates, SSH keys, and code signing certificates to prevent outages and breaches.',
    keyProducts: [
      'Venafi Trust Protection Platform',
      'Venafi TLS Protect Cloud',
      'Venafi SSH Protect',
      'Venafi CodeSign Protect',
    ],
    coverageCells: [
      { row: 'data', column: 'protect' },
      { row: 'applications', column: 'protect' },
      { row: 'devices', column: 'identify' },
    ],
    costRange: 'enterprise',
    popularityRank: 53,
    websiteUrl: 'https://www.venafi.com',
  },
  {
    id: 'entrust',
    vendorName: 'Entrust',
    category: 'Data Security',
    description:
      'Digital security company providing certificate authority services, PKI, HSMs, multi-factor authentication, and secure digital identities for trusted transactions.',
    keyProducts: [
      'Entrust Certificate Services',
      'Entrust nShield HSM',
      'Entrust Identity as a Service',
      'Entrust PKI',
      'Entrust Digital Signing',
    ],
    coverageCells: [
      { row: 'data', column: 'protect' },
      { row: 'users', column: 'protect' },
      { row: 'applications', column: 'protect' },
    ],
    costRange: 'high',
    popularityRank: 54,
    websiteUrl: 'https://www.entrust.com',
  },
  {
    id: 'onespan',
    vendorName: 'OneSpan',
    category: 'Identity & Access Management',
    description:
      'Digital identity verification and e-signature company providing secure authentication, fraud prevention, and digital agreement solutions for financial services.',
    keyProducts: [
      'OneSpan Sign',
      'OneSpan Identity Verification',
      'OneSpan Mobile Security Suite',
      'OneSpan Digipass Authenticators',
    ],
    coverageCells: [
      { row: 'users', column: 'protect' },
      { row: 'users', column: 'identify' },
      { row: 'applications', column: 'protect' },
    ],
    costRange: 'high',
    popularityRank: 55,
    websiteUrl: 'https://www.onespan.com',
  },
  {
    id: 'ping-identity',
    vendorName: 'Ping Identity',
    category: 'Identity & Access Management',
    description:
      'Intelligent identity platform delivering single sign-on, multi-factor authentication, access management, and directory services for enterprise workforce and customer identities.',
    keyProducts: [
      'PingOne',
      'PingFederate',
      'PingAccess',
      'PingID',
      'PingDirectory',
    ],
    coverageCells: [
      { row: 'users', column: 'identify' },
      { row: 'users', column: 'protect' },
      { row: 'applications', column: 'protect' },
    ],
    costRange: 'high',
    popularityRank: 56,
    websiteUrl: 'https://www.pingidentity.com',
  },
  {
    id: 'forgerock',
    vendorName: 'ForgeRock',
    category: 'Identity & Access Management',
    description:
      'Digital identity platform providing enterprise-grade identity management, access management, and identity governance for workforce and consumer use cases.',
    keyProducts: [
      'ForgeRock Identity Platform',
      'ForgeRock Access Management',
      'ForgeRock Identity Management',
      'ForgeRock Identity Governance',
      'ForgeRock Autonomous Identity',
    ],
    coverageCells: [
      { row: 'users', column: 'identify' },
      { row: 'users', column: 'protect' },
      { row: 'applications', column: 'protect' },
    ],
    costRange: 'enterprise',
    popularityRank: 57,
    websiteUrl: 'https://www.forgerock.com',
  },
  {
    id: 'auth0',
    vendorName: 'Auth0',
    category: 'Identity & Access Management',
    description:
      'Developer-focused identity platform (now part of Okta) providing authentication, authorization, and user management APIs for web, mobile, and legacy applications.',
    keyProducts: [
      'Auth0 Universal Login',
      'Auth0 Actions',
      'Auth0 Organizations',
      'Auth0 Adaptive MFA',
      'Auth0 Attack Protection',
    ],
    coverageCells: [
      { row: 'users', column: 'protect' },
      { row: 'applications', column: 'protect' },
      { row: 'users', column: 'identify' },
    ],
    costRange: 'medium',
    popularityRank: 58,
    websiteUrl: 'https://auth0.com',
  },
  {
    id: 'jumpcloud',
    vendorName: 'JumpCloud',
    category: 'Identity & Access Management',
    description:
      'Open directory platform delivering cloud-based identity management, device management, and conditional access from a single unified console.',
    keyProducts: [
      'JumpCloud Directory Platform',
      'JumpCloud SSO',
      'JumpCloud MFA',
      'JumpCloud Device Management',
      'JumpCloud LDAP-as-a-Service',
    ],
    coverageCells: [
      { row: 'users', column: 'identify' },
      { row: 'users', column: 'protect' },
      { row: 'devices', column: 'protect' },
    ],
    costRange: 'medium',
    popularityRank: 59,
    websiteUrl: 'https://jumpcloud.com',
  },
  {
    id: '1password',
    vendorName: '1Password',
    category: 'Identity & Access Management',
    description:
      'Enterprise password manager and secrets management platform that secures credentials, API keys, and sensitive data for teams and individuals.',
    keyProducts: [
      '1Password Business',
      '1Password Teams',
      '1Password Developer Tools',
      '1Password Watchtower',
      '1Password CLI',
    ],
    coverageCells: [
      { row: 'users', column: 'protect' },
      { row: 'data', column: 'protect' },
    ],
    costRange: 'low',
    popularityRank: 60,
    websiteUrl: 'https://1password.com',
  },

  // ─────────────────────────────────────────────
  // 61-70
  // ─────────────────────────────────────────────
  {
    id: 'bitwarden',
    vendorName: 'Bitwarden',
    category: 'Identity & Access Management',
    description:
      'Open-source password management solution for individuals and enterprises providing secure credential storage, sharing, and self-hosting options.',
    keyProducts: [
      'Bitwarden Password Manager',
      'Bitwarden Send',
      'Bitwarden Directory Connector',
      'Bitwarden Secrets Manager',
    ],
    coverageCells: [
      { row: 'users', column: 'protect' },
      { row: 'data', column: 'protect' },
    ],
    costRange: 'free',
    popularityRank: 61,
    websiteUrl: 'https://bitwarden.com',
  },
  {
    id: 'lastpass',
    vendorName: 'LastPass',
    category: 'Identity & Access Management',
    description:
      'Cloud-based password manager for personal and business use providing credential vaulting, autofill, dark web monitoring, and admin policy controls.',
    keyProducts: [
      'LastPass Business',
      'LastPass Teams',
      'LastPass MFA',
      'LastPass Premium',
    ],
    coverageCells: [
      { row: 'users', column: 'protect' },
      { row: 'data', column: 'protect' },
    ],
    costRange: 'low',
    popularityRank: 62,
    websiteUrl: 'https://www.lastpass.com',
  },
  {
    id: 'nordlayer',
    vendorName: 'NordLayer',
    category: 'Network Security',
    description:
      'Business VPN and network access security solution by Nord Security providing ZTNA, secure remote access, and network segmentation for distributed teams.',
    keyProducts: [
      'NordLayer Business VPN',
      'NordLayer ZTNA',
      'NordLayer Smart Remote Access',
      'NordLayer Device Posture Security',
    ],
    coverageCells: [
      { row: 'networks', column: 'protect' },
      { row: 'users', column: 'protect' },
    ],
    costRange: 'low',
    popularityRank: 63,
    websiteUrl: 'https://nordlayer.com',
  },
  {
    id: 'perimeter-81',
    vendorName: 'Perimeter 81',
    category: 'Network Security',
    description:
      'Cloud-based network security platform providing SASE, ZTNA, SWG, and FWaaS for secure connectivity across distributed workforces and cloud resources.',
    keyProducts: [
      'Perimeter 81 ZTNA',
      'Perimeter 81 Secure Web Gateway',
      'Perimeter 81 FWaaS',
      'Perimeter 81 Device Posture Check',
    ],
    coverageCells: [
      { row: 'networks', column: 'protect' },
      { row: 'users', column: 'protect' },
      { row: 'applications', column: 'protect' },
    ],
    costRange: 'medium',
    popularityRank: 64,
    websiteUrl: 'https://www.perimeter81.com',
  },
  {
    id: 'tailscale',
    vendorName: 'Tailscale',
    category: 'Network Security',
    description:
      'Zero-config mesh VPN built on WireGuard that creates secure peer-to-peer networks, enabling simple and encrypted connectivity without managing firewall rules.',
    keyProducts: [
      'Tailscale Mesh VPN',
      'Tailscale SSH',
      'Tailscale ACLs',
      'Tailscale Funnel',
    ],
    coverageCells: [
      { row: 'networks', column: 'protect' },
      { row: 'devices', column: 'protect' },
    ],
    costRange: 'free',
    popularityRank: 65,
    websiteUrl: 'https://tailscale.com',
  },
  {
    id: 'wireguard',
    vendorName: 'WireGuard',
    category: 'Network Security',
    description:
      'Modern, high-performance VPN protocol and open-source implementation providing fast, cryptographically sound encrypted tunnels with minimal attack surface.',
    keyProducts: [
      'WireGuard VPN Protocol',
      'WireGuard for Linux',
      'WireGuard for Windows',
      'WireGuard for macOS',
    ],
    coverageCells: [
      { row: 'networks', column: 'protect' },
    ],
    costRange: 'free',
    popularityRank: 66,
    websiteUrl: 'https://www.wireguard.com',
  },
  {
    id: 'nmap',
    vendorName: 'Nmap',
    category: 'Penetration Testing',
    description:
      'Open-source network discovery and security auditing tool used worldwide for network inventory, host detection, service enumeration, and vulnerability scanning.',
    keyProducts: [
      'Nmap Security Scanner',
      'Zenmap (GUI)',
      'Nmap Scripting Engine (NSE)',
      'Ncat',
    ],
    coverageCells: [
      { row: 'networks', column: 'identify' },
      { row: 'devices', column: 'identify' },
    ],
    costRange: 'free',
    popularityRank: 67,
    websiteUrl: 'https://nmap.org',
  },
  {
    id: 'wireshark',
    vendorName: 'Wireshark',
    category: 'Network Security',
    description:
      'Open-source network protocol analyzer for deep packet inspection, network troubleshooting, traffic analysis, and security investigations at the packet level.',
    keyProducts: [
      'Wireshark',
      'TShark (CLI)',
      'Wireshark Display Filters',
      'Wireshark Dissectors',
    ],
    coverageCells: [
      { row: 'networks', column: 'detect' },
      { row: 'networks', column: 'identify' },
    ],
    costRange: 'free',
    popularityRank: 68,
    websiteUrl: 'https://www.wireshark.org',
  },
  {
    id: 'metasploit',
    vendorName: 'Metasploit',
    category: 'Penetration Testing',
    description:
      'Industry-standard penetration testing framework providing exploit development, vulnerability verification, and security assessment capabilities for red teams and researchers.',
    keyProducts: [
      'Metasploit Framework (Open Source)',
      'Metasploit Pro',
      'Meterpreter',
      'Metasploit Community',
    ],
    coverageCells: [
      { row: 'devices', column: 'identify' },
      { row: 'applications', column: 'identify' },
      { row: 'networks', column: 'identify' },
    ],
    costRange: 'free',
    popularityRank: 69,
    websiteUrl: 'https://www.metasploit.com',
  },
  {
    id: 'burp-suite',
    vendorName: 'Burp Suite',
    category: 'Penetration Testing',
    description:
      'Leading web application security testing toolkit used by penetration testers for manual and automated vulnerability scanning of web apps and APIs.',
    keyProducts: [
      'Burp Suite Professional',
      'Burp Suite Enterprise',
      'Burp Suite Community',
      'Burp Intruder',
      'Burp Scanner',
    ],
    coverageCells: [
      { row: 'applications', column: 'identify' },
      { row: 'applications', column: 'detect' },
    ],
    costRange: 'medium',
    popularityRank: 70,
    websiteUrl: 'https://portswigger.net/burp',
  },

  // ─────────────────────────────────────────────
  // 71-80
  // ─────────────────────────────────────────────
  {
    id: 'owasp-zap',
    vendorName: 'OWASP ZAP',
    category: 'Penetration Testing',
    description:
      'Open-source web application security scanner maintained by OWASP for finding vulnerabilities in web applications during development and testing phases.',
    keyProducts: [
      'ZAP Desktop',
      'ZAP Daemon',
      'ZAP API',
      'ZAP Marketplace Add-ons',
    ],
    coverageCells: [
      { row: 'applications', column: 'identify' },
      { row: 'applications', column: 'detect' },
    ],
    costRange: 'free',
    popularityRank: 71,
    websiteUrl: 'https://www.zaproxy.org',
  },
  {
    id: 'nessus',
    vendorName: 'Nessus',
    category: 'Vulnerability Management',
    description:
      'Industry-standard vulnerability scanner by Tenable providing comprehensive vulnerability assessment, configuration auditing, and compliance checking for IT assets.',
    keyProducts: [
      'Nessus Professional',
      'Nessus Expert',
      'Nessus Essentials (Free)',
      'Nessus Plugins',
    ],
    coverageCells: [
      { row: 'devices', column: 'identify' },
      { row: 'applications', column: 'identify' },
      { row: 'networks', column: 'identify' },
    ],
    costRange: 'medium',
    popularityRank: 72,
    websiteUrl: 'https://www.tenable.com/products/nessus',
  },
  {
    id: 'openvas',
    vendorName: 'OpenVAS',
    category: 'Vulnerability Management',
    description:
      'Open-source vulnerability scanner and management framework providing comprehensive network vulnerability testing with regularly updated feed of security checks.',
    keyProducts: [
      'OpenVAS Scanner',
      'Greenbone Vulnerability Management (GVM)',
      'Greenbone Community Feed',
      'Greenbone Enterprise Appliance',
    ],
    coverageCells: [
      { row: 'devices', column: 'identify' },
      { row: 'networks', column: 'identify' },
      { row: 'applications', column: 'identify' },
    ],
    costRange: 'free',
    popularityRank: 73,
    websiteUrl: 'https://www.openvas.org',
  },
  {
    id: 'kali-linux',
    vendorName: 'Kali Linux',
    category: 'Penetration Testing',
    description:
      'Debian-based Linux distribution designed for advanced penetration testing and security auditing, preloaded with hundreds of offensive security tools.',
    keyProducts: [
      'Kali Linux OS',
      'Kali NetHunter (Mobile)',
      'Kali Cloud',
      'Kali Purple',
    ],
    coverageCells: [
      { row: 'devices', column: 'identify' },
      { row: 'networks', column: 'identify' },
      { row: 'applications', column: 'identify' },
    ],
    costRange: 'free',
    popularityRank: 74,
    websiteUrl: 'https://www.kali.org',
  },
  {
    id: 'snort',
    vendorName: 'Snort',
    category: 'Network Security',
    description:
      'Open-source network intrusion detection and prevention system performing real-time traffic analysis and packet logging to identify malicious network activity.',
    keyProducts: [
      'Snort 3 IDS/IPS',
      'Snort Rulesets',
      'Snort Community Rules',
      'Snort Subscriber Rules',
    ],
    coverageCells: [
      { row: 'networks', column: 'detect' },
      { row: 'networks', column: 'protect' },
    ],
    costRange: 'free',
    popularityRank: 75,
    websiteUrl: 'https://www.snort.org',
  },
  {
    id: 'suricata',
    vendorName: 'Suricata',
    category: 'Network Security',
    description:
      'High-performance open-source network IDS, IPS, and network security monitoring engine with multi-threaded processing and protocol identification capabilities.',
    keyProducts: [
      'Suricata IDS/IPS',
      'Suricata Network Security Monitoring',
      'Suricata Protocol Detection',
      'Suricata File Extraction',
    ],
    coverageCells: [
      { row: 'networks', column: 'detect' },
      { row: 'networks', column: 'protect' },
    ],
    costRange: 'free',
    popularityRank: 76,
    websiteUrl: 'https://suricata.io',
  },
  {
    id: 'ossec',
    vendorName: 'OSSEC',
    category: 'Endpoint Security',
    description:
      'Open-source host-based intrusion detection system providing log analysis, file integrity monitoring, rootkit detection, and real-time alerting across platforms.',
    keyProducts: [
      'OSSEC HIDS',
      'OSSEC Agent',
      'OSSEC Active Response',
      'Atomic OSSEC (Commercial)',
    ],
    coverageCells: [
      { row: 'devices', column: 'detect' },
      { row: 'devices', column: 'identify' },
      { row: 'data', column: 'detect' },
    ],
    costRange: 'free',
    popularityRank: 77,
    websiteUrl: 'https://www.ossec.net',
  },
  {
    id: 'wazuh',
    vendorName: 'Wazuh',
    category: 'SIEM & Analytics',
    description:
      'Open-source unified XDR and SIEM platform providing threat detection, integrity monitoring, incident response, and regulatory compliance across endpoints and cloud.',
    keyProducts: [
      'Wazuh SIEM',
      'Wazuh XDR',
      'Wazuh Cloud',
      'Wazuh Agent',
      'Wazuh Dashboard',
    ],
    coverageCells: [
      { row: 'devices', column: 'detect' },
      { row: 'devices', column: 'respond' },
      { row: 'applications', column: 'detect' },
      { row: 'data', column: 'detect' },
    ],
    costRange: 'free',
    popularityRank: 78,
    websiteUrl: 'https://wazuh.com',
  },
  {
    id: 'thehive',
    vendorName: 'TheHive',
    category: 'SIEM & Analytics',
    description:
      'Open-source security incident response platform enabling SOC teams to collaboratively investigate and manage security incidents with case management workflows.',
    keyProducts: [
      'TheHive 5',
      'Cortex (Analysis Engine)',
      'TheHive4py (Python API)',
      'MISP Integration',
    ],
    coverageCells: [
      { row: 'devices', column: 'respond' },
      { row: 'networks', column: 'respond' },
      { row: 'applications', column: 'respond' },
    ],
    costRange: 'free',
    popularityRank: 79,
    websiteUrl: 'https://thehive-project.org',
  },
  {
    id: 'misp',
    vendorName: 'MISP',
    category: 'Threat Intelligence',
    description:
      'Open-source threat intelligence sharing platform for collecting, storing, distributing, and sharing cybersecurity indicators and threat information among trusted communities.',
    keyProducts: [
      'MISP Core Platform',
      'MISP Galaxies',
      'MISP Taxonomies',
      'MISP Modules',
    ],
    coverageCells: [
      { row: 'devices', column: 'identify' },
      { row: 'networks', column: 'identify' },
      { row: 'applications', column: 'identify' },
    ],
    costRange: 'free',
    popularityRank: 80,
    websiteUrl: 'https://www.misp-project.org',
  },

  // ─────────────────────────────────────────────
  // 81-90
  // ─────────────────────────────────────────────
  {
    id: 'velociraptor',
    vendorName: 'Velociraptor',
    category: 'Digital Forensics',
    description:
      'Open-source endpoint visibility and digital forensics tool for collecting, querying, and monitoring forensic artifacts at scale across enterprise endpoints.',
    keyProducts: [
      'Velociraptor Server',
      'Velociraptor Agent',
      'Velociraptor Query Language (VQL)',
      'Velociraptor Artifact Exchange',
    ],
    coverageCells: [
      { row: 'devices', column: 'detect' },
      { row: 'devices', column: 'respond' },
      { row: 'devices', column: 'identify' },
    ],
    costRange: 'free',
    popularityRank: 81,
    websiteUrl: 'https://docs.velociraptor.app',
  },
  {
    id: 'grr',
    vendorName: 'GRR',
    category: 'Digital Forensics',
    description:
      'Google-developed open-source incident response framework for remote live forensics, enabling analysts to collect artifacts and investigate hosts at enterprise scale.',
    keyProducts: [
      'GRR Rapid Response Server',
      'GRR Client',
      'GRR Flows',
      'GRR Hunts',
    ],
    coverageCells: [
      { row: 'devices', column: 'respond' },
      { row: 'devices', column: 'detect' },
      { row: 'devices', column: 'identify' },
    ],
    costRange: 'free',
    popularityRank: 82,
    websiteUrl: 'https://grr-doc.readthedocs.io',
  },
  {
    id: 'volatility',
    vendorName: 'Volatility',
    category: 'Digital Forensics',
    description:
      'Open-source memory forensics framework for extracting artifacts from volatile memory (RAM) dumps to investigate malware, rootkits, and advanced persistent threats.',
    keyProducts: [
      'Volatility 3',
      'Volatility 2',
      'Volatility Plugins',
      'Volatility Workbench',
    ],
    coverageCells: [
      { row: 'devices', column: 'detect' },
      { row: 'devices', column: 'respond' },
    ],
    costRange: 'free',
    popularityRank: 83,
    websiteUrl: 'https://www.volatilityfoundation.org',
  },
  {
    id: 'autopsy',
    vendorName: 'Autopsy',
    category: 'Digital Forensics',
    description:
      'Open-source digital forensics platform for investigating hard drives, smartphones, and media with timeline analysis, keyword search, and artifact extraction.',
    keyProducts: [
      'Autopsy Digital Forensics Platform',
      'The Sleuth Kit',
      'Autopsy Modules',
      'Autopsy Multi-User Collaboration',
    ],
    coverageCells: [
      { row: 'devices', column: 'respond' },
      { row: 'data', column: 'detect' },
      { row: 'devices', column: 'detect' },
    ],
    costRange: 'free',
    popularityRank: 84,
    websiteUrl: 'https://www.autopsy.com',
  },
  {
    id: 'cuckoo-sandbox',
    vendorName: 'Cuckoo Sandbox',
    category: 'Threat Intelligence',
    description:
      'Open-source automated malware analysis system that executes suspicious files in an isolated environment and reports on their behavior, network activity, and impact.',
    keyProducts: [
      'Cuckoo Sandbox',
      'Cuckoo Modified',
      'Cuckoo API',
      'CAPE Sandbox (Community Fork)',
    ],
    coverageCells: [
      { row: 'applications', column: 'detect' },
      { row: 'devices', column: 'detect' },
    ],
    costRange: 'free',
    popularityRank: 85,
    websiteUrl: 'https://cuckoosandbox.org',
  },
  {
    id: 'virustotal',
    vendorName: 'VirusTotal',
    category: 'Threat Intelligence',
    description:
      'Google-owned online service that aggregates 70+ antivirus engines and URL/domain scanners to analyze files and URLs for malware and malicious content.',
    keyProducts: [
      'VirusTotal File Analysis',
      'VirusTotal URL Scanner',
      'VirusTotal API',
      'VirusTotal Enterprise',
      'VirusTotal Intelligence',
    ],
    coverageCells: [
      { row: 'applications', column: 'detect' },
      { row: 'devices', column: 'detect' },
      { row: 'applications', column: 'identify' },
    ],
    costRange: 'free',
    popularityRank: 86,
    websiteUrl: 'https://www.virustotal.com',
  },
  {
    id: 'any-run',
    vendorName: 'ANY.RUN',
    category: 'Threat Intelligence',
    description:
      'Interactive online malware sandbox allowing analysts to observe malware behavior in real time with full control over the analysis environment and process.',
    keyProducts: [
      'ANY.RUN Interactive Sandbox',
      'ANY.RUN Threat Intelligence Lookup',
      'ANY.RUN YARA Search',
      'ANY.RUN API',
    ],
    coverageCells: [
      { row: 'applications', column: 'detect' },
      { row: 'devices', column: 'detect' },
    ],
    costRange: 'medium',
    popularityRank: 87,
    websiteUrl: 'https://any.run',
  },
  {
    id: 'joe-sandbox',
    vendorName: 'Joe Sandbox',
    category: 'Threat Intelligence',
    description:
      'Deep malware analysis platform performing automated behavioral analysis of executables, documents, URLs, and APKs across Windows, macOS, Linux, and Android.',
    keyProducts: [
      'Joe Sandbox Cloud',
      'Joe Sandbox Desktop',
      'Joe Sandbox Complete',
      'Joe Sandbox Mobile',
    ],
    coverageCells: [
      { row: 'applications', column: 'detect' },
      { row: 'devices', column: 'detect' },
      { row: 'applications', column: 'identify' },
    ],
    costRange: 'high',
    popularityRank: 88,
    websiteUrl: 'https://www.joesandbox.com',
  },
  {
    id: 'ghidra',
    vendorName: 'Ghidra',
    category: 'Digital Forensics',
    description:
      'NSA-developed open-source software reverse engineering framework providing disassembly, decompilation, scripting, and collaborative analysis capabilities.',
    keyProducts: [
      'Ghidra SRE Framework',
      'Ghidra Decompiler',
      'Ghidra CodeBrowser',
      'Ghidra Scripting API',
    ],
    coverageCells: [
      { row: 'applications', column: 'detect' },
      { row: 'applications', column: 'identify' },
    ],
    costRange: 'free',
    popularityRank: 89,
    websiteUrl: 'https://ghidra-sre.org',
  },
  {
    id: 'ida-pro',
    vendorName: 'IDA Pro',
    category: 'Digital Forensics',
    description:
      'Industry-standard interactive disassembler and debugger used by reverse engineers and malware analysts for binary analysis, exploit development, and vulnerability research.',
    keyProducts: [
      'IDA Pro',
      'IDA Home',
      'IDA Free',
      'Hex-Rays Decompiler',
    ],
    coverageCells: [
      { row: 'applications', column: 'detect' },
      { row: 'applications', column: 'identify' },
    ],
    costRange: 'high',
    popularityRank: 90,
    websiteUrl: 'https://hex-rays.com/ida-pro',
  },

  // ─────────────────────────────────────────────
  // 91-100
  // ─────────────────────────────────────────────
  {
    id: 'maltego',
    vendorName: 'Maltego',
    category: 'Threat Intelligence',
    description:
      'Visual link analysis and OSINT platform for graphical investigation of relationships between people, domains, IPs, infrastructure, and other entities in cyber investigations.',
    keyProducts: [
      'Maltego CE (Community)',
      'Maltego Classic',
      'Maltego XL',
      'Maltego Transforms',
    ],
    coverageCells: [
      { row: 'networks', column: 'identify' },
      { row: 'users', column: 'identify' },
      { row: 'devices', column: 'identify' },
    ],
    costRange: 'medium',
    popularityRank: 91,
    websiteUrl: 'https://www.maltego.com',
  },
  {
    id: 'shodan',
    vendorName: 'Shodan',
    category: 'Threat Intelligence',
    description:
      'Internet-wide search engine for discovering internet-connected devices, open ports, services, and vulnerabilities across the global attack surface.',
    keyProducts: [
      'Shodan Search Engine',
      'Shodan Monitor',
      'Shodan API',
      'Shodan Enterprise',
    ],
    coverageCells: [
      { row: 'devices', column: 'identify' },
      { row: 'networks', column: 'identify' },
    ],
    costRange: 'low',
    popularityRank: 92,
    websiteUrl: 'https://www.shodan.io',
  },
  {
    id: 'censys',
    vendorName: 'Censys',
    category: 'Threat Intelligence',
    description:
      'Attack surface management and internet intelligence platform providing continuous discovery and monitoring of internet-facing assets and certificate transparency data.',
    keyProducts: [
      'Censys Attack Surface Management',
      'Censys Search',
      'Censys API',
      'Censys Enterprise',
    ],
    coverageCells: [
      { row: 'devices', column: 'identify' },
      { row: 'networks', column: 'identify' },
      { row: 'applications', column: 'identify' },
    ],
    costRange: 'medium',
    popularityRank: 93,
    websiteUrl: 'https://censys.io',
  },
  {
    id: 'securityscorecard',
    vendorName: 'SecurityScorecard',
    category: 'Security Ratings',
    description:
      'Security ratings platform that continuously monitors and scores organizations on their cybersecurity posture for third-party risk management and board reporting.',
    keyProducts: [
      'SecurityScorecard Ratings',
      'SecurityScorecard Atlas (TPRM)',
      'SecurityScorecard MAX',
      'SecurityScorecard Automatic Vendor Detection',
    ],
    coverageCells: [
      { row: 'networks', column: 'identify' },
      { row: 'applications', column: 'identify' },
      { row: 'devices', column: 'identify' },
    ],
    costRange: 'high',
    popularityRank: 94,
    websiteUrl: 'https://securityscorecard.com',
  },
  {
    id: 'bitsight',
    vendorName: 'BitSight',
    category: 'Security Ratings',
    description:
      'Cyber risk management and security performance ratings company providing data-driven visibility into the security posture of organizations and their supply chains.',
    keyProducts: [
      'BitSight Security Ratings',
      'BitSight for Third-Party Risk Management',
      'BitSight for Security Performance Management',
      'BitSight Attack Surface Analytics',
    ],
    coverageCells: [
      { row: 'networks', column: 'identify' },
      { row: 'applications', column: 'identify' },
      { row: 'devices', column: 'identify' },
    ],
    costRange: 'enterprise',
    popularityRank: 95,
    websiteUrl: 'https://www.bitsight.com',
  },
  {
    id: 'riskrecon',
    vendorName: 'RiskRecon',
    category: 'Security Ratings',
    description:
      'Mastercard company providing continuous third-party risk monitoring by assessing the cybersecurity hygiene of vendor ecosystems through passive internet analysis.',
    keyProducts: [
      'RiskRecon Third-Party Risk Management',
      'RiskRecon Security Performance Ratings',
      'RiskRecon Portfolio Risk Assessment',
      'RiskRecon API',
    ],
    coverageCells: [
      { row: 'networks', column: 'identify' },
      { row: 'applications', column: 'identify' },
    ],
    costRange: 'high',
    popularityRank: 96,
    websiteUrl: 'https://www.riskrecon.com',
  },
  {
    id: 'upguard',
    vendorName: 'UpGuard',
    category: 'Security Ratings',
    description:
      'Cyber risk management platform that combines security ratings, vendor risk assessments, and data leak detection to continuously monitor external attack surfaces.',
    keyProducts: [
      'UpGuard BreachSight',
      'UpGuard Vendor Risk',
      'UpGuard CyberResearch',
      'UpGuard Security Ratings',
    ],
    coverageCells: [
      { row: 'networks', column: 'identify' },
      { row: 'data', column: 'identify' },
      { row: 'applications', column: 'identify' },
    ],
    costRange: 'high',
    popularityRank: 97,
    websiteUrl: 'https://www.upguard.com',
  },
  {
    id: 'pentera',
    vendorName: 'Pentera',
    category: 'Breach & Attack Simulation',
    description:
      'Automated security validation platform that continuously tests an organization\'s security posture by safely emulating real-world attacks across the full kill chain.',
    keyProducts: [
      'Pentera Core',
      'Pentera Surface',
      'Pentera Cloud',
      'Pentera Automated Penetration Testing',
    ],
    coverageCells: [
      { row: 'networks', column: 'identify' },
      { row: 'devices', column: 'identify' },
      { row: 'applications', column: 'identify' },
      { row: 'networks', column: 'detect' },
    ],
    costRange: 'enterprise',
    popularityRank: 98,
    websiteUrl: 'https://pentera.io',
  },
  {
    id: 'cymulate',
    vendorName: 'Cymulate',
    category: 'Breach & Attack Simulation',
    description:
      'Continuous security validation platform that simulates advanced cyber threats to test and optimize an organization\'s security controls and incident response readiness.',
    keyProducts: [
      'Cymulate BAS Platform',
      'Cymulate Continuous Automated Red Teaming',
      'Cymulate Attack Surface Management',
      'Cymulate Exposure Analytics',
    ],
    coverageCells: [
      { row: 'networks', column: 'identify' },
      { row: 'applications', column: 'identify' },
      { row: 'devices', column: 'identify' },
      { row: 'users', column: 'identify' },
    ],
    costRange: 'enterprise',
    popularityRank: 99,
    websiteUrl: 'https://cymulate.com',
  },
  {
    id: 'attackiq',
    vendorName: 'AttackIQ',
    category: 'Breach & Attack Simulation',
    description:
      'Breach and attack simulation platform aligned with MITRE ATT&CK that validates security controls by emulating adversary tactics, techniques, and procedures.',
    keyProducts: [
      'AttackIQ Enterprise',
      'AttackIQ Ready!',
      'AttackIQ Flex',
      'AttackIQ Anatomic Engine',
    ],
    coverageCells: [
      { row: 'networks', column: 'identify' },
      { row: 'devices', column: 'identify' },
      { row: 'applications', column: 'identify' },
      { row: 'users', column: 'identify' },
    ],
    costRange: 'enterprise',
    popularityRank: 100,
    websiteUrl: 'https://www.attackiq.com',
  },
]
