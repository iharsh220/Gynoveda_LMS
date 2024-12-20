import Lead from '../../models/Lead.js';

export default async function handler(req, res) {
    try {


        if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
            return res.status(401).end('Unauthorized');
        }

        if (req.method === 'POST') {
            
            // Fetch all leads with 'Pending' status
            const pendingLeads = await Lead.findAll({ where: { status: 'Pending' } });

            if (pendingLeads.length === 0) {
                console.log('No pending leads found.');
                return res.status(200).json({ message: 'No pending leads found.', condition: true });
            }

            const success = Math.random() > 0.5; // Random success/failure

            if (success) {
                // Iterate through each lead and trigger the Call API
                for (const lead of pendingLeads) {

                    lead.status = "Appointment Booked";

                    // Save the updated lead status
                    await lead.save();

                    console.log(`Lead ${lead.id} status updated to ${lead.status}`);
                }

                return res.status(200).json({ message: 'Call successful', condition: true });
            }
            return res.status(200).json({ message: 'Call failed', condition: false });
        }
        return res.status(405).json({ error: 'Method Not Allowed' });

    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error in Call API:', error.message);

        // Return a generic error message to the client
        return res.status(500).json({
            error: 'Something went wrong',
            details: error.message
        });
    }
}
