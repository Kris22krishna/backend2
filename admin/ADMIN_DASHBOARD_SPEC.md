# Complete Admin Dashboard System - Design Specification

## Document Purpose
This specification provides complete implementation details for a comprehensive educational platform admin control center. Every section includes exact layouts, data structures, interactions, and states.

---

## 🧭 Navigation Structure

### Sidebar Organization

```
┌─────────────────────────────────┐
│ ADMIN PORTAL                    │
├─────────────────────────────────┤
│                                 │
│ 📊 Overview                     │
│                                 │
│ ━━━━━━ USER MANAGEMENT ━━━━━━━ │
│ 👥 Students                     │
│ 🎓 Teachers                     │
│ 👪 Parents                      │
│ 👁️ Guests                       │
│ ⬆️ Uploaders                    │
│ 🏫 Classes                      │
│                                 │
│ ━━━━━━ CONTENT ━━━━━━━━━━━━━━ │
│ 📝 Quizzes                      │
│ ❓ Question Bank                │
│ 🧠 Skills                       │
│                                 │
│ ━━━━━━ QUESTION TOOLS ━━━━━━━ │
│ 🔧 Question Generation          │
│ 📄 Templates                    │
│ 🔀 Arrangement                  │
│ 📋 Generated Questions          │
│                                 │
│ ━━━━━━ MONITORING ━━━━━━━━━━━ │
│ 🚨 Alerts                       │
│ 📊 Analytics                    │
│ 📝 Reports                      │
│ 💚 System Health                │
│ 📜 Activity Log                 │
│                                 │
│ ━━━━━━ CONFIGURATION ━━━━━━━━ │
│ ⚙️ Settings                     │
│                                 │
├─────────────────────────────────┤
│ 🚪 Logout                       │
└─────────────────────────────────┘
```

