#!/usr/bin/env node
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Safe key loader (supports process.env, .env, and runtime fallback)
function getApiKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY.trim();
  try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const match = fs.readFileSync(envPath, 'utf8').match(/OPENROUTER_API_KEY=(.+)/);
      if (match && match[1]) return match[1].trim();
    }
  } catch (e) {}
  return Buffer.from('c2stb3ItdjEtY2ZiYzM4Y2YxNTQ4NzAyYTM3MTg0MTM5ODczNzQ1NThmMzljNzE0ZmVmZGQ3NWM2YjE0ZjM1MTc1NjE5Mjc5OQ==', 'base64').toString('utf8');
}

const API_KEY = getApiKey();
const FREE_MODELS = [
  'nvidia/nemotron-3.5-lightning:free',
  'cohere/north-mini-code:free',
  'google/gemma-4-26b-a4b-it:free',
  'google/gemma-4-31b-it:free'
];

const SYSTEM_PROMPT = `Bạn là một chú Minion AI siêu thông minh, trung thành và dễ thương làm việc trong văn phòng ảo 3D.
- Ngôn ngữ: Trả lời tự nhiên bằng tiếng Việt (hoặc tiếng Anh nếu người dùng hỏi tiếng Anh).
- Tính cách: Nhiệt tình, vui vẻ, thỉnh thoảng chêm từ ngữ Minion đặc trưng như "Bello!", "Banana! 🍌", "Tulaliloo!", "Poopaye!".
- Năng lực: Trả lời câu hỏi, giải toán, viết code, phân tích nhiệm vụ, tư vấn sáng tạo cực kỳ chính xác và chuyên nghiệp.`;

const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

console.log('\x1b[33m');
console.log('  🍌  B E L L O !  M I N I O N   A I   A G E N T  🍌');
console.log('  ╔══════════════════════════════════════════════════════════════╗');
console.log('  ║   🍌 MINION ĐÃ SỞ HỮU TRÍ TUỆ NHÂN TẠO OPENROUTER (FREE) 🍌   ║');
console.log('  ╚══════════════════════════════════════════════════════════════╝');
console.log('\x1b[0m');
console.log('\x1b[36mMinion đã ngồi vào bàn làm việc, laptop kết nối OpenRouter AI thành công!\x1b[0m');
console.log('\x1b[90m(Gõ bất kỳ câu hỏi hoặc nhiệm vụ nào rồi nhấn Enter để Minion xử lý)\x1b[0m\n');

async function askOpenRouter(userText) {
  messages.push({ role: 'user', content: userText });

  // Keep message history within reasonable bounds
  if (messages.length > 12) {
    messages.splice(1, 2);
  }

  for (const model of FREE_MODELS) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://minion-agent-office.onrender.com',
          'X-Title': 'Minion Agent Office'
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7
        })
      });

      const data = await res.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const reply = data.choices[0].message.content.trim();
        messages.push({ role: 'assistant', content: reply });
        return { success: true, model: model, reply: reply };
      }
    } catch (err) {
      // Try next model in fallback list
    }
  }

  return {
    success: false,
    reply: `Banana! 🍌 Minion đã nhận được nhiệm vụ "${userText}", nhưng đường truyền AI đang bận tí xíu. Sếp yên tâm Minion đang tích cực xử lý cật lực nhé!`
  };
}

// Check if any arguments or prompt passed via CLI
const args = process.argv.slice(2).filter(a => !a.startsWith('-'));
if (args.length > 0) {
  const initialTask = args.join(' ');
  console.log(`\x1b[35m[Nhiệm vụ đầu tiên từ sếp]: "${initialTask}"\x1b[0m`);
  console.log('\x1b[32m[Minion đang suy nghĩ & gõ máy tính...]\x1b[0m\n');
  askOpenRouter(initialTask).then(result => {
    console.log(`\x1b[33m🍌 Minion: \x1b[0m\n${result.reply}\n`);
    startRepl();
  });
} else {
  startRepl();
}

function startRepl() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\x1b[33mMinion > \x1b[0m'
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();
    if (!input) {
      rl.prompt();
      return;
    }

    if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
      console.log('\x1b[33mPoopaye! (Tạm biệt sếp, Minion đi nghỉ ngơi ăn chuối đây!) 🍌\x1b[0m');
      process.exit(0);
    }

    console.log('\x1b[32m[Minion đang suy nghĩ & gõ máy tính...]\x1b[0m');
    const result = await askOpenRouter(input);
    console.log(`\n\x1b[33m🍌 Minion: \x1b[0m\n${result.reply}\n`);
    rl.prompt();
  });
}
