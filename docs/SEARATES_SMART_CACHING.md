# SeaRates API Smart Caching System

## ✅ API Credentials Configured

- **Platform ID**: `29979`
- **API Key**: `K-21EB16AA-B6A6-4D41-9365-5882597F9B11`
- **Limit**: 50 API calls per calendar month

## 🧠 Smart Caching Strategy

### How It Works:

1. **Check Cache FIRST** (No API Call)
   - Checks `life_rates` table first (most recent)
   - Then checks `rates_cache` table
   - If valid cache exists → Return immediately (saves API quota!)

2. **Call API Only When Needed**
   - Only subscribers can trigger API calls
   - Only when no valid cache exists
   - Non-subscribers get cached rates (never trigger API)

3. **Store in BOTH Tables** (Maximize Reuse)
   - When API is called, store result in:
     - `life_rates` → For subscribers
     - `rates_cache` → For non-subscribers
   - **One API call serves both!**

4. **Reuse Cached Rates**
   - Same route checked again? → Use cache (no API call)
   - Subscriber checks route → Use cache if exists
   - Non-subscriber checks route → Use cache if exists
   - **Saves API quota!**

## 📊 Example Flow

### Scenario 1: First Time Check (Subscriber)
```
User (Subscriber) checks: Shanghai → Los Angeles
├─ Check life_rates cache → ❌ Not found
├─ Check rates_cache → ❌ Not found
├─ Call SeaRates API → ✅ (1 API call used)
├─ Store in life_rates → ✅
└─ Store in rates_cache → ✅
Result: Rate returned, stored for reuse
```

### Scenario 2: Same Route Again (Subscriber)
```
User (Subscriber) checks: Shanghai → Los Angeles
├─ Check life_rates cache → ✅ Found!
└─ Return cached rate → ✅ (0 API calls - saved!)
Result: Instant response, no API call
```

### Scenario 3: Non-Subscriber Checks Same Route
```
User (Non-Subscriber) checks: Shanghai → Los Angeles
├─ Check life_rates cache → ✅ Found!
└─ Return cached rate → ✅ (0 API calls - saved!)
Result: Non-subscriber gets cached rate, no API call
```

### Scenario 4: New Route (Subscriber)
```
User (Subscriber) checks: New York → Tokyo
├─ Check life_rates cache → ❌ Not found
├─ Check rates_cache → ❌ Not found
├─ Call SeaRates API → ✅ (1 API call used)
├─ Store in life_rates → ✅
└─ Store in rates_cache → ✅
Result: New rate fetched, stored for reuse
```

## 💾 Database Storage

### life_rates Table (Subscribers)
- Stores rates fetched from API
- Used by subscribers
- 7-day validity period
- Most recent rates first

### rates_cache Table (Non-Subscribers)
- Stores same rates as life_rates
- Used by non-subscribers
- 7-day validity period
- Allows non-subscribers to benefit from subscriber API calls

## 🎯 Benefits

1. **Maximizes 50 API Calls/Month**
   - Each unique route only called once
   - Cached for 7 days
   - Reused by all users (subscribers + non-subscribers)

2. **Fast Response Times**
   - Cached rates return instantly
   - No waiting for API calls

3. **Cost Efficient**
   - One API call serves many users
   - Non-subscribers benefit from subscriber API calls

4. **Smart Quota Management**
   - Only subscribers can trigger API calls
   - Non-subscribers never use API quota
   - Cache prevents duplicate API calls

## 📈 API Call Tracking

To track your 50 calls/month:

```sql
-- Count API calls this month (life_rates entries created this month)
SELECT COUNT(*) as api_calls_this_month
FROM life_rates
WHERE created_at >= unixepoch('now', 'start of month');
```

## ⚙️ Configuration

Environment variables (already set with your credentials):

```bash
SEARATES_PLATFORM_ID=29979
SEARATES_API_KEY=K-21EB16AA-B6A6-4D41-9365-5882597F9B11
SEARATES_API_URL=https://api.searates.com/v2  # Optional, defaults to this
```

## 🔄 Cache Validity

- **Validity Period**: 7 days
- **Auto-expiry**: Rates older than 7 days are ignored
- **Refresh**: New API call refreshes cache for another 7 days

## 🚀 Usage

The caching is **automatic** - no code changes needed:

```typescript
// Just call getSeaRates - caching happens automatically
const rates = await getSeaRates('Shanghai', 'Los Angeles', userId);
// First call: API call (if subscriber, no cache)
// Subsequent calls: Cached (no API call)
```

## ✅ Summary

- ✅ **Smart caching** - Checks cache first
- ✅ **Dual storage** - Stores in both tables
- ✅ **Quota efficient** - Maximizes 50 calls/month
- ✅ **Automatic** - No manual cache management needed
- ✅ **Fast** - Cached rates return instantly

Your 50 API calls/month will go a long way with this smart caching system! 🎉

