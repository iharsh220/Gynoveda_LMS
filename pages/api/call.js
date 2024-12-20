import Lead from '../../models/Lead.js';

export default async function handler(req, res) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token !== process.env.CRON_SECRET) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (req.method === 'POST') {
            // Fetch all leads with 'Pending' status
            const pendingLeads = await Lead.findAll({ where: { status: 'Pending' } });

            if (pendingLeads.length === 0) {
                console.log('No pending leads found.');
                return res.status(200).json({ message: 'No pending leads found.', condition: true });
            }

            const success = Math.random() > 0.5; // Simulate success/failure

            if (success) {
                // Bulk update all leads to "Appointment Booked"
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
            }

            return res.status(500).json({ message: 'Call failed', condition: false });
        }

        return res.status(405).json({ error: 'Method Not Allowed' });

    } catch (error) {
        console.error('Error in Call API:', error.message);

        return res.status(500).json({
            error: 'Something went wrong',
            details: error.message
        });
    }
}
