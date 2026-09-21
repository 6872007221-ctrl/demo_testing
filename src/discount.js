// ฟังก์ชันคำนวณส่วนลดตามประเภทสมาชิก
function calculateDiscount(amount, memberType) {
  if (amount <= 0) return 0;
  
  switch (memberType) {
    case 'GOLD':
      return amount * 0.20; // ลด 20%
    case 'SILVER':
      return amount * 0.10; // ลด 10%
    default:
      return 0;             // ไม่ได้ส่วนลด
  }
}

module.exports = { calculateDiscount };