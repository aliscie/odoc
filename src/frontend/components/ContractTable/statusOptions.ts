export const getAvailableStatusOptions = (payment, profileId) => {
  console.log('payment', payment);
  const isSender = profileId === payment.sender.toString();
  const currentStatus = Object.keys(payment.status)[0];

  // Sender's options
  if (isSender) {
    switch (currentStatus) {
      case 'None':
        return ['None', 'Released', 'HighPromise'];
      case 'ApproveHighPromise':
      case 'Confirmed':
        return ['RequestCancellation', 'Released'];
      default:
        return [];
    }
  }

  // Receiver's options
  else {
    switch (currentStatus) {
      case 'None':
        return ['Objected', 'Confirmed'];
      case 'HighPromise':
        return ['Objected', 'ApproveHighPromise'];
      case 'RequestCancellation':
        return ['Objected', 'ConfirmedCancellation'];
      default:
        return [];
    }
  }
};
