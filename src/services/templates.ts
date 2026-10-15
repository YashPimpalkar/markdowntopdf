import type { DocumentTemplate } from '../types/document';

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'technical-spec',
    name: 'Technical Specification',
    description: 'System architecture, API design, code snippets, and math algorithms.',
    icon: 'Cpu',
    defaultTheme: 'tech',
    content: `# Distributed Consensus Engine (DCE)
**Architecture Specification & Protocol Design v2.4**

*Author:* Distributed Systems Core Team  
*Date:* October 2026 | *Classification:* Engineering Whitepaper

---

## 1. Executive Overview

The **Distributed Consensus Engine** provides high-throughput state machine replication across untrusted network partitions. By decoupling transaction ordering from state transition validation, DCE achieves sub-10ms finality with Byzantine fault tolerance.

> [!NOTE]
> This protocol guarantees safety under partially synchronous network assumptions where maximum message delay $\\Delta$ is bounded.

---

## 2. Mathematical Formalization

The network consists of $N$ validator nodes, where at most $f$ nodes may exhibit Byzantine (arbitrary) failure modes. Consensus safety is mathematically guaranteed when:

$$N \\ge 3f + 1$$

The quorums $Q_1$ and $Q_2$ for commit rounds satisfy the strict intersection property:

$$|Q_1 \\cap Q_2| \\ge f + 1$$

Given network message latency distribution $\\mathcal{P}(\\tau)$, expected round latency $\\mathbb{E}[L]$ under active pipelining converges to:

$$\\mathbb{E}[L] = \\int_{0}^{\\infty} \\tau \\cdot \\lambda e^{-\\lambda \\tau} d\\tau = \\frac{1}{\\lambda}$$

---

## 3. Core Engine Implementation

Below is the state-transition processor written in TypeScript:

\`\`\`typescript
interface StateProof {
  blockHeight: number;
  stateRoot: string;
  validatorSignatures: Uint8Array[];
}

export class ConsensusKernel {
  private currentHeight: number = 0;
  private readonly threshold: number;

  constructor(private readonly validatorCount: number) {
    this.threshold = Math.floor((2 * validatorCount) / 3) + 1;
  }

  public async commitBlock(proof: StateProof): Promise<boolean> {
    if (proof.validatorSignatures.length < this.threshold) {
      throw new Error("Insufficient quorum signatures for commit");
    }
    this.currentHeight = proof.blockHeight;
    return true;
  }
}
\`\`\`

<!-- pagebreak -->

## 4. Benchmark Performance

| Cluster Size | Throughput (Tx/sec) | P95 Latency | Quorum Size |
| :--- | :--- | :--- | :--- |
| 4 Nodes | 84,200 | 4.2 ms | 3 Nodes |
| 16 Nodes | 61,500 | 8.7 ms | 11 Nodes |
| 64 Nodes | 32,800 | 18.4 ms | 43 Nodes |
| 128 Nodes | 19,400 | 29.1 ms | 86 Nodes |

> [!TIP]
> Enable pipelined batching with compression for payloads exceeding 1MB to sustain maximum IO throughput.

---

## 5. Security & Invariant Checklist

- [x] Ephemeral TLS 1.3 session key rotation every 10,000 blocks
- [x] Slashing conditions verified against double-proposal history
- [ ] Multi-region geographic partition canary test
- [ ] Post-quantum Kyber-1024 hybrid key encapsulation
`,
  },
  {
    id: 'executive-report',
    name: 'Executive Business Report',
    description: 'Quarterly performance, financial metrics, KPI tables, and strategic roadmap.',
    icon: 'Briefcase',
    defaultTheme: 'executive',
    content: `# Global Operations Quarterly Review
**Q3 FY2026 Strategic Performance & Financial Trajectory**

*Prepared by:* Office of the Chief Strategy Officer  
*Audience:* Board of Directors & Executive Leadership

---

## 1. Leadership Summary

During the third quarter of 2026, enterprise revenue expanded by **34.2% YoY**, driven by accelerated international adoption and enterprise contract renewals exceeding 118% net revenue retention.

> [!IMPORTANT]
> Gross margins improved by 280 basis points to **74.1%**, primarily as automated infrastructure optimizations reduced cloud compute costs per transaction.

---

## 2. Key Performance Indicators (KPIs)

| Financial Metric | Q3 2025 (Actual) | Q3 2026 (Actual) | Variance | Target Status |
| :--- | :--- | :--- | :--- | :--- |
| **Annual Recurring Revenue** | $84.2M | $112.9M | +34.1% | Exceeded (104%) |
| **Gross Margin** | 71.3% | 74.1% | +280 bps | On Track |
| **Customer Acquisition Cost**| $14,200 | $11,800 | -16.9% | Optimized |
| **Operating Cash Flow** | $18.4M | $28.6M | +55.4% | Exceeded |

<!-- pagebreak -->

## 3. Strategic Growth Pillars

### Pillar A: Enterprise Expansion
1. Accelerated sales velocity in EMEA and APAC financial sectors.
2. Standardized ISO 27001 and SOC2 Type II compliance controls.

### Pillar B: Product Innovation
- Self-serve developer sandbox reduced onboarding friction by 40%.
- Real-time audit dashboard deployed to 100% of tier-1 customers.

> [!WARNING]
> Supply chain lead times for specialized hardware accelerators remain elongated at 14 weeks. Buffer inventory has been fortified accordingly.

---

## 4. Next Quarter Milestones

- [x] Board audit sign-off for statutory disclosures
- [x] Initial launch of Tokyo and Frankfurt edge nodes
- [ ] Finalize Series D capital allocation framework
- [ ] Complete annual carbon neutrality assessment
`,
  },
  {
    id: 'academic-paper',
    name: 'Academic Research Paper',
    description: 'Formal publication layout with LaTeX equations, abstract, and citation formatting.',
    icon: 'GraduationCap',
    defaultTheme: 'academic',
    content: `# Stochastic Convergence of Adaptive Gradient Methods in Non-Convex Optimization

**Dr. Eleanor Vance, PhD**  
*Department of Applied Mathematics & Computer Science*  
*Institute for Advanced Computational Research*

---

### Abstract
We investigate the asymptotic convergence behavior of adaptive moment estimation algorithms in non-convex stochastic optimization. By constructing a modified Lyapunov function, we establish an upper bound on the gradient norm without requiring uniform boundedness assumptions on stochastic gradients. Numerical experiments confirm empirical superiority on deep transformer architectures.

---

## 1. Introduction & Problem Formulation

Consider the unconstrained minimization problem:

$$\\min_{\\theta \\in \\mathbb{R}^d} f(\\theta) := \\mathbb{E}_{\\xi \\sim \\mathcal{D}}[F(\\theta; \\xi)]$$

where $f: \\mathbb{R}^d \\to \\mathbb{R}$ is continuously differentiable and $L$-smooth, satisfying:

$$\\|\\nabla f(\\theta_1) - \\nabla f(\\theta_2)\\| \\le L \\|\\theta_1 - \\theta_2\\|, \\quad \\forall \\theta_1, \\theta_2 \\in \\mathbb{R}^d$$

Adaptive gradient updates incorporate second-order moment accumulators $v_t$:

$$m_t = \\beta_1 m_{t-1} + (1 - \\beta_1) g_t$$

$$v_t = \\beta_2 v_{t-1} + (1 - \\beta_2) g_t^2$$

$$\\theta_{t+1} = \\theta_t - \\frac{\\alpha}{\\sqrt{v_t} + \\epsilon} \\odot m_t$$

<!-- pagebreak -->

## 2. Main Theoretical Result

> [!NOTE]
> **Theorem 1 (Non-Convex Convergence Bound)**  
> Let $f$ be $L$-smooth and lower bounded by $f^*$. Under diminishing step-size schedule $\\alpha_t = \\frac{\\alpha_0}{\\sqrt{t}}$, the gradient trajectory satisfies:
>
> $$\\frac{1}{T} \\sum_{t=1}^T \\mathbb{E}[\\|\\nabla f(\\theta_t)\\|^2] \\le \\mathcal{O}\\left(\\frac{\\sigma}{\\sqrt{T}}\\right) + \\mathcal{O}\\left(\\frac{L(f(\\theta_1) - f^*)}{T}\\right)$$

### 2.1 Proof Sketch
We define the energy functional $\\Phi_t = f(\\theta_t) + \\frac{1}{2\\gamma} \\|\\theta_t - \\theta^*\\|^2$. Differentiating along trajectories and applying the Cauchy-Schwarz inequality yields the result.

---

## 3. Empirical Verification

\`\`\`python
import numpy as np

def adaptive_gradient_step(theta, grad, m, v, t, lr=1e-3, b1=0.9, b2=0.999, eps=1e-8):
    m = b1 * m + (1.0 - b1) * grad
    v = b2 * v + (1.0 - b2) * (grad ** 2)
    m_hat = m / (1.0 - b1 ** t)
    v_hat = v / (1.0 - b2 ** t)
    theta = theta - (lr / (np.sqrt(v_hat) + eps)) * m_hat
    return theta, m, v
\`\`\`
`,
  },
  {
    id: 'modern-resume',
    name: 'Modern Resume / CV',
    description: 'Clean single/double page professional resume with contact grid and project bullets.',
    icon: 'User',
    defaultTheme: 'minimal',
    content: `# Alex Morgan
**Senior Principal Software Engineer & Distributed Systems Architect**  
*San Francisco, CA* | alex.morgan@example.com | github.com/alexmorgan | linkedin.com/in/alexmorgan

---

## Professional Summary
Results-driven software architect with 10+ years of experience engineering high-scale distributed backends, streaming platforms, and developer tooling. Proven track record leading engineering squads of 15+ engineers to deliver 99.999% availability at 500k+ QPS.

---

## Technical Competencies
- **Languages:** TypeScript, Go, Rust, Python, C++, SQL
- **Cloud & Infrastructure:** Kubernetes, AWS, Terraform, Docker, Kafka, Redis, PostgreSQL
- **Architecture:** Microservices, Event-Driven Architecture, Consensus (Raft/Paxos), GraphQL, gRPC

---

## Work Experience

### **Principal Architect** | CloudScale Technologies
*2022 – Present | San Francisco, CA*
- Designed and migrated legacy monolith to an event-driven Go/Kafka architecture, reducing cloud spend by **$1.8M annually**.
- Spearheaded company-wide adoption of gRPC and Protobuf, decreasing service-to-service latency by **38%**.
- Mentored 12 senior engineers across infrastructure and platform reliability teams.

### **Lead Backend Engineer** | Nexus Financial Systems
*2018 – 2022 | New York, NY*
- Engineered core clearing engine processing **$12B in daily transaction volume**.
- Maintained 99.999% uptime SLA across 4 global operating regions.
- Implemented real-time anomaly detection pipelines using Apache Flink and Redis.

<!-- pagebreak -->

## Education & Certifications

- **B.S. in Computer Science & Mathematics** — University of California, Berkeley (3.9 GPA)
- **AWS Certified Solutions Architect – Professional** (2024)
- **Certified Kubernetes Administrator (CKA)** (Linux Foundation)

---

## Key Open Source Contributions

- **RaftGo:** Maintained high-performance Raft consensus library with 4.8k GitHub stars.
- **FastMark:** High-speed streaming markdown renderer for documentation suites.
`,
  },
];
