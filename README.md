# Project Jupiter Evidence Portal

> Evidence-Grade Accountability System for Community Advocacy

**Generated**: January 22, 2026  
**Method**: Manual evidence analysis following verdict system prompt  
**Framework**: Evidence-grade documentation with strict citation standards

---

## Quick Stats

<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-value">18</div>
    <div class="stat-label">Documents</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">71</div>
    <div class="stat-label">Evidence Items</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">15</div>
    <div class="stat-label">Contradictions</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">82</div>
    <div class="stat-label">Timeline Events</div>
  </div>
</div>

---

##  START HERE

<div class="alert alert-info">
<strong>New to this project?</strong> Begin with the <a href="#/CONSOLIDATED_PUBLIC_REPORT">Consolidated Public Report</a> - a complete 94-page analysis ready for distribution to community, media, and legal teams.
</div>

---

##  What's Inside

### Core Deliverables (Public Release Ready)

1. **[Consolidated Public Report](CONSOLIDATED_PUBLIC_REPORT.md)** ⭐
   - Complete public-facing accountability report
   - Executive summary + findings + action items
   - Ready for distribution

2. **[Evidence Matrix](evidence_matrix.csv)** 
   - 71 evidence rows with atomic facts
   - Sources, dates, verification status
   - Foundation for all other deliverables

3. **[Contradictions Analysis](contradictions.md)** ️
   - 15 documented contradictions between sources
   - Legal and political implications
   - Citations to conflicting sources

4. **[Accountability Map](accountability_map.md)** ️
   - Legal exposure (state officials, county commissioners)
   - Political accountability (electoral targets)
   - Enforcement pathways with statutory references

### Action Tools

5. **[30-Day Messaging Campaign](public_messaging_30_days.md)** 
   - Bilingual (English/Spanish) social media posts
   - Daily messages with source citations
   - Ready for immediate deployment

6. **[Public Comment Scripts](public_comment_scripts.md)** 
   - 6 time-bounded scripts (~2 minutes each)
   - Fact-checked with citations
   - Follow-up questions to expose evasions

7. **[Opposition Research Profiles](opposition_research_profiles.md)** 
   - Research framework for commissioners who voted YES
   - Voting records and campaign finance priorities
   - Documented contradictions

8. **[Decision Network Timeline](decision_network_timeline.md)** 
   - Chronological: Feb 2025 - Dec 2025
   - Network analysis of communications
   - Pattern identification and IPRA requests

---

##  Usage Guide

### For Community Organizers

**Start with**: [Consolidated Public Report](CONSOLIDATED_PUBLIC_REPORT.md)  
**Then use**:
- [30-Day Messaging Campaign](public_messaging_30_days.md) for social media
- [Public Comment Scripts](public_comment_scripts.md) for meetings
- [Contradictions Analysis](contradictions.md) for talking points

**Distribute**: Share this entire portal link with community members

### For Legal Teams

**Start with**: [Evidence Matrix](evidence_matrix.csv) + [Accountability Map](accountability_map.md)  
**Focus on**:
- Open Meetings Act violations
- Incomplete IRB application
- Decision network timeline

**Use**: Citations as foundation for legal briefs

### For Journalists

**Start with**: [Consolidated Report Executive Summary](CONSOLIDATED_PUBLIC_REPORT.md)  
**Dig into**:
- [Decision Network Timeline](decision_network_timeline.md) (investigative leads)
- [Opposition Research](opposition_research_profiles.md) (campaign finance angles)
- [Contradictions](contradictions.md) (headline-worthy discrepancies)

**Verify**: All sources cited; follow up with IPRA requests

---

##  Methodology

All deliverables follow strict accountability standards:

1. **No Speculation** - Every claim backed by verifiable source
2. **Strict Citations** - Document name + date + page/section/line number
3. **Contradiction Mapping** - Identify conflicts between sources
4. **Accountability Assignment** - Legal, political, and administrative responsibility
5. **Traceability** - All claims traceable to primary sources

**Verification Statuses**:
- <span class="badge badge-success">verified_primary</span> - From executed legal documents, court filings
- <span class="badge badge-accent">verified_secondary</span> - From news coverage, requiring confirmation
- <span class="badge badge-warning">needs_verification</span> - Requires additional IPRA requests

---

##  Source Documentation

### Primary Sources Analyzed

- **State MOU**: BorderPlex Digital Assets LLC + NM Governor (2025-02-25)
- **County MOU**: Doña Ana County + Project Jupiter entities (2025-09-24)
- **IRB Ordinances**: 367-2025, 368-2025, 369-2025
- **Lease Documents**: Series 2025A, 2025B, 2025C
- **LEDA PPA**: Project Participation Agreement (2025-09-17)
- **Legal Complaint**: Petition for Writ of Certiorari (Case D-307-CV-2025-02766)
- **NMELC Letters**: Doxxing complaint, air permit advocacy
- **News Coverage**: KFOX14, Haussamen, Courthouse News

### Document Count

