# URUN REFINED DOCUMENTATION SECTIONS
**Purpose:** Provides exact redactions & additions for critical ambiguities  
**Format:** Show | Current Text → Suggested Replacement

---

## TIER 1: CRITICAL REFINEMENTS

### **REC-1: Doc 20 (Rules for AI) - Add "Sovereignty Definition"**

**Location:** Doc 20, Section I after "The URUN Constitution"

**Current:** (Missing - only abstract definition)

**Add this section:**

```markdown
### **Operational Definition: "Data Sovereignty"**

To prevent ambiguity during implementation, here's how to determine 
if a technical decision respects URUN's Sovereignty principle:

#### ✅ **ALLOWED - Data Co-Stewardship**

A third-party service may receive community data IF:

1. Data is **functionally necessary** for the service to operate
   - Example ✅: Payment gateway needs (transaction_id, amount, currency, timestamp)
   - Example ✅: SMS gateway needs (phone_number, message_content)
   - Example ❌: Analytics service needs (user_id, click_behavior, time_spent)

2. Data **minimization principle** is applied
   - Service receives ONLY what's needed, nothing more
   - No "just in case" data sharing
   - Example: Email service receives (email, subject, body) 
     but NOT (user_id, user_location, user_age)

3. Service **explicitly contracts** to NOT use data for:
   - Profiling, analytics, resale
   - Training external ML models
   - Cross-referencing with other users' data
   - Retention beyond necessary period
   
   This is enforced via Data Processing Agreement (DPA) with penalties 
   for breach.

4. Community data is **recoverable** (right to deletion, right to export)
   - User can request all their data in standard format (JSON)
   - User can request deletion (with anonymization as fallback)
   - Community can export full dataset anytime (no vendor lock-in)

#### ❌ **NOT ALLOWED - Data Extraction**

Any feature where external services receive data for profiling/behavioral 
analytics is REJECTED, even if "optional" or "consented."

Examples of rejected patterns:
- ❌ Full Google Analytics tracking (behavioral profiling)
- ❌ Sending user_id to advertising networks
- ❌ "Anonymous" usage analytics sold to third parties
- ❌ Marketplace integration without explicit product-only clause

#### **Decision Flow for AI**

When implementing an integration:

```
1. ASK: "Does [external service] NEED [data X] to provide [function Y]?"
   - If NO → Don't send
   - If YES → Go to 2
   
2. ASK: "Is there a way to provide [function Y] WITHOUT [data X]?"
   - If YES → Do it that way (minimal data)
   - If NO → Go to 3
   
3. ASK: "Can we contractually guarantee [external service] won't 
   use [data X] for profiling/resale?"
   - If YES → Require DPA with penalty clause, proceed
   - If NO → REJECT feature, propose alternative
   
4. ASK: "Can users DELETE or EXPORT all [data X]?"
   - If NO → REJECT feature
   - If YES → Document deletion/export process, proceed
   
5. IMPLEMENT: Audit external service's privacy policy + SoC2 
   certification before go-live.
```

---

### **REC-2: Doc 02 (Business Model) - Add "Revenue Allocation Matrix"**

**Location:** Doc 02, Section II after "Hybrid Revenue Portfolio"

**Current:** 
```
"Hybrid Revenue Portfolio" mencakup: Freemium model, komisi transaksi, 
dan affiliate.
```

**Replace with:**

```markdown
### **Revenue Allocation Matrix (Complete Transparency)**

URUN menghasilkan revenue dari 4 sumber. Setiap rupiah WAJIB dialokasikan 
dengan eksplisit:

| Revenue Source | Amount Example | Split | Destination | Rationale |
|---|---|---|---|---|
| **Affiliate Commission** | Marketplace (Tokopedia, Shopee) memberikan komisi 2% dari penjualan | 70% URUN Ops 30% Community | Community Treasury | Community bearing the risk; URUN covers infrastructure |
| **Tender Platform Fee** | Komunitas membayar 5% dari nilai tender untuk platform | 95% Community 5% URUN Ops | Community (as savings/reinvestment) | Fees are savings mechanism; Community owns surplus |
| **Premium Features** | Communities can opt-in analytics dashboard (Rp 50k/month) | 80% Community 20% URUN | Community (direct subscription revenue) | Community monetization of own data |
| **Donation/Grant** | Grants dari Kemitraan sosial | 100% URUN Ops (with transparency) | URUN Sustainability Fund | Growth & maintenance funding |

#### **Ledger Encoding**

SEMUA revenue transactions WAJIB tercatat di ledger dengan explicitness:

```sql
INSERT INTO ledger (
  community_id,
  account_code,
  description,
  amount_idr,
  direction
) VALUES (
  'COM_001',
  'revenue:affiliate:tokopedia',
  'Tokopedia affiliate komisi (70% community, 30% ops)',
  150000,
  'CREDIT' -- Community Treasury
);

INSERT INTO ledger (
  community_id,
  account_code,
  description,
  amount_idr,
  direction
) VALUES (
  'COM_001',
  'expense:urun_ops:infrastructure',
  'URUN operational allocation (30% dari affiliate)',
  65000,
  'DEBIT' -- URUN Ops
);
```

#### **Transparency Requirement**

- Community leader dapat akses ledger untuk lihat SEMUA revenue/allocation
- Dashboard menampilkan: "Bulan ini, affiliate revenue Rp X masuk ke treasury, 
  Rp Y untuk URUN operations"
- Quarterly report otomatis dikirim ke community leader
- Founder publishes aggregate dashboard (anonymized) di public website
```

---

### **REC-3: Doc 12 (Protocol Spec) - Add "RLS Policy Enforcement" Sub-section**

**Location:** Doc 12, Section II after "Authentication & Authorization"

**Add this section:**

```markdown
### **Row-Level Security (RLS) Policy Enforcement**

