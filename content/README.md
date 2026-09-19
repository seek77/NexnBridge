# Insights publishing

`insights.json` is the single source for article metadata, Korean summaries and original English bodies. Pages are static and remain readable with JavaScript disabled.

1. Verify the author, exact original body, original publication date and source URL.
2. Add an entry with a unique stable slug and category (`agentic`, `knowledge`, `scm`). Preserve the author's wording; do not mix comments, recommendations or drafts into the body.
3. Store original approved images under `assets/images/insights/`. Embedded video remains linked to the original source. Do not hotlink expiring media URLs.
4. Provide clearly distinguished Korean and English editorial summaries. Mark only three representative entries `featured: true` to preserve homepage balance.
5. Run `node scripts/build-insights.cjs`. Check both language indexes, detail pages, internal links, mobile layout, source attribution and original-body fidelity before committing.

The build refreshes `/ko/insights.html`, `/en/insights.html`, the corresponding article pages, the existing home Insights sections and the sitemap. It preserves the existing navigation and footer. It neither scrapes LinkedIn nor publishes automatically.

This library contains individually verified public pieces imported on 2026-09-19. It is not a claim that every post on the author's LinkedIn account has been retrieved. Account-wide coverage must be reconciled against an author-provided export before claiming completion.

The index is one newest-first list with topic filters. There are no editorial reading-path groupings. Previous/next links are generated only for original titles explicitly numbered `Post N.M`, and only when the immediately adjacent installment is available. Missing installments are not skipped, and topical similarity alone never creates a series relationship.
