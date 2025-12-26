# Schedules API Integration

## Overview
The schedules feature integrates with:
- **Sea Freight**: SeaRates Schedules API
- **Airfreight**: Airlines API (AviationStack or similar)

## SeaRates API Integration

### Configuration
SeaRates API credentials are configured in `wrangler.toml`:
```toml
[vars]
SEARATES_PLATFORM_ID = "29979"
SEARATES_API_KEY = "K-21EB16AA-B6A6-4D41-9365-5882597F9B11"
```

### Endpoints Used
1. **Authentication**: `POST /auth/platform-token`
   - Gets Bearer token for API requests
   
2. **Schedules by Points**: `GET /api/schedules/v1/search-vessels`
   - Parameters: `origin`, `destination`, `weeks_ahead`
   - Returns vessel schedules between two ports

3. **Alternative**: `GET /api/logistics/v2/schedules`
   - Fallback endpoint if primary fails

### City to LOCODE Mapping
The system automatically converts city names to UN/LOCODE port codes:
- Shanghai → CNSHA
- Los Angeles → USLAX
- New York → USNYC
- etc.

## Airlines API Integration

### AviationStack API (Recommended)
1. **Get Free API Key**: https://aviationstack.com/
2. **Add to `wrangler.toml`**:
   ```toml
   [vars]
   AVIATION_STACK_API_KEY = "your_api_key_here"
   ```

3. **Endpoint**: `GET https://api.aviationstack.com/v1/flights`
   - Parameters: `dep_iata`, `arr_iata`, `flight_date`

### City to Airport Code Mapping
The system automatically converts city names to IATA airport codes:
- Shanghai → PVG
- Los Angeles → LAX
- New York → JFK
- etc.

### Fallback
If no Airlines API key is configured, the system uses mock data for airfreight schedules.

## Usage

### API Route
```
GET /api/schedules?type=sea|air&origin=Shanghai&destination=Los Angeles
```

### Example Requests

**Sea Freight:**
```bash
curl "https://vcanfreight.com/api/schedules?type=sea&origin=Shanghai&destination=Los%20Angeles"
```

**Airfreight:**
```bash
curl "https://vcanfreight.com/api/schedules?type=air&origin=Shanghai&destination=Los%20Angeles"
```

## Response Format

```json
{
  "schedules": [
    {
      "id": "sea-0-1234567890",
      "type": "sea",
      "origin": "Shanghai (CNSHA)",
      "destination": "Los Angeles (USLAX)",
      "carrier": "Maersk Line",
      "departure": "2025-01-15",
      "arrival": "2025-02-05",
      "transitTime": 21,
      "frequency": "Weekly",
      "vessel": "MAERSK SHANGHAI",
      "status": "available",
      "originCode": "CNSHA",
      "destinationCode": "USLAX"
    }
  ],
  "count": 1,
  "type": "sea",
  "origin": "Shanghai",
  "destination": "Los Angeles"
}
```

## Error Handling

- If SeaRates API fails, returns empty array
- If Airlines API key not configured, uses mock data
- All errors are logged to console for debugging

## Testing

1. **Test Sea Schedules:**
   - Navigate to `/schedules`
   - Select "Sea Freight"
   - Enter origin: "Shanghai"
   - Enter destination: "Los Angeles"
   - Click "Search"

2. **Test Air Schedules:**
   - Navigate to `/schedules`
   - Select "Airfreight"
   - Enter origin: "Shanghai"
   - Enter destination: "Los Angeles"
   - Click "Search"

## Notes

- SeaRates API has a 50 calls/month limit (shared with rates API)
- Consider implementing caching for schedules similar to rates
- AviationStack has a free tier with limited requests
- All city names are normalized and matched to port/airport codes



