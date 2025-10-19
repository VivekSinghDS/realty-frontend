# Line Break Test

## Test Data Format
Your executive summary data with line breaks should now render properly:

```json
{
  "executiveSummary": {
    "value": "**Lease Summary**\nLandlord **PH Office 2, LLC** (Rogers, AR) leases to **Bayer HealthCare LLC** (Whippany, NJ) approximately **17,090 rentable sf** (14,642 usable sf) on the 6th floor of 5100 W.J.B. Hunt Drive, Rogers, AR.\n\nThe primary term is 77 months, commencing after completion of tenant improvements and issuance of certificates; rent starts on the first day of the 6th month at **$24.50 / RSF** (incl. taxes, utilities, insurance) and escalates 2 % annually to **$27.05 / RSF** by month 66‑77 (see rent schedule)."
  }
}
```

## What Should Happen Now
- **Bold text** should render as **bold**
- Line breaks (`\n`) should create actual line breaks in the display
- The content should be properly formatted with spacing

## Technical Changes Made
1. ✅ Added `remark-breaks` plugin
2. ✅ Updated MarkdownRenderer to include `remarkBreaks` in plugins
3. ✅ Added line break detection to Markdown pattern matching
4. ✅ Line breaks (`\n`) now convert to `<br>` tags in the rendered output

Your executive summary should now display with proper line breaks between paragraphs!
