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
          automobilis: bookingDetails.Automobilis,
          data: bookingDetails.Data,
          laikas: bookingDetails.Laikas,
          problema: bookingDetails.Papildoma,
          formos_tipas: "Registracija vizitui",
          message: [
            `Vardas: ${bookingDetails.Vardas}`,
            `Telefonas: ${bookingDetails.Telefonas}`,
            `El. paštas: ${bookingDetails.Email}`,
            `Automobilis: ${bookingDetails.Automobilis}`,
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
      throw new Error(result.message || 'EmailJS rejected the request');
    }
  } catch (error) {
    console.warn('[EmailJS] Nepavyko išsiųsti, bandomas Web3Forms:', error);

    try {
      const fallbackResponse = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: '438c8f64-a249-4b1c-8a8d-5f11b5474c39',
          subject: 'Nauja rezervacija iš AutoUp',
          botcheck: '',
          ...bookingDetails,
          name: bookingDetails.Vardas,
          email: bookingDetails.Email,
          message: bookingDetails.message
        })
      });
      const fallbackResult = await fallbackResponse.json();

      if (fallbackResult.success) {
        return { success: true, message: 'Rezervacija išsiųsta.' };
      }

      return { success: false, message: fallbackResult.message || 'Nepavyko išsiųsti rezervacijos laiško.' };
    } catch (fallbackError) {
      console.error('[Web3Forms] Atsarginis siuntimas nepavyko:', fallbackError);
      return { success: false, message: 'Nepavyko išsiųsti rezervacijos laiško.' };
    }
  }
};

export const sendTireDisposalEmail = async (registration) => {
  const message = [
    `Vardas: ${registration.name}`,
    `Telefonas: ${registration.phone}`,
    `El. paštas: ${registration.email || "Nenurodyta"}`,
    `Padangų kiekis: ${registration.quantity}`,
    `Kur įsigytos padangos: ${registration.source}`,
    `Automobilio / padangų informacija: ${registration.tireInfo || "Nenurodyta"}`,
    `Pageidaujama data: ${registration.date}`,
    `Pageidaujamas laikas: ${registration.time}`,
    `Numatoma priėmimo kaina: ${registration.price} €`,
    `Papildoma informacija: ${registration.notes || "Nenurodyta"}`,
  ].join("\n");

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
          subject: "Nauja naudotų padangų pridavimo registracija",
          title: "Nauja naudotų padangų pridavimo registracija",
          name: registration.name,
          email: registration.email,
          from_name: registration.name,
          reply_to: registration.email,
          formos_tipas: "Naudotų padangų priėmimas",
          message,
          ...registration,
        },
      }),
    });

    const result = await response.json();
    if (result.success) return { success: true, message: "Registracija išsiųsta." };
    throw new Error(result.message || "EmailJS rejected the request");
  } catch (error) {
    console.warn("[EmailJS] Nepavyko išsiųsti padangų registracijos, bandomas Web3Forms:", error);

    try {
      const fallbackResponse = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "438c8f64-a249-4b1c-8a8d-5f11b5474c39",
          subject: "Nauja naudotų padangų pridavimo registracija",
          botcheck: "",
          email: registration.email,
          name: registration.name,
          message,
          formos_tipas: "Naudotų padangų priėmimas",
        }),
      });
      const fallbackResult = await fallbackResponse.json();
      if (fallbackResult.success) return { success: true, message: "Registracija išsiųsta." };
      return { success: false, message: fallbackResult.message || "Nepavyko išsiųsti registracijos laiško." };
    } catch (fallbackError) {
      console.error("[Web3Forms] Padangų registracijos siuntimas nepavyko:", fallbackError);
      return { success: false, message: "Nepavyko išsiųsti registracijos laiško." };
    }
  }
};