-- Migration script for Firebase users to Cloudflare D1
-- Based on Firebase analysis: 2 users found
-- Firestore: Empty (no data to migrate)
-- Functions: Not deployed (no functions to migrate)

-- ============================================
-- USER 1: vg@vcanresources.com (Google OAuth)
-- ============================================
INSERT OR REPLACE INTO users (
    id, 
    email, 
    name, 
    password_hash, 
    google_id, 
    subscription_status,
    created_at, 
    updated_at
) VALUES (
    'usr_firebase_vg_' || substr(hex(randomblob(8)), 1, 12),
    'vg@vcanresources.com',
    'VCAN Resources',
    NULL, -- Google OAuth user, no password needed
    NULL, -- Will be set when user signs in with Google again
    'free', -- Default subscription status
    unixepoch('2024-12-17 00:00:00'), -- Approximate creation date
    unixepoch('2024-12-17 00:00:00')
);

-- ============================================
-- USER 2: vijindran79@... (Email/Password)
-- ============================================
-- IMPORTANT: Update the email below with the full Firebase email address
-- You can find it in Firebase Console → Authentication → Users
INSERT OR REPLACE INTO users (
    id, 
    email, 
    name, 
    password_hash, 
    google_id, 
    subscription_status,
    created_at, 
    updated_at
) VALUES (
    'usr_firebase_vij_' || substr(hex(randomblob(8)), 1, 12),
    'vijindran79@...', -- ⚠️ UPDATE THIS: Replace with full email from Firebase
    'Vijindran', -- Update name if different
    NULL, -- Password hash (user MUST reset password - Firebase doesn't expose hashes)
    NULL,
    'free',
    unixepoch('2024-12-16 00:00:00'), -- Approximate creation date
    unixepoch('2024-12-16 00:00:00')
);

-- ============================================
-- IMPORTANT NOTES:
-- ============================================
-- 1. PASSWORD RESET REQUIRED:
--    - Firebase doesn't expose password hashes for security
--    - User vijindran79@... MUST reset password after migration
--    - They can use "Forgot Password" flow in the app
--
-- 2. GOOGLE OAUTH:
--    - User vg@vcanresources.com will need to sign in with Google again
--    - Google OAuth will automatically link their account
--    - Their email and name will be preserved
--
-- 3. NO FIRESTORE DATA:
--    - Firestore is empty, so no bookings/rates to migrate ✅
--    - Users can start fresh with bookings
--
-- 4. VERIFICATION:
--    After running this script, verify with:
--    npx wrangler d1 execute vcanfreight-db --command "SELECT id, email, name, subscription_status FROM users"