URUN's "Data Isolation by community_id" adalah CRITICAL SECURITY CONTROL. 
RLS WAJIB di-enforce di database level (bukan application level), 
untuk memastikan bahkan bug dalam aplikasi tidak dapat bypass data isolation.

#### **RLS Policies (Supabase/PostgreSQL)**

```sql
-- Policy 1: Users can only view their own profile
CREATE POLICY "user_profile_self_access"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy 2: Users can only view ledger entries dari communities mereka
CREATE POLICY "ledger_community_access"
  ON ledger
  FOR SELECT
  TO authenticated
  USING (
    community_id IN (
      SELECT community_id 
      FROM community_members 
      WHERE user_id = auth.uid() 
      AND status = 'active'
    )
  );

-- Policy 3: Only community treasurer can INSERT ledger
CREATE POLICY "ledger_insert_treasurer_only"
  ON ledger
  FOR INSERT
  TO authenticated
  WITH CHECK (
    community_id IN (
      SELECT community_id 
      FROM community_members 
      WHERE user_id = auth.uid() 
      AND role IN ('treasurer', 'admin', 'founder')
      AND status = 'active'
    )
  );

-- Policy 4: Ledger entries are IMMUTABLE (no UPDATE/DELETE)
-- (Enforce via trigger, not RLS - any attempt to modify 
-- should raise error: "Ledger is immutable. Use correction entry instead.")
```

#### **Cross-Community Access (Founder/Admin)**

Founder dapat VIEW data semua communities, tapi hanya untuk:
- Aggregate analytics (via federated learning, NOT direct access)
- Compliance audit (dengan logging setiap akses)
- Incident investigation (dengan approval trail)

```sql
-- Policy: Super-admin can view all data (dengan audit logging)
CREATE POLICY "super_admin_audit_access"
  ON ledger
  FOR SELECT
  TO authenticated
  USING (
    -- Check if user is super_admin
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'super_admin'
    -- AND log this access to audit_log
    AND EXISTS (
      INSERT INTO audit_log (
        accessed_by, 
        accessed_table, 
        accessed_resource_id, 
        timestamp, 
        reason
      ) 
      VALUES (auth.uid(), 'ledger', id, now(), 'super_admin_audit')
    )
  );
```

#### **Role Revocation & Immediate Access Removal**

Ketika komunitas member di-remove (misal: pengurus keluar), 
access HARUS di-revoke IMMEDIATELY:

```sql
-- Trigger: When community_member status = 'inactive', 
-- revoke their session
CREATE TRIGGER revoke_access_on_removal
  AFTER UPDATE ON community_members
  FOR EACH ROW
  WHEN (NEW.status = 'inactive' AND OLD.status = 'active')
  EXECUTE FUNCTION revoke_user_sessions(NEW.user_id);
```

#### **Audit Trail**

SEMUA data access (terutama cross-community) WAJIB di-log:

```
audit_log table:
- accessed_by (user_id)
- accessed_table (table_name)
- accessed_records (count)
- timestamp
- reason (SELECT, INSERT, UPDATE, DELETE)
- community_id (for context)

Retention: 12 months minimum
```

#### **Testing & Validation**

AI Coder WAJIB test RLS policies:
1. User A TIDAK bisa lihat ledger komunitas B
2. User dengan role 'member' TIDAK bisa INSERT ledger
3. Even jika aplikasi bug, database RLS harus block
4. Founder akses tercatat di audit_log setiap kali

```javascript
// Example test (Jest)
test('RLS: Member cannot view other community ledger', async () => {
  const { data, error } = await supabase
    .from('ledger')
    .select('*')
    .eq('community_id', 'other_community_id')
    .single();
  
  expect(error?.message).toContain('row-level security');
  expect(data).toBeNull();
});
```
```

---

### **REC-4: Doc 12 (Protocol Spec) - Add "Collective Procurement Workflow"**

**Location:** Doc 12, Section III (after API Endpoints) add new section

**Add this section:**

```markdown
### **Collective Procurement Workflow (End-to-End)**

Collective Procurement adalah core value proposition URUN. 
Workflow berikut mendeskripsikan state machine lengkap, 
termasuk payload, notifications, dan edge cases.

#### **State Diagram**

```
[DRAFT] → [PUBLISHED] → [SUBSCRIBING] → [CLOSED] → [FULFILLED] → [SETTLED]
   ↓          ↓            ↓              ↓           ↓             ↓
 (Pengurus)  (Public)   (Warga join)  (Deadline)  (Supplier)   (Payment)
   
Possible dead-ends:
[DRAFT] → [CANCELLED] (if pengurus cancels)
[PUBLISHED] → [EXPIRED] (if deadline passed without min qty)
[FULFILLED] → [DISPUTE] (if delivery issue)
```

#### **State Transitions**

**1. DRAFT → PUBLISHED**

Trigger: Pengurus calls `POST /api/tenders/create`

Request payload:
```json
{
  "community_id": "COM_001",
  "title": "Minyak Goreng Kolektif",
  "description": "Beli minyak goreng 100L untuk RT/RW",
  "target_quantity": 100,
  "unit": "liter",
  "deadline_date": "2026-05-28",
  "min_participants": 5,
  "estimated_unit_price": 15000,
  "created_by": "user_123"
}
```

Response:
```json
{
  "tender_id": "TND_001",
  "state": "DRAFT",
  "created_at": "2026-05-20T10:00:00Z"
}
```

Action:
- Save to `tenders` table with `state = 'DRAFT'`
- No notification yet (internal only)

---

**2. DRAFT → PUBLISHED**

Trigger: Pengurus calls `POST /api/tenders/{tender_id}/publish`

