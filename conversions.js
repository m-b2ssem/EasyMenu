import axios from 'axios';
import crypto from 'crypto';




// Function to send conversion event to Meta
export async function sendMetaConversionEvent(userId, eventId,company_name ,email, clientIpAddress, userAgent, event_name, eventSourceUrl, event_time) {
    const accessToken = 'EAAnGQW7VNUIBO6p4y4lr0wfikcJ2ftdXjNF1R2ce8Iz3PcwYMtdXtpp71j7yIuAblF3MwM8BbctzV8whZC82uosU3G2p2ZAac33t5IXoetF9UQ9VMRhtI4xzKb5F858CoZCRCoKSjQQIuBY5PYyVJQRAlKDJa7BQzPT3WKLn2nIEIe9HQpVhgHh0OZCe2STYZBQZDZD';
    const pixelId = '8004482946310463';
    const hashedEmail = await hashData(email);
    const hashUserId = await hashData(userId.toString());

    const event = {
        event_name: event_name,
        event_time: event_time,
        action_source: 'website',
        event_id: eventId, // Add event_id here
        event_source_url: eventSourceUrl,
        user_data: {
            em: [hashedEmail], 
            external_id: [hashUserId],
            client_ip_address: clientIpAddress,
            client_user_agent: userAgent,
        },
    };

    const url = `https://graph.facebook.com/v11.0/${pixelId}/events?access_token=${accessToken}`;

    try {
        const response = await axios.post(url, { data: [event], test_event_code: 'TEST12735'});
    } catch (error) {
        if (error.response) {
            console.error('Error sending conversion event to Meta:', error.response.data);
        } else {
            console.error('Error sending conversion event to Meta:', error.message);
        }
    }
}

// Function to hash email
export async function hashData(data) {
    return  crypto.createHash('sha256').update(data).digest('hex');
}