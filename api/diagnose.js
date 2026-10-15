export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { carModel, carFuel, carSystem, carProblem } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // مفتاحك المحمي بأمان تام داخل إعدادات Vercel

  const prompt = `أنت خبير ميكانيك وكهرباء سيارات محترف متخصص في السوق السوري والعربي.
الرجاء تقديم تشخيص دقيق وواضح جداً بناءً على مدخلات المستخدم التالية:
- نوع السيارة والموديل: ${carModel}
- نوع الوقود: ${carFuel}
- نظام العطل: ${carSystem}
- وصف المشكلة والأعراض: ${carProblem}

الرجاء الإجابة بشكل مخصص ومباشر لهذه المشكلة متضمنة:
1. الأسباب المحتملة للعطل بدقة.
2. القطع الواجب فحصها أو تغييرها.
3. نصيحة عملية للحل بأمان وتوفير التكلفة.`;

  try {
    const response = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const apiRes = await fetch(response, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await apiRes.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم يتم استلام رد من النموذج.";

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch AI response' });
  }
}