- **2,647 total markdown files** analyzed
- **71 evidence rows** in accountability matrix
- **8 complete deliverables** generated

---

##  Analytics (Multi-User)

This repo includes a lightweight analytics collector so you can aggregate events across all users.

**Start the collector (local or hosted):**
- `node server/analytics-server.js`

**Configure the site and dashboard to send/read remote analytics:**
- Set `window.PJ_ANALYTICS_ENDPOINT` to your server base URL (example: `https://your-collector.example.com`)
- (Optional) Set `ANALYTICS_API_KEY` on the server and `window.PJ_ANALYTICS_KEY` in the client

The collector exposes:
- `POST /collect` to receive events
- `GET /analytics` to read aggregated data
- `GET /health` for a quick status check

If you’re hosting the Docsify site on GitHub Pages, deploy the collector separately (any Node host works), then point `PJ_ANALYTICS_ENDPOINT` to it.

### Fly.io quick start

This repo includes `Dockerfile` and `fly.toml` for Fly.io.

1. Install and authenticate: `fly auth login`
2. Create the app (replace name): `fly launch --name project-jupiter-analytics --no-deploy`
3. Create a volume for persistence:
   - `fly volumes create analytics_data --size 1`
4. (Optional) Set API key: `fly secrets set ANALYTICS_API_KEY=your-secret`
5. Deploy: `fly deploy`



## ️ The Legal Case

**Filed**: October 17, 2025  
**Court**: Third Judicial District Court, Doña Ana County, NM  
**Plaintiffs**: Empowerment Congress, José Saldaña Jr., Vivian Fuller  
**Legal Rep**: NM Environmental Law Center

**Ordinances Challenged**:
1. Ordinance 367-2025: $165 billion Industrial Revenue Bonds
2. Ordinance 368-2025: LEDA funding for project development
3. Related LEDA ordinance: Funding for permit fees

**Legal Claims**: Violation of state/local laws requiring fully-informed decisions, procedurally deficient approval

---

##  The Water Crisis

> "How can we live without water? Water is life."  
> — José Saldaña Jr., Sunland Park resident

**Current Conditions**:
- Santa Teresa and Sunland Park lack clean, safe, affordable drinking water for decades
- **Arsenic contamination** above federal health standards
- EPA inspection (2025): 3 of 4 arsenic treatment plants offline

**Project Impact**:
- Data centers require massive water consumption
- Project includes desalination plant (enormous demand)
- Immense additional strain on failing infrastructure

---

##  Community Opposition

**September 19, 2025 Vote**: 4-1 approval despite massive community protest

**Key Voices**:

**José Saldaña Jr.** (Plaintiff):
> "We filed this lawsuit because the community's health is in danger. I'm protecting water rights for the community."

**Vivian Fuller** (Plaintiff):
> "Our voices were still not heard"

**Daisy Maldonado** (Empowerment Congress Director):
> "There's a missing economic analysis, there's a missing environmental analysis, and certainly, there's a missing community voice."

**Commissioner Susana Chaparro** (Only NO vote):
> Remained steadfast in her commitment to Doña Ana County constituents

---

##  Contact Information

### Community Leaders
- **Daisy Maldonado**, Empowerment Congress: daisy@empowernm.org | (575) 642-5683
- **José Saldaña Jr.**: saldanajose21@yahoo.com | (915) 204-9720
- **Vivian Fuller**: vivian@empowernm.org | (915) 408-5102

### Legal Representation
- **Kacey Hovden**, NM Environmental Law Center: khovden@nmelc.org | (712) 540-2301
- **NMELC**: www.nmelc.org

Full contact list: [CONTACTS.md](CONTACTS.md)

---

##  Next Steps

### Immediate (Week 1)
1. Distribute [Consolidated Report](CONSOLIDATED_PUBLIC_REPORT.md) to community
2. Launch [30-day messaging campaign](public_messaging_30_days.md)
3. Prepare speakers using [public comment scripts](public_comment_scripts.md)

### Short-Term (Weeks 2-4)
4. File IPRA requests (see [timeline recommendations](decision_network_timeline.md))
5. Campaign finance investigation
6. Media outreach with evidence package

### Long-Term (Months 2-6)
7. Support ongoing lawsuit
8. Organize recall petition efforts (if community supports)
9. Electoral strategy for next cycle
10. Monitor project compliance

---

##  License

**Public Domain for Community Use**

This evidence package is released for public benefit. You may:
- Distribute freely
- Adapt for local use
- Translate into additional languages
- Use in legal proceedings, advocacy, or journalism

**Attribution appreciated but not required**

One request: If you find errors, report them so we can correct the record.

---

##  Acknowledgments

**Sources of Evidence**:
- Community members who attended meetings and documented the process
- Journalists who filed IPRA requests
- NMELC for legal advocacy
- Empowerment Congress for organizing opposition
- Commissioner Susana Chaparro for voting NO

**This report stands on their work.**

---

<div class="text-center">
<p><strong>Water is life. The community's health is in danger. We must act now.</strong></p>
</div>
