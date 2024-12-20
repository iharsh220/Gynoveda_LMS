import Lead from '../../../models/Lead.js';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    try {
        const lead = await Lead.findByPk(id);

        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        switch (method) {
            case 'GET': // Fetch a specific lead by ID
                res.status(200).json(lead);
                break;

            case 'PUT': // Update lead's status and reason
                const { name, phone_number, status, reason } = req.body;

                if (status === 'Not Booked' && !reason) {
                    return res.status(400).json({ error: 'Reason is required for "Not Booked"' });
                }

                lead.name = name || lead.name;
                lead.phone_number = phone_number || lead.phone_number;
                lead.status = status || lead.status;
                lead.reason = reason || lead.reason;

                await lead.save();
                res.status(200).json(lead);
                break;

            case 'DELETE': // Delete a lead by ID
                await lead.destroy();
                res.status(200).json({ message: 'Lead deleted successfully' });
                break;

            default:
                res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
