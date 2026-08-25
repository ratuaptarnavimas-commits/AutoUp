/**
 * Sends a booking request using Web3Forms API.
 * 
 * @param {Object} bookingDetails - The mapped form data
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendBookingEmail = async (bookingDetails) => {
  const ACCESS_KEY = "438c8f64-a249-4b1c-8a8d-5f11b5474c39";

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: "Nauja rezervacija iš AUTOUP",
        botcheck: "", // Honeypot field must be empty
        ...bookingDetails
      }),
    });

    const result = await response.json();

    if (result.success) {
      return { 
        success: true, 
        message: 'Booking request sent successfully!' 
      };
    } else {
      console.error('[Web3Forms] Error:', result);
      return {
        success: false,
        message: result.message || 'Failed to send booking request.'
      };
    }
  } catch (error) {
    console.error('[Web3Forms] Network Error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please try again later.'
    };
  }
};