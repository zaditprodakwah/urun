# URUN: QUICK REFERENCE CARD
**Print this. Tape it to your monitor. Refer to it every single day.**

---

## THE 3 PILLARS (Your North Star)

```
┌─────────────────────────────────────────────────────────────┐
│  1. LOCAL DATA STEWARDSHIP                                  │
│     Community owns their data. Full stop.                   │
│     • Isolate by community_id (RLS at DB level)            │
│     • Right to export (anytime)                            │
│     • Right to delete (anytime)                            │
│     • NO external profiling/resale                         │
│                                                             │
│  2. COLLECTIVE EFFICIENCY                                   │
│     Reduce costs. Keep surplus in community.               │
│     • Collective Procurement is THE killer app             │
│     • 70% revenue → Community, 30% → URUN Ops              │
│     • Measure: "How much did warga save?"                  │
│     • NOT: "How many daily active users?"                  │
│                                                             │
│  3. HUMAN-CENTRIC RESILIENCE                               │
│     Tech serves humans, not vice-versa.                    │
│     • Works offline (or has offline fallback)              │
│     • Simple (accessible to low-literacy users)            │
│     • AI recommends, humans decide (for $)                 │
│     • Survives failures (redundancy, backups)              │
└─────────────────────────────────────────────────────────────┘
```

---

## THE 7 SACRED RULES (Don't Break These)

| # | Rule | Violates | Check |
|---|------|----------|-------|
| 1 | **RLS ≻ App Logic** | Pillar 1 | RLS policy blocks data, not just app code |
| 2 | **Ledger Immutable** | Pillar 2 | No DELETE/UPDATE; only INSERT or correction |
| 3 | **Data Minimization** | Pillar 1 | Only collect what's functionally necessary |
| 4 | **Reputation Deterministic** | Pillar 2 | Same event = same points, ALWAYS |
| 5 | **Multi-Sig Enforced** | Pillar 2 | >5M IDR needs 2-of-3 approval |
| 6 | **Fraud Detection Daily** | Pillar 2 | Run `reconcile_ledger.js` every day |
| 7 | **User Can Delete/Export** | Pillar 1 | Every user: right to portability + deletion |

---

## DECISION TREE: "Should We Build This?"

```
          FEATURE REQUEST
                 │
                 ▼
    ┌──────────────────────┐
    │ Does it strengthen   │
    │ any 3 Pillars?       │
    └──────────────────────┘
         /          │          \
       YES        MAYBE       NO
       │            │         │
       ▼            ▼         ▼
    PRIORITY      Step 2    LOWER
    FEATURE       Below     PRIORITY
       │
       ▼
    ┌──────────────────────────┐
    │ Violate any operational  │
    │ constraint?              │
    │ (7 Sacred Rules)         │
    └──────────────────────────┘
         /            \
       NO            YES
       │              │
       ▼              ▼
    BUILD IT    ❌ REJECT or
                 REDESIGN
```

---

## OPERATIONAL CHECKLIST (Daily)

**Before you commit code, ask yourself:**

- [ ] **Data:** What data am I touching? Is RLS policy covering it? Can user delete/export?
- [ ] **Ledger:** Am I modifying ledger? (Should be INSERT-only) 
- [ ] **Reputation:** Am I changing a score? (Is it deterministic? Logged?)
- [ ] **External:** Am I calling an external service? (Does it have DPA? What data?)
- [ ] **Rollback:** If this breaks, how do I fix it in <5 minutes?
- [ ] **Audit Trail:** Is this change logged? (Git + compliance_log)
- [ ] **Pillar Check:** Does this strengthen or weaken the 3 pillars?

---

## RED FLAGS (If You See These, Stop & Ask)

```
🚨 "We need Google Analytics to understand user behavior"
   → Use internal analytics + differential privacy instead

🚨 "Let's add gamification with random rewards"
   → Rule 4 violation: Reputation MUST be deterministic

🚨 "User wants to modify a transaction they already completed"
   → Rule 2: Ledger is immutable, use correction entry instead

🚨 "Can we sell affiliate data to marketplace?"
   → Rule 3: Data minimization. Only share what's needed.

🚨 "Large tender approved, no need for 2-sig approval"
   → Rule 5: Multi-sig ENFORCED, not optional

🚨 "We'll delete this user's data to save storage"
   → Rule 7: User can request deletion, but must follow process

🚨 "Fraud detection will run when we suspect something"
   → Rule 6: Run DAILY, not on-demand

🚨 "Let's make reputation retroactive based on new formula"
   → Before touching historical scores: Bug fix + community vote required
```

---

## EXTERNAL SERVICE DECISION FLOW

```
Want to integrate [Service X]?

1. Does [Service] need [Data Y] to work?
   NO  → Don't send it
   YES → Go to 2

2. Can we provide the function WITHOUT [Data Y]?
   YES → Do it that way (minimal data)
   NO  → Go to 3

3. Will [Service] contractually promise NOT to profile/resell?
   NO  → REJECT feature
   YES → Go to 4

4. Can users DELETE or EXPORT [Data Y]?
   NO  → REJECT feature
   YES → Get DPA signed, proceed

5. Before go-live: Test in staging, get founder approval
```

---

## DATABASE RLS (Row-Level Security)

**RLS is MANDATORY. Database enforces, NOT application.**

```sql
-- Every SELECT:
RLS policy checks: Is user_id in this community_id?
If NO → Query returns empty set (database blocks it)
If YES → Query succeeds

-- Every INSERT/UPDATE:
RLS policy checks: Can this user write to this community_id?
If NO → Error (database blocks it)
If YES → Allowed

-- Test this:
try {
  const hacker = await db
    .from('ledger')
    .select('*')
    .eq('community_id', 'OTHER_COMMUNITY')
    .single();
  
  // SHOULD ERROR: row-level security
  assert(hacker.error.message.includes('row-level'));
}
```

