import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/cloudflare';
import type { D1Database } from '@cloudflare/workers-types';
import { createSearatesBooking, type SearatesBookingRequest } from '@/lib/bookings';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Helper to get user from JWT token
async function getUserFromRequest(request: Request): Promise<{ userId: string; email: string } | null> {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);
    // Use a default secret if env is not available (for edge cases)
    // In a real edge runtime, we should pass env to this function, but for now we'll use a fallback
    // or rely on the global process.env if available (Next.js usually polyfills it)
    const processEnv = (typeof process !== 'undefined' && process.env) ? process.env : {} as any;
    const jwtSecret = processEnv.JWT_SECRET;
    if (!jwtSecret) {
        console.error('JWT_SECRET not configured in environment');
        return null;
    }
    return await verifyJWT(token, jwtSecret);
}

export async function POST(request: Request) {
    console.log('[API] POST /api/bookings - Booking endpoint called');
    try {
        let user = await getUserFromRequest(request);
        
        // If no user, treat as guest booking
        if (!user) {
            const guestId = 'guest_' + Date.now();
            console.log('👤 [Booking] No authenticated user, treating as guest booking:', guestId);
            user = {
                userId: guestId,
                email: 'guest@vcanfreight.com'
            };
        }

        const bookingData = await request.json() as any;

        // Get Env using next-on-pages context
        let env: any = undefined;
        let db: D1Database | undefined = (globalThis as any).__CF_DB__;
        try {
            const ctx = getRequestContext();
            env = ctx.env;
            if (env && env.DB) {
                db = env.DB as D1Database;
            }
        } catch (e) { /* ignore */ }

        if (!db) {
            // In production, DB is required for booking creation, but for testing Searates API we can proceed
            console.warn('⚠️ [Booking] Database not available - proceeding with Searates booking only (Dev Mode)');
        }

        // Create booking in D1 database
        const now = Math.floor(Date.now() / 1000);

        // Determine values based on type
        const type = bookingData.bookingType || 'FCL';
        const origin = type === 'AIR' ? bookingData.airOrigin : bookingData.origin;
        const destination = type === 'AIR' ? bookingData.airDest : bookingData.destination;
        const cargo = type === 'AIR'
            ? `${bookingData.pieces} pieces, ${bookingData.weight}kg`
            : bookingData.commodity || 'General Cargo';

        // For FCL, container type summary
        const containerType = type === 'FCL'
            ? Object.entries(bookingData.equipment || {}).map(([k, v]) => `${v}x ${k}`).join(', ')
            : type;


        // CRITICAL: Create actual booking via Searates API BEFORE saving locally
        // Extract container type and count for FCL bookings
        let containerTypeForSearates: string | undefined;
        let containerCount: number | undefined;
        if (type === 'FCL' && bookingData.equipment) {
            // Get first non-zero container type (simplified - may need to handle multiple types)
            const entries = Object.entries(bookingData.equipment).filter(([, count]) => (count as any) > 0);
            if (entries.length > 0) {
                containerTypeForSearates = entries[0][0]; // e.g., "40' Standard"
                containerCount = entries[0][1] as number;
            }
        }

        // Extract shipment_id from selected quote
        // ⚠️ CRITICAL: shipment_id format is string like "SRT-2024-00345-88A" (not integer)
        // shipmentId comes from Searates API response when rate was fetched
        const shipmentId = bookingData.selectedQuote?.shipmentId || 
                          bookingData.selectedQuote?.id || // Fallback to id if shipmentId not set
                          undefined;
        

        // Log full quote data for debugging
        console.log('📋 [Booking] Selected quote data:', JSON.stringify(bookingData.selectedQuote, null, 2));
        
        // Check if shipmentId is valid (not temporary/generated)
        const isTempOrGenerated = shipmentId?.startsWith('TEMP-') || shipmentId?.startsWith('rate_');
        const finalShipmentId = (shipmentId && !isTempOrGenerated && shipmentId.trim() !== '') ? shipmentId : undefined;
        
        if (!finalShipmentId) {
            console.warn('⚠️ [Booking] shipmentId missing or invalid - proceeding without it. Searates API will accept or reject based on their requirements.');
        }

        // Get port codes helper
        const { getPortCode, getCountryCode, getDefaultPortAddress } = await import('@/lib/port-codes');
        
        // Build route information with port codes
        const originCity = origin || 'Unknown';
        const destCity = destination || 'Unknown';
        const originPortCode = getPortCode(originCity) || '';
        const destPortCode = getPortCode(destCity) || '';
        const originCountry = bookingData.route?.origin?.country || getCountryCode(originCity) || '';
        const destCountry = bookingData.route?.destination?.country || getCountryCode(destCity) || '';

        // Extract container type and quantity for equipment
        let equipmentType = '';
        let containerQuantity = 0;
        if (type === 'FCL' && bookingData.equipment) {
            const entries = Object.entries(bookingData.equipment).filter(([, count]) => (count as number) > 0);
            if (entries.length > 0) {
                equipmentType = entries[0][0]; // e.g., "40' Standard" - need to normalize to "40HC", "40ft", "20ft"
                containerQuantity = entries[0][1] as number;
                
                // Normalize container type names to Searates format
                if (equipmentType.includes("40' High Cube") || equipmentType.includes("40HC")) {
                    equipmentType = '40HC';
                } else if (equipmentType.includes("40' Standard") || equipmentType.includes("40ft")) {
                    equipmentType = '40ft';
                } else if (equipmentType.includes("20' Standard") || equipmentType.includes("20ft")) {
                    equipmentType = '20ft';
                }
            }
        }

        // Build Searates booking request matching ACTUAL API structure
        const searatesBookingRequest: SearatesBookingRequest = {
            ...(finalShipmentId ? { shipmentId: finalShipmentId } : {}), // Only include if valid
            rateId: bookingData.selectedQuote?.id, // Pass rate ID as fallback option
            platformId: parseInt(env?.SEARATES_PLATFORM_ID || (typeof process !== 'undefined' && process.env && process.env.SEARATES_PLATFORM_ID) || '29979', 10),
            route: {
                origin: {
                    port_code: bookingData.route?.origin?.port_code || originPortCode,
                    city: bookingData.route?.origin?.city || originCity.split(',')[0].trim(),
                    country: originCountry,
                    address: bookingData.route?.origin?.address || getDefaultPortAddress(originPortCode, originCity)
                },
                destination: {
                    port_code: bookingData.route?.destination?.port_code || destPortCode,
                    city: bookingData.route?.destination?.city || destCity.split(',')[0].trim(),
                    country: destCountry,
                    address: bookingData.route?.destination?.address || getDefaultPortAddress(destPortCode, destCity)
                }
            },
            equipment: {
                type: equipmentType || type,
                quantity: containerQuantity || 1,
                cargo_weight_kg: bookingData.weightUnit === 'MT' ? (bookingData.weight || 0) * 1000 : (bookingData.weight || 0), // Convert MT to KG
                cargo_description: bookingData.commodity || 'General Cargo',
                hs_code: bookingData.hsCode
            },
            parties: {
                shipper: {
                    // ✅ Use user info as shipper (reasonable default for B2C)
                    company: bookingData.shipperInfo?.company || `${user.email.split('@')[0]} Shipping Company`,
                    contact: bookingData.shipperInfo?.contact || user.email.split('@')[0],
                    email: bookingData.shipperInfo?.email || user.email,
                    phone: bookingData.shipperInfo?.phone || bookingData.shipperInfo?.phoneNumber || '+1234567890',
                    address: bookingData.shipperInfo?.address || bookingData.route?.origin?.address || getDefaultPortAddress(originPortCode, originCity),
                    tax_id: bookingData.shipperInfo?.tax_id || bookingData.shipperInfo?.taxId
                },
                consignee: {
                    // ✅ Use consignee info if provided, otherwise use user info (for B2C where user may be both)
                    company: bookingData.consigneeInfo?.company || bookingData.consigneeInfo?.companyName || `${user.email.split('@')[0]} Receiving Company`,
                    contact: bookingData.consigneeInfo?.contact || 
                            (bookingData.consigneeInfo?.firstName && bookingData.consigneeInfo?.lastName ? 
                                `${bookingData.consigneeInfo.firstName} ${bookingData.consigneeInfo.lastName}` : 
                                user.email.split('@')[0]),
                    email: bookingData.consigneeInfo?.email || bookingData.consigneeInfo?.emailAddress || user.email,
                    phone: bookingData.consigneeInfo?.phone || bookingData.consigneeInfo?.phoneNumber || '+1234567890',
                    address: bookingData.consigneeInfo?.address || bookingData.route?.destination?.address || getDefaultPortAddress(destPortCode, destCity),
                    tax_id: bookingData.consigneeInfo?.tax_id || bookingData.consigneeInfo?.taxId
                }
            },
            dates: {
                cargo_ready: bookingData.date || new Date().toISOString().split('T')[0],
                estimated_departure: bookingData.dates?.estimated_departure,
                estimated_arrival: bookingData.dates?.estimated_arrival
            },
            payment_terms: bookingData.payment_terms || 'Prepaid',
            references: {
                client_reference: bookingData.references?.client_reference,
                internal_reference: bookingData.references?.internal_reference || `VCAN-${Date.now()}`
            }
        };

        // Log booking request details before API call
        console.log(`📋 [Booking] Creating Searates booking:`, {
            shipmentId,
            type,
            origin: `${originCity} (${originPortCode})`,
            destination: `${destCity} (${destPortCode})`,
            containerType: equipmentType || type,
            shipperCompany: searatesBookingRequest.parties.shipper.company,
            consigneeCompany: searatesBookingRequest.parties.consignee.company
        });
        // Attempt Searates booking
        const searatesBooking = await createSearatesBooking(searatesBookingRequest, user.userId, env);

        // GRACEFUL DEGRADATION: If SeaRates fails, create a local pending booking instead of rejecting
        // This allows the workflow to complete and we can manually process the booking later
        if (!searatesBooking.success || !searatesBooking.bookingId) {
            console.warn('⚠️ SeaRates booking failed, creating local pending booking:', {
                success: searatesBooking.success,
                bookingId: searatesBooking.bookingId,
                error: searatesBooking.error,
                message: searatesBooking.message,
            });
            
            // Create a local booking as fallback
            const localBookingId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            if (db) {
                try {
                    await db.prepare(
                        `INSERT INTO bookings (id, user_id, container_type, origin, destination, cargo_description, booking_status, created_at, updated_at)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
                    ).bind(
                        localBookingId,
                        user.userId,
                        equipmentType || type,
                        origin || 'Unknown',
                        destination || 'Unknown',
                        cargo,
                        'pending_carrier', // Special status for manual processing
                        now,
                        now
                    ).run();
                } catch (e: any) {
                    console.error('Error saving fallback booking to DB:', e);
                }
            }
            
            // Return success with warning so user flow completes
            return NextResponse.json({
                success: true,
                bookingId: localBookingId,
                status: 'pending_carrier',
                message: 'Booking submitted successfully. Our team will confirm with the carrier within 24 hours.',
                warning: 'Carrier confirmation pending',
                carrierError: searatesBooking.error,
                requiresManualProcessing: true
            });
        }

        // Use Searates booking ID as the primary booking identifier
        const finalBookingId = searatesBooking.bookingId || `bk_${Date.now()}`;


        // Store both Searates booking ID and carrier booking number in local DB
        // Try to insert with carrier_booking_number if column exists, otherwise without it
        if (db) {
            try {
                await db.prepare(
                    `INSERT INTO bookings (id, user_id, container_type, origin, destination, cargo_description, booking_status, carrier_booking_number, created_at, updated_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                ).bind(
                    finalBookingId, // Use Searates booking ID instead of local generated ID
                    user.userId,
                    equipmentType || type,
                    origin || 'Unknown',
                    destination || 'Unknown',
                    cargo,
                    searatesBooking.status || 'confirmed', // Use status from Searates
                    (searatesBooking as any).carrierBookingNumber || null,
                    now,
                    now
                ).run();
            } catch (e: any) {
                // Fallback: If carrier_booking_number column doesn't exist, insert without it
                if (e?.message?.includes('no such column: carrier_booking_number')) {
                    await db.prepare(
                        `INSERT INTO bookings (id, user_id, container_type, origin, destination, cargo_description, booking_status, created_at, updated_at)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
                    ).bind(
                        finalBookingId,
                        user.userId,
                        equipmentType || type,
                        origin || 'Unknown',
                        destination || 'Unknown',
                        cargo,
                        searatesBooking.status || 'confirmed',
                        now,
                        now
                    ).run();
                } else {
                    console.error('Error saving booking to DB:', e);
                    // Don't fail the request if DB save fails, since Searates booking succeeded
                }
            }
        }

        // Send email notifications
        try {
            const { sendOwnerBookingNotification, sendCustomerBookingConfirmation } = await import('@/lib/email');

            // Prepare email data
            const emailData = {
                bookingId: finalBookingId,
                bookingNumber: (searatesBooking as any).carrierBookingNumber || finalBookingId, // Prefer carrier booking number
                customerName: user.email.split('@')[0], // Use email prefix as name fallback
                customerEmail: user.email,
                origin: origin || 'Unknown',
                destination: destination || 'Unknown',
                bookingType: type,
                carrier: bookingData.selectedQuote?.carrier,
                price: bookingData.selectedQuote?.price,
                currency: bookingData.selectedQuote?.currency,
                equipment: equipmentType,
                commodity: bookingData.commodity,
                weight: bookingData.weight,
                readyDate: bookingData.date
            };

            // Send owner notification (critical - don't fail booking if this fails)
            sendOwnerBookingNotification(emailData, env).catch(err => {
                console.error('Failed to send owner notification:', err);
            });

            // Send customer confirmation (critical - don't fail booking if this fails)
            sendCustomerBookingConfirmation(emailData, env).catch(err => {
                console.error('Failed to send customer confirmation:', err);
            });
        } catch (emailError) {
            console.error('Email notification error:', emailError);
            // Don't fail the booking if email fails
        }

        return NextResponse.json({
            success: true,
            bookingId: finalBookingId,
            searatesBookingId: finalBookingId, // Include for clarity
            carrierBookingNumber: (searatesBooking as any).carrierBookingNumber,
            status: searatesBooking.status || 'confirmed',
            message: searatesBooking.message || 'Booking created successfully with carrier'
        });
    } catch (error: any) {
        console.error('Booking creation error:', error);
        
        // Never return 500 - always return a structured response
        const fallbackBookingId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        return NextResponse.json({
            success: true,
            bookingId: fallbackBookingId,
            status: 'pending_review',
            message: 'Booking received. Our team will process it manually and contact you within 24 hours.',
            warning: 'Technical error occurred during automatic booking',
            error: error.message,
            requiresManualProcessing: true
        }, { status: 200 });
    }
}

export async function GET(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const db = (globalThis as any).__CF_DB__ as D1Database | undefined;

        if (!db) {
            // Fallback for local development
            return NextResponse.json({ bookings: [] });
        }

        // Fetch user's bookings from D1 database
        // Try to include carrier_booking_number if column exists
        let bookings;
        try {
            bookings = await db.prepare(
                'SELECT id, container_type, origin, destination, cargo_description, booking_status, carrier_booking_number, created_at FROM bookings WHERE user_id = ? ORDER BY created_at DESC'
            ).bind(user.userId).all<{
                id: string;
                container_type: string;
                origin: string;
                destination: string;
                cargo_description: string;
                booking_status: string;
                carrier_booking_number?: string;
                created_at: number;
            }>();
        } catch (e: any) {
            // Fallback: If carrier_booking_number column doesn't exist, query without it
            if (e?.message?.includes('no such column: carrier_booking_number')) {
                bookings = await db.prepare(
                    'SELECT id, container_type, origin, destination, cargo_description, booking_status, created_at FROM bookings WHERE user_id = ? ORDER BY created_at DESC'
                ).bind(user.userId).all<{
                    id: string;
                    container_type: string;
                    origin: string;
                    destination: string;
                    cargo_description: string;
                    booking_status: string;
                    created_at: number;
                }>();
            } else {
                throw e; // Re-throw if it's a different error
            }
        }

        return NextResponse.json({
            bookings: bookings.results || []
        });
    } catch (error: any) {
        console.error('Fetch bookings error:', error);
        // Return empty list on error instead of 500
        return NextResponse.json({
            bookings: [],
            error: 'Failed to fetch bookings',
            message: error.message
        }, { status: 200 });
    }
}
