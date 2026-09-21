const OrderService = require('../../src/orderService');

describe('Integration Test: OrderService Integration', () => {
  let paymentApiMock;
  let orderService;

  beforeEach(() => {
    // Mock Payment API เพื่อไม่ให้มีการตัดเงินจริงระหว่างการทดสอบ
    paymentApiMock = {
      charge: jest.fn()
    };
    orderService = new OrderService(paymentApiMock);
  });

  test('ประมวลผลคำสั่งซื้อสำเร็จ: คำนวณส่วนลดถูก และเรียก Payment API ด้วยยอดเงินหลังหักส่วนลด', async () => {
    // กำหนดพฤติกรรมจำลองของ Payment API
    paymentApiMock.charge.mockResolvedValue({
      success: true,
      transactionId: 'TX12345'
    });

    const orderData = {
      user: 'john_doe',
      amount: 1000,
      memberType: 'GOLD'
    };

    const result = await orderService.processOrder(orderData);

    // ตรวจสอบสถานะและยอดชำระจริง (1000 - ส่วนลด 20% = 800)
    expect(result.status).toBe('COMPLETED');
    expect(result.finalAmount).toBe(800);
    expect(result.transactionId).toBe('TX12345');

    // ตรวจสอบว่า OrderService ส่งยอดเงินหลังหักส่วนลด (800) ไปที่ Payment API จริงหรือไม่
    expect(paymentApiMock.charge).toHaveBeenCalledWith('john_doe', 800);
    expect(paymentApiMock.charge).toHaveBeenCalledTimes(1);
  });

  test('โยน Error ออกมาเมื่อชำระเงินไม่สำเร็จ', async () => {
    // จำลองสถานการณ์การชำระเงินล้มเหลว
    paymentApiMock.charge.mockResolvedValue({
      success: false
    });

    const orderData = {
      user: 'jane_doe',
      amount: 500,
      memberType: 'SILVER'
    };

    await expect(orderService.processOrder(orderData))
      .rejects
      .toThrow('Payment failed');
  });
});