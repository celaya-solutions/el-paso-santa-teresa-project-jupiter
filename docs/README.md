# Project Jupiter: The Numbers Nobody Published

Independent quantitative analysis of water and electrical grid pressure in the El Paso / Santa Teresa data center corridor.

## What This Is

Two analyses. One question each. Math instead of opinion.

**Water:** Do we have enough water for the new data centers?
**Electrical:** Does the grid have enough capacity?

Every number comes from a public source. Every calculation can be reproduced with a calculator and the cited documents. If any number is wrong, correct it publicly and cite your source.

## Documents

| Document | Question | Key Finding |
|----------|----------|-------------|
| [Water Analysis](pj_numbers.html) | Is there enough water? | DC demand = 17.9% of supply surplus. Conclusion flips depending on which supply definition is used. No public document specifies which one decision-makers used. |
| [Grid Analysis](pj_grid.html) | Is there enough power? | DC load = 197% of grid surplus. Stated power plant size (700-900 MW) does not match air quality permits (2,880 MW). Permitted microgrid is 125% the size of the regional utility. |

## Who This Is For

Each document has four tiers. Pick the one that fits you.

| Tab | Audience | What You Get |
|-----|----------|-------------|
| Residents | Community members | Plain language, 6th grade reading level |
| Journalists | Reporters, editors | Sourced data tables with full bibliography |
| Technical | Engineers, professors, researchers | Full equations, input values, step-by-step calculations |
| Español | Comunidad hispanohablante | Resumen en español claro |

## Key Numbers

### Water (pj_numbers.html)

- Bureau of Reclamation allocation to El Paso: 60,000 acre-feet/year
- Current demand: 130,498 acre-feet/year (2023)
- Supply surplus: 8,702 acre-feet/year
- Combined DC water demand at full build: 1.56 MGD (1,748 acre-feet/year)
- DC demand as share of surplus: 17.9%
- No public document specifies which supply definition was used in approvals

### Electrical (pj_grid.html)

- EPE total generation capacity: ~2,300 MW
- Record peak demand: 2,173 MW (July 2020)
- Grid margin at peak: 127 MW (5.5%)
- Combined DC load on EPE grid: 250 MW (Meta 100 MW + Wiwynn 150 MW)
- DC load vs. grid margin: 197%
- Project Jupiter stated to commissioners: 700-900 MW
- Project Jupiter air quality permits: 2,880 MW
- Jupiter microgrid vs. entire EPE system: 125%
- EPE dividend extraction (2022-2024): $491.8 million
- Proposed rate increase revenue: ~$123 million/year
- Dividend extraction exceeds proposed rate increase by 33%

## Sources

### Water Analysis
1. Texas Tribune, April 2025 (El Paso baseline demand)
2. El Paso Water Conservation Plan, 2024 (2023 production data)
3. Bureau of Reclamation, Rio Grande Project (supply and demand allocations)
4. Dona Ana County MOU, September 24, 2025 (Jupiter water requirements)
5. KVIA / Yahoo News (Meta El Paso water requirements)
6. State MOU, February 25, 2025 (BorderPlex Digital Assets LLC)
7. EPA inspection report, 2025 (arsenic treatment plant status)
8. Legal complaint, Case D-307-CV-2025-02766

### Grid Analysis
1. El Paso Matters, March 2025 (EPE capacity, Wiwynn 150 MW)
2. EPE press release, July 2020 (record peak demand)
3. EPE 2024 System Expansion Plan (load growth projections)
4. EPE All-Source RFP, July 2025 (capacity need 650-850 MW)
5. El Paso Matters, September 2025 (Meta 100 MW)
6. Dona Ana County Commission meeting, September 19, 2025 (700-900 MW statement)
7. NMED air quality permit applications, December 2025 (2,880 MW, emissions data)
8. ABQ Journal, December 2025 (permit splitting analysis)
9. IIF/EPE regulatory filings (dividend data, $491.8M)
10. Fitch Ratings analysis (EPE $3.5B capital plan)
11. El Paso Matters / Kelly Tomblin quotes (CEO statements on capacity need)

## Verification

### Water
1. Obtain the source documents listed above
2. Extract the stated values (demand, supply, DC water requirements)
3. Compute: `P_water = (DC_demand + existing_demand) / available_supply`
4. Compare your results to the document

### Electrical
1. Obtain the source documents listed above
2. Extract the stated values (capacity, peak demand, DC load)
3. Compute: `P_grid = (DC_load + existing_peak_demand) / grid_capacity`
4. Compare your results to the document

If your numbers differ, publish the correction with your source.

## Integrity

Each document includes a SHA-256 hash computed before publication. If a Solana transaction signature is present, the hash was anchored to the blockchain before the document was made public. This proves the content existed at the stated time and has not been modified.

To verify: compute `sha256sum` on the HTML file and compare to the hash printed in the document and recorded on-chain.

## License

Public domain. See [LICENSE](LICENSE).