Preconditions:
- Pengurus has role 'treasurer' or 'admin'
- Tender must have: title, description, quantity, deadline
- Deadline must be > 48 hours from now

Action:
- Update tender `state = 'PUBLISHED'`
- Insert into `tender_timeline` (audit trail)
- Send webhook: `tender.published`
- Notify all community members: "Tender baru: [Title]"

Response:
```json
{
  "tender_id": "TND_001",
  "state": "PUBLISHED",
  "published_at": "2026-05-20T10:15:00Z"
}
```

Notification payload:
```json
{
  "type": "tender.published",
  "tender_id": "TND_001",
  "title": "Minyak Goreng Kolektif",
  "deadline": "2026-05-28",
  "community_id": "COM_001",
  "timestamp": "2026-05-20T10:15:00Z"
}
```

---

**3. PUBLISHED → SUBSCRIBING**

Trigger: Warga calls `POST /api/tenders/{tender_id}/subscribe`

Request:
```json
{
  "tender_id": "TND_001",
  "quantity": 10,  // How many liters this user wants
  "notes": "Rumah, Jl. Merdeka 123"
}
```

Action:
- Insert into `tender_subscriptions` table
- Check: Cumulative qty <= target_qty
  - If YES: state remains SUBSCRIBING, update `current_qty`
  - If NO: return error (qty overflow) or suggest waitlist
- Increment `subscription_count`
- Log to `interaction_log` (for reputation calculation later)

Response:
```json
{
  "subscription_id": "SUB_001",
  "tender_id": "TND_001",
  "quantity": 10,
  "status": "confirmed",
  "current_coverage": "65%",  // (qty_subscribed / target_qty)
  "subscribed_at": "2026-05-21T08:30:00Z"
}
```

Notification:
- Notify pengurus: "[User] subscribe 10L, total coverage now 65%"
- Notify all subscribers: "Coverage update: 65%, target 100%"

Edge case: If `min_participants` not met by deadline, tender auto-expires.

---

**4. SUBSCRIBING → CLOSED**

Trigger: Deadline passed OR Pengurus manually closes

Check 1: `current_qty >= target_qty`
- If YES → Proceed to FULFILLED
- If NO and `current_qty >= min_qty_for_proceed` → Proceed with reduced qty
- If NO and `current_qty < min_qty_for_proceed` → EXPIRED (dead-end)

Action:
- Update tender `state = 'CLOSED'`
- Lock all further subscriptions
- Insert into `tender_timeline`

Notification:
- All subscribers: "Tender closed. Coverage: 80%. Proceeding to fulfillment."

---

**5. CLOSED → FULFILLED**

Trigger: Pengurus manually confirms supplier & delivery details

Request:
```json
{
  "tender_id": "TND_001",
  "supplier_id": "SUP_001",
  "total_price_idr": 1500000,  // 100L × 15k
  "delivery_date": "2026-05-29",
  "delivery_location": "RT 01 Community Center"
}
```

Action:
- Validate: `total_price_idr` matches (current_qty × estimated_unit_price) ±10%
- Create `tender_order` (links tender → supplier)
- Update `state = 'FULFILLED'`
- Create ledger entry: `DEBIT community_treasury, CREDIT payable:supplier`

Ledger entry:
```
{
  "community_id": "COM_001",
  "account_code": "expense:collective:groceries",
  "description": "Minyak Goreng Kolektif TND_001 - Supplier SUP_001",
  "amount_idr": 1500000,
  "direction": "DEBIT",
  "tender_id": "TND_001",
  "status": "PENDING_DELIVERY"
}
```

Notification:
- All subscribers: "Order confirmed. Delivery on 2026-05-29 at Community Center"

---

**6. FULFILLED → SETTLED**

Trigger: Pengurus confirms delivery received & quality OK

Request:
```json
{
  "tender_id": "TND_001",
  "delivery_confirmed": true,
  "quality_notes": "All items received, good condition",
  "actual_total_paid": 1500000
}
```

Action:
- Update tender `state = 'SETTLED'`
- Update ledger: `expense:collective:groceries` status = 'COMPLETED'
- Calculate per-person share (total_price / subscribers)
- Insert `tender_settlement` record

Settlement calculation:
```
Total cost: 1,500,000 IDR
Total qty delivered: 100L
Subscribers: 10 users
Per-unit cost: 1,500,000 / 100 = 15,000 IDR

User settlements:
- User A: 10L × 15k = 150,000 IDR
- User B: 5L × 15k = 75,000 IDR
- etc.
```

- Distribute settlement notifications to each user
- Award reputation: +3 pts to all subscribers (for participating)
- Award reputation: +5 pts to pengurus (for completing on-time)

Notification:
- All subscribers: "Tender complete! Your share: Rp 150,000. 
  You earned +3 reputation points."

---

**7. Error Cases & Edge Cases**

