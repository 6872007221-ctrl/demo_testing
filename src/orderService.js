const { calculateDiscount } = require('./discount');

class OrderService {
  constructor(paymentApi) {
    this.paymentApi = paymentApi; // Dependency Injection สำหรับ Payment Gateway
  }

  async processOrder(order) {
    const { amount, memberType, user } = order;
    
    // 1. คำนวณส่วนลด
    const discount = calculateDiscount(amount, memberType);
    const finalAmount = amount - discount;

    // 2. เรียก Payment Gateway เพื่อทำการชำระเงิน
    const paymentResult = await this.paymentApi.charge(user, finalAmount);

    if (!paymentResult.success) {
      throw new Error('Payment failed');
    }

    return {
      status: 'COMPLETED',
      finalAmount,
      transactionId: paymentResult.transactionId
    };
  }
}

module.exports = OrderService;