---

## REPUTATION SCORING (Single Source of Truth)

```
Activity               │ Points │ Condition
──────────────────────┼────────┼──────────────────────────
Transaction Complete  │  +5    │ ledger.status = COMPLETED
Tender Participation  │  +3    │ Subscribed + paid share
On-Time Completion    │  +3    │ Settled before deadline
Referral Successful   │  +2    │ Referred user 1st txn
Violation Detected    │ -10    │ Fraud detected
Late Payment          │  -3    │ Missed settlement deadline

RULES:
✓ Deterministic (same event = same points)
✓ Auditable (logged in interaction_log with reason)
✓ Transparent (user notified with details)
✓ Anti-gaming (no self-dealing, velocity limits)
```

---

## LEDGER IMMUTABILITY

```
Ledger Table = "Book of Truth"

┌─ INSERT (✓ Always allowed for treasurers)
│  New transaction: INSERT ledger_entry
│
├─ UPDATE (✗ NEVER)
│  Error: "Ledger is immutable"
│
├─ DELETE (✗ NEVER)
│  Error: "Ledger is immutable"
│
└─ Correction (✓ If error found)
   INSERT new entry marked: is_correction = true
   Reference original: corrects_entry_id = [original_id]
   Example: "Transaction TXN_001 reversed: price was wrong"
```

---

## STATE MACHINES (Know These by Heart)

```
COLLECTIVE PROCUREMENT:
  DRAFT → PUBLISHED → SUBSCRIBING → CLOSED → FULFILLED → SETTLED
     ↓          ↓            ↓          ↓
   (Create)   (Public)  (Join)    (Deadline)
   
   (Can also go: → CANCELLED, → EXPIRED, → DISPUTE)

MULTI-SIG APPROVAL:
  PENDING → AWAITING_SIGNER_2 → AWAITING_SIGNER_3 → APPROVED → EXECUTED
     ↓                                            ↓
  (Request)                                  (Transaction executes)
  
  (Can also go: → REJECTED, → TIMEOUT)

USER JOURNEY:
  SIGNUP → PROFILE_COMPLETE → VERIFIED → ACTIVE
     ↓                                    ↓
  (Email confirm)                    (Can transact)
  
  (Can also go: → SUSPENDED (violation), → DELETED (user request))
```

---

## WHAT TO LOG (Audit Trail)

```
interaction_log:
├─ Every reputation change (why? trigger? reference?)
├─ Every ledger entry (user? amount? description?)
├─ Every multi-sig approval (who? for what? timestamp?)
├─ Every tender state change (PUBLISHED? SETTLED? by whom?)
└─ Every external service call (what data sent? response time?)

audit_log:
├─ Data access (who viewed what, when, why?)
├─ Role changes (user promoted from member → treasurer)
├─ System health (backup success? RLS test passed?)
├─ Compliance events (user deletion, data export request)
└─ Security alerts (fraud detected, IP anomaly, etc)

compliance_log:
├─ Algorithm changes (what changed? when? why?)
├─ User counts (this month's active users)
├─ Revenue (affiliate, fees, donations)
├─ Regulatory (PSE registration status, PDP compliance)
└─ Incidents (downtime, data issues, security)
```

---

## COMMON MISTAKES (Don't Make These)

| Mistake | Problem | Fix |
|---------|---------|-----|
| Checking `user_id` in code to protect data | App logic can have bugs | Use RLS policy at database level |
| Updating ledger amount to correct error | Breaks immutability | Insert correction entry instead |
| Sending all user data to analytics tool | Data extraction violation | Use internal + differential privacy |
| Random bonuses for reputation | Violates determinism | Must be rule-based, auditable |
| Single approval for large tender | No guardrail | Require multi-sig (2-of-3) |
| Checking fraud weekly | Might miss it | Run daily reconciliation |
| No way for user to delete account | Violates PDP | Implement deletion + anonymization |

---

## FIRST WEEK TASKS

- [ ] Read `03_URUN_MASTER_SYSTEM_PROMPT.md` (20 minutes)
- [ ] Print this card, stick on monitor
- [ ] Review `01_URUN_AUDIT_REPORT.md` (30 minutes)
- [ ] Ask clarifying questions on ambiguous parts
- [ ] Setup database schema with RLS policies
- [ ] Write RLS policy tests
- [ ] Build Phase 1 skeleton (no business logic yet)

---

## WHEN YOU'RE STUCK

```
"Is this feature allowed?"
→ Does it strengthen a Pillar?
→ Does it violate a Sacred Rule?
→ Ask founder if unsure

"Should I add this optimization?"
→ Does it break immutability or RLS?
→ Does it remove audit trail?
→ If YES to either → Don't do it

"Can we use [external service]?"
→ Follow decision flow above
→ Default: Don't share unless necessary

"Did we get this right?"
→ Read the Master Prompt section: "Daily Standup Questions"
→ Did you check all 4?
```

---

## YOUR MANTRA

> **Community > Growth**  
> **Simplicity > Cleverness**  
> **Transparency > Speed**  
> **Data stays in, defaults to No**

---

## QUICK LINKS

- **Full documentation:** URUN_MASTER_SYSTEM_PROMPT.md (context)
- **Detailed audit:** URUN_AUDIT_REPORT.md (gaps + findings)
- **Refinements:** URUN_REFINED_SECTIONS.md (copy-paste ready)
- **Project scope:** EXECUTIVE_SUMMARY.md (timeline + priorities)

---

**Print this. Memorize this. Live this.**

*The three pillars and seven sacred rules are not suggestions. They are constraints that URUN cannot violate without losing its soul.*

**Now build something beautiful. 🚀**
