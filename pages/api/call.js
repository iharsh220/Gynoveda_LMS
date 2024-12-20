import Lead from '../../models/Lead.js';

export default async function handler(req, res) {
    try {
        // Extract the Authorization header
        const authHeader = req.headers['authorization'];
        console.log('Authorization Header:', authHeader);

        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header is missing' });
        }

        // Extract and verify the token
        const token = authHeader.split(' ')[1];
        if (!token || token !== process.env.CRON_SECRET) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }

        // Fetch leads with 'Pending' status
        const pendingLeads = await Lead.findAll({ where: { status: 'Pending' } });

        if (!pendingLeads || pendingLeads.length === 0) {
            console.log('No pending leads found.');
            return res.status(200).json({
                message: 'No pending leads found.',
                condition: true
            });
        }

        // Simulate success/failure
        const success = Math.random() > 0.5;

        if (success) {
            try {
                // Bulk update leads to "Appointment Booked"
                await Lead.update(
                    { status: "Appointment Booked" },
                    { where: { status: 'Pending' } }
                );

                console.log(`${pendingLeads.length} leads updated to Appointment Booked.`);
                return res.status(200).json({
                    message: 'Call successful',
                    condition: true,
                    updatedLeads: pendingLeads.length
                });
            } catch (updateError) {
                console.error('Error updating leads:', updateError.message);
                return res.status(500).json({
                    error: 'Failed to update leads',
                    details: updateError.message
                });
            }
        } else {
            console.log('Simulated failure occurred.');
            return res.status(500).json({
                message: 'Call failed',
                condition: false
            });
        }
    } catch (error) {
        console.error('Error in Call API:', error.message);
        return res.status(500).json({
            error: 'Something went wrong',
            details: error.message
        });
    }
}