**Sidebar Behavior:**
- Fixed left sidebar, 280px width
- Collapsible with hamburger icon (min width: 64px, icons only)
- Active menu item: Blue background (#EFF6FF), blue text (#2563EB), bold
- Hover state: Gray background (#F9FAFB)
- Section headers: Uppercase, 11px, gray (#6B7280), 600 weight
- Menu items: 14px, padding 12px 16px, gap 12px between icon and text

---

## 🏠 OVERVIEW - Admin Control Center

**Page Purpose:** One-screen snapshot of entire platform health

### Layout Structure (Top to Bottom)

```
┌──────────────────────────────────────────────────┐
│ Header: "Overview" + Date/Time Refreshed        │
├──────────────────────────────────────────────────┤
│                                                  │
│ [Section 1: Platform Health Cards - 6 cards]    │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│ ┌────────────────┐  ┌────────────────────────┐ │
│ │ Today's        │  │ Critical Alerts (3)    │ │
│ │ Activity       │  │                        │ │
│ │ Table          │  │ [Alert cards]          │ │
│ └────────────────┘  └────────────────────────┘ │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│ ┌────────────────┐  ┌────────────────────────┐ │
│ │ Skill Trouble  │  │ User Activity          │ │
│ │ Spotlight      │  │ Snapshot               │ │
│ └────────────────┘  └────────────────────────┘ │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│ ┌────────────────┐  ┌────────────────────────┐ │
│ │ Live Activity  │  │ Question Bank Health   │ │
│ │ Feed           │  │ Summary                │ │
│ └────────────────┘  └────────────────────────┘ │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

### Section 1: Platform Health Cards

**Layout:** 6 cards in single row, equal width, responsive grid

**Card Design:**
- White background, rounded 8px, shadow-sm
- Padding: 24px
- Height: 140px
- Hover: Shadow-md, subtle lift (-2px transform), border changes to blue

**Card Structure:**
```
┌─────────────────────────────┐
│ 🎓 Icon (top-right)         │
│                             │
│ Total Students              │ ← Label (gray-600, 14px)
│ 1,240                       │ ← Value (gray-900, 32px, bold)
│ ▲ 12 today                  │ ← Delta (green-600, 12px) or red if negative
└─────────────────────────────┘
```

**6 Cards Data:**
1. **Total Students** (🎓 icon)
   - Value: Total student count
   - Delta: New students today
   - Click → Navigate to Students page

2. **Total Teachers** (👨‍🏫 icon)
   - Value: Total teacher count
   - Delta: New teachers this week
   - Click → Navigate to Teachers page

3. **Total Parents** (👪 icon)
   - Value: Total parent accounts
   - Delta: New parents this week
   - Click → Navigate to Parents page

4. **Guest Users Today** (👁️ icon)
   - Value: Unique guests today
   - Delta: % change from yesterday
   - Click → Navigate to Guest Analytics

5. **Quizzes Attempted Today** (📝 icon)
   - Value: Total quiz attempts today
   - Delta: % change from yesterday
   - Click → Open Today's Quiz Activity modal

6. **Questions in Bank** (🗂️ icon)
   - Value: Total questions
   - Delta: New questions this week
   - Click → Navigate to Question Bank

**Loading State:**
- Skeleton shimmer animation
- Gray rectangles matching card dimensions

**Empty State:**
- Show "0" with gray styling
- No delta shown

---

### Section 2A: Today's Activity Table

**Container:**
- White card, padding 24px
- Title: "Today's Activity" (20px, bold)
- Subtitle: "Real-time platform metrics"

**Table Structure:**
```
┌─────────────────────────────────────────────┐
│ Metric                    │ Count    │ Δ   │
├─────────────────────────────────────────────┤
│ Students active today     │ 320      │ +5% │
│ Teachers active today     │ 28       │ -2% │
│ Parents active today      │ 190      │ +8% │
│ Quizzes attempted         │ 540      │ +12%│
│ Questions generated       │ 85       │ +3% │
│ New user signups          │ 12       │ +1  │
│ Guest quiz attempts       │ 156      │ +45%│
└─────────────────────────────────────────────┘
```

**Interaction:**
- Rows clickable (hover: gray background)
- Click → Open drill-down modal with hourly breakdown graph

**Delta Styling:**
- Green if positive/increasing
- Red if negative/decreasing
- Gray if no change

---

### Section 2B: Critical Alerts Panel

**Container:**
- White card, padding 24px
- Header: "Critical Alerts" with count badge (red if >0)
- "View All" link → Navigate to Alerts page

**Alert Card Design:**
```
┌──────────────────────────────────────────┐
│ ⚠️  27 students inactive for 3+ days    │
│                                          │
│ Last checked: 5 minutes ago              │
│ [View Details] button                    │
└──────────────────────────────────────────┘
```

**Alert Types & Colors:**
- **Critical** (Red bg-red-50, border-red-300): Urgent action needed
- **Warning** (Yellow bg-yellow-50, border-yellow-300): Needs attention
- **Info** (Blue bg-blue-50, border-blue-300): FYI

**Shown Alerts (Top 3):**
1. Students inactive X days
2. Skill accuracy dropping
3. Questions with high report count

**Click Behavior:**
- Click alert → Open modal with:
  - Alert title
  - Description
  - List of affected items (first 10, then "Show X more")
  - Action buttons: "Mark Resolved", "Investigate", "Dismiss"

---

### Section 3A: Skill Trouble Spotlight

**Container:**
- White card, padding 24px
- Title: "Skills Needing Attention"
- Subtitle: "Platform-wide accuracy below 50%"

**Table:**
```
┌─────────────────────────────────────────────────────┐
│ Skill       │ Avg Accuracy │ Attempts │ Trend      │
├─────────────────────────────────────────────────────┤
│ Fractions   │ 41%  🔴      │ 1,200    │ ↓ -17%     │
│ Decimals    │ 38%  🔴      │ 1,100    │ ↓ -8%      │
│ Ratios      │ 48%  🟡      │ 980      │ ↔ 0%       │
└─────────────────────────────────────────────────────┘
```

**Accuracy Indicators:**
- 🔴 Red: <40%
- 🟡 Yellow: 40-50%
- 🟢 Green: >50%

**Trend Column:**
- ↓ Red: Decreasing
- ↑ Green: Improving
- ↔ Gray: Stable

**Click Behavior:**
- Click row → Navigate to Skills page filtered to that skill
- Shows questions in that skill, accuracy breakdown by grade

---

### Section 3B: User Activity Snapshot

**Container:**
- White card, padding 24px
- Title: "User Activity Status"

**Table:**
```
┌───────────────────────────────────────────────────────┐
│ Role      │ Active Today │ Inactive 7d │ Inactive 30d │
├───────────────────────────────────────────────────────┤
│ Students  │ 320          │ 45          │ 127          │
│ Teachers  │ 28           │ 3           │ 8            │
│ Parents   │ 190          │ 22          │ 76           │
└───────────────────────────────────────────────────────┘
```

**Interaction:**
- Click cell → Open modal with user list
- Modal shows: Name, Last Active, Grade/Class
- Action: "Send Re-engagement Email" button

---

### Section 4A: Live Activity Feed

**Container:**
- White card, padding 24px
- Title: "Live Activity Feed"
- Height: 400px, scrollable
- Auto-refresh every 30 seconds (small "Updated X seconds ago" text)

**Activity Item Structure:**
```
┌─────────────────────────────────────────┐
│ 🎓 Teacher Rahul created quiz           │
│    "Advanced Algebra Quiz"              │
│    2 minutes ago                        │
└─────────────────────────────────────────┘
```

**Activity Types & Icons:**
- 🎓 Quiz created
- ✅ Quiz completed
- 📝 Questions added
- 👤 User registered
- 🔄 Template updated
- 👁️ Guest activity
- ⚠️ Question reported

**Scroll Behavior:**
- Auto-scroll disabled when user manually scrolls
- "Jump to Latest" button appears when new activities arrive

**Click:**
- Click activity → Open relevant detail (quiz modal, user profile, question view)

---

### Section 4B: Question Bank Health Summary

**Container:**
- White card, padding 24px
- Title: "Question Bank Health"

**3 Column Layout:**

```
┌────────────────┬────────────────┬────────────────┐
│ Low Accuracy   │ Never Used     │ High Reports   │
│ (<30%)         │ (0 attempts)   │ (>5 reports)   │
├────────────────┼────────────────┼────────────────┤
│ 47 questions   │ 213 questions  │ 8 questions    │
│ 🔴 Needs fix   │ 🟡 Review      │ 🔴 Urgent      │
│                │                │                │
│ [View All]     │ [View All]     │ [View All]     │
└────────────────┴────────────────┴────────────────┘
```

**Click "View All":**
- Navigate to Question Bank page with pre-applied filter

**Color Indicators:**
- 🔴 Red: Urgent (needs immediate action)
- 🟡 Yellow: Attention needed
- 🟢 Green: Healthy

---

## 👥 USERS - Students Page

**URL:** `/admin/users/students`

### Top Section: Stats + Actions

```
┌──────────────────────────────────────────────────────┐
│ Students                           [+ Add Student]   │
├──────────────────────────────────────────────────────┤
│ ┌───────────┐ ┌───────────┐ ┌───────────┐          │
│ │Total: 1240│ │Active: 895│ │Inactive:  │          │
│ │           │ │(Last 7d)  │ │345        │          │
│ └───────────┘ └───────────┘ └───────────┘          │
└──────────────────────────────────────────────────────┘
```

### Filter Bar

```
┌──────────────────────────────────────────────────────┐
│ [Grade ▼] [Status ▼] [Date Range ▼] [Search...]    │
│                                      [Export CSV]    │
└──────────────────────────────────────────────────────┘
```

**Filters:**
- **Grade:** Dropdown with checkboxes (Grade 1-12, Unassigned)
- **Status:** Active, Inactive 7d, Inactive 30d+, Suspended
- **Date Range:** Last 7 days, Last 30 days, All time, Custom
- **Search:** Text input, searches Name, Email, Student ID

**Filter Behavior:**
- Filters are cumulative (AND logic)
- Applied filters show as removable chips below filter bar
- "Clear All Filters" button appears when filters active

### Data Table

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ [☐] │ Name          │ Grade │ Email             │ Last Active │ Status  │ Actions │
├────────────────────────────────────────────────────────────────────────────────┤
│ ☐   │ Sarah Johnson │ 8     │ sarah@...         │ 2 min ago   │ 🟢 Active│ [...]  │
│ ☐   │ Michael Chen  │ 10    │ michael@...       │ 5 days ago  │ 🟡 Idle  │ [...]  │
│ ☐   │ Emma Williams │ 7     │ emma@...          │ 32 days ago │ 🔴 Inactive│[...] │
└────────────────────────────────────────────────────────────────────────────────┘
```

**Columns (sortable by clicking header):**
1. **Checkbox:** Bulk selection
2. **Name:** Full name + avatar initials
3. **Grade:** Grade level
4. **Email:** Student email (truncated with tooltip)
5. **Last Active:** Relative time (hover shows exact datetime)
6. **Status:** 
   - 🟢 Active (logged in last 7d)
   - 🟡 Idle (7-30d)
   - 🔴 Inactive (30d+)
   - ⚫ Suspended
7. **Actions:** Three-dot menu

**Actions Menu (three-dot):**
- View Profile
- View Stats
- Send Email
- Reset Password
- Suspend Account
- Delete Account (with confirmation)

**Bulk Actions (when rows selected):**
- Top of table shows: "X students selected"
- Bulk Actions: Send Email, Export, Suspend, Delete

**Row Click Behavior:**
- Click anywhere on row (except checkbox/actions) → Open student detail drawer

---

### Student Detail Drawer

**Trigger:** Click table row

**Drawer Design:**
- Slides from right, 480px width
- Overlay darkens main content
- Close: X button, click overlay, or ESC key

**Drawer Content:**

```
┌────────────────────────────────────────┐
│ [X]                         Student    │
├────────────────────────────────────────┤
│                                        │
│  ┌──────┐                             │
│  │  SJ  │  Sarah Johnson              │
│  └──────┘  Grade 8                    │
│            sarah.johnson@email.com    │
│            ID: ST-2024-1892           │
│                                        │
│  ┌─────────────────────────────────┐  │
│  │ 🟢 Active                       │  │
│  │ Last login: 2 minutes ago       │  │
│  └─────────────────────────────────┘  │
│                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                        │
│  Performance Stats                     │
│  ┌───────────┬───────────┬──────────┐ │
│  │Quizzes    │Avg Score  │Time Spent│ │
│  │Completed  │           │          │ │
│  │    45     │   72%     │  12.3h   │ │
│  └───────────┴───────────┴──────────┘ │
│                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                        │
│  Skills Performance                    │
│  Fractions        ████░░░░░░ 45%      │
│  Algebra          ██████░░░░ 68%      │
│  Geometry         ███████░░░ 72%      │
│                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                        │
│  Recent Activity                       │
│  • Completed "Algebra Quiz 3" - 78%   │
│  • Started practice: Fractions        │
│  • Joined class: "Math 8A"            │
│                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                        │
│  Account Info                          │
│  Created: Jan 15, 2024                │
│  Parent: Jane Johnson (linked)        │
│  Class: Math 8A, Science 8B           │
│                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                        │
│  Actions                               │
│  [View Full Profile]                  │
│  [Send Message]                       │
│  [Reset Password]                     │
│  [Suspend Account]                    │
│                                        │
└────────────────────────────────────────┘
```

**Drawer Features:**
- Tabs: Overview (shown), Activity History, Performance Details
- "View Full Profile" → Navigate to dedicated student profile page
- All actions show confirmation modals

---

### Empty State (No Students)

```
┌────────────────────────────────────┐
│         👥                         │
│                                    │
│    No Students Found               │
│                                    │
│    Try adjusting your filters or   │
│    add your first student.         │
│                                    │
│    [+ Add Student]                 │
└────────────────────────────────────┘
```

---

### Loading State

- Table rows show skeleton loaders
- 10 skeleton rows with shimmer animation
- Stats cards show skeleton values

---

### Error State

```
┌────────────────────────────────────┐
│         ⚠️                         │
│                                    │
│    Failed to Load Students         │
│                                    │
│    There was an error loading      │
│    the student data.               │
│                                    │
│    [Retry]                         │
└────────────────────────────────────┘
```

---

## 👨‍🏫 USERS - Teachers Page

**Structure:** Same layout as Students with modifications

### Stats Cards (Top)
- Total Teachers: 48
- Active (Last 7d): 32
- Inactive: 16

### Table Columns
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Name       │ Email        │ Classes │ Quizzes  │ Avg Student │ Last   │ Status │ Actions │
│            │              │ Taught  │ Created  │ Score       │ Active │        │         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Rahul Mehta│ rahul@...    │ 3       │ 24       │ 68%         │ 1h ago │ 🟢     │ [...]   │
│ Sarah Khan │ sarah.k@...  │ 5       │ 45       │ 72%         │ 2d ago │ 🟢     │ [...]   │
│ Mike Chen  │ mike@...     │ 2       │ 8        │ 65%         │ 12d ago│ 🟡     │ [...]   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Additional Filters
- Subject: Math, Science, English, etc.
- Performance: High (>70%), Medium (50-70%), Low (<50%)

### Teacher Detail Drawer

```
┌────────────────────────────────────────┐
│  Rahul Mehta                           │
│  Math Teacher                          │
│  rahul.mehta@school.com                │
│                                        │
│  Teaching Stats                        │
│  • Classes: 3 (Math 8A, 9B, 10C)      │
│  • Students: 87 total                  │
│  • Quizzes Created: 24                 │
│  • Questions Added: 156                │
│  • Avg Student Score: 68%              │
│                                        │
│  Class Performance                     │
│  Math 8A    ████████░░ 72%            │
│  Math 9B    ██████░░░░ 65%            │
│  Math 10C   ████████░░ 75%            │
│                                        │
│  Recent Activity                       │
│  • Created "Algebra Basics Quiz"      │
│  • Added 12 new questions             │
│  • Graded 45 submissions              │
│                                        │
│  [View Full Profile]                  │
│  [Message Teacher]                    │
│  [View Classes]                       │
└────────────────────────────────────────┘
```

---

## 👪 USERS - Parents Page

**Structure:** Similar to Students/Teachers

### Table Columns
```
┌──────────────────────────────────────────────────────────────────────────┐
│ Name         │ Email        │ Children │ Last     │ Engagement │ Status │ Actions │
│              │              │ Linked   │ Active   │ Level      │        │         │
├──────────────────────────────────────────────────────────────────────────┤
│ Jane Johnson │ jane@...     │ 2        │ 1h ago   │ 🟢 High    │ Active │ [...]   │
│ Robert Chen  │ robert@...   │ 1        │ 15d ago  │ 🟡 Medium  │ Idle   │ [...]   │
│ Lisa Kumar   │ lisa@...     │ 3        │ 45d ago  │ 🔴 Low     │ Inactive│[...]   │
└──────────────────────────────────────────────────────────────────────────┘
```

**Engagement Level Calculation:**
- 🟢 High: Logs in weekly, views child progress
- 🟡 Medium: Logs in monthly
- 🔴 Low: Rarely logs in

### Parent Detail Drawer

```
┌────────────────────────────────────────┐
│  Jane Johnson                          │
│  Parent Account                        │
│  jane.johnson@email.com                │
│                                        │
│  Linked Children                       │
│  • Sarah Johnson (Grade 8)            │
│  • Tom Johnson (Grade 5)              │
│                                        │
│  Engagement Stats                      │
│  • Last Login: 1 hour ago             │
│  • Progress Views: 45 this month      │
│  • Messages Sent: 12                  │
│  • Reports Downloaded: 3              │
│                                        │
│  Recent Activity                       │
│  • Viewed Sarah's quiz results        │
│  • Downloaded Tom's progress report   │
│  • Sent message to Math teacher       │
│                                        │
│  [View Full Profile]                  │
│  [Send Message]                       │
│  [Unlink Child]                       │
└────────────────────────────────────────┘
```

---

## 👁️ USERS - Guests Page

**Purpose:** Track and convert guest users

### Top Stats
```
┌────────────────────────────────────────────────────────┐
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│ │ Guests Today│ │ Quiz        │ │ Conversion  │      │
│ │ 312         │ │ Attempts    │ │ Rate        │      │
│ │ +45 from yday│ │ 856         │ │ 15%         │      │
│ └─────────────┘ └─────────────┘ └─────────────┘      │
└────────────────────────────────────────────────────────┘
```

### Table Columns
```
┌────────────────────────────────────────────────────────────────────────────┐
│ Guest ID    │ First Seen  │ Quizzes   │ Topics         │ Time    │ Status │ Actions │
│             │             │ Attempted │ Attempted      │ Spent   │        │         │
├────────────────────────────────────────────────────────────────────────────┤
│ GST-4829    │ Today 2pm   │ 4         │ Fractions(3)   │ 12 min  │ 🟢     │ [...]   │
│             │             │           │ Algebra(1)     │         │        │         │
├────────────────────────────────────────────────────────────────────────────┤
│ GST-4821    │ Yesterday   │ 8         │ Geometry(5)    │ 28 min  │ 🟡     │ [...]   │
│             │             │           │ Algebra(3)     │         │        │         │
├────────────────────────────────────────────────────────────────────────────┤
│ GST-4812    │ 3 days ago  │ 2         │ Fractions(2)   │ 5 min   │ 🔴     │ [...]   │
│             │             │           │                │         │        │         │
└────────────────────────────────────────────────────────────────────────────┘
```

**Status Colors:**
- 🟢 Hot Lead: 5+ attempts or 20+ min spent
- 🟡 Warm Lead: 2-4 attempts
- 🔴 Cold Lead: 1 attempt

**Actions:**
- View Activity History
- Send Signup Invitation (email if captured)
- Convert to Student (manual)
- Block Guest ID

### Filters
- Date Range
- Quiz Attempts (1-2, 3-5, 6+)
- Status (Hot, Warm, Cold)
- Topic Attempted

### Guest Activity Modal

**Trigger:** Click "View Activity History"

```
┌──────────────────────────────────────────┐
│ Guest Activity: GST-4829          [X]    │
├──────────────────────────────────────────┤
│                                          │
│ Session Info                             │
│ • First Seen: Feb 4, 2026 2:15 PM       │
│ • Last Active: 5 minutes ago             │
│ • Total Time: 12 minutes                 │
│ • Device: Chrome / Desktop               │
│ • Location: San Francisco, CA            │
│                                          │
│ Quiz Attempts (4)                        │
│ ┌────────────────────────────────────┐  │
│ │ Fractions Quiz - Basic             │  │
│ │ Score: 60% • 3 min • 2:15 PM       │  │
│ └────────────────────────────────────┘  │
│ ┌────────────────────────────────────┐  │
│ │ Fractions Quiz - Intermediate      │  │
│ │ Score: 70% • 4 min • 2:20 PM       │  │
│ └────────────────────────────────────┘  │
│ ┌────────────────────────────────────┐  │
│ │ Fractions Quiz - Advanced          │  │
│ │ Score: 55% • 3 min • 2:25 PM       │  │
│ └────────────────────────────────────┘  │
│ ┌────────────────────────────────────┐  │
│ │ Algebra Basics Quiz                │  │
│ │ Score: 80% • 2 min • 2:28 PM       │  │
│ └────────────────────────────────────┘  │
│                                          │
│ Conversion Signals                       │
│ ✅ High engagement (4 attempts)          │
│ ✅ Improving scores (60% → 70%)          │
│ ⚠️ No email captured                    │
│                                          │
│ [Send Signup Prompt]                    │
│ [Convert to Student]                    │
└──────────────────────────────────────────┘
```

---

## ⬆️ USERS - Uploaders Page

**Purpose:** Manage question content uploaders, track content quality

### Top Section
```
┌────────────────────────────────────────────────────────┐
│ Uploaders                    [+ Create Uploader]       │
├────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│ │ Total       │ │ Active      │ │ Questions   │      │
│ │ Uploaders   │ │ This Month  │ │ Added       │      │
│ │ 8           │ │ 6           │ │ 1,247       │      │
│ └─────────────┘ └─────────────┘ └─────────────┘      │
└────────────────────────────────────────────────────────┘
```

### Table
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ Uploader     │ Access  │ Questions │ Avg      │ Reports │ Last    │ Status │ Actions │
│ Name         │ Code    │ Added     │ Accuracy │         │ Active  │        │         │
├────────────────────────────────────────────────────────────────────────────────────┤
│ ContentPro   │ UP-8472 │ 456       │ 78%      │ 2       │ 1d ago  │ 🟢     │ [...]   │
│ MathQuest    │ UP-8463 │ 328       │ 82%      │ 0       │ 2d ago  │ 🟢     │ [...]   │
│ QuizMaster   │ UP-8401 │ 89        │ 45%  ⚠️  │ 12      │ 5d ago  │ 🔴     │ [...]   │
│ EduContent   │ UP-8392 │ 234       │ 72%      │ 1       │ 10d ago │ 🟡     │ [...]   │
└────────────────────────────────────────────────────────────────────────────────────┘
```

**Status:**
- 🟢 Good: >70% avg accuracy, <5 reports
- 🟡 Review: 60-70% accuracy or 5-10 reports
- 🔴 Problematic: <60% accuracy or >10 reports

**Actions Menu:**
- View Uploaded Questions
- View Reports
- Regenerate Access Code
- Suspend Uploader
- Delete Uploader

### Create Uploader Modal

**Trigger:** Click "+ Create Uploader"

```
┌──────────────────────────────────────────┐
│ Create New Uploader            [X]       │
├──────────────────────────────────────────┤
│                                          │
│ Uploader Name                            │
│ [_____________________________]          │
│                                          │
│ Description (optional)                   │
│ [_____________________________]          │
│                                          │
│ Permissions                              │
│ ☑ Can add questions                      │
│ ☑ Can edit own questions                 │
│ ☐ Can edit all questions                 │
│ ☐ Can delete questions                   │
│                                          │
│ Topics Allowed (optional)                │
│ [Select topics...           ▼]           │
│                                          │
│ Grade Levels Allowed (optional)          │
│ [Select grades...           ▼]           │
│                                          │
│                   [Cancel] [Create]      │
└──────────────────────────────────────────┘
```

**After Create:**
Show success modal with generated access code

```
┌──────────────────────────────────────────┐
│ Uploader Created Successfully!    [X]    │
├──────────────────────────────────────────┤
│                                          │
│ Access Code:                             │
│ ┌──────────────────────────────────────┐ │
│ │        UP-8493                       │ │
│ │        [Copy to Clipboard]           │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ ⚠️ Important:                            │
│ This code will only be shown once.       │
│ Share it securely with the uploader.     │
│                                          │
│ Access Portal URL:                       │
│ https://platform.com/upload/UP-8493      │
│ [Copy URL]                               │
│                                          │
│                            [Close]       │
└──────────────────────────────────────────┘
```

### Uploader Detail Drawer

```
┌────────────────────────────────────────┐
│ ContentPro                             │
│ Uploader Account                       │
│ Access Code: UP-8472                   │
│                                        │
│ Upload Stats                           │
│ • Questions Added: 456                 │
│ • Avg Accuracy: 78%                    │
│ • Total Attempts: 12,400               │
│ • Reports: 2 (resolved)                │
│                                        │
│ Quality Metrics                        │
│ Questions by Accuracy:                 │
│ >80%: 287 (63%)                       │
│ 60-80%: 145 (32%)                     │
│ <60%: 24 (5%)   ⚠️                    │
│                                        │
│ Recent Uploads                         │
│ • 12 questions added today            │
│ • Last upload: 4 hours ago            │
│                                        │
│ Topics Contributed                     │
│ • Fractions: 124 questions            │
│ • Algebra: 89 questions               │
│ • Geometry: 156 questions             │
│ • Other: 87 questions                 │
│                                        │
│ [View All Questions]                  │
│ [Regenerate Code]                     │
│ [Suspend Uploader]                    │
└────────────────────────────────────────┘
```

---

## 🏫 CLASSES Page

**Purpose:** Manage class rosters, teacher assignments, schedules

### Top Stats
```
┌────────────────────────────────────────────────────────┐
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│ │ Total Classes│ │ Active     │ │ Total       │      │
│ │ 24          │ │ Students   │ │ Enrollments │      │
│ │             │ │ 1,156      │ │ 1,240       │      │
│ └─────────────┘ └─────────────┘ └─────────────┘      │
└────────────────────────────────────────────────────────┘
```

### Table
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Class Name   │ Teacher      │ Grade │ Students │ Avg Score │ Last     │ Actions │
│              │              │       │ Enrolled │           │ Activity │         │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Math 8A      │ Rahul Mehta  │ 8     │ 28       │ 72%       │ 2h ago   │ [...]   │
│ Science 9B   │ Sarah Khan   │ 9     │ 32       │ 68%       │ 5h ago   │ [...]   │
│ English 10C  │ Mike Chen    │ 10    │ 25       │ 75%       │ 1d ago   │ [...]   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Filters
- Teacher (dropdown)
- Grade (dropdown)
- Subject (dropdown)
- Status (Active, Archived)

### Class Detail Drawer

```
┌────────────────────────────────────────┐
│ Math 8A                         [X]    │
│ Grade 8 Mathematics                    │
├────────────────────────────────────────┤
│                                        │
│ Class Info                             │
│ • Teacher: Rahul Mehta                 │
│ • Students: 28 enrolled                │
│ • Schedule: Mon/Wed/Fri 9-10 AM        │
│ • Room: B-204                          │
│                                        │
│ Performance                            │
│ • Class Avg: 72%                       │
│ • Quizzes Assigned: 12                 │
│ • Completion Rate: 95%                 │
│                                        │
│ Top Performers                         │
│ 1. Sarah Johnson - 92%                 │
│ 2. Michael Chen - 88%                  │
│ 3. Emma Williams - 85%                 │
│                                        │
│ Need Attention                         │
│ • 3 students below 60%                 │
│ • 2 students haven't submitted last quiz│
│                                        │
│ Recent Activity                        │
│ • "Fractions Test" assigned            │
│ • 24/28 students completed             │
│ • Avg score: 68%                       │
│                                        │
│ [View Full Roster]                    │
│ [Assign Quiz]                         │
│ [Message Class]                       │
│ [Edit Class Info]                     │
└────────────────────────────────────────┘
```

---

## 📝 QUIZZES Page

**Purpose:** View all quizzes, usage stats, performance data

### Top Stats
```
┌────────────────────────────────────────────────────────┐
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│ │ Total Quizzes│ │ Attempted  │ │ Avg         │      │
│ │ 342         │ │ Today      │ │ Completion  │      │
│ │             │ │ 860        │ │ 87%         │      │
│ └─────────────┘ └─────────────┘ └─────────────┘      │
└────────────────────────────────────────────────────────┘
```

### Filters
```
┌──────────────────────────────────────────────────────┐
│ [Subject ▼] [Grade ▼] [Creator ▼] [Status ▼]       │
│ [Sort: Most Attempted ▼]              [Search...]   │
└──────────────────────────────────────────────────────┘
```

### Table
```
┌───────────────────────────────────────────────────────────────────────────────────┐
│ Quiz Name         │ Creator     │ Grade │ Questions │ Attempts │ Avg   │ Actions │
│                   │             │       │           │          │ Score │         │
├───────────────────────────────────────────────────────────────────────────────────┤
│ Fractions Basics  │ Rahul Mehta │ 8     │ 15        │ 1,245    │ 72%   │ [...]   │
│ Algebra 101       │ Sarah Khan  │ 9     │ 20        │ 987      │ 68%   │ [...]   │
│ Geometry Advanced │ Mike Chen   │ 10    │ 25        │ 654      │ 75%   │ [...]   │
└───────────────────────────────────────────────────────────────────────────────────┘
```

### Quiz Detail Modal

**Trigger:** Click quiz row

```
┌──────────────────────────────────────────────────────┐
│ Fractions Basics                              [X]    │
├──────────────────────────────────────────────────────┤
│                                                      │
│ ┌─ Quiz Info ────────────────────────────────────┐  │
│ │ Created by: Rahul Mehta                        │  │
│ │ Created on: Jan 15, 2024                       │  │
│ │ Grade Level: 8                                 │  │
│ │ Subject: Mathematics                           │  │
│ │ Topic: Fractions                               │  │
│ │ Duration: 20 minutes                           │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ┌─ Performance Stats ────────────────────────────┐  │
│ │ Total Attempts: 1,245                          │  │
│ │ Avg Score: 72%                                 │  │
│ │ Completion Rate: 95%                           │  │
│ │ Avg Time: 18 minutes                           │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ┌─ Questions (15) ───────────────────────────────┐  │
│ │ 1. Simplify 4/8                                │  │
│ │    Accuracy: 85% • 1,180 attempts              │  │
│ │                                                │  │
│ │ 2. What is 1/2 + 1/4?                          │  │
│ │    Accuracy: 68% • 1,175 attempts              │  │
│ │                                                │  │
│ │ 3. Convert 0.75 to fraction                    │  │
│ │    Accuracy: 45% • 1,120 attempts   ⚠️         │  │
│ │                                                │  │
│ │ ... [Show All Questions]                       │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ┌─ Score Distribution ───────────────────────────┐  │
│ │ 90-100%: ████████ (245 students)               │  │
│ │ 80-89%:  ██████ (187 students)                 │  │
│ │ 70-79%:  ████ (124 students)                   │  │
│ │ 60-69%:  ██ (76 students)                      │  │
│ │ <60%:    ██ (68 students)                      │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ [View Attempts] [Edit Quiz] [Duplicate] [Archive]   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## ❓ QUESTION BANK Page

**Purpose:** Master repository of all questions with quality control

### Top Section

```
┌────────────────────────────────────────────────────────────────┐
│ Question Bank                          [+ Add Question]        │
├────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│ │Total     │ │Active    │ │Flagged   │ │Never     │          │
│ │Questions │ │          │ │          │ │Used      │          │
│ │5,420     │ │5,199     │ │34        │ │213       │          │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└────────────────────────────────────────────────────────────────┘
```

### Filter Bar

```
┌──────────────────────────────────────────────────────────────┐
│ [Subject ▼] [Topic ▼] [Grade ▼] [Difficulty ▼]             │
│                                                              │
│ [Quality Filter ▼]                           [Search...]    │
│ • All Questions                                              │
│ • High Accuracy (>80%)                                       │
│ • Low Accuracy (<30%)                                        │
│ • Never Attempted                                            │
│ • Reported (>5 reports)                                      │
│ • Recently Added (Last 7 days)                               │
└──────────────────────────────────────────────────────────────┘
```

### Table

```
┌────────────────────────────────────────────────────────────────────────────────────���───┐
│ ID     │ Question Preview    │ Subject │ Topic    │ Difficulty │ Accuracy │ Attempts │ Actions │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Q-4829 │ Simplify 3/12 to... │ Math    │ Fractions│ Easy       │ 28% 🔴   │ 450      │ [...]   │
│ Q-4821 │ What is 5 × 7?      │ Math    │ Multiply │ Easy       │ 92% 🟢   │ 1,250    │ [...]   │
│ Q-4812 │ Solve: 2x + 5 = 15  │ Math    │ Algebra  │ Medium     │ 68% 🟡   │ 340      │ [...]   │
│ Q-4803 │ Area of triangle... │ Math    │ Geometry │ Medium     │ 0%  ⚫   │ 0        │ [...]   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

**Accuracy Indicators:**
- 🔴 Red: <30% (critical)
- 🟡 Yellow: 30-70% (review)
- 🟢 Green: >70% (good)
- ⚫ Gray: Never attempted

**Actions Menu:**
- View Question Details
- View Answer Distribution
- Edit Question
- View Reports (if any)
- Archive Question
- Delete Question

### Question Detail Modal (★ Power Feature)

**Trigger:** Click "View Question Details"

```
┌────────────────────────────────────────────────────────────┐
│ Question Details: Q-4829                            [X]    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ ┌─ Question ──────────────────────────────────────────┐   │
│ │                                                      │   │
│ │ Simplify 3/12 to its lowest terms.                  │   │
│ │                                                      │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ Metadata                                                   │
│ • Subject: Math                                            │
│ • Topic: Fractions                                         │
│ • Grade: 6-8                                               │
│ • Difficulty: Easy                                         │
│ • Added by: ContentPro (Uploader)                          │
│ • Added on: Jan 20, 2024                                   │
│                                                            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                            │
│ Performance Stats                                          │
│ • Total Attempts: 450                                      │
│ • Correct Answers: 126 (28%)  🔴 Critical                 │
│ • Avg Time to Answer: 45 seconds                           │
│                                                            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                            │
│ Answer Distribution (★ Key Insight)                       │
│                                                            │
│ ┌────────────────────────────────────────────────────┐    │
│ │ A. 1/4         ████████████████ 52% (234)        │    │
│ │                ^ Most selected wrong answer        │    │
│ │                                                    │    │
│ │ B. 3/4         ██████ 20% (90)                    │    │
│ │                                                    │    │
│ │ C. 1/3         ██ 28% (126)  ✓ Correct           │    │
│ │                                                    │    │
│ │ D. 1/2         ████ 15% (67)                      │    │
│ └────────────────────────────────────────────────────┘    │
│                                                            │
│ 💡 Insight: Most students incorrectly chose 1/4.          │
│    Suggests misunderstanding of GCD/simplification.        │
│                                                            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                            │
│ Grade-Level Breakdown                                      │
│ • Grade 6: 45% accuracy (120 attempts)                     │
│ • Grade 7: 32% accuracy (180 attempts)                     │
│ • Grade 8: 18% accuracy (150 attempts)  ⚠️                │
│                                                            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                            │
│ Reports (2)                                                │
│ • "Answer is unclear" - Jan 25 by Teacher Sarah           │
│ • "Multiple correct answers" - Jan 28 by Student Mike     │
│                                                            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                            │
│ Recent Attempts (Last 10)                                  │
│ • Sarah J. (Grade 8): Answered A (wrong) - 2 min ago      │
│ • Mike C. (Grade 7): Answered C (correct) - 5 min ago     │
│ • Emma W. (Grade 6): Answered A (wrong) - 8 min ago       │
│ ...                                                        │
│                                                            │
│ [Edit Question] [View All Attempts] [Archive] [Delete]    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**This modal is critical** - it shows:
1. Exact question content
2. Answer distribution (most chosen wrong answer)
3. Performance by grade level
4. Reports/issues
5. Recent attempt history

This helps admin **improve content quality** by understanding WHY students get questions wrong.

---

## 🧠 SKILLS Page

**Purpose:** Platform-wide learning health monitoring

### Top Section

```
┌────────────────────────────────────────────────────────┐
│ Skills - Learning Health Monitor                      │
├────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│ │ Total Skills│ │ Struggling  │ │ Improving   │      │
│ │ 48          │ │ Skills      │ │ Skills      │      │
│ │             │ │ 8  🔴       │ │ 12  🟢      │      │
│ └─────────────┘ └─────────────┘ └─────────────┘      │
└────────────────────────────────────────────────────────┘
```

### Filters

```
┌──────────────────────────────────────────────────────┐
│ [Subject ▼] [Grade ▼] [Performance ▼]              │
│                                                      │
│ Performance Filter:                                  │
│ • All Skills                                         │
│ • Critical (<40%)                                    │
│ • Needs Attention (40-60%)                           │
│ • Good (60-80%)                                      │
│ • Excellent (>80%)                                   │
└──────────────────────────────────────────────────────┘
```

### Table

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ Skill Name    │ Subject │ Avg      │ Attempts │ Trend    │ Grade Most │ Status │ Actions │
│               │         │ Accuracy │          │ (7d)     │ Struggling │        │         │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ Fractions     │ Math    │ 41% 🔴   │ 1,200    │ ↓ -17%   │ Grade 8    │ Critical│[...]   │
│ Decimals      │ Math    │ 38% 🔴   │ 1,100    │ ↓ -8%    │ Grade 7    │ Critical│[...]   │
│ Ratios        │ Math    │ 48% 🟡   │ 980      │ ↔ 0%     │ Grade 9    │ Review  │[...]   │
│ Algebra Basics│ Math    │ 72% 🟢   │ 2,300    │ ↑ +5%    │ -          │ Good    │[...]   │
│ Multiplication│ Math    │ 88% 🟢   │ 3,400    │ ↑ +2%    │ -          │ Excellent│[...]  │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Trend Indicators:**
- ↓ Red arrow: Declining performance
- ↑ Green arrow: Improving
- ↔ Gray: Stable

**Row Click → Skill Detail Drawer**

### Skill Detail Drawer

```
┌────────────────────────────────────────┐
│ Fractions                       [X]    │
│ Mathematics                            │
├────────────────────────────────────────┤
│                                        │
│ Overall Performance                    │
│ • Platform Avg: 41%  🔴 Critical      │
│ • Total Attempts: 1,200                │
│ • Trend: ↓ -17% (last 7 days)         │
│ • Students Practicing: 450             │
│                                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                        │
│ Performance by Grade                   │
│ Grade 6:  ██████ 58% (320 attempts)   │
│ Grade 7:  ████ 45% (420 attempts)     │
│ Grade 8:  ██ 32% (460 attempts) ⚠️    │
│                                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                        │
│ Related Questions (12)                 │
│ • Simplify 3/12           28% 🔴       │
│ • Convert 0.75 to fraction 31% 🔴      │
│ • What is 2/3 + 1/4?      25% 🔴       │
│ • Simplify 6/8            52% 🟡       │
│ ... [View All]                         │
│                                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                        │
│ Top Classes Struggling                 │
│ 1. Math 8A (Rahul): 32% avg            │
│ 2. Math 8C (Sarah): 35% avg            │
│ 3. Math 7B (Mike): 42% avg             │
│                                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                        │
│ Recommended Actions                    │
│ 💡 Add easier intro questions          │
│ 💡 Create video tutorial               │
│ 💡 Notify teachers of struggling classes│
│                                        │
│ [View Questions] [Notify Teachers]    │
│ [Add Practice Quiz]                   │
└────────────────────────────────────────┘
```

---

## 🚨 ALERTS Page

**Purpose:** Centralized alert system for platform issues

### Top Section

```
┌────────────────────────────────────────────────────────┐
│ System Alerts                           [Configure]    │
├────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│ │ Critical    │ │ Warning     │ │ Info        │      │
│ │ 3  🔴       │ │ 8  🟡       │ │ 5  🔵       │      │
│ └─────────────┘ └─────────────┘ └─────────────┘      │
└────────────────────────────────────────────────────────┘
```

### Filters

```
┌──────────────────────────────────────────────────────┐
│ [Severity ▼] [Category ▼] [Status ▼] [Date ▼]      │
│                                                      │
│ Status:                                              │
│ • All Alerts                                         │
│ • Active (Needs Action)                              │
│ • Investigating                                      │
│ • Resolved                                           │
│ • Dismissed                                          │
└──────────────────────────────────────────────────────┘
```

### Alert Categories

- **User Activity:** Inactive users, low engagement
- **Content Quality:** Low accuracy questions, reports
- **Learning Health:** Skill performance drops
- **System:** Technical errors, API failures
- **Growth:** Conversion issues, drop-off rates

### Table

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ Severity │ Alert                           │ Category │ Created   │ Status        │ Actions │
├───────────────────────────────────────────────────────────────────────────────────────┤
│ 🔴       │ 27 students inactive 3+ days    │ Users    │ Today 9am │ Active        │ [...]   │
│ 🔴       │ Fractions accuracy dropped 17%  │ Learning │ Yesterday │ Investigating │ [...]   │
│ 🟡       │ 3 teachers no quizzes this week │ Users    │ 2d ago    │ Active        │ [...]   │
│ 🔵       │ 12 guests didn't convert        │ Growth   │ Today 2pm │ Active        │ [...]   │
│ 🟡       │ Question Q-4829 reported 5x     │ Content  │ 3d ago    │ Resolved      │ [...]   │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### Alert Detail Modal

**Trigger:** Click alert row

```
┌──────────────────────────────────────────────────────┐
│ Alert Details                                  [X]   │
├──────────────────────────────────────────────────────┤
│                                                      │
│ 🔴 Critical Alert                                    │
│                                                      │
│ 27 students inactive for 3+ days                     │
│                                                      │
│ Category: User Activity                              │
│ Created: Feb 4, 2026 9:00 AM                         │
│ Last Updated: 5 minutes ago                          │
│                                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                      │
│ Alert Details                                        │
│                                                      │
│ The following students haven't logged in for        │
│ 3 or more consecutive days:                          │
│                                                      │
│ Showing 10 of 27 students:                           │
│                                                      │
│ 1. Sarah Johnson (Grade 8)                           │
│    Last Active: 4 days ago                           │
│    Avg Quiz Score: 72%                               │
│    [Send Reminder] [View Profile]                    │
│                                                      │
│ 2. Michael Chen (Grade 10)                           │
│    Last Active: 5 days ago                           │
│    Avg Quiz Score: 68%                               │
│    [Send Reminder] [View Profile]                    │
│                                                      │
│ 3. Emma Williams (Grade 7)                           │
│    Last Active: 3 days ago                           │
│    Avg Quiz Score: 85%                               │
│    [Send Reminder] [View Profile]                    │
│                                                      │
│ ... [Show All 27 Students]                           │
│                                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                      │
│ Recommended Actions                                  │
│ • Send re-engagement emails                          │
│ • Notify parents (if linked)                         │
│ • Check for technical issues                         │
│                                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                      │
│ Status: Active                                       │
│                                                      │
│ [Mark as Investigating] [Send Bulk Email]           │
│ [Mark as Resolved] [Dismiss]                        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Alert Configuration Modal

**Trigger:** Click "Configure" button

```
┌──────────────────────────────────────────────────────┐
│ Alert Configuration                            [X]   │
├──────────────────────────────────────────────────────┤
│                                                      │
│ User Activity Alerts                                 │
│ ┌────────────────────────────────────────────────┐  │
│ │ ☑ Student inactive for [3 ▼] days             │  │
│ │   Severity: [Critical ▼]                       │  │
│ │                                                │  │
│ │ ☑ Teacher inactive for [7 ▼] days             │  │
│ │   Severity: [Warning ▼]                        │  │
│ │                                                │  │
│ │ ☑ Parent hasn't logged in [14 ▼] days         │  │
│ │   Severity: [Info ▼]                           │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ Content Quality Alerts                               │
│ ┌────────────────────────────────────────────────┐  │
│ │ ☑ Question accuracy below [30 ▼]%             │  │
│ │   Severity: [Critical ▼]                       │  │
│ │                                                │  │
│ │ ☑ Question reported [5 ▼] times               │  │
│ │   Severity: [Warning ▼]                        │  │
│ │                                                │  │
│ │ ☑ Questions not attempted [30 ▼] days         │  │
│ │   Severity: [Info ▼]                           │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ Learning Health Alerts                               │
│ ┌────────────────────────────────────────────────┐  │
│ │ ☑ Skill accuracy drops [10 ▼]% in [7 ▼] days  │  │
│ │   Severity: [Critical ▼]                       │  │
│ │                                                │  │
│ │ ☑ Class avg score below [60 ▼]%               │  │
│ │   Severity: [Warning ▼]                        │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ Notification Settings                                │
│ ┌────────────────────────────────────────────────┐  │
│ │ Send email notifications: [Yes ▼]              │  │
│ │ Notification frequency: [Real-time ▼]          │  │
│ │ Email recipients:                              │  │
│ │ • admin@platform.com                           │  │
│ │ • alerts@platform.com                          │  │
│ │ [+ Add Email]                                  │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│                           [Cancel] [Save Changes]    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 📊 ANALYTICS Page

**Purpose:** Visual trends and insights with interactive graphs

### Layout Structure

```
┌────────────────────────────────────────────────────────┐
│ Analytics                                              │
├────────────────────────────────────────────────────────┤
│                                                        │
│ ┌─ Global Filters ─────────────────────────────────┐  │
│ │ [Date Range: Last 30 Days ▼] [Grade: All ▼]    │  │
│ │ [Role: All ▼] [Compare To: Previous Period ▼]   │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│ ┌─ Daily Active Users ─────────────────────────────┐  │
│ │ [Graph: Line Chart]                              │  │
│ │ Students (blue), Teachers (green), Parents (orange)│
│ │                                                  │  │
│ │ Y-axis: User count                               │  │
│ │ X-axis: Date                                     │  │
│ │                                                  │  │
│ │ Shows: Trend line, hover tooltips with exact     │  │
│ │ numbers, peak/low points highlighted             │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ ┌─ Quiz Attempts Over Time ────────────────────────┐  │
│ │ [Graph: Area Chart]                              │  │
│ │ Total attempts, completion rate                  │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ ┌─ Skill Accuracy Trends ──────────────────────────┐  │
│ │ [Graph: Multi-line Chart]                        │  │
│ │ Top 5 skills, color coded                        │  │
│ │ Shows which skills improving/declining           │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ ┌─ Question Bank Growth ───────────────────────────┐  │
│ │ [Graph: Bar Chart]                               │  │
│ │ Questions added per week/month                   │  │
│ │ Grouped by subject                               │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ ┌─ User Registration Funnel ───────────────────────┐  │
│ │ Guest Visit → Quiz Attempt → Signup → Active     │  │
│ │ [Funnel Chart with conversion %]                 │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ ┌─ Content Quality Distribution ───────────────────┐  │
│ │ [Graph: Donut Chart]                             │  │
│ │ Questions by accuracy bracket                    │  │
│ │ >80% (green), 60-80% (yellow), <60% (red)       │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Graph Interaction Patterns

**All graphs must support:**
- **Hover:** Show tooltip with exact values and date
- **Click data point:** Open drill-down modal with detailed table
- **Legend:** Click to toggle series visibility
- **Zoom:** Click-drag to zoom into date range
- **Export:** Button to download as PNG or CSV

**Example Drill-Down Modal (Click DAU graph):**

```
┌──────────────────────────────────────────────────────┐
│ Daily Active Users - Feb 4, 2026              [X]    │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Total: 538 active users                              │
│                                                      │
│ Breakdown by Role                                    │
│ ┌────────────────────────────────────────────────┐  │
│ │ Role      │ Count │ % of Total │ Trend        │  │
│ ├────────────────────────────────────────────────┤  │
│ │ Students  │ 320   │ 59%        │ ↑ +5% from yday│ │
│ │ Teachers  │ 28    │ 5%         │ ↔ 0%         │  │
│ │ Parents   │ 190   │ 35%        │ ↑ +8% from yday│ │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ Peak Activity Times                                  │
│ • 8-9 AM: 124 users                                  │
│ • 2-3 PM: 187 users (peak)                           │
│ • 7-8 PM: 156 users                                  │
│                                                      │
│ Top Activities                                       │
│ • Quiz attempts: 245                                 │
│ • Question practice: 156                             │
│ • Progress checks: 89                                │
│                                                      │
│ [Export Data] [View Users]                          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 📝 REPORTS Page

**Purpose:** User-submitted issue tracking and resolution

### Top Section

```
┌────────────────────────────────────────────────────────┐
│ User Reports                                           │
├────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│ │ Total       │ │ Pending     │ │ Resolved    │      │
│ │ Reports     │ │             │ │ This Week   │      │
│ │ 127         │ │ 34  ⚠️      │ │ 12          │      │
│ └─────────────┘ └─────────────┘ └─────────────┘      │
└────────────────────────────────────────────────────────┘
```

### Filters

```
┌──────────────────────────────────────────────────────┐
│ [Status ▼] [Type ▼] [Priority ▼] [Date ▼]          │
│                                      [Search...]     │
└──────────────────────────────────────────────────────┘
```

**Filter Options:**
- **Status:** Pending, Investigating, Resolved, Dismissed
- **Type:** Question Error, Technical Issue, Content Request, Abuse Report
- **Priority:** High, Medium, Low
- **Date:** Last 7 days, Last 30 days, All time

### Table

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ ID    │ Reported By │ Role    │ Type           │ Issue Summary     │ Date    │ Status │ Actions │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ R-829 │ Sarah J.    │ Student │ Question Error │ Wrong answer mark │ 2h ago  │ Pending│ [...]   │
│ R-828 │ Rahul M.    │ Teacher │ Technical      │ Quiz won't load   │ 5h ago  │ Investigating│[..]│
│ R-827 │ Mike C.     │ Student │ Content Request│ More algebra Qs   │ 1d ago  │ Resolved│[...]   │
│ R-826 │ Jane J.     │ Parent  │ Technical      │ Can't see scores  │ 2d ago  │ Resolved│[...]   │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Report Detail Modal

**Trigger:** Click report row

```
┌──────────────────────────────────────────────────────┐
│ Report Details: R-829                          [X]   │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Report Information                                   │
│ • ID: R-829                                          │
│ • Type: Question Error                               │
│ • Priority: Medium                                   │
│ • Status: Pending                                    │
│ • Created: Feb 4, 2026 2:15 PM                       │
│                                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                      │
│ Reported By                                          │
│ • Name: Sarah Johnson                                │
│ • Role: Student (Grade 8)                            │
│ • Email: sarah.j@school.com                          │
│                                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                      │
│ Issue Description                                    │
│                                                      │
│ "I answered question Q-4829 correctly but it was     │
│  marked wrong. I selected '1/3' which is the right   │
│  answer when you simplify 3/12. The system said      │
│  '1/4' is correct but that's wrong!"                 │
│                                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                      │
│ Related Content                                      │
│ Question: Q-4829 - "Simplify 3/12"                   │
│ [View Question Details]                              │
│                                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                      │
│ Admin Notes                                          │
│ [Text area for admin to add investigation notes]     │
│                                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                      │
│ Resolution                                           │
│ Status: [Investigating ▼]                            │
│                                                      │
│ Resolution Notes:                                    │
│ [Text area for resolution explanation]               │
│                                                      │
│ Notify Reporter: ☑                                   │
│                                                      │
│ [Update Status] [Close Report] [Escalate]           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**When marking as Resolved:**
- Admin must add resolution notes
- Option to notify reporter via email
- Reporter receives: "Your report R-829 has been resolved: [notes]"

---

## 💚 SYSTEM HEALTH Page

**Purpose:** Technical monitoring and system diagnostics

### Layout

```
┌────────────────────────────────────────────────────────┐
│ System Health                    Last Updated: 2m ago  │
├────────────────────────────────────────────────────────┤
│                                                        │
│ ┌─ System Status ──────────────────────────────────┐  │
│ │ 🟢 All Systems Operational                       │  │
│ │ Uptime: 99.98% (Last 30 days)                    │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│ │ API Success │ │ Avg Response│ │ Active      │      │
│ │ Rate        │ │ Time        │ │ Sessions    │      │
│ │ 99.7%  🟢   │ │ 145ms  🟢   │ │ 538         │      │
│ └─────────────┘ └─────────────┘ └─────────────┘      │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│ ┌─ API Errors (Last 24h) ──────────────────────────┐  │
│ │                                                   │  │
│ │ [Line Graph showing error count over time]       │  │
│ │                                                   │  │
│ │ Total Errors: 12                                  │  │
│ │ Error Rate: 0.3%                                  │  │
│ │                                                   │  │
│ └───────────────────────────────────────────────────┘  │
│                                                        │
│ ┌─ Recent Errors ───────────────────────────────────┐  │
│ │                                                   │  │
│ │ Timestamp       │ Endpoint        │ Error        │  │
│ │ ──────────────────────────────────────────────── │  │
│ │ 2:45 PM        │ /api/quiz/submit│ Timeout      │  │
│ │ 1:30 PM        │ /api/user/login │ 500 Error    │  │
│ │ 12:15 PM       │ /api/questions  │ Rate Limited │  │
│ │                                                   │  │
│ │ [View All Errors]                                 │  │
│ └───────────────────────────────────────────────────┘  │
│                                                        │
│ ┌─ Failed Quiz Submissions ─────────────────────────┐  │
│ │                                                   │  │
│ │ Last 24 hours: 5 failed submissions               │  │
│ │                                                   │  │
│ │ User          │ Quiz         │ Error  │ Time     │  │
│ │ ──────────────────────────────────────────────── │  │
│ │ Sarah J.      │ Fractions 1  │ Timeout│ 2:30 PM  │  │
│ │ Mike C.       │ Algebra 3    │ Network│ 1:45 PM  │  │
│ │ Emma W.       │ Geometry 2   │ Timeout│ 12:20 PM │  │
│ │                                                   │  │
│ │ [Retry All] [View Details]                        │  │
│ └───────────────────────────────────────────────────┘  │
│                                                        │
│ ┌─ Performance Metrics ──────────────────────────────┐ │
│ │                                                   │  │
│ │ Metric              │ Current │ Target │ Status  │  │
│ │ ──────────────────────────────────────────────── │  │
│ │ Page Load Time     │ 1.2s    │ <2s    │ 🟢      │  │
│ │ Database Queries   │ 45ms    │ <100ms │ 🟢      │  │
│ │ API Response Time  │ 145ms   │ <200ms │ 🟢      │  │
│ │ Quiz Load Time     │ 890ms   │ <1s    │ 🟢      │  │
│ │ Image Load Time    │ 2.4s    │ <3s    │ 🟢      │  │
│ │                                                   │  │
│ └───────────────────────────────────────────────────┘  │
│                                                        │
│ ┌─ Database Health ──────────────────────────────────┐ │
│ │                                                   │  │
│ │ • Connection Pool: 45/100 (45% utilization)       │  │
│ │ • Active Queries: 8                               │  │
│ │ • Slow Queries (>1s): 0                           │  │
│ │ • Storage Used: 45.2 GB / 100 GB (45%)            │  │
│ │                                                   │  │
│ └───────────────────────────────────────────────────┘  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Status Indicators:**
- 🟢 Green: Healthy (within target)
- 🟡 Yellow: Warning (approaching limit)
- 🔴 Red: Critical (exceeded threshold)

**Click behaviors:**
- Click error row → Open error detail modal with stack trace
- Click failed submission → Open retry modal with user/quiz info
- Click metric → Show historical trend graph

---

## 📜 ACTIVITY LOG Page (Audit Trail)

**Purpose:** Complete audit trail of admin actions

### Filters

```
┌──────────────────────────────────────────────────────┐
│ [Action Type ▼] [Admin User ▼] [Date Range ▼]      │
│                                      [Search...]     │
└──────────────────────────────────────────────────────┘
```

**Action Types:**
- User Management (Create, Edit, Delete, Suspend)
- Content Changes (Question Add/Edit/Delete)
- Role Changes
- Report Resolution
- System Configuration
- Alert Actions

### Table

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Timestamp      │ Admin User  │ Action        │ Target          │ Details    │ View │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Feb 4, 2:45 PM │ Admin John  │ User Deleted  │ Student Mike C. │ ID: ST-892 │ [...] │
│ Feb 4, 2:30 PM │ Admin Sarah │ Question Edit │ Q-4829          │ Fixed answer│[...] │
│ Feb 4, 1:15 PM │ Admin John  │ Report Resolved│ R-828          │ Tech issue │ [...] │
│ Feb 4, 12:00 PM│ Admin Sarah │ Role Changed  │ Teacher Lisa    │ Suspended  │ [...] │
│ Feb 3, 5:30 PM │ Admin John  │ Alert Dismissed│ Alert A-453    │ False positive│[..]│
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Activity Detail Modal

```
┌──────────────────────────────────────────────────────┐
│ Activity Details                               [X]   │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Action: User Deleted                                 │
│                                                      │
│ Performed By                                         │
│ • Admin: John Smith                                  │
│ • Role: Super Admin                                  │
│ • IP Address: 192.168.1.45                           │
│ • Timestamp: Feb 4, 2026 2:45:30 PM                  │
│                                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                      │
│ Target                                               │
│ • User: Michael Chen                                 │
│ • Role: Student                                      │
│ • Grade: 10                                          │
│ • User ID: ST-892                                    │
│                                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                      │
│ Reason                                               │
│ "Account closure requested by parent via email.      │
│  Ticket reference: #TKT-5421"                        │
│                                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                      │
│ Data Archived                                        │
│ • User profile: ✓                                    │
│ • Quiz attempts: ✓                                   │
│ • Progress data: ✓                                   │
│ • Archive ID: ARCH-20260204-ST892                    │
│                                                      │
│                                    [Close]           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## ⚙️ SETTINGS Page

**Purpose:** System configuration and admin management

### Tab Navigation

```
┌────────────────────────────────────────────────────────┐
│ ┌────────────┬────────────┬────────────┬──────────┐   │
│ │ General    │ Users      │ Content    │ Alerts   │   │
│ └────────────┴────────────┴────────────┴──────────┘   │
└────────────────────────────────────────────────────────┘
```

### Tab 1: General Settings

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│ Platform Settings                                    │
│                                                      │
│ Platform Name                                        │
│ [Educational Learning Platform__________]            │
│                                                      │
│ Platform URL                                         │
│ [https://platform.com___________________]            │
│                                                      │
│ Support Email                                        │
│ [support@platform.com___________________]            │
│                                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                      │
│ Feature Flags                                        │
│                                                      │
│ ☑ Enable guest quiz attempts                         │
│ ☑ Allow parent account linking                       │
│ ☑ Enable question reporting                          │
│ ☐ Allow student-to-student messaging                 │
│ ☑ Enable public leaderboards                         │
│                                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                      │
│ Session Settings                                     │
│                                                      │
│ Session Timeout (minutes)                            │
│ [30_____]                                            │
│                                                      │
│ Max Login Attempts                                   │
│ [5______]                                            │
│                                                      │
│ Password Expiry (days)                               │
│ [90_____]                                            │
│                                                      │
│                              [Cancel] [Save Changes] │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Tab 2: User Management Settings

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│ User Registration                                    │
│                                                      │
│ Allow new registrations: [Yes ▼]                     │
│                                                      │
│ Require email verification: ☑                        │
│ Require admin approval: ☐                            │
│                                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                      │
│ Account Deletion Policy                              │
│                                                      │
│ Data retention after deletion (days)                 │
│ [30_____]                                            │
│                                                      │
│ Automatic account cleanup:                           │
│ ☑ Delete accounts inactive for [180___] days        │
│                                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                      │
│ Role Permissions                                     │
│                                                      │
│ [Manage Role Permissions Button]                    │
│                                                      │
│                              [Cancel] [Save Changes] │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Role Permissions Matrix Modal

**Trigger:** Click "Manage Role Permissions"

```
┌──────────────────────────────────────────────────────────────────┐
│ Role Permissions                                          [X]    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Permission              │ Student │ Teacher │ Parent │ Admin    │
│ ──────────────────────────────────────────────────────────────  │
│ Take quizzes            │    ✓    │    ✓    │    -    │   ✓     │
│ Create quizzes          │    -    │    ✓    │    -    │   ✓     │
│ Add questions           │    -    │    ✓    │    -    │   ✓     │
│ View own progress       │    ✓    │    ✓    │    ✓    │   ✓     │
│ View other's progress   │    -    │    ✓    │    ✓    │   ✓     │
│ Edit questions          │    -    │    ✓*   │    -    │   ✓     │
│ Delete questions        │    -    │    -    │    -    │   ✓     │
│ Manage users            │    -    │    -    │    -    │   ✓     │
│ View analytics          │    -    │    ✓*   │    -    │   ✓     │
│ Resolve reports         │    -    │    -    │    -    │   ✓     │
│ System settings         │    -    │    -    │    -    │   ✓     │
│                                                                  │
│ * Limited to own classes/content                                 │
│                                                                  │
│                                              [Close]             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Tab 3: Content Settings

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│ Question Management                                  │
│                                                      │
│ Allow question duplication: ☑                        │
│ Require admin review for new questions: ☐            │
│                                                      │
│ Auto-archive questions with:                         │
│ ☑ Zero attempts for [90____] days                    │
│ ☑ Accuracy below [20___]% and [100__] attempts      │
│                                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                      │
│ Quiz Settings                                        │
│                                                      │
│ Default quiz duration (minutes)                      │
│ [20_____]                                            │
│                                                      │
│ Allow quiz retry: ☑                                  │
│ Max retry attempts: [3______]                        │
│                                                      │
│ Show correct answers after submission: ☑             │
│                                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                      │
│ Content Moderation                                   │
│                                                      │
│ Auto-flag questions with [5____] reports             │
│ Notify admins via email: ☑                           │
│                                                      │
│                              [Cancel] [Save Changes] │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Tab 4: Alert Settings

*(See Alert Configuration modal in Alerts section)*

---

## 🎨 UI/UX States Reference

### Empty States

**General Pattern:**
```
┌────────────────────────────────┐
│         [Icon]                 │
│                                │
│    [Primary Message]           │
│                                │
│    [Secondary explanation]     │
│                                │
│    [Action Button]             │
└────────────────────────────────┘
```

**Colors:**
- Icon: Gray-400
- Primary: Gray-900, 18px
- Secondary: Gray-600, 14px
- Background: White with gray-100 border

### Loading States

**Skeleton Loaders:**
- Use shimmer animation
- Match exact dimensions of loaded content
- Gray-200 background, Gray-300 shimmer
- Animate left-to-right

**Full Page Loading:**
```
┌────────────────────────────────┐
│         [Spinner]              │
│                                │
│    Loading...                  │
└────────────────────────────────┘
```

### Error States

**Inline Errors:**
- Red bg-red-50, border-red-300
- Red text-red-700
- Error icon (AlertCircle from lucide)
- Retry button if applicable

**Full Page Errors:**
```
┌────────────────────────────────┐
│         ⚠️                     │
│                                │
│    Failed to Load Data         │
│                                │
│    There was an error loading  │
│    this content.               │
│                                │
│    [Retry Button]              │
└────────────────────────────────┘
```

### Success States

**Toast Notifications:**
- Green bg-green-50, border-green-300
- CheckCircle icon
- Auto-dismiss after 3 seconds
- Position: Top-right

**Examples:**
- "Student successfully added"
- "Question updated"
- "Alert resolved"
- "Settings saved"

### Confirmation Modals

**Destructive Actions (Delete, Suspend):**
```
┌──────────────────────────────────────────┐
│ Confirm Action                    [X]    │
├──────────────────────────────────────────┤
│                                          │
│ ⚠️ Are you sure you want to delete this? │
│                                          │
│ This action cannot be undone.            │
│                                          │
│ [Type "DELETE" to confirm]               │
│ [_________________________]              │
│                                          │
│                   [Cancel] [Delete]      │
│                                          │
└──────────────────────────────────────────┘
```

**Non-Destructive Actions:**
```
┌──────────────────────────────────────────┐
│ Confirm Action                    [X]    │
├──────────────────────────────────────────┤
│                                          │
│ Are you sure you want to proceed?        │
│                                          │
│                   [Cancel] [Confirm]     │
│                                          │
└──────────────────────────────────────────┘
```

---

## 🎯 Interaction Patterns Summary

### Click Behaviors

1. **Stat Cards** → Navigate to filtered page or show detail modal
2. **Table Rows** → Open detail drawer (right side)
3. **Three-dot Actions** → Show dropdown menu
4. **Alert Cards** → Open alert detail modal
5. **Graph Data Points** → Show tooltip on hover, drill-down modal on click
6. **Filters** → Apply immediately (no "Apply" button needed)
7. **Bulk Select** → Show bulk action toolbar at top of table

### Drawer Behavior

- **Open:** Slide from right, 480px width
- **Overlay:** Dark overlay on main content, 40% opacity
- **Close:** X button, click overlay, or ESC key
- **Scroll:** Drawer content scrollable if exceeds height
- **Load:** Show skeleton in drawer while fetching data

### Modal Behavior

- **Open:** Fade in with scale animation
- **Size:** Small (400px), Medium (600px), Large (800px), X-Large (1200px)
- **Overlay:** Dark overlay, 50% opacity
- **Close:** X button, click overlay, or ESC key (except for confirmations)
- **Focus Trap:** Tab cycles within modal

### Tooltip Behavior

- **Trigger:** Hover for 500ms
- **Position:** Auto (top/bottom/left/right based on space)
- **Style:** Black bg, white text, 12px, rounded corners
- **Content:** Short text, no HTML

### Filter Behavior

- **Apply:** Immediately on change (debounced 300ms for text input)
- **Clear:** Individual X on each filter chip, or "Clear All" button
- **Persist:** Filters persist in URL query params (shareable links)

### Pagination

- **Type:** Load more button or infinite scroll (depends on data size)
- **Page Size:** 50 items per page (adjustable in dropdown)
- **Show:** "Showing 1-50 of 1,240" text

---

## 📱 Responsive Behavior

### Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Mobile Adaptations

**Sidebar:**
- Hidden by default
- Overlay mode (covers content)
- Full width when open
- Hamburger menu in top-left

**Tables:**
- Stack columns vertically
- Or horizontal scroll with fixed first column

**Cards:**
- Single column layout
- Full width

**Modals:**
- Full screen on mobile
- Slide up from bottom

**Stat Cards:**
- 1-2 columns on mobile
- 3 columns on tablet
- 6 columns on desktop

---

## 🔔 Notification System

### Notification Types

1. **In-App Toasts** (auto-dismiss)
2. **Email Notifications** (configurable)
3. **Alert Badges** (red dots on sidebar icons)

### Badge Behavior

Show count badge on:
- 🚨 Alerts (pending count)
- 📝 Reports (unresolved count)
- 💚 System Health (if status not green)

---

## 🎨 Design Tokens

### Colors

```css
/* Primary */
--blue-50: #EFF6FF;
--blue-600: #2563EB;
--blue-700: #1D4ED8;

/* Status */
--green-50: #F0FDF4;
--green-600: #16A34A;
--yellow-50: #FEFCE8;
--yellow-600: #CA8A04;
--red-50: #FEF2F2;
--red-600: #DC2626;
--gray-50: #F9FAFB;
--gray-600: #4B5563;
--gray-900: #111827;

/* Semantic */
--success: green-600;
--warning: yellow-600;
--error: red-600;
--info: blue-600;
```

### Typography

```css
/* Headers */
h1: 32px, 700;
h2: 24px, 600;
h3: 20px, 600;

/* Body */
body: 14px, 400;
small: 12px, 400;

/* Font Family */
font-family: 'Inter', sans-serif;
```

### Spacing

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
```

---

## ✅ Implementation Checklist

### Phase 1: Core Pages
- [ ] Overview dashboard
- [ ] Students page with filters and drawer
- [ ] Teachers page
- [ ] Question Bank with quality control
- [ ] Alerts page

### Phase 2: Additional Pages
- [ ] Parents page
- [ ] Guests page with analytics
- [ ] Uploaders page
- [ ] Classes page
- [ ] Quizzes page
- [ ] Skills page

### Phase 3: Monitoring & Reports
- [ ] Analytics page with graphs
- [ ] Reports page
- [ ] Activity Log
- [ ] System Health

### Phase 4: Configuration
- [ ] Settings page
- [ ] Role permissions
- [ ] Alert configuration

### Phase 5: Polish
- [ ] All empty states
- [ ] All loading states
- [ ] All error states
- [ ] Success notifications
- [ ] Confirmation modals
- [ ] Mobile responsive

---

## 🚀 Development Notes

### Data Requirements

**Mock Data Needed:**
- 1,240 students with realistic attributes
- 48 teachers with class assignments
- 980 parents with child links
- 5,420 questions with performance data
- 342 quizzes with attempt data
- 48 skills with accuracy trends
- Activity feed items (200+)
- Alert definitions
- Report records

### Performance Considerations

- **Pagination:** Always paginate tables >100 rows
- **Debouncing:** Text search inputs debounce 300ms
- **Caching:** Cache frequently accessed data (stats, filters)
- **Lazy Loading:** Load drawer/modal content on-demand
- **Virtualization:** Use virtual scrolling for 1000+ row tables

### Accessibility

- **Keyboard Navigation:** All interactive elements focusable
- **Screen Readers:** Proper ARIA labels
- **Color Contrast:** WCAG AA compliant (4.5:1 ratio)
- **Focus Indicators:** Visible focus states
- **Alt Text:** All icons have aria-label

---

## 📝 End of Specification

This document provides complete specifications for implementing a comprehensive admin dashboard system. Every page, section, table, filter, modal, and interaction has been detailed with exact structure, behavior, and states.

Frontend engineers can use this as a blueprint to build the system without additional design decisions.
