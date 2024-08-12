import { Router } from 'express';


const router = Router();


router.get('/track', async (req, res) => {
    const parameters = req.query;
  
    // Remove additional quotes from parameter values
    const cleanedParams = {};
    for (const [key, value] of Object.entries(parameters)) {
      cleanedParams[key] = value.replace(/^"|"$/g, '');
    }
    // Extract IP address
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const accessToken = 'EAAnGQW7VNUIBO6p4y4lr0wfikcJ2ftdXjNF1R2ce8Iz3PcwYMtdXtpp71j7yIuAblF3MwM8BbctzV8whZC82uosU3G2p2ZAac33t5IXoetF9UQ9VMRhtI4xzKb5F858CoZCRCoKSjQQIuBY5PYyVJQRAlKDJa7BQzPT3WKLn2nIEIe9HQpVhgHh0OZCe2STYZBQZDZD';
    const pixelId = '8004482946310463';
    const url = `https://graph.facebook.com/v11.0/${pixelId}/events?access_token=${accessToken}`;
    const event = {
      event_name: cleanedParams.event_name,
      event_id: cleanedParams.event_id,
      action_source: cleanedParams.action_source,
      event_source_url: cleanedParams.event_source_url,
      event_time: parseInt(cleanedParams.event_time, 10),
      user_data: {
        fbp: cleanedParams.fbp,
        client_ip_address: clientIp,
        client_user_agent: req.headers['user-agent'],
    },
    };
    try {
      const response = await axios.post(url, { data: [event]});
      res.status(200).send(response.data);
    } catch (error) {
        throw error;
    }
});
  
router.get('/facebook-track', async (req, res) => {
    const parameters = req.query;
  
    // Remove additional quotes from parameter values
    const cleanedParams = {};
    for (const [key, value] of Object.entries(parameters)) {
      cleanedParams[key] = value.replace(/^"|"$/g, '');
    }
    // Extract IP address
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const accessToken = 'EAAnGQW7VNUIBO6p4y4lr0wfikcJ2ftdXjNF1R2ce8Iz3PcwYMtdXtpp71j7yIuAblF3MwM8BbctzV8whZC82uosU3G2p2ZAac33t5IXoetF9UQ9VMRhtI4xzKb5F858CoZCRCoKSjQQIuBY5PYyVJQRAlKDJa7BQzPT3WKLn2nIEIe9HQpVhgHh0OZCe2STYZBQZDZD';
    const pixelId = '8004482946310463';
    const url = `https://graph.facebook.com/v11.0/${pixelId}/events?access_token=${accessToken}`;
    const event = {
      event_name: cleanedParams.event_name,
      event_id: cleanedParams.event_id,
      action_source: cleanedParams.action_source,
      event_source_url: cleanedParams.event_source_url,
      event_time: parseInt(cleanedParams.event_time, 10),
      user_data: {
        fbp: cleanedParams.fbp,
        client_ip_address: clientIp,
        client_user_agent: req.headers['user-agent'],
    },
    };
    try {
      const response = await axios.post(url, { data: [event], test_event_code: 'TEST45831' });
      res.status(200).send(response.data);
    } catch (error) {
        throw error;
    }
});

export default router;