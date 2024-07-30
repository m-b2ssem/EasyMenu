import axios from 'axios';
import crypto from 'crypto';




// Function to send conversion event to Meta
export async function sendMetaConversionEvent(userId, eventId,company_name ,email, clientIpAddress, userAgent, event_name, eventSourceUrl, event_time) {
    const accessToken = 'EAAwSU08tu9cBO1FDoC78tdRi9bwUEZATaVZAaZATRQZBZAvOrOKWFxKWo44tKctvaAHPRueKChwsPB1EsFCesLYCDDoOtrs8S6lsGdYIZCVSIX99epiEsfd9ml3xgKovsLRZBX1kALtdquD3odSd70v5zcDrS2TQZBpBca0YHGndmpD1JsixphJsInArSKLzP4ZAjfgZDZD';
    const pixelId = '401424272934424';
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
        const response = await axios.post(url, { data: [event]});
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