/**
 * Sends a booking request using the configured EmailJS template.
 * 
 * @param {Object} bookingDetails - The mapped form data
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendBookingEmail = async (bookingDetails) => {
  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
        template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: import.meta.env.VITE_EMAILJS_TO_EMAIL || "ratuaptarnavimas@gmail.com",
          subject: "Nauja rezervacija iš AutoUp",
          title: "Nauja rezervacija iš AutoUp",
          name: bookingDetails.Vardas,
          email: bookingDetails.Email,
          from_name: bookingDetails.Vardas,
          reply_to: bookingDetails.Email,
          vardas: bookingDetails.Vardas,
          telefonas: bookingDetails.Telefonas,
          el_pastas: bookingDetails.Email,
          data: bookingDetails.Data,
          laikas: bookingDetails.Laikas,
          problema: bookingDetails.Papildoma,
          formos_tipas: "Registracija vizitui",
          message: [
            `Vardas: ${bookingDetails.Vardas}`,
            `Telefonas: ${bookingDetails.Telefonas}`,
            `El. paštas: ${bookingDetails.Email}`,
            `Data: ${bookingDetails.Data}`,
            `Laikas: ${bookingDetails.Laikas}`,
            `Papildoma informacija: ${bookingDetails.Papildoma || "Nenurodyta"}`
          ].join("\n")
        }
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
        message: result.message || 'Nepavyko išsiųsti rezervacijos laiško.'
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