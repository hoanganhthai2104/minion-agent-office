#!/usr/bin/env node
const readline = require('readline');

console.log('\x1b[33m');
console.log('  🍌  B E L L O !  🍌  ');
console.log('  ╔═══════════════════════════════════════════════════════════╗');
console.log('  ║   🍌 MINION WORKER AGENT - SẴN SÀNG NHẬN NHIỆM VỤ! 🍌     ║');
console.log('  ╚═══════════════════════════════════════════════════════════╝');
console.log('\x1b[0m');
console.log('\x1b[36mMinion đã ngồi vào bàn làm việc, laptop đã bật!\x1b[0m');
console.log('\x1b[90m(Gõ tin nhắn hoặc câu hỏi bất kỳ rồi nhấn Enter để trò chuyện)\x1b[0m\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\x1b[33mMinion > \x1b[0m'
});

rl.prompt();

rl.on('line', (line) => {
  const input = line.trim();
  if (!input) {
    rl.prompt();
    return;
  }

  if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
    console.log('\x1b[33mPoopaye! (Tạm biệt sếp!)\x1b[0m');
    process.exit(0);
  }

  // Cute minion responses or task acknowledgment
  console.log('\x1b[32m[Minion đang suy nghĩ & gõ máy tính...]\x1b[0m');
  setTimeout(() => {
    const minionQuotes = [
      'Banana! 🍌 Nhiệm vụ: "' + input + '" đã được Minion ghi nhận và đang xử lý cật lực!',
      'Tulaliloo ti amo! Đang phân tích yêu cầu "' + input + '"...',
      'Bello! Minion đang mở tài liệu và viết mã cho bạn đây!',
      'Underwear! Hehehe, sếp giao việc chuẩn bài: "' + input + '". Đang chạy!'
    ];
    const reply = minionQuotes[Math.floor(Math.random() * minionQuotes.length)];
    console.log('\x1b[33m🍌 ' + reply + '\x1b[0m\n');
    rl.prompt();
  }, 600);
});

