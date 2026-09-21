const { calculateDiscount } = require('../../src/discount');

describe('Unit Test: Discount Calculator', () => {
  test('สมาชิก GOLD ควรได้รับส่วนลด 20%', () => {
    const discount = calculateDiscount(1000, 'GOLD');
    expect(discount).toBe(200);
  });

  test('สมาชิก SILVER ควรได้รับส่วนลด 10%', () => {
    const discount = calculateDiscount(1000, 'SILVER');
    expect(discount).toBe(100);
  });

  test('สมาชิกทั่วไป (MEMBER) ไม่ได้รับส่วนลด', () => {
    const discount = calculateDiscount(1000, 'MEMBER');
    expect(discount).toBe(0);
  });

  test('ยอดเงินเป็น 0 หรือติดลบ ต้องได้ส่วนลดเป็น 0', () => {
    expect(calculateDiscount(0, 'GOLD')).toBe(0);
    expect(calculateDiscount(-100, 'GOLD')).toBe(0);
  });
});