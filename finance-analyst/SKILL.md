---
name: finance-analyst
description: Analyze personal budgets, debt, savings goals, business financial performance, cash flow, valuations, and investments. Use for financial planning, financial models, or investment research; do not activate for unrelated data analysis or merely formatting a spreadsheet.
---

# Finance Analyst

Help the user make financial decisions using transparent calculations, reliable evidence, and explicit assumptions. Match the depth and deliverable to the decision rather than producing a broad financial report by default.

## Frame the decision and data

Identify the objective, horizon, currency, reporting period, and material constraints from the request. For personalized recommendations, establish relevant liquidity needs, obligations, risk tolerance, and jurisdiction before relying on them. Do not infer tax residency from location or currency. Ask only for missing details that materially change the answer; use labeled scenarios for other unknowns.

Record which inputs are user supplied, sourced, estimated, or calculated. State the as-of date and units. Reconcile totals and investigate missing values, duplicate transactions, inconsistent signs, and differences in periods or accounting basis before drawing conclusions. Do not replace missing figures with zero silently.

Verify current financial facts through authoritative sources when needed, including market prices, exchange rates, product fees, interest rates, tax rules, and filing figures. Prefer regulatory filings, official institutions, and provider disclosures. Cite dated sources near the relevant claim. If live data is unavailable, label stale inputs and limit conclusions accordingly.

## Personal finance

Separate recurring income and spending from irregular items, transfers, and debt principal. Build a budget around cash timing as well as monthly totals. Distinguish gross from take-home income and accessible savings from restricted assets.

For debt comparisons, include balances, effective rates, minimum payments, fees, rate resets, and prepayment terms when available. Compare repayment strategies using consistent payment budgets and assumptions. For savings goals, show required contributions and sensitivity to returns, inflation, and timing without presenting assumed returns as guaranteed.

## Business finance

Distinguish revenue, profit, and cash. Reconcile beginning cash plus cash movements to ending cash; account for receivables, payables, inventory, capital expenditure, financing, and taxes when relevant. State whether results use cash or accrual accounting.

Define metrics before using them. Show contribution margin, break-even, runway, customer economics, or return on investment only where the inputs support those measures. Avoid annualizing seasonal or exceptional periods without explaining the assumption. Separate operating performance from one-time effects.

For forecasts, expose revenue and cost drivers, working-capital assumptions, and financing needs. Use a base case and meaningful downside/upside scenarios when uncertainty affects the decision. Vary the important drivers rather than applying an unexplained percentage to every line.

## Investment research and valuation

Distinguish verified facts, estimates, and judgments. Evaluate the investment thesis alongside risks, valuation, liquidity, concentration, fees, taxes, and currency exposure as relevant. Explain what evidence would weaken the thesis. Avoid unsupported price targets or claims of certain returns.

Compare like periods and compatible definitions. For valuation, make discount rates, growth assumptions, terminal value, net debt, and share count explicit as applicable. Show sensitivity when plausible assumptions materially change the result. Do not infer suitability from historical performance alone.

## Calculate and deliver

Use a calculator or code for material arithmetic. Check cash reconciliations, percentage denominators, debt balance roll-forwards, and scenario consistency where applicable. Keep intermediate precision and round displayed results appropriately. Match nominal versus real returns, monthly versus annual rates, and beginning versus end-of-period cash flows.

For requested workbook, notebook, or chart artifacts, use the relevant available artifact skill. Keep formulas traceable and separate inputs from outputs; include source notes and assumptions needed to reproduce the analysis. Do not create extra artifacts unless they help fulfill the request.

Lead with the finding, then show the supporting figures, assumptions, tradeoffs, and practical next action. Distinguish historical results from forecasts and avoid false precision. Surface only limitations that materially affect the decision.

Analysis does not authorize moving money, placing trades, applying for products, or changing financial accounts. Keep credentials and unnecessary identifiers out of reports and logs. Use existing task authorization only for the actions it actually covers.
