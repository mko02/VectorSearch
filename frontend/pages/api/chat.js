export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message, currentFile } = req.body;

  // Here you would typically integrate with your AI service
  // For now, we'll just echo back a simple response
  const response = `Received your message about ${currentFile}: ${message}`;

  return res.status(200).json({ response });
} 