**Case: Tender min_qty not met**
- Auto-transition: SUBSCRIBING → EXPIRED (at deadline)
- All subscriptions refunded
- Notification: "Tender expired. Not enough participants."
- Reputation: NOT awarded (since didn't complete)

**Case: Supplier fails delivery**
- Pengurus can transition: FULFILLED → DISPUTE
- Notification: Founder + community leader for manual intervention
- Settlement frozen (pending resolution)

**Case: User wants to un-subscribe**
- Only allowed if tender still in PUBLISHED state
- After deadline: Cannot un-subscribe (committed)

**Case: Price change before fulfillment**
- Pengurus can adjust: +/- 10% acceptable without re-voting
- Beyond 10%: Requires community vote

---

#### **Notification Matrix**

| Event | Who Notified | Channel | Payload |
|-------|------|---------|---------|
| Tender Published | All members | WhatsApp/Dashboard | tender_id, title, deadline, link |
| New Subscriber | Pengurus | Dashboard | subscriber name, qty |
| Coverage Update | All subscribers | Dashboard | current %, target % |
| Tender Closed | All subscribers | WhatsApp | "Proceeding to fulfillment" |
| Delivery Confirmed | All subscribers | WhatsApp | delivery_date, location, your_share_idr |
| Settlement Complete | Each subscriber | WhatsApp | "Your share: Rp X, reputation +3" |
| Tender Expired | All who subscribed | WhatsApp | "Not enough participants, refunded" |

---

#### **Timeouts & Auto-Transitions**

```
Tender PUBLISHED for 7 days
├─ After day 7: Auto-transition to CLOSED (deadline)
│  └─ If min_qty met: Proceed to fulfillment
│  └─ Else: Auto-transition to EXPIRED
└─ Pengurus can manually extend deadline (+3 days, max once)

After FULFILLED, pengurus has 3 days to confirm delivery
├─ After 3 days: Alert pengurus (daily reminder)
└─ After 10 days without confirmation: Auto-escalate to Founder
```

#### **API Endpoints for Workflow**

```
POST /api/tenders                   # Create tender (DRAFT)
POST /api/tenders/{id}/publish      # Publish tender
POST /api/tenders/{id}/subscribe    # Subscribe to tender
POST /api/tenders/{id}/close        # Close subscription period
POST /api/tenders/{id}/fulfill      # Confirm order (FULFILLED)
POST /api/tenders/{id}/settle       # Confirm delivery (SETTLED)
GET  /api/tenders/{id}/status       # Get tender state + metadata
GET  /api/tenders?state=PUBLISHED   # List all active tenders
```
```

---

### **REC-5: Doc 22 (Algorithm Spec) - Consolidate & Expand Reputation Scoring**

**Location:** Doc 22, Section II, replace entire "Reputation Engine" section

**Current:** (Scattered across multiple docs, inconsistent)

**Replace with:**

```markdown
### **Reputation Engine Specification (The Definitive Reference)**

Reputation adalah CORE MECHANIC di URUN untuk:
1. Building trust (who's reliable?)
2. Access control (can they submit large tenders?)
3. Growth incentive (positive reinforcement for participation)

Reputation score (`profiles.reputation_score`) WAJIB dimulai dari **0** 
(setiap user baru). HANYA aktivitas terverifikasi yang menambah/mengurangi score.

#### **Reputation Scoring Matrix (Authoritative)**

| Activity | Points | Condition | Trigger | Who Audits |
|----------|--------|-----------|---------|-----------|
| **First Transaction Completed** | +5 | ledger.status = 'COMPLETED' | ledger_change trigger | interaction_log |
| **Tender Participation** | +3 | Subscribed + Settled (paid share) | tender settlement | interaction_log |
| **On-Time Tender Completion** | +3 (bonus) | Settled before deadline | tender state machine | interaction_log |
| **Referral Successful** | +2 | Referred user completes 1st txn | user signup flow | interaction_log |
| **Marketplace Review** | +1 | User leaves honest review on product | review_interaction trigger | interaction_log |
| **Community Vote (Yes)** | +1 | Participated in community vote | voting system | interaction_log |
| **Violation Detected** | -10 | Fraud, double-spending, spam | reconcile_ledger.js | interaction_log |
| **Late Payment** | -3 | Missed tender settlement deadline | tender state machine | interaction_log |
| **Account Dispute** | -5 | User disputes transaction (if resolved against them) | dispute resolution | interaction_log |

**Note on Viral Bonus:**
- When tender reaches 100% funding early, all subscribers get +1 bonus point
- Recorded as: `interaction_log.trigger_type = 'viral_bonus'`

#### **Calculation & Update Flow**

```
┌─ Event occurs (transaction completed)
│
├─ Trigger fires: ledger_change
│  ├─ Check: transaction status = COMPLETED?
│  ├─ Look up: Relevant reputation rule
│  ├─ Add: X points to profiles.reputation_score
│  └─ Record: Entry in interaction_log
│
├─ interaction_log entry includes:
│  ├─ user_id
│  ├─ action_type (e.g., 'transaction_completed')
│  ├─ points_awarded (+5)
│  ├─ trigger_type (e.g., 'ledger_change')
│  ├─ reference_id (e.g., ledger.id)
│  ├─ timestamp
│  └─ is_verified (boolean - was audit passed?)
│
└─ User notified:
   "You earned +5 reputation points for completing transaction [TXN_123]"
```

#### **Determinism & Transparency**

✅ ALL reputation changes MUST be:
1. **Deterministic** - Same event = Same points (no randomness/gacha)
2. **Auditable** - Logged in interaction_log with reference_id
3. **Notified** - User gets SMS/notification explaining why
4. **Reversible** - If audit reveals fraud, points can be reversed 
   (with log entry: `is_reversed = true`)

Example notification:
```
"Anda mendapatkan +5 poin karena menyelesaikan transaksi TXN_001. 
Lihat detail: [link]"
```

#### **Anti-Gaming Rules**

To prevent reputation manipulation, the following are BLOCKED:

1. **Self-dealing**
   - User A CANNOT earn points by transacting with User A
   - Check: `sender_user_id != receiver_user_id`

2. **Transaction Velocity**
   - Maximum 10 transactions per hour per user
   - If exceeded: Block + Flag for fraud review

3. **Duplicate Subscriptions**
   - User cannot subscribe to same tender twice
   - Check: SELECT * FROM tender_subscriptions 
     WHERE user_id = X AND tender_id = Y

4. **IP/Device Abuse**
   - 5+ accounts from same IP: Flag all as potential fraud
   - Check: Cron job reconcile_ledger.js runs daily
     ```sql
     SELECT ip_address, COUNT(DISTINCT user_id) as account_count
     FROM audit_log
     GROUP BY ip_address
     HAVING account_count > 5
     ```

#### **Reputation Thresholds & Access Control**

Reputation unlocks features:

| Threshold | Unlocked Privilege | Rationale |
|-----------|-------------------|-----------|
| 0 (all users) | View public catalog, subscribe to tenders | No barriers |
| 10 | Create small tender (<Rp 5 juta) | Proof of reliability |
| 30 | Create medium tender (Rp 5-50 juta) | Higher trust |
| 100 | Create large tender (Rp 50 juta+) OR become "Trusted Supplier" | Significant trust |
| -5 (violation) | Suspended (24 hours) | Violation cooldown |
| -20+ | Banned (requires founder approval to lift) | Serious abuse |

#### **Reputation Recalculation (When Rules Change)**

If reputation rules change (e.g., "+5 pts" → "+2 pts"), 
here's the process:

1. **Proposed Change:**
   - Document: What changed, why, expected impact
   - Impact analysis: How many users affected? By how much?

2. **Testing (2 weeks staging):**
   - Run simulation with new rules on production data
   - Compare: Old score vs New score
   - Get founder sign-off

3. **Announcement:**
   - Notify all affected users 2 weeks before
   - Explain rationale: "We're recalibrating points to better reflect contribution"
   - Allow objection period (1 week)

4. **Implementation Options:**

   **Option A: Only apply to new transactions (going forward)**
   - Simpler, no recalculation needed
   - Old users keep old scores

   **Option B: Retroactive recalculation (if bug-fix only)**
   - User scores recalculated to match new rules
   - Example: "Reputation audit reveals overpaying points; 
     correcting now"
   - Requires community vote (>50% approval)
   - Each affected user gets notification + adjustment details

5. **Audit Trail:**
   - Log in compliance_log: 
     - What changed
     - When
     - Rationale
     - Before/after metrics
     - Affected users (anonymized count)

#### **Reporting & Dashboard**

Community leader can access:
```
Reputation Dashboard:
├─ Leaderboard: Top 10 contributors (by reputation)
├─ Activity: Recent reputation-granting actions
├─ Threshold Analysis: "X users at 10pts, Y at 30pts" (histogram)
├─ Fraud Alerts: "Z accounts flagged for suspicious pattern"
└─ Exports: CSV of reputation ledger (for audit)
```

Founder can access:
```
Founder Analytics:
├─ Aggregate: Total reputation score distribution (all communities)
├─ Trends: "Avg reputation increasing? Decreasing?"
├─ Anomalies: "Community X has unusual score pattern"
└─ Policy Impact: "New rule impact analysis"
```
```

---

## TIER 2: HIGH PRIORITY REFINEMENTS

### **REC-6: Doc 00 (Roadmap) - Clarify PSE Registration Timing**

**Location:** Doc 00, Section II, Phase 1

**Current:**
```
1. **Database Provisioning:** ...
2. **Core Schema Deployment:** ...
3. **Auth & Identity:** ...
4. **Compliance Setup:** Registrasi PSE (Komdigi) dan implementasi Privacy Policy
```

**Replace with:**

```markdown
### **Phase 1: The Sovereign Core (Infrastructure & Database)**

**Timeline: 0-6 months**

**Important:** This phase is PRE-PRODUCTION. No production user data.

#### **Phase 1A: Foundation (Month 0-3)**

1. **Database Provisioning:** Setup Supabase dengan kebijakan RLS (Row-Level 
   Security) untuk isolasi community_id.
2. **Core Schema Deployment:** Implementasi tabel communities, profiles, 
   catalog_items, dan ledger.
3. **Auth & Identity:** Integrasi Supabase Auth dengan penyesuaian untuk 
   identitas komunitas.
4. **Legal Preparation:** 
   - Draft Privacy Policy & Terms of Service
   - Internal audit: Is URUN a "Platform" per PDP UU 27/2022?
   - Identify data types collected (personal, financial, behavioral)

#### **Phase 1B: PSE Registration & Compliance (Month 3-6)**

*Prerequisite: Phase 1A must be complete*

5. **PSE Registration (Komdigi):**
   - Submit application ke Kementerian Komunikasi dan Informatika
   - Expected timeline: 2-3 bulan (no guarantee)
   - Requirements: 
     - Privacy Policy reviewed by legal counsel
     - Data center location compliance (must be in Indonesia)
     - Security incident response plan
     - Verification contact & responsible person

6. **Privacy & Security Controls:**
   - Implement: Data retention policies per PDP (max 12 months default)
   - Implement: User consent mechanisms & withdrawal option
   - Implement: Data deletion procedures
   - Implement: Encryption (in-transit TLS 1.3, at-rest AES-256)
   - Audit: Third-party SOC2 review of infrastructure

7. **Compliance Audit:** Final check against all requirements

#### **Phase 2: The Community Utility (MVP) - Only after PSE Approved**

*GATE: PSE registration MUST be completed before Phase 2 launch*

Status: MVP can launch ONLY after Phase 1B complete

If PSE registration delayed beyond 6 months:
- Option A: Continue development in staging (no production users)
- Option B: Request soft launch with limited communities 
  (Rp 10juta max transaction value)
- Option C: Delay Phase 2 until PSE approved

---

### **REC-7: Doc 22 (Algorithm Spec) - Add "Algorithm Evolution Protocol"**

**Location:** Doc 22, Section VI at end

**Add this section:**

```markdown
### **Algorithm Evolution & Safety Protocol**

Algorithms (reputation, recommendation, fraud detection) drive user behavior. 
Changes to algorithms can have significant community impact. This protocol 
ensures changes are safe, transparent, and reversible.

#### **When Algorithm Changes Are Needed**

1. **Bug Fixes** - Algorithm doesn't match specification
2. **Performance Issues** - Algorithm is too slow or expensive
3. **Fairness Issues** - Algorithm produces biased outcomes
4. **Feature Updates** - New rules based on community feedback

#### **Change Control Process**

**Step 1: Proposal (1 week)**

Document:
```
Title: [Name of Change]
Type: Bug fix / Performance / Fairness / Feature
Affected Algorithm: [reputation / recommendation / fraud-detection]
Current Behavior: [Describe current rule]
Proposed Behavior: [Describe new rule]
Rationale: [Why change needed?]
Expected Impact: [How many users? How much change?]
Rollback Plan: [How to revert if bad?]
```

Approval: Founder sign-off required

**Step 2: Testing (2 weeks)**

Run in staging environment:
- Simulate with production data (anonymized)
- Compare metrics: Old algorithm vs New algorithm
- Edge case testing
- Sample user feedback (optional)

Output: Impact report
```
Impact Report:
- % users whose score changes: X%
- Avg score change: +/- Y points
- Users gaining access (reputation threshold): Z
- Users losing access: W
- Performance improvement: (old latency) → (new latency)
```

Decision: Proceed → Announce? Or Reject → Why?

**Step 3: Announcement (2 weeks before)**

If proceeding:
- Public post: "URUN Algorithm Update on [Date]"
- What: Describe change in simple terms
- Why: Rationale
- Impact: "This affects X% of you. Your score might change Y points."
- Objection period: 1 week for community feedback
- Contact: How to reach us with concerns

**Step 4: Implementation (on scheduled date)**

Option A: **Gradual Rollout** (preferred)
- Deploy to 1% of traffic
- Monitor: error rates, latency, unintended consequences
- If OK → 10% → 50% → 100%
- Rollback at any stage

Option B: **Big Bang** (only if safe, low-risk)
- One-time deploy to all
- Monitor closely for 24 hours

**Step 5: Monitoring (post-deployment)**

First 24 hours:
- Alert: If error rate > 1%
- Alert: If latency increases > 20%
- Alert: If fraudsters exploit new algorithm

First 7 days:
- Collect user feedback
- Check: Is impact matching expectations?
- If major issues: Rollback

**Step 6: Reconciliation (if retroactive needed)**

If algorithm change needs retroactive application:

Allowed only if:
1. **Bug Fix** - Old algorithm was mathematically wrong
2. AND **Community votes** (>70% approval) to retroactively apply
3. AND **Each affected user** gets full explanation + ability to appeal

Process:
- Calculate old score vs new score for each affected user
- Send notification: "Your reputation was recalculated. 
  Old: X, New: Y. Read why: [link]"
- 1-week appeal period: Users can contest
- After 1 week: Apply changes to profiles.reputation_score

Audit:
- Log all recalculations in compliance_log
- Show: affected_users, old_total, new_total, timestamp

**Example:**

Date: 2026-06-01
Algorithm: Reputation Scoring
Change: "Tender completion bonus reduced from +3 to +1"
Reason: "Too generous; leading to reputation inflation"
Impact: ~40% of active users affected
Approved By: Founder
Users notified: 15 days before
Implementation: Gradual (1% → 100% over 24 hours)
Retroactive: NO (only applies to new tenders going forward)
```

---

### **REC-8: Doc 22 (Algorithm Spec) - Add "Multi-Sig Specification"**

**Location:** Doc 22, Section IV, expand with table

**Current:** (Too vague)

**Replace with:**

```markdown
### **Multi-Signature (Multi-Sig) Financial Guardrail**

For large transactions, URUN requires multiple approvers 
to prevent fraud & unauthorized spending.

#### **Multi-Sig Thresholds**

| Transaction Amount | Required Signers | Approval Timeout | Fallback |
|---|---|---|---|
| < Rp 5 juta | Single signature (Treasurer) | N/A | N/A |
| Rp 5-50 juta | 2 of 3 (Treasurer + 1 Witness) | 72 hours | Founder override (with full audit) |
| > Rp 50 juta | 2 of 3 + Community Vote (>50% approve) | 7 days | Extended discussion period |

Signers can only be: Treasurer, Admin, or designated Witness (all community members)

#### **Approval Workflow**

1. Treasurer initiates transaction (creates `multi_sig_request`)
2. System notifies signers: "Approval needed for Rp X transaction"
3. Signers review & approve/reject in dashboard
4. Once threshold met: Transaction executes automatically
5. If timeout: Transaction canceled, Treasurer notified

Ledger recording:
```
INSERT INTO multi_sig_request (
  transaction_id,
  amount_idr,
  requested_by,
  required_signers,
  approval_threshold,
  expires_at,
  status
) VALUES (...)

INSERT INTO multi_sig_approval (
  request_id,
  signer_user_id,
  approved_at,
  signature_proof  -- e.g., hash of approval
)
```

#### **Signer Management**

- Signers assigned by Community Leader (Founder/Admin)
- Signers must have reputation >= 10
- Can revoke immediately (access blocked)
- Audit: All signer changes logged

---

### **REC-9: Doc 22 (Algorithm Spec) - Expand "Federated Learning Spec"**

**Location:** Doc 22, Section III, expand significantly

**Current:** (Too vague - 3 paragraphs)

**Replace with:**

```markdown
### **Federated Trend Analysis (Privacy-Preserving Intelligence)**

URUN aggregates trends across communities WITHOUT exposing individual users. 
This enables founder to understand market movements, while respecting 
community privacy.

#### **What Trends Are Analyzed?**

1. **Price Trends**
   - Avg price per product category per region per month
   - Example: "Avg harga minyak goreng di Jawa Barat bulan Mei = Rp 15,200"
   - NOT tracked: "User X bought oil at Rp 15k"

2. **Demand Trends**
   - Frequency of tenders per category
   - Example: "Sembako tenders up 20% month-over-month"
   - NOT tracked: "User Y bought X tenders"

3. **Efficiency Trends**
   - Avg time-to-fulfillment per tender type
   - Participation rates (% of community that engages)
   - Example: "Avg tender fulfillment: 5 days"
   - NOT tracked: "User Z took X days"

4. **Reputation Trends**
   - Distribution of reputation scores (mean, median, percentiles)
   - NOT tracked: "User A has score X"

#### **Data Collection & Aggregation**

```
Individual Transaction
    ↓
Local SQL Aggregation (per community)
    ├─ SELECT AVG(price), COUNT(*) FROM purchases
    │  GROUP BY product_category, month
    │  (removes all user identifiers)
    │
└─ Result: Anonymized statistics (10+ communities minimum)
```

#### **Privacy Guarantee: Differential Privacy**

All trend queries use differential privacy to prevent re-identification.

```
Differential Privacy Rule:
- Aggregate data ONLY from 10+ communities (prevent exact identification)
- Add Laplace noise: epsilon = 0.5 (higher epsilon = more accuracy, less privacy)
- Never output: Individual user_id, community_id, IP address
- Only output: Aggregate stats (mean, count, percentile)

Example:
- Actual: [15000, 15200, 15100, 15050] (prices from 4 users)
- After Laplace noise: 15127 ± noise
- Output: "Avg price ≈ Rp 15,100 (with 95% confidence)"
```

#### **Output Dashboards**

**Founder Dashboard** (full aggregate view)
```
- National price trends (all regions)
- Demand patterns (what products are hot?)
- Efficiency benchmarks (best-performing communities)
- Anomalies (unusual patterns triggering investigation)

Access: Founder + Analytics team
Frequency: Weekly updated
```

**Community Dashboard** (regional view)
```
- Regional price benchmarks (your region vs national)
- Local demand trends
- Local efficiency (how fast are YOUR tenders?)

Access: Community leader + Treasurer
Frequency: Weekly updated
Note: Cannot see other communities' detailed data
```

**Public Dashboard** (anonymized, no identifying info)
```
- National price index (minyak, beras, etc)
- Seasonal trends
- Public insights about collective procurement

Access: Anyone (public website)
Frequency: Monthly updated
```

#### **Data Retention & Deletion**

```
Raw transaction data: 12 months
Aggregated statistics: 24 months
Audit logs: 36 months (for compliance)
```

If user requests deletion:
- Remove from future aggregation (going forward)
- DO NOT retroactively adjust past trends 
  (would reveal user identity)

#### **Audit & Transparency**

```
Federated Learning Audit Log:
- What trends were queried
- When
- Who requested
- Result (count of users in aggregate)
- Epsilon value used (privacy setting)

Published quarterly:
- "This quarter, X trend queries were run"
- "Y users' data contributed (anonymized)"
```

---

### **REC-10: Doc 30 (Maintenance) - Add Comprehensive Health Check Matrix**

**Location:** Doc 30, Section II, expand "Health Check Checklist"

**Current:** (List only)

**Replace with:**

```markdown
### **Health Check Ownership & SLA Matrix**

Each automated health check has clear ownership, alerting, and SLA:

| Script | Type | Frequency | Owner | Alert Recipients | P1 SLA | Automated Action |
|--------|------|-----------|-------|------------------|--------|------------------|
| **reconcile_ledger.js** | Validation | Daily 00:00 UTC | Cron (Lambda) | Founder Email + Slack | 1 hour | Block transactions if fail |
| **backup_community_data.js** | Backup | Daily 02:00 UTC | Cron (Backup system) | Founder Email | 2 hours | Retry 3x, then escalate |
| **detect_fraud_patterns.js** | Monitoring | Hourly | Cron (Lambda) | Admin Dashboard | 30 minutes | Flag suspicious accounts |
| **verify_rls_policies.js** | Security | Daily 03:00 UTC | Cron (Lambda) | Founder Email | 1 hour | Alert if policy violated |
| **check_api_latency.js** | Performance | Every 5 min | Monitoring (Datadog) | PagerDuty (critical) | 5 minutes | Auto-scale if >30% slow |
| **sync_reputation_scores.js** | Consistency | Every 15 min | Cron (Lambda) | Dashboard | 1 hour | Reconcile vs interaction_log |
| **audit_external_services.js** | Dependency | Daily 04:00 UTC | Cron (Lambda) | Founder Email | 4 hours | Mark service "degraded" |

#### **P1 vs P2 vs P3 Severity**

```
P1 (CRITICAL):
- Data loss risk (backup failed)
- Security breach (RLS policy down)
- Fraud active (cannot detect)
- Financial error (ledger mismatch)
→ SLA: 1 hour response (24/7)
→ Action: Immediate investigation, potential downtime acceptable

P2 (HIGH):
- Performance degraded (API > 1s)
- Non-critical feature broken
- Audit discrepancy (will catch up)
→ SLA: 4 hours response (business hours)
→ Action: Investigate + fix within 24 hours

P3 (MEDIUM):
- Low-impact bug
- Non-urgent feedback
- Documentation issue
→ SLA: 1 day response
→ Action: Fix in next release

P4 (LOW):
- Nice-to-have improvement
- Non-urgent feature request
→ SLA: 1 week
```

#### **Alert Escalation**

If no one responds:

```
T+0: Alert sent to Primary Owner
T+15 min: Alert re-sent + escalate to Secondary Owner
T+30 min (P1): Page on-call engineer
T+1 hour (P1): Founder gets SMS (not email)
T+2 hours (P1): Emergency action (may cause downtime)
```

---

### **REC-11: Doc 32 (Legal) - Add "Data Deletion & Anonymization" Procedure**

**Location:** Doc 32, Section III new sub-section

**Add:**

```markdown
### **User Offboarding & Data Deletion Process**

Per Indonesia's PDP UU 27/2022, users have Right to Deletion.

#### **User Initiates Deletion**

User calls `DELETE /api/account` with password confirmation.

System:
1. Flag account as `status = 'pending_deletion'`
2. Send email confirmation: "Click link to confirm deletion, or ignore to cancel"
3. **Cooling-off period: 7 days**
4. If user doesn't confirm: No deletion (account still active)
5. If user confirms: Proceed to permanent deletion

#### **Permanent Deletion (After 7 Days)**

System executes:

1. **PII Deletion** (completely removed)
   - profiles.name → NULL
   - profiles.email → NULL
   - profiles.phone → NULL
   - profiles.address → NULL
   - auth.users (Supabase) → Delete

2. **User ID Anonymization** (for audit trail)
   - Create mapping: original_user_id → "deleted_user_[hash]"
   - Replace all mentions in ledger: user_id → "deleted_user_[hash]"
   - Example:
     ```
     BEFORE: ledger (user_id: abc123, amount: 50000)
     AFTER:  ledger (user_id: deleted_user_xyz, amount: 50000)
     ```

3. **Immutable Records** (kept for compliance)
   - Ledger entries: KEPT (audit trail)
   - Tender participation history: KEPT (audit trail)
   - interaction_log: KEPT (reputation history)
   - All marked with `deleted_at` timestamp

4. **Profile Cleanup**
   - profiles table: row DELETED
   - community_members: relationship DELETED
   - Any active sessions: REVOKED

#### **Data Export Before Deletion**

Before deletion, user can request export of all their data:

`GET /api/export/my-data` returns ZIP file with:
- profiles.json (name, email, phone, address, reputation_score)
- transactions.json (all ledger entries they participated in)
- interaction_log.json (reputation change history)
- tender_subscriptions.json (all tenders they subscribed to)

Format: JSON (portable, human-readable)

#### **Anonymization for Analytics**

For aggregate analytics (trend analysis), deleted users' data is still used but anonymized:

```
BEFORE deletion:
- User has Rp 50,000 transaction on 2026-05-15
- Included in "Daily transaction volume" trend

AFTER deletion:
- Historical transaction KEPT (for trend continuity)
- User ID = "deleted_user_[hash]"
- NOT included in future "Active users" count
```

#### **Audit Trail**

Every deletion logged:
```
audit_log:
- user_id: abc123
- action: 'account_deleted'
- deleted_at: 2026-05-30T14:00:00Z
- data_export_requested: true/false
- pii_fields_deleted: ['name', 'email', 'phone', 'address']
- immutable_records_kept: ['ledger', 'interaction_log']
```

Published to compliance_log quarterly:
- "X users requested deletion this quarter"
- "Y% of deletion requests within 7 days"

---

### **REC-12: Doc 02 (Business Model) - Add "International Expansion Roadmap"**

**Location:** Doc 02, Section IV (new)

**Add:**

```markdown
### **International Expansion Roadmap (Multi-Currency Support)**

URUN is currently Indonesia-focused (IDR). Future international expansion 
requires multi-currency support. Here's the phased approach:

#### **Phase 1 (Now - 2026): IDR Only**

- No foreign exchange support
- All transactions in Rupiah
- Database: No currency field needed (implicit IDR)

#### **Phase 2 (2027): Multi-Currency Architecture**

Expand to regional communities (Philippines, Thailand, Vietnam):

1. **Add currency field**
   - `ledger.currency: enum('IDR', 'PHP', 'THB', 'VND')`
   - `tenders.currency: enum('IDR', 'PHP', ...)`

2. **Exchange rate management**
   - Daily settled rate (prevent intra-day volatility gaming)
   - Source: CoinGecko API (reliable, no registration needed)
   - Update frequency: Once per day (00:00 UTC)
   - Margin cap: Max 2% deviation from market rate

3. **Cross-currency transactions**
   - Example: Community A (IDR) wants to buy from Community B (PHP)
   - System converts at daily rate + margin
   - Both communities see transaction in their local currency

4. **Tax implications**
   - Each jurisdiction has different rules (beyond URUN's scope)
   - Founder must consult local tax counsel
   - Recommendation: Communities responsible for own tax filing

#### **Phase 3 (2028+): P2P Exchange (Decentralized)**

Enable communities to exchange currency directly (peer-to-peer):
- Community A has excess PHP, needs IDR
- Community B has excess IDR, needs PHP
- URUN facilitates peer matching + settlement
- Rate determined by communities (supply/demand)

```

---

## SUMMARY TABLE: All Recommended Additions

| Rec # | Doc | Section | Priority | Status |
|-------|-----|---------|----------|--------|
| 1 | 20 | Rules for AI | CRITICAL | New section |
| 2 | 02 | Business Model | CRITICAL | Expand |
| 3 | 12 | Protocol Spec | CRITICAL | Expand |
| 4 | 12 | Protocol Spec | CRITICAL | New section |
| 5 | 22 | Algorithm Spec | CRITICAL | Replace |
| 6 | 00 | Roadmap | CRITICAL | Clarify |
| 7 | 22 | Algorithm Spec | HIGH | New section |
| 8 | 22 | Algorithm Spec | HIGH | Expand |
| 9 | 22 | Algorithm Spec | HIGH | Expand |
| 10 | 30 | Maintenance | HIGH | Expand |
| 11 | 32 | Legal | HIGH | New section |
| 12 | 02 | Business Model | MEDIUM | New section |

---

**Next Step:** Review these recommendations with technical team. 
Once approved, integrate into main URUN documentation.
