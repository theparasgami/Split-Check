const requestMoneyMessage = (payerName, receiverName, amount) => {
  return `Dear ${payerName},

This is a friendly reminder that you owe ${receiverName} ₹${amount} for expenses in your Split-Check group. Please make the payment at your earliest convenience to settle up and maintain the balance.

Payment Details:
Amount: ₹${amount}
Recipient: ${receiverName}

We appreciate your prompt attention to this matter. If you have any questions or need further assistance, please feel free to reach out.

Thank you for using Split-Check.

Best regards,
Your Split-Check Team`;
};

export { requestMoneyMessage };
