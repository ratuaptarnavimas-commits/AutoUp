// This service is deprecated. Please use web3formsService.js instead.
export const sendBookingEmail = async () => {
  console.warn('sendBookingEmail from emailService is deprecated.');
  return { success: false, message: 'Service deprecated' };
};