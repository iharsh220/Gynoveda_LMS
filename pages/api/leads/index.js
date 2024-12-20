import Lead from '../../../models/Lead.js';

export default async function handler(req, res) {
    const { method } = req;

    try {
        switch (method) {
            case 'POST': // Add a new lead
                const { name, phone_number } = req.body;
                if (!name || !phone_number) {
                    return res.status(400).json({ error: 'Name and Phone Number are required' });
                }
                const newLead = await Lead.create({ name, phone_number });
                res.status(201).json(newLead);
                break;

            case 'GET': // Fetch all leads
                const leads = await Lead.findAll();
                res.status(200).json(leads);
                break;

            default:
                res.setHeader('Allow', ['POST', 'GET']